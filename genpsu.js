"use strict";
var AWS = require("aws-sdk");
var s3 = new AWS.S3({ signatureVersion: "v4" });
var bucket = process.env.S3_Bucket;
module.exports.generate = function (event, context, callback) {
    if (!bucket) {
        callback(new Error("S3 bucket not set"));
    }
    var data = JSON.parse(event.body);
    var key = data.object_key;
    if (!key) {
        callback(new Error("S3 object key missing"));
        return;
    }
    var params = { Bucket: bucket, Key: key };
    s3.getSignedUrl("putObject", params, function (error, url) {
        if (error) {
            callback(error);
        }
        else {
            var responseBody = {
                url: url
            };
            var response = {
                statusCode: 200,
                headers: {
                    running: "smoothly"
                },
                body: JSON.stringify(responseBody),
                isBase64Encoded: false
            };
            callback(null, response);
        }
    });
};
