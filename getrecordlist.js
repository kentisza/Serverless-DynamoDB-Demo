"use strict";
var AWS = require("aws-sdk");
AWS.config.update({
    region: process.env.region
});
module.exports.generate = function (event, context, callback) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var eventdata = JSON.parse(event.body);
    var order = eventdata.sortorder;
    var block = eventdata.pagination;
    var table = process.env.DynamoDB_Table;
    var bucketkey = process.env.S3_Bucket;
    console.log("Querying for all files in the S3 bucket from DynamoDB database");
    if (order == "ascending") {
        var sif = false;
    }
    if (order == "descending") {
        var sif = true;
    }
    else {
        console.log("sortorder must be ascending or descending.");
    }
    var params = {
        TableName: table,
        KeyConditionExpression: "bucketname = :bkey",
        ExpressionAttributeValues: {
            ":bkey": bucketkey
        },
        Limit: block,
        ScanIndexForward: sif
    };
    console.log(params);
    docClient.query(params, function (err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            console.log("Query succeeded.");
            var response = {
                statusCode: 200,
                headers: {
                    running: "smoothly"
                },
                body: JSON.stringify(data),
                isBase64Encoded: false
            };
            callback(null, response);
        }
    });
};
