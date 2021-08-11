import * as path from "path";
import { Construct } from 'constructs';
import { App, TerraformStack, TerraformOutput } from "cdktf";

// import * as aws from '@cdktf/provider-aws';
import * as aws from '@cdktf/provider-aws';
import { NodejsFunction } from '@cdktf-plus/aws';

class LambdaStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new aws.AwsProvider(this, "provider", {
      region: "eu-central-1",
    });

    // Create Lambda executable including Cloudwatch Logs and IAM execution role
    // Code will be bundled via esbuild and inline all dependencies
    const lambda = new NodejsFunction(this, "lambda-function", {
      path: path.join(__dirname, './app', 'index.ts'),
      timeout: 90,
      memorySize: 128,
    });

    // Create and configure API gateway
    const api = new aws.Apigatewayv2Api(this, "api-gw", {
      name: name,
      protocolType: "HTTP",
      target: lambda.fn.invokeArn
    })

    new aws.LambdaPermission(this, "apigw-lambda", {
      functionName: lambda.fn.functionName,
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

new LambdaStack(app, 'hello-world');

app.synth();
