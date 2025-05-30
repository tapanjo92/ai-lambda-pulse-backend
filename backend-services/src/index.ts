import { Logger } from '@aws-lambda-powertools/logger';
import {
  FirehoseTransformationEvent,
  FirehoseTransformationEventRecord,
  FirehoseTransformationResult,
  FirehoseTransformationResultRecord,
} from 'aws-lambda';

const logger = new Logger({ serviceName: 'FirehoseTransformer' });

export const handler = async (
  event: FirehoseTransformationEvent
): Promise<FirehoseTransformationResult> => {
  logger.info(
    `Processing ${event.records.length} records from region ${event.region}. Invocation ID: ${event.invocationId}`
  );

  const output: FirehoseTransformationResultRecord[] = event.records.map(
    (record: FirehoseTransformationEventRecord): FirehoseTransformationResultRecord => {
      // logger.debug(`Processing recordId: ${record.recordId}`); // Optional: log individual records
      const payload = Buffer.from(record.data, 'base64').toString('utf-8');
      // logger.debug('Decoded payload snippet:', payload.substring(0, 100)); // Log a snippet

      return {
        recordId: record.recordId,
        result: 'Ok',
        data: Buffer.from(payload.toUpperCase(), 'utf-8').toString('base64'),
      };
    }
  );
  return { records: output };
};
// Ensure no trailing blank lines below this line
