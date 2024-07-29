import { InfluxDBClient } from '@influxdata/influxdb3-client';
import { Injectable } from '@nestjs/common';
import { env } from 'process';
import { Author } from 'src/lib/types';

@Injectable()
export class TrendingAuthorsService {
  private getInfluxDBClient() {
    const client = new InfluxDBClient({
      host: env.INFLUX_URL,
      token: env.INFLUX_TOKEN,
      database: env.INFLUX_BUCKET,
    });

    return client;
  }

  async getTrendingAuthors(criterion: string) {
    const client = this.getInfluxDBClient();

    const query = `SELECT
                          weekly.*,
                          weekly.${criterion} - monthly.${criterion} AS gain
                          FROM 
                              (SELECT monthly.url, monthly.${criterion} FROM
                                  (SELECT url, MIN(time) as starting_time FROM
                                  creators WHERE time >= now() - interval '14 day' AND time < now() - interval '7 day' GROUP BY url) last_month
                                  JOIN
                                  creators monthly
                                  ON last_month.url = monthly.url AND last_month.starting_time = monthly.time)
                              JOIN
                              (SELECT weekly.* FROM
                                  (SELECT url, MAX(time) as recent_time FROM
                                  creators WHERE time >= now() - interval '7 days' GROUP BY url) last_week
                                  JOIN
                                  creators weekly
                                  ON last_week.url = weekly.url AND last_week.recent_time = weekly.time)
                              ON weekly.url = monthly.url AND weekly.${criterion} > monthly.${criterion}
                          WHERE weekly.${criterion} > -1 AND monthly.${criterion} > -1 ORDER BY gain DESC
                          LIMIT 10;`;
    const queryResult = await client.query(query, env.INFLUX_BUCKET);
    const resultsArray: Author[] = [];
    for await (const row of queryResult) {
      const arrayElement = {
        image_url: row.image_url,
        is_recommended: row.is_recommended,
        name: row.name,
        tags: row.tags,
        url: row.url,
        total_revenue: parseInt(row.total_revenue),
        monthly_revenue: parseInt(row.monthly_revenue),
        number_of_patrons: parseInt(row.number_of_patrons),
        gain: parseInt(row.gain),
        time: row.time,
      };
      resultsArray.push(arrayElement);
    }

    client.close();
    return resultsArray;
  }
}
