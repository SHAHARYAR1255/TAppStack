/** @format */

// Import necessary modules from AWS CDK library
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Duration } from "aws-cdk-lib";

// Define the properties for the Microservices
interface TMicroservicesProps {
  transcriptionTable: ITable; // DynamoDB table for storing transcriptions
}

// Define the Microservices class
export class TMicroservices extends Construct {
  public readonly transcriptionMicroservice: NodejsFunction; // Lambda function for transcribing videos

  constructor(scope: Construct, id: string, props: TMicroservicesProps) {
    super(scope, id);

    // Initialize the transcription microservice
    this.transcriptionMicroservice = this.transcriptionFunction(
      props.transcriptionTable
    );
  }

  // Define the transcription function
  private transcriptionFunction(transcriptionTable: ITable): NodejsFunction {
    // Create a new Lambda function for video transcription
    const videoTranscribeLambda = new lambda.Function(
      this,
      "videoTranscribeLambda",
      {
        runtime: lambda.Runtime.NODEJS_18_X, // Use Node.js 18.x runtime
        handler: "index.handler", // Handler is the 'handler' function in 'index.ts' file
        code: lambda.Code.fromAsset("lambda"), // Code is located in the 'lambda' directory
        timeout: Duration.seconds(200), // Set the timeout to 200 seconds
      }
    );

    // Grant the Lambda function read/write access to the transcription table
    transcriptionTable.grantReadWriteData(videoTranscribeLambda);

    // Uncomment the following lines if needed:

    // Add an environment variable to the Lambda function
    // videoTranscribeLambda.addEnvironment("DIARY_BUCKET", bucket.bucketName);

    // Add a policy to the Lambda function's role
    // videoTranscribeLambda.addToRolePolicy(translatePolicyStatement);

    // Add permission for the API Gateway to invoke the Lambda function
    // videoTranscribeLambda.addPermission("PermitAPIGInvocation", {
    //   principal: new ServicePrincipal("apigateway.amazonaws.com"),
    //   sourceArn: api.arnForExecuteApi("*"),
    // });

    return videoTranscribeLambda; // Return the Lambda function
  }
}
