import * as path from "path";
import { Construct } from 'constructs';
import { App, TerraformStack, TerraformAsset, AssetType, TerraformOutput } from "cdktf";

// import * as aws from '@cdktf/provider-aws';
import * as aws from './.gen/providers/aws';
import * as random from './.gen/providers/random';

interface LambdaFunctionConfig {
  path: string,
  handler: string,
  runtime: string,
  stageName: string,
  version: string,
}

const lambdaRolePolicy = {
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}

class LambdaStack extends TerraformStack {
  constructor(scope: Construct, name: string, config: LambdaFunctionConfig) {
    super(scope, name);

    new aws.AwsProvider(this, "provider", {
      region: "eu-central-1",
    });

    // Create random value
    const pet = new random.Pet(this, "random-name", {
      length: 2,
    })

    // Create Lambda executable
    const asset = new TerraformAsset(this, "lambda-asset", {
      path: path.resolve(__dirname, config.path),
      type: AssetType.ARCHIVE, // if left empty it infers directory and file
    });

    // Create unique S3 bucket that hosts Lambda executable
    const bucket = new aws.S3Bucket(this, "bucket", {
      bucketPrefix: `showcase-${name}`,
    });

    // Upload Lambda zip file to newly created S3 bucket
    const lambdaArchive = new aws.S3BucketObject(this, "lambda-archive", {
      bucket: bucket.bucket,
      key: `${config.version}/${asset.fileName}`,
      source: asset.path, // returns a posix path
    });

    // Create Lambda role
    const role = new aws.IamRole(this, "lambda-exec", {
      name: `showcase-${name}-${pet.id}`,
      assumeRolePolicy: JSON.stringify(lambdaRolePolicy)
    })

    // // Add execution role for lambda to write to CloudWatch logs
    // new aws.IamRolePolicyAttachment(this, "lambda-managed-policy", {
    //   policyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
    //   role: role.name
    // })

    // Create hash to detect changes in application
    const lambda_file = new TerraformAsset(this, "hello-world-code", {
      path: path.resolve(__dirname, "../application"),
      type: AssetType.ARCHIVE
    });

    // Create Lambda function
    const lambdaFunc = new aws.LambdaFunction(this, "hello-world", {
      functionName: `showcase-${name}-${pet.id}`,
      s3Bucket: bucket.bucket,
      s3Key: lambdaArchive.key,
      handler: config.handler,
      runtime: config.runtime,
      role: role.arn,
      sourceCodeHash: lambda_file.assetHash
    });

    // Create and configure API gateway
    const api = new aws.Apigatewayv2Api(this, "api-gw", {
      name: name,
      protocolType: "HTTP",
      target: lambdaFunc.arn
    })

    new aws.LambdaPermission(this, "apigw-lambda", {
      functionName: lambdaFunc.functionName,
      action: "lambda:InvokeFunction",
      principal: "apigateway.amazonaws.com",
      sourceArn: `${api.executionArn}/*/*`,
    })

    new TerraformOutput(this, 'url', {
      value: api.apiEndpoint
    });

  }
}

const app = new App();

new LambdaStack(app, 'hello-world', {
  path: "../application/dist",
  handler: "index.handler",
  runtime: "nodejs10.x",
  stageName: "hello-world",
  version: "v0.0.2"
});

app.synth();
