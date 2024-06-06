/** @format */

import { Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CognitoStack } from "./comps/cognito-stack";
import { TAppStack } from "./comps/application-stack";

export class AwsCdkTDemoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const cognito = new CognitoStack(this, "Cognito");

    Tags.of(cognito).add("Module", "Cognito");

    const api = new TAppStack(this, "Api");

    Tags.of(api).add("Module", "API");

    //
  }
}
