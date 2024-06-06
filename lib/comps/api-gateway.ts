/** @format */

// Import necessary modules from AWS CDK library
import {
  RestApi,
  AuthorizationType,
  Cors,
  LambdaIntegration,
  CognitoUserPoolsAuthorizer,
} from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { ServicePrincipal } from "aws-cdk-lib/aws-iam";

// Define the properties for the API Gateway
interface TApiGatewayProps {
  transcriptionMicroservice: IFunction;
  userPoolArn: string;
}

// Define the API Gateway class
export class TApiGateway extends Construct {
  constructor(scope: Construct, id: string, props: TApiGatewayProps) {
    super(scope, id);

    // Initialize the transcription API
    this.transcriptionApi(props.transcriptionMicroservice, props.userPoolArn);
  }

  // Define the transcription API
  private transcriptionApi(
    transcriptionMicroservice: IFunction,
    userPoolArn: string
  ) {
    // Create a new REST API
    const apigw = new RestApi(this, "MainApi", {
      defaultCorsPreflightOptions: {
        // allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowOrigins: ["http://localhost:8081"],
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ["*"],
        allowCredentials: true,
      },
    });

    // Get the Cognito User Pool from the ARN
    const userPool = cognito.UserPool.fromUserPoolArn(
      this,
      "UserPool",
      userPoolArn
    );

    // Create a new Cognito User Pools Authorizer
    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      "CognitoAuthorizer",
      {
        cognitoUserPools: [userPool],
      }
    );

    // Add a new resource to the API
    //change with your route name
    const videoTranscribeResource = apigw.root.addResource("transcribe");

    // Create a new Lambda Integration
    const videoTranscribeLambdaIntegeration = new LambdaIntegration(
      transcriptionMicroservice,
      {
        requestParameters: {
          "integration.request.querystring.prompt":
            "method.request.querystring.prompt",
          // can add more
        },
      }
    );

    // Add a new GET method to the resource
    videoTranscribeResource.addMethod(
      "GET",
      videoTranscribeLambdaIntegeration,
      {
        authorizationType: AuthorizationType.COGNITO,
        authorizer: authorizer,
        requestParameters: {
          "method.request.querystring.prompt": true,
        },
      }
    );

    // Add permission for the API Gateway to invoke the Lambda function
    transcriptionMicroservice.addPermission("PermitAPIGInvocation", {
      principal: new ServicePrincipal("apigateway.amazonaws.com"),
      sourceArn: apigw.arnForExecuteApi("*"),
    });

    // Add a new resource with a path parameter to the API
    const videoTranscribeResourcesingle =
      videoTranscribeResource.addResource("{id}"); // videotranscribe/{id}

    // Add a new GET method to the resource with the path parameter
    videoTranscribeResourcesingle.addMethod("GET"); // GET /videotranscribe/{id}

    // Add a new DELETE method to the resource with the path parameter
    videoTranscribeResourcesingle.addMethod("DELETE"); // DELETE /videotranscribe/{id}
  }
}
