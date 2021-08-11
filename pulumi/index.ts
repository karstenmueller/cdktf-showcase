import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
// import { createConsumerRole, createDefaultPolicies, createPublisherRole } from './role-and-policy';

async function main() {
    const prefix = 'pulumi-hello-world';
    const lambda = createFunction(prefix, role, { BUCKET_NAME: bucket.id });
}

function createFunction(
    prefix: string,
    role: aws.iam.Role,
    variables?: pulumi.Input<{ [key: string]: pulumi.Input<string> }>,
    vpcConfig?: pulumi.Input<aws.types.input.lambda.FunctionVpcConfig>
): aws.lambda.Function {
    const name = `${prefix}-handler`;
    return new aws.lambda.Function(name, {
        handler: `index.${prefix}`,
        name,
        code: new pulumi.asset.FileArchive(`../application/dist`),
        runtime: 'nodejs14.x',
        role: role.arn,
        vpcConfig,
        timeout: 90,
        memorySize: 128,
        environment: {
            variables
        }
    });
}

export = main();
