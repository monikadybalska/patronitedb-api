import { InfluxDBClient } from '@influxdata/influxdb3-client';
import { Injectable } from '@nestjs/common';
import { env } from 'process';

@Injectable()
export class GainService {
  private getInfluxDBClient() {
    const client = new InfluxDBClient({
      host: env.INFLUX_URL,
      token: env.INFLUX_TOKEN,
      database: env.INFLUX_BUCKET,
    });

    return client;
  }

  async getGainByUrl({ url, criterion }: { url: string; criterion: string }) {
    const client = this.getInfluxDBClient();

    const query = `SELECT
                  ${criterion},
                  (${criterion} - LEAD(${criterion}) OVER (ORDER BY time DESC)) * 1.0 AS ${criterion}_gain,
                  ROUND((${criterion} - LEAD(${criterion}) OVER (ORDER BY time DESC)) * 100) / (LEAD(${criterion}) OVER (ORDER BY time DESC)) AS ${criterion}_gain_percentage,
                  time,
                  url
                  FROM
                  (
                      SELECT
                      last_value(${criterion} ORDER BY time) as ${criterion},
                      last_value(url ORDER BY time) as url,
                      last_value(time ORDER BY time) as time
                      FROM
                      creators WHERE url LIKE '${url}'
                      GROUP BY date_trunc('day', time)
                  )
                  WHERE ${criterion} > -1
                  ORDER BY time DESC`;
    const queryResult = await client.query(query, env.INFLUX_BUCKET);
    const resultsArray = [];

    for await (const row of queryResult) {
      const arrayElement = {
        ...row['_tags'],
        [`${criterion}`]: parseInt(row[`${criterion}`]),
        [`${criterion}_gain`]: parseInt(row[`${criterion}_gain`]),
        [`${criterion}_gain_percentage`]: parseFloat(
          row[`${criterion}_gain_percentage`],
        ),
        time: row.time,
      };
      resultsArray.push(arrayElement);
    }

    client.close();
    return resultsArray;
  }
}
