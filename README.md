# Showcase Serverless App using API gateway v2 and Lambda

This showcase should make it easy to compare between IaC code variants as both are creating the same resources. After deployment you got an AWS API Gateway v2 which executes a lambda function to print "Hello world!"

The IaC code is written in
- in HCL for terraform (see [terraform/README.md](terraform/README.md))
- typescript for cdktf (see [cdktf/README.md](cdktf/README.md))
- typescript for pulumi (see [pulumi/README.md](pulumi/README.md))

As of [CDK for Terraform 0.5](https://www.hashicorp.com/blog/announcing-cdk-for-terraform-0-5) it is possible to convert terraform code. See [cdktf-convert/run.sh](cdktf-convert/run.sh).

## Usage

All directories are containing a `run.sh` script to get you started.

## Resources

AWS Resources which are created:

- CloudWatch Logs
  - Role & Policy (allow lambda write to CloudWatch)
- Lambda Function
  - API Gateway v2

## References

- [CDK for Terraform](https://www.hashicorp.com/blog/cdk-for-terraform-enabling-python-and-typescript-support)
- [Introducing the Cloud Development Kit for Terraform](https://aws.amazon.com/blogs/developer/introducing-the-cloud-development-kit-for-terraform-preview)
- [CDK Construct Hub](https://constructs.dev/)
