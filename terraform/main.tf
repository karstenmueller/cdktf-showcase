locals {
  name = "hello-world"
}

variable "aws_region" {
  default = "eu-central-1"
}

provider "aws" {
  region = var.aws_region
}

# Create random value
resource "random_pet" "random-name" {
  length = 2
}

data "archive_file" "this" {
  type        = "zip"
  source_file = "../application/dist/index.js"
  output_path = "./archive.zip"
}

# Create unique S3 bucket that hosts Lambda executable
resource "aws_s3_bucket" "bucket" {
  bucket = "showcase-${local.name}-${random_pet.random-name.id}"
  acl    = "private"
}

# Upload Lambda zip file to newly created S3 bucket
resource "aws_s3_bucket_object" "lambda-archive" {
  bucket = aws_s3_bucket.bucket.bucket
  key    = "v0.0.2/archive.zip"
  source = "./archive.zip"
}

# Create Lambda role
resource "aws_iam_role" "lambda-exec" {
  name = "showcase-${local.name}-${random_pet.random-name.id}"

  assume_role_policy = <<EOF
{
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
EOF
}

# Lambda function
resource "aws_lambda_function" "hello-world" {
  function_name    = "showcase-${local.name}-${random_pet.random-name.id}"
  handler          = "index.handler"
  role             = aws_iam_role.lambda-exec.arn
  runtime          = "nodejs10.x"
  s3_bucket        = aws_s3_bucket.bucket.bucket
  s3_key           = aws_s3_bucket_object.lambda-archive.key
  source_code_hash = data.archive_file.this.output_base64sha256
}

# AWS API Gateway HTTP v2
resource "aws_apigatewayv2_api" "api-gw" {
  name          = local.name
  protocol_type = "HTTP"
  target        = aws_lambda_function.hello-world.arn
}

output "url" {
  value = aws_apigatewayv2_api.api-gw.api_endpoint
}

# Permission
resource "aws_lambda_permission" "apigw-lambda" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.hello-world.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.api-gw.execution_arn}/*/*"
}
