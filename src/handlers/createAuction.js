'use strict';
import { v4 as uuid } from 'uuid';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';
import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient();


async function createAuction(event, context) {
  console.log("start ............");


  let { title } = event.body;
  const now = new Date();

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString()
  }
  try {
    await dynamoDB.put({
      TableName: 'AuctionsTable',
      Item: auction
    }).promise()


  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);

  }
  return {
    statusCode: 201,
    body: JSON.stringify({ auction }),
  };

}
export const handler = middy(createAuction)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
