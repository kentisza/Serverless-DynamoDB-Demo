"use strict";

const AWS = require("aws-sdk");
const s3 = new AWS.S3({ signatureVersion: "v4" });
const bucket = process.env.S3_Bucket;

module.exports.generate = (event, context, callback) => {
  if (!bucket) {
    callback(new Error("S3 bucket not set"));
  }
  const data = JSON.parse(event.body);
  const key = data.object_key;

  if (!key) {
    callback(new Error("S3 object key missing"));
    return;
  }

  const params = { Bucket: bucket, Key: key };

  s3.getSignedUrl("putObject", params, (error, url) => {
    if (error) {
      callback(error);
    } else {
      var responseBody = {
        url: url
      };
      var response = {
        statusCode: 200,
        headers: {
          running: "smoothly",
        },
        body: JSON.stringify(responseBody),
        isBase64Encoded: false,
      };
      callback(null, response );
    }
  });
};
