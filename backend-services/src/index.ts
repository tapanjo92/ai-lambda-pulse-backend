import { handler } from './index';
import { FirehoseTransformationEvent, FirehoseTransformationResultRecord } from 'aws-lambda';

test('handler should process records correctly, converting data to uppercase', async () => {
  // 1. Create a sample input that looks like what Firehose would send
  const sampleEvent: FirehoseTransformationEvent = {
    invocationId: 'invId123', // Just an example ID for the function call
    deliveryStreamArn: 'arn:aws:kinesis:region:account-id:deliverystream/stream-name', // Example ARN
    region: 'us-east-1', // Example region
    records: [
      {
        recordId: 'record1', // ID for the first piece of data
        approximateArrivalTimestamp: Date.now(),
        data: Buffer.from('hello world').toString('base64'), // "hello world" encoded
      },
      {
        recordId: 'record2', // ID for the second piece of data
        approximateArrivalTimestamp: Date.now(),
        data: Buffer.from('test data').toString('base64'), // "test data" encoded
      },
    ],
  };

  // 2. Call the handler with our sample event
  const result = await handler(sampleEvent);

  // 3. Check if the output is what we expect

  // It should have the same number of records as the input
  expect(result.records.length).toBe(2);

  // Check the first record
  const record1Result = result.records.find(r => r.recordId === 'record1');
  expect(record1Result).toBeDefined(); // Make sure we found it
  expect(record1Result?.result).toBe('Ok'); // The handler should mark it as 'Ok'
  // The data should be "HELLO WORLD" (uppercase of "hello world"), then base64 encoded
  expect(record1Result?.data).toBe(Buffer.from('HELLO WORLD').toString('base64'));

  // Check the second record
  const record2Result = result.records.find(r => r.recordId === 'record2');
  expect(record2Result).toBeDefined();
  expect(record2Result?.result).toBe('Ok');
  // The data should be "TEST DATA" (uppercase of "test data"), then base64 encoded
  expect(record2Result?.data).toBe(Buffer.from('TEST DATA').toString('base64'));
});
