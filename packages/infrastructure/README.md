# Welcome to your CDK App for Common Value 

The goal of this package is to define the infrastructure of the project as Code also known as IoC (Infrastructure as Code).

The Entrypoint of the CDK App is /bin/infrastructure.ts
There you will find all the stacks that will be deployed. A stack in the AWS world is a term to combine multiple aws resources under one group. 
At the moment stage there are following stacks:

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Current stacks

* `/lib/infrastructure-stack`   defines the VPC, the EC2-Instance where oracle node app is running and postgres database
* `/lib/website-stack`   defined S3 Bucket for the static frontend, and a cloudfront distribution as a CDN

## How to start
1) make sure you have cdk installed otherwise you can use it with npx --> npx cdk 

2) Check if cdk can create cloudformation templates --> ENV_MODE=dev npx cdk synth  
 (we need the ENV_MODE for the correct lookup of the config in the env-config folder)

3)




































