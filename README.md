# Serverless-DynamoDB-Demo
Uses the Serverless Framework to create a (Lambda) serverless API to record S3 objects in DynamoDB

##Setup:

1) Install Node.js v14 LTS
```console
nvm install v14.16.1
```

2) Install Serverless Framework
```console
npm install -g serverless
```

3) Install Node.js dependencies and devdependencies
```console
npm install --production=false
```

## Execute

1) Deploy resources
```console
serverless deploy --stage stage_name
```

## To generate OpenAPI 3.0 Specification for the API Gateway enpoints:

1) (Optionally) Edit definitions for API resources which are defined in 'serverless.doc.yml'
2) Use the openapi-documentation plugin to generate the OpenAPI specification documentation file 'openapi.yml'
```console
serverless openapi generate -o ./openapi-documentation/openapi.yml
```

## To remove resources

1) Empty S3 Bucket 'serverless-s3-apigw-bucket-7354
```console
aws s3 rm s3://bucket-name/doc --recursive
```

2) Delete resources
```console
serverless deploy --stage stage_name
```

  If you missed step 1, you will receive error:
  
    "An error occurred: S3BucketServerlesss3apigwbucket7354 - The bucket you tried to delete is not empty "
  
  Empty the Bucket and delete the CloudFormation stack.