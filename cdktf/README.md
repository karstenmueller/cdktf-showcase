# CDK for Terraform

~~~shell
> cdktf plan
Stack: hello-world
Resources
 + AWS_APIGATEWAYV2_API api-gw              aws_apigatewayv2_api.api-gw
 + AWS_CLOUDWATCH_LOG_G lambda-function_sno aws_cloudwatch_log_group.lambda-functio
   ROUP                 op-log-group        n_snoop-log-group_0C1F7E3F
 + AWS_IAM_POLICY       lambda-function_ser aws_iam_policy.lambda-function_server-r
                        ver-role_role-polic ole_role-policy_FACD84B8
                        y
 + AWS_IAM_ROLE         lambda-function_ser aws_iam_role.lambda-function_server-rol
                        ver-role            e_E96813CF
 + AWS_IAM_ROLE_POLICY_ lambda-function_ser aws_iam_role_policy_attachment.lambda-f
   ATTACHMENT           ver-role_PolicyAtta unction_server-role_PolicyAttachment_9B
                        chment              DC8FC8
 + AWS_LAMBDA_FUNCTION  lambda-function_fn  aws_lambda_function.lambda-function_fn_
                                            644D8088
 + AWS_LAMBDA_PERMISSIO apigw-lambda        aws_lambda_permission.apigw-lambda
   N

Diff: 7 to create, 0 to update, 0 to delete.
~~~

### Full deploy

Install project dependencies

~~~bash
npm install
~~~

Generate CDK for Terraform constructs for Terraform provides and modules used in the project

~~~bash
cdktf get
~~~

Simply deploy via cdktf or choose terraform.

#### cdktf deployment

~~~bash
cdktf deploy hello-world 
~~~

#### terraform deployment

Lets you output a terraform plan with all the details you might be familiar with.

~~~bash
terraform -chdir=cdktf.out/stacks/hello-world init
terraform -chdir=cdktf.out/stacks/hello-world plan -no-color
terraform -chdir=cdktf.out/stacks/hello-world apply
~~~

## Bootstrap an empty directory

~~~bash
npm install -g cdktf-cli
mkdir -p infrastructure/terraform-cdk
cd infrastructure/terraform-cdk
cdktf init --template=typescript (Use --local to drop Terraform Cloud state management)
~~~

## References

- [Introduction to cdktf](https://learn.hashicorp.com/tutorials/terraform/cdktf)
- [skorfmann/awesome-terraform-cdk](https://github.com/skorfmann/awesome-terraform-cdk)
- [hashicorp/learn-cdktf-assets-stacks-lambda](https://github.com/hashicorp/learn-cdktf-assets-stacks-lambda)
- [hashicorp/terraform-cdk](https://github.com/hashicorp/terraform-cdk)
