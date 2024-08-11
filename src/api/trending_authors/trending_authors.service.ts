import { InfluxDBClient } from '@influxdata/influxdb3-client';
import { Injectable } from '@nestjs/common';
import { env } from 'process';
import { Author } from '../../lib/types';

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

  async getTrendingAuthors(order: string, criterion: string, days: string) {
    const client = this.getInfluxDBClient();
    const endOfPreviousPeriod = parseInt(days) + 1;

    const query = `SELECT
                          current_period.*,
                          current_period.${criterion} - last_period.${criterion} AS gain
                          FROM 
                              (SELECT last_period.url, last_period.${criterion} FROM
                                  (SELECT url, MIN(time) as starting_time FROM
                                  creators WHERE time > now() - interval '${endOfPreviousPeriod} day' AND time < now() - interval '${days} day' GROUP BY url) end_of_period
                                  JOIN
                                  creators last_period
                                  ON end_of_period.url = last_period.url AND end_of_period.starting_time = last_period.time)
                              JOIN
                              (SELECT current_period.* FROM
                                  (SELECT url, MAX(time) as recent_time FROM
                                  creators WHERE time >= now() - interval '1 day' GROUP BY url) last_day
                                  JOIN
                                  creators current_period
                                  ON last_day.url = current_period.url AND last_day.recent_time = current_period.time)
                              ON current_period.url = last_period.url
                          WHERE current_period.${criterion} > -1 AND last_period.${criterion} > -1 ORDER BY gain ${order}
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
