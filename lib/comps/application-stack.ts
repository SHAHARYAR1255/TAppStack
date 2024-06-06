/** @format */

// Import necessary modules from AWS CDK library
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import { RemovalPolicy } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { TApiGateway } from "./api-gateway";
import { TDatabase } from "./database";
import { TMicroservices } from "./microservice";

// Import the ARN of the Cognito User Pool
const userPoolArn = cdk.Fn.importValue("CognitoUserPoolArn");

// Define the TAppStack class
export class TAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a new S3 bucket
    const bucket = new s3.Bucket(this, "MainBucket", {
      removalPolicy: RemovalPolicy.DESTROY, // The bucket and its contents will be deleted when the stack is deleted
      autoDeleteObjects: true, // Automatically delete all objects in the bucket when the bucket is deleted (not recommended for production code)
    });

    // Initialize the database
    const database = new TDatabase(this, "Database");

    // Initialize the microservices
    const microservices = new TMicroservices(this, "Microservices", {
      transcriptionTable: database.transcriptionTable, // Pass the transcription table from the database to the microservices
    });

    // Grant the microservice read/write access to the S3 bucket
    bucket.grantReadWrite(microservices.transcriptionMicroservice);

    // Create a new IAM policy statement that allows the microservice to invoke the Translate service
    const PolicyStatement = new iam.PolicyStatement({
      actions: [
        "translate:*", // Allow all actions on the Translate service
        // Add any other policies you need for your service
      ],
      effect: iam.Effect.ALLOW, // The policy allows the actions
      resources: ["*"], // The policy applies to all resources (adjust based on your requirements)
    });

    // Add the policy statement to the microservice's role
    microservices.transcriptionMicroservice.addToRolePolicy(PolicyStatement);

    // Initialize the API Gateway
    const apigateway = new TApiGateway(this, "ApiGateway", {
      transcriptionMicroservice: microservices.transcriptionMicroservice,
      userPoolArn, // Pass the microservice to the API Gateway
    });

    //
  }
}
