<!-- @format -->

# Boiler plate for Infrastructure Deployment on AWS through aws cdk code

Edit the cognito-stack file
and update permissions of your lambda function
and add routes to your api-gateway

## Services included
Aws Cognito, Api Gateway, Lambda, S3, Dynamodb, SES, IAM Role

## commands:

npm install

npm run build

cdk config

cdk synth

cdk deploy

then use The returned A
## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template
