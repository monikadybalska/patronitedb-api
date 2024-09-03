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

    let query = `SELECT last_value(name ORDER BY time) AS name FROM creators WHERE`;
    if (tags) {
      query += ` (find_in_set(split_part(tags, ',', 1), '${tags}') = 1 OR find_in_set(split_part(tags, ',', 2), '${tags}') = 1 OR find_in_set(split_part(tags, ',', 3), '${tags}') = 1) AND`;
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
    query += ` time >= now() - interval '7 days' GROUP BY name ORDER BY name;`;
    const queryResult = await client.queryPoints(query, env.INFLUX_BUCKET);
    const resultsArray: string[] = [];

    for await (const row of queryResult) {
      resultsArray.push(row.getField('name', 'string'));
    }

    client.close();
    return resultsArray;
  }
}
