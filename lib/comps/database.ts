/** @format */

import { RemovalPolicy } from "aws-cdk-lib";
import {
  AttributeType,
  BillingMode,
  ITable,
  Table,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class TDatabase extends Construct {
  public readonly transcriptionTable: ITable;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.transcriptionTable = this.createTranscriptionTable();
  }

  private createTranscriptionTable(): ITable {
    const transcriptionTable = new Table(this, "transcriptionTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: "transcriptionTable",
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    //remove if you dont need to add index
    // Add a Global Secondary Index
    transcriptionTable.addGlobalSecondaryIndex({
      indexName: "CreationTimeIndex", // Provide a name for the index
      partitionKey: {
        name: "username",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "CreationTime",
        type: AttributeType.STRING,
      },
    });
    return transcriptionTable;
  }
}
