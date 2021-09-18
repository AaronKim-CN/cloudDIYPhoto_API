# cloudDIYPhoto_API
This is API part of Cloud DIY Photo project. It's a back-end API service, and it should work with [cloudDIYPhoto_Client](https://github.com/AaronKim-CN/cloudDIYPhoto_Client) together. Please refer to the following process to install the API.

# Prepare

## Create a AWS account
This application is based on several AWS services. So, please create an AWS account first. And, and AWS ACCESSKEY, SECRETKEY and REGION to the .env file.

## Set-up DynamoDB on the AWS
Create 3 tables on the DynamoDB and add the table information to the .env file.
- Album Table, it collects album information.
- Picture Table, it collects pictures location on the S3 and some metadata.
- User Table, it stores the user information and control who can access to this service.

## Set-up S3 on the AWS
Create a bucket on the AWS and add the bucket name to the .env file.

# Run the application
Simply run the following basic nodejs commandes to run the App. 
```
npm install
npm start
```

# Test the API
Simply access the following link on the browser, it should get a response. Event it didn't test authentication, the whole API should running well if you got a messsage from the server.
```
http://localhost:9000/testAPI/
```
