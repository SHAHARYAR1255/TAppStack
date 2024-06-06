/** @format */

import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export class CognitoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, "Pool", {
      userPoolName: "Pool",
      signInCaseSensitive: false,
      passwordPolicy: {
        minLength: 8,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      selfSignUpEnabled: true,
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.CODE,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
    });

    //
    const provider = new cognito.UserPoolIdentityProviderGoogle(
      this,
      "googleProvider",
      {
        userPool: userPool,
        clientId: "", // Google Client id
        clientSecret: "", // Google Client Secret
        attributeMapping: {
          email: cognito.ProviderAttribute.GOOGLE_EMAIL,
          givenName: cognito.ProviderAttribute.GOOGLE_GIVEN_NAME,
          // phoneNumber: cognito.ProviderAttribute.GOOGLE_PHONE_NUMBERS,
        },
        scopes: ["profile", "email", "openid"],
      }
    );

    userPool.registerIdentityProvider(provider);
    //

    const userPoolClient = new cognito.UserPoolClient(
      this,
      "DiaryUserPool-client",
      {
        userPool,
        refreshTokenValidity: cdk.Duration.days(30),
        accessTokenValidity: cdk.Duration.days(1),
        idTokenValidity: cdk.Duration.days(1),
        preventUserExistenceErrors: true,
        oAuth: {
          callbackUrls: ["http://localhost:3001/"], // This is what user is allowed to be redirected to with the code upon signin. this can be a list of urls.
          logoutUrls: ["http://localhost:3001/"], // This is what user is allowed to be redirected to after signout. this can be a list of urls.
        },
      }
    );
    const domain = userPool.addDomain("domain", {
      cognitoDomain: {
        domainPrefix: "videostranscription",
      },
    });

    new cdk.CfnOutput(this, "domain", {
      value: domain.domainName,
    });

    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });

    // Export the User Pool's ARN
    new cdk.CfnOutput(this, "UserPoolArn", {
      value: userPool.userPoolArn,
      exportName: "CognitoUserPoolArn",
    });
  }
}
