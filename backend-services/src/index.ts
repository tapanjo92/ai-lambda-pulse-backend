import { Logger } from '@aws-lambda-powertools/logger';
import {
  FirehoseTransformationEvent,
  FirehoseTransformationEventRecord, // Make sure this is also imported if you are using it explicitly for 'record' type
  FirehoseTransformationResult, // Make sure this is also imported for the handler's return Promise
  FirehoseTransformationResultRecord, // This is the type in question
} from 'aws-lambda';

const logger = new Logger({ serviceName: 'FirehoseTransformer' });

export const handler = async (
  event: FirehoseTransformationEvent
): Promise<FirehoseTransformationResult> => {
  // FirehoseTransformationResult is used here
  logger.info(
    `Processing ${event.records.length} records from region ${event.region}. Invocation ID: ${event.invocationId}`
  );

  // FirehoseTransformationResultRecord is used here as the type for the 'output' array
  const output: FirehoseTransformationResultRecord[] = event.records.map(
    // FirehoseTransformationEventRecord is used here as the type for 'record'
    // FirehoseTransformationResultRecord is used here as the return type of the map function
    (record: FirehoseTransformationEventRecord): FirehoseTransformationResultRecord => {
      const payload = Buffer.from(record.data, 'base64').toString('utf-8');

      // The object returned here matches the structure of FirehoseTransformationResultRecord
      return {
        recordId: record.recordId,
        result: 'Ok',
        data: Buffer.from(payload.toUpperCase(), 'utf-8').toString('base64'),
      };
    }
  );

  // The 'records' property of the return object expects an array of FirehoseTransformationResultRecord
  return { records: output };
};
