import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import * as apigw from "aws-cdk-lib/aws-apigateway";

export class CdkStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const helloLambda = new lambda.Function(this, "helloLambda", {
            functionName: "helloLambda",
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset(
                path.join(__dirname, "./src/lambdas/helloLambda")
            ),
            handler: "index.handler"
        })

        new apigw.LambdaRestApi(this, "Endpoint", {
            handler: helloLambda
        })

        // #region Bucket and Policies
        const photoBucket = new cdk.aws_s3.Bucket(this, "PhotoBucket", {
            bucketName: "PhotoBucket",
        });

        const photoBucketReadPolicy: cdk.aws_iam.PolicyStatement = new cdk.aws_iam.PolicyStatement({
            actions: ["s3:GetObject"],
            resources: [photoBucket.arnForObjects("*")]
        })
        const photoBucketWritePolicy: cdk.aws_iam.PolicyStatement = new cdk.aws_iam.PolicyStatement({
            actions: ["s3:PutObject"],
            resources: [photoBucket.arnForObjects("*")]
        })
        // #endregion


    }
}
