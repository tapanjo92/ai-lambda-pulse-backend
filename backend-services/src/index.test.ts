import { handler } from './index';
// Import necessary types from aws-lambda to construct valid test events
import { FirehoseTransformationEvent } from 'aws-lambda';

test('handler should process records correctly, converting data to uppercase', async () => {
  // 1. Create a sample event that matches the FirehoseTransformationEvent structure
  const sampleEvent: FirehoseTransformationEvent = {
    invocationId: 'test-invocation-id-123',
    deliveryStreamArn: 'arn:aws:kinesis:region:account-id:deliverystream/your-stream-name',
    region: 'us-east-1',
    records: [
      {
        recordId: 'record1',
        approximateArrivalTimestamp: Date.now(),
        data: Buffer.from('hello world').toString('base64'), // "hello world" encoded in base64
      },
      {
        recordId: 'record2',
        approximateArrivalTimestamp: Date.now(),
        data: Buffer.from('test data 123').toString('base64'), // "test data 123" encoded in base64
      },
    ],
  };

  // 2. Call the handler with the correctly structured event
  const result = await handler(sampleEvent);

  // 3. Check the structure and content of the result
  expect(result.records).toBeDefined(); // The result should have a 'records' array
  expect(result.records.length).toBe(2); // Should match the number of input records

  // Check the first record's transformation
  const firstRecord = result.records.find(r => r.recordId === 'record1');
  expect(firstRecord).toBeDefined(); // Ensure the record is found
  if (firstRecord) {
    expect(firstRecord.result).toBe('Ok'); // As per your handler logic
    // Expected: "hello world" -> "HELLO WORLD" -> base64 encoded
    expect(firstRecord.data).toBe(Buffer.from('HELLO WORLD').toString('base64'));
  }

  // Check the second record's transformation
  const secondRecord = result.records.find(r => r.recordId === 'record2');
  expect(secondRecord).toBeDefined(); // Ensure the record is found
  if (secondRecord) {
    expect(secondRecord.result).toBe('Ok'); // As per your handler logic
    // Expected: "test data 123" -> "TEST DATA 123" -> base64 encoded
    expect(secondRecord.data).toBe(Buffer.from('TEST DATA 123').toString('base64'));
  }
});
