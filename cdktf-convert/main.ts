import * as cdktf from "cdktf";
import * as aws from "./.gen/providers/aws";
import * as random from "./.gen/providers/random";
import * as archive from "./.gen/providers/archive";
const awsRegion = new cdktf.TerraformVariable(this, "aws_region", {
  default: "eu-central-1",
});
const name = "hello-world";
const awsIamRoleLambdaExec = new aws.IamRole(this, "lambda-exec", {
  assumeRolePolicy:
    '{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Action": "sts:AssumeRole",\n      "Principal": {\n        "Service": "lambda.amazonaws.com"\n      },\n      "Effect": "Allow",\n      "Sid": ""\n    }\n  ]\n}\n',
  name: "showcase-${local.name}-${random_pet.random-name.id}",
});
const awsS3BucketBucket = new aws.S3Bucket(this, "bucket", {
  acl: "private",
  bucket: "showcase-${local.name}-${random_pet.random-name.id}",
});
const awsS3BucketObjectLambdaArchive = new aws.S3BucketObject(
  this,
  "lambda-archive",
  {
    bucket: awsS3BucketBucket.bucket,
    key: "v0.0.2/archive.zip",
    source: "./archive.zip",
  }
);
new random.Pet(this, "random-name", {
  length: 2,
});
const dataArchiveFileThis = new archive.DataArchiveFile(this, "this", {
  outputPath: "./archive.zip",
  sourceFile: "./app/dist/index.js",
  type: "zip",
});
new aws.AwsProvider(this, "aws", {
  region: awsRegion.value,
});
const awsLambdaFunctionHelloWorld = new aws.LambdaFunction(
  this,
  "hello-world",
  {
    functionName: "showcase-${local.name}-${random_pet.random-name.id}",
    handler: "index.handler",
    role: awsIamRoleLambdaExec.arn,
    runtime: "nodejs10.x",
    s3Bucket: awsS3BucketBucket.bucket,
    s3Key: awsS3BucketObjectLambdaArchive.key,
    sourceCodeHash: dataArchiveFileThis.outputBase64Sha256,
  }
);
const awsApigatewayv2ApiApiGw = new aws.Apigatewayv2Api(this, "api-gw", {
  name: name,
  protocolType: "HTTP",
  target: awsLambdaFunctionHelloWorld.arn,
});
new aws.LambdaPermission(this, "apigw-lambda", {
  action: "lambda:InvokeFunction",
  functionName: awsLambdaFunctionHelloWorld.functionName,
  principal: "apigateway.amazonaws.com",
  sourceArn: `\${${awsApigatewayv2ApiApiGw.executionArn}}/*/*`,
});
new cdktf.TerraformOutput(this, "url", {
  value: awsApigatewayv2ApiApiGw.apiEndpoint,
});

