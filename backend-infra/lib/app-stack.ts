import * as path from 'path';
import {
  Stack,
  StackProps,
  RemovalPolicy,
  aws_s3 as s3,
  aws_kinesisfirehose as firehose,
  aws_iam as iam,
} from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 1) Create S3 bucket with auto-delete and destroy policy
    const dataBucket = new s3.Bucket(this, 'DataBucket', {
      removalPolicy: RemovalPolicy.DESTROY, // :contentReference[oaicite:0]{index=0}
      autoDeleteObjects: true,
    });

    // 2) IAM role for Firehose to write to S3 and invoke Lambda
    const firehoseRole = new iam.Role(this, 'FirehoseRole', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });
    dataBucket.grantWrite(firehoseRole);

    // 3) Compute the monorepo root and your Lambda entry file
    const projectRoot = path.resolve(__dirname, '../..');
    const entryFile = path.join(projectRoot, 'backend-services', 'src', 'index.ts');

    // 4) Define your transform Lambda, bundling from the repo root
    const transformLambda = new NodejsFunction(this, 'TransformLambda', {
      runtime: Runtime.NODEJS_20_X, // :contentReference[oaicite:1]{index=1}
      entry: entryFile,
      handler: 'handler',
      projectRoot: projectRoot,
      bundling: {
        // Forces esbuild to include this package in the bundle
        nodeModules: ['@aws-lambda-powertools/logger'],
        // OR, if you want to treat it as external at runtime:
        // externalModules: ['@aws-lambda-powertools/logger'],
      }, // :contentReference[oaicite:2]{index=2}
    });
    transformLambda.grantInvoke(firehoseRole);

    // 5) Kinesis Firehose delivery stream with Lambda processing to S3
    new firehose.CfnDeliveryStream(this, 'DataDeliveryStream', {
      deliveryStreamType: 'DirectPut',
      extendedS3DestinationConfiguration: {
        bucketArn: dataBucket.bucketArn,
        roleArn: firehoseRole.roleArn,
        bufferingHints: { intervalInSeconds: 60, sizeInMBs: 5 },
        processingConfiguration: {
          enabled: true,
          processors: [
            {
              type: 'Lambda',
              parameters: [
                {
                  parameterName: 'LambdaArn',
                  parameterValue: transformLambda.functionArn,
                },
              ],
            },
          ],
        },
      },
    });
  }
}
