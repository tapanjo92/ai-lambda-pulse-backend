import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger({ serviceName: 'FirehoseTransformer' });

export const handler = async (event: any) => {
  const output = event.records.map((record: any) => {
    const payload = Buffer.from(record.data, 'base64').toString('utf-8');
    return {
      recordId: record.recordId,
      result: 'Ok',
      data: Buffer.from(payload.toUpperCase(), 'utf-8').toString('base64'),
    };
  });
  return { records: output };
};

