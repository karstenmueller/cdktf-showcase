# Showcase CDK for Terraform

This showcase should make it easy to compare between IaC code variants as both are creating the same resources. After deployment you got an AWS API Gateway v2 which executes a lambda function to print "Hello world!"

The IaC code is written in typescript for cdktf (see [cdktf/README.md](cdktf/README.md)) and in HCL for terraform (see [terraform/README.md](terraform/README.md)).

As of [CDK for Terraform 0.5](https://www.hashicorp.com/blog/announcing-cdk-for-terraform-0-5) it is possible to convert terraform code. See [cdktf-convert/run.sh](cdktf-convert/run.sh).

## Usage

All directories are containing a `run.sh` script to get you started.

## Resources

Resources which are created (Terraform ressource names):

- aws_apigatewayv2_api
- aws_iam_role
- aws_lambda_function
- aws_lambda_permission
- aws_s3_bucket
- aws_s3_bucket_object
- random_pet

## References

- [CDK for Terraform](https://www.hashicorp.com/blog/cdk-for-terraform-enabling-python-and-typescript-support)
- [Introducing the Cloud Development Kit for Terraform](https://aws.amazon.com/blogs/developer/introducing-the-cloud-development-kit-for-terraform-preview)
- [CDK Construct Hub](https://constructs.dev/)
