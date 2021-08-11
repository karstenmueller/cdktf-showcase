# Deploy lambda function with cdktf

Using NodejsFunction from Provider '@cdktf-plus/aws' it's simple:

~~~typescript
import { TerraformStack } from "cdktf";
import { NodejsFunction } from '@cdktf-plus/aws';

class LambdaStack extends TerraformStack {
    // Create Lambda executable including Cloudwatch Logs and IAM execution role
    // Code will be bundled via esbuild and inline all dependencies
    const lambda = new NodejsFunction(this, "lambda-function", {
      path: path.join(__dirname, '../application', 'index.ts')
    });
}
~~~

Using IamRole and IamRolePolicyAttachment from Provider '@cdktf/provider-aws' it's a bit longer:

~~~typescript
import { TerraformStack } from "cdktf";
import * as aws from '@cdktf/provider-aws';

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
    // Create AWS Lambda execution role
    const role = new aws.IamRole(this, "lambda-exec", {
      name: `showcase-${name}`,
      assumeRolePolicy: JSON.stringify(lambdaRolePolicy)
    })
    // Attach AWS managed policy to allow writing CloudWatch logs
    new aws.IamRolePolicyAttachment(this, "managed-policy", {
      policyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
      role: role.name
    })
}
~~~
