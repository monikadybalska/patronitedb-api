import { InfluxDBClient } from '@influxdata/influxdb3-client';
import { Injectable } from '@nestjs/common';
import { env } from 'process';

@Injectable()
export class MinMaxService {
  private getInfluxDBClient() {
    const client = new InfluxDBClient({
      host: env.INFLUX_URL,
      token: env.INFLUX_TOKEN,
      database: env.INFLUX_BUCKET,
    });

    return client;
  }

  async getMinMax() {
    const client = this.getInfluxDBClient();

    const query = `SELECT 'total_revenue' as name, MAX(total_revenue) as max FROM (SELECT last_value(total_revenue ORDER BY time) AS total_revenue FROM creators WHERE time >= now() - interval '7 days' GROUP BY name)
                  UNION
                  SELECT 'number_of_patrons' as name, MAX(number_of_patrons) as max FROM (SELECT last_value(number_of_patrons ORDER BY time) AS number_of_patrons FROM creators WHERE time >= now() - interval '7 days' GROUP BY name)
                  UNION
                  SELECT 'monthly_revenue' as name, MAX(monthly_revenue) as max FROM (SELECT last_value(monthly_revenue ORDER BY time) AS monthly_revenue FROM creators WHERE time >= now() - interval '7 days' GROUP BY name)`;
    const queryResult = await client.query(query, env.INFLUX_BUCKET);
    const resultsArray: { max: number; name: string }[] = [];
    for await (const row of queryResult) {
      const arrayElement = {
        max: parseInt(row.max),
        name: row.name,
      };
      resultsArray.push(arrayElement);
    }
    client.close();
    return resultsArray;
  }
}
