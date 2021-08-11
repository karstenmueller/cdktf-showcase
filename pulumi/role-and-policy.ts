import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';

export function createRole(prefix: string, policies: aws.iam.Policy[], additionalPolicies?: aws.iam.GetPolicyResult[]): aws.iam.Role {
    const roleName = `${prefix}-role`;
    const role = new aws.iam.Role(roleName, {
        name: roleName,
        assumeRolePolicy: {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: {
                        Service: 'lambda.amazonaws.com',
                    },
                    Action: 'sts:AssumeRole',
                }
            ]
        },
        forceDetachPolicies: false,
        maxSessionDuration: 3600,
        path: '/service-role/',
    });

    policies.forEach(policy => {
        policy.name.apply(name => {
            new aws.iam.RolePolicyAttachment(`${prefix}-${name}-attachment`, {
                policyArn: policy.arn,
                role
            });
        })
    })

    if (typeof additionalPolicies !== 'undefined') {
        additionalPolicies.forEach(policy => {
            new aws.iam.RolePolicyAttachment(`${prefix}-${policy.name}-attachment`, {
                policyArn: policy.arn,
                role
            });
        })
    }

    return role;
}
