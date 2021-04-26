"use strict";

const AWS = require("aws-sdk");
const s3 = new AWS.S3({ signatureVersion: "v4" });
const ddbClient = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

module.exports.generate = async (event, context) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  const mimeparams = {
    Bucket: bucket,
    Key: key,
  };
  const objectsize = event.Records[0].s3.object.size;
  const eventtime = event.Records[0].eventTime;
  const { ContentType } = await s3.getObject(mimeparams).promise();
  console.log("CONTENT TYPE:", ContentType);
  let putParams = {
    TableName: process.env.DynamoDB_Table,
    Item: {
      bucketname: { S: bucket },
      objectname: { S: key },
      uploadtimedate: { S: eventtime },
      mimetype: { S: ContentType },
      filesize: { S: JSON.stringify(objectsize) },
    },
  };
  console.log("putParams", putParams);
  try {
        var result = await ddbClient.putItem(putParams).promise();
        console.log(JSON.stringify(result))
  } catch(err) {
        console.log(err);
    }
};