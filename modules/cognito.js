'use strict';

const aws = require("aws-sdk");

module.exports.signUpUser = async (email,
  password,attributes,clientId,) => {
  const params = {
    ClientId: clientId,
    Password: password,
    Username: email,
    UserAttributes: attributes
  };

  const service = new aws.CognitoIdentityServiceProvider();

  return service
    .signUp(params)
    .promise()
    .then(data => {
      return data.UserSub;
    });
};

module.exports.deleteUser = async (
    userId, poolId) => {
    const params = {
      Username: userId,
      UserPoolId: poolId
    };
  
  const service = new aws.CognitoIdentityServiceProvider();
    return service
      .adminDeleteUser(params)
      .promise()
      .then(data => {});
  };
  
