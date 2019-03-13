'use strict';
var {signUpUser,service} = require("./cognito");
const aws = require("aws-sdk");
aws.config.update({region: process.env.REGION,});
let options = {apiVersion: '2012-08-10'}
var ddb = new aws.DynamoDB.DocumentClient(options);
module.exports.accountVerifyHandler = async (event, context, cb) => {
  event.response.autoConfirmUser = true;
  if (event.request.userAttributes.hasOwnProperty("email")) {
      event.response["autoVerifyEmail"] = true;
    }
  
    if (event.request.userAttributes.hasOwnProperty("phone_number")) {
      event.response["autoVerifyPhone"] = true;
    }
    cb(null, event);
};

console.log(process.env.USER_POOL_CLIENT_ID)
module.exports.createAccount = async (event, context, cb) => {
  let data = event
  if(event.body){
    data = JSON.parse(event.body)};

  let userID = '' + Math.random()*1000
  await signUpUser(
    data.email,
    data.password,
    [
      { Name: "custom:accountId", Value: userID }//,
    //  { Name: "name", Value: createRequest.companyName }
    ],
    process.env.USER_POOL_CLIENT_ID
  );
  data['PK'] = data.email
  data['SK'] = "v0Account" 
  await ddb.put({
    TableName: process.env.TABLE_NAME,
    Item: data
  }).promise()
  
    cb(null, event);
};
