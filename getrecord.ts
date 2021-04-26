"use strict";

var AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.region,
});

module.exports.generate = (event, context, callback) => {
  var docClient = new AWS.DynamoDB.DocumentClient();
  const eventdata = JSON.parse(event.body);
  var itemname = eventdata.name;
  const table = process.env.DynamoDB_Table;
  const bucketkey = process.env.S3_Bucket;

  console.log("Querying for file name in the S3 bucket from DynamoDB database");

  var params = {
    TableName: table,
    KeyConditionExpression: "bucketname = :bkey",
    FilterExpression:
      "contains(objectname, :oname)",
    ExpressionAttributeValues: {
      ":bkey": bucketkey,
      ":oname": itemname
    },
  };
  console.log(params);
  docClient.query(params, function (err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      console.log("Query succeeded.");
      var response = {
        statusCode: 200,
        headers: {
          running: "smoothly",
        },
        body: JSON.stringify(data),
        isBase64Encoded: false,
      };
      callback(null, response);
    }
  });
};
