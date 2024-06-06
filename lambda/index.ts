/** @format */

import {
  TranscribeClient,
  GetTranscriptionJobCommand,
} from "@aws-sdk/client-transcribe";

const TABLE_NAME = process.env.IMAGES_TABLE || "";
const BUCKET_NAME = process.env.DIARY_BUCKET || "";

const client = new TranscribeClient();

module.exports.handler = async (event: any) => {
  const queryParams = event.queryStringParameters;
  const { prompt } = queryParams;

  const input: any = {
    prompt, // dummy Input
  };
  const headers = {
    "Access-Control-Allow-Origin": "*", // or specify the allowed origin(s)
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE", // or the allowed methods
    "Access-Control-Allow-Headers": "Content-Type, Authorization", // or the allowed headers
  };
  try {
    const command = new GetTranscriptionJobCommand(input);
    const response = await client.send(command);
    //

    //
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "message",
        data: response,
        success: 1,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: 0,
        message: "Got Error",
        data: err,
      }),
    };
  }
};
