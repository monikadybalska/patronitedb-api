import { InfluxDBClient } from '@influxdata/influxdb3-client';
import { Injectable } from '@nestjs/common';
import { env } from 'process';

@Injectable()
export class RowCountService {
  private getInfluxDBClient() {
    const client = new InfluxDBClient({
      host: env.INFLUX_URL,
      token: env.INFLUX_TOKEN,
      database: env.INFLUX_BUCKET,
    });

    return client;
  }

  async getRowCount({
    tags,
    name,
    min_total_revenue,
    max_total_revenue,
    min_monthly_revenue,
    max_monthly_revenue,
    min_number_of_patrons,
    max_number_of_patrons,
  }: {
    tags?: string;
    name?: string;
    min_total_revenue?: number;
    max_total_revenue?: number;
    min_monthly_revenue?: number;
    max_monthly_revenue?: number;
    min_number_of_patrons?: number;
    max_number_of_patrons?: number;
  }) {
    const client = this.getInfluxDBClient();

    let query = `SELECT t2.url AS url FROM (SELECT url, MAX(time) as recent_time`;
    if (tags) {
      query += `,find_in_set(split_part(last_value(tags ORDER BY time), ',', 1), '${tags}') = 1 AS first_tag,
        find_in_set(split_part(last_value(tags ORDER BY time), ',', 2), '${tags}') = 1 AS second_tag,
        find_in_set(split_part(last_value(tags ORDER BY time), ',', 3), '${tags}') = 1 AS third_tag`;
    }
    query += ` FROM creators WHERE time >= now() - interval '7 days' GROUP BY url) t1 JOIN creators t2 ON t1.url = t2.url AND t1.recent_time = t2.time WHERE`;
    if (tags) {
      query += ' (first_tag OR second_tag OR third_tag) AND';
    }
    if (name) {
      query += ` LOWER(name) LIKE '%${name}%' AND`;
    }
    if (min_total_revenue) {
      query += ` total_revenue >= ${min_total_revenue} AND`;
    }
    if (max_total_revenue) {
      query += ` total_revenue <= ${max_total_revenue} AND`;
    }
    if (min_monthly_revenue) {
      query += ` monthly_revenue >= ${min_monthly_revenue} AND`;
    }
    if (max_monthly_revenue) {
      query += ` monthly_revenue <= ${max_monthly_revenue} AND`;
    }
    if (min_number_of_patrons) {
      query += ` number_of_patrons >= ${min_number_of_patrons} AND`;
    }
    if (max_number_of_patrons) {
      query += ` number_of_patrons <= ${max_number_of_patrons} AND`;
    }
    query += ` 1 = 1`;
    const queryResult = await client.queryPoints(query, env.INFLUX_BUCKET);
    const resultsArray: string[] = [];

    for await (const row of queryResult) {
      resultsArray.push(row.getTag('url'));
    }

    client.close();
    return resultsArray;
  }
}
