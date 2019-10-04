#!/usr/bin/env node

var engine = require('./engine');
var AWS = require('aws-sdk');
var params = require('aws-commons-parameters');
var sts = new AWS.STS({apiVersion: '2011-06-15'});

// OPTION 1: Configure service provider credentials through hard-coded config objects

// AWSConfig = {
//  accessKeyId: '',
//  secretAccessKey: '',
//  sessionToken: '',
//  region: 'us-east-1'
// };

// OPTION 2: Import a service provider config file containing credentials

//AWSConfig = require(__dirname + '/aws_credentials.json');


// OPTION 3: ENV configuration with service provider env vars
//if(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY){
//    AWSConfig = {
//        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//        secretAccessKey:  process.env.AWS_SECRET_ACCESS_KEY,
//        sessionToken: process.env.AWS_SESSION_TOKEN,
//        region: process.env.AWS_DEFAULT_REGION || 'us-east-1'
//    };
//}



// Custom settings - place plugin-specific settings here
var settings = {};

// If running in GovCloud, uncomment the following
// settings.govcloud = true;

// If running in AWS China, uncomment the following
// settings.china = true;

// If you want to disable AWS pagination, set the setting to false here
settings.paginate = true;

console.info(`Running cloudsploit scan with arguments ${process.argv}`);
// Now execute the scans using the defined configuration information.
getAwsConfig()
    .then( cfg => {
        engine(cfg, null, null, null, null, settings);
    })
    .catch( err => {
        console.error(err)
    });



async function getAwsConfig(){

    var role = await params.getPlainTextParameter(process.env.ROLE);
    var extId = await params.getEncryptedParameter(process.env.EXT_ID);

    var assumeRoleRequest = {
        RoleArn: role,
        RoleSessionName: 'cloudsploit-scan',
        ExternalId: extId
    };

    console.info(`Assuming role ${role}`);
    var resp = await sts.assumeRole(assumeRoleRequest).promise();
    console.info(`Assumed role with arn ${(resp.AssumedRoleUser.Arn)}`);

    return {
      accessKeyId: resp.Credentials.AccessKeyId,
      secretAccessKey: resp.Credentials.SecretAccessKey,
      sessionToken: resp.Credentials.SessionToken
   };
}



