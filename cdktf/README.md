# CDK for Terraform

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
