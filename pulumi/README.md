
~~~shell
> PULUMI_CONFIG_PASSPHRASE="" pulumi preview -s dev
Previewing update (dev):
     Type                             Name                  Plan
 +   pulumi:pulumi:Stack              hello-world-dev       create
 +   ├─ aws:iam:Role                  lambdaRole            create
 +   ├─ aws:apigatewayv2:Api          httpApiGateway        create
 +   ├─ aws:lambda:Function           lambdaFunction        create
 +   ├─ aws:iam:RolePolicyAttachment  lambdaRoleAttachment  create
 +   ├─ aws:apigatewayv2:Integration  lambdaIntegration     create
 +   ├─ aws:lambda:Permission         lambdaPermission      create
 +   ├─ aws:apigatewayv2:Route        apiRoute              create
 +   └─ aws:apigatewayv2:Stage        apiStage              create

Resources:
    + 9 to create
~~~
