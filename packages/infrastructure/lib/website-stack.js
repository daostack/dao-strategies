"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticSiteStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_certificatemanager_1 = require("aws-cdk-lib/aws-certificatemanager");
const aws_s3_1 = require("aws-cdk-lib/aws-s3");
const aws_cloudfront_1 = require("aws-cdk-lib/aws-cloudfront");
const aws_s3_deployment_1 = require("aws-cdk-lib/aws-s3-deployment");
const lib_1 = require("aws-cdk-lib/aws-route53-targets/lib");
const aws_route53_1 = require("aws-cdk-lib/aws-route53");
/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 */
class StaticSiteStack extends aws_cdk_lib_1.Stack {
    constructor(parent, name, props) {
        super(parent, name, props);
        const { domainName, deploymentEnvironment } = props;
        const prefix = `${deploymentEnvironment}-commonvalue`;
        const zone = aws_route53_1.HostedZone.fromLookup(this, "Zone", {
            domainName: props.domainName,
        });
        // subDomain constructing here possible
        const siteDomain = domainName;
        new aws_cdk_lib_1.CfnOutput(this, "Site", { value: "https://" + siteDomain });
        // Content bucket
        const siteBucket = new aws_s3_1.Bucket(this, "SiteBucket", {
            bucketName: siteDomain,
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "error.html",
            publicReadAccess: true,
            // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
            // the new bucket, and it will remain in your account until manually deleted. By setting the policy to
            // DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
        });
        new aws_cdk_lib_1.CfnOutput(this, "Bucket", { value: siteBucket.bucketName });
        // TLS certificate
        const certificateArn = new aws_certificatemanager_1.DnsValidatedCertificate(this, "SiteCertificate", {
            domainName: siteDomain,
            hostedZone: zone,
            region: "us-east-1",
        }).certificateArn;
        new aws_cdk_lib_1.CfnOutput(this, "Certificate", { value: certificateArn });
        // CloudFront distribution that provides HTTPS
        const distribution = new aws_cloudfront_1.CloudFrontWebDistribution(this, "SiteDistribution", {
            // aliasConfiguration: {
            //   acmCertRef: certificateArn,
            //   names: [siteDomain],
            //   sslMethod: SSLMethod.SNI,
            //   securityPolicy: SecurityPolicyProtocol.TLS_V1_1_2016,
            // },
            originConfigs: [
                {
                    customOriginSource: {
                        domainName: siteBucket.bucketWebsiteDomainName,
                        originProtocolPolicy: aws_cloudfront_1.OriginProtocolPolicy.HTTP_ONLY,
                    },
                    behaviors: [{ isDefaultBehavior: true }],
                },
            ],
        });
        new aws_cdk_lib_1.CfnOutput(this, "DistributionId", {
            value: distribution.distributionId,
        });
        // Route53 alias record for the CloudFront distribution
        new aws_route53_1.ARecord(this, "SiteAliasRecord", {
            recordName: siteDomain,
            target: aws_route53_1.RecordTarget.fromAlias(new lib_1.CloudFrontTarget(distribution)),
            zone,
        });
        // Deploy site contents to S3 bucket
        new aws_s3_deployment_1.BucketDeployment(this, "DeployWithInvalidation", {
            sources: [aws_s3_deployment_1.Source.asset("./site-contents")],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ["/*"],
        });
    }
}
exports.StaticSiteStack = StaticSiteStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vic2l0ZS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndlYnNpdGUtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsNkNBQW1FO0FBR25FLCtFQUE2RTtBQUM3RSwrQ0FBNEM7QUFDNUMsK0RBQWdJO0FBQ2hJLHFFQUF5RTtBQUN6RSw2REFBdUU7QUFDdkUseURBQTRFO0FBTzVFOzs7OztHQUtHO0FBQ0gsTUFBYSxlQUFnQixTQUFRLG1CQUFLO0lBQ3hDLFlBQVksTUFBVyxFQUFFLElBQVksRUFBRSxLQUFzQjtRQUMzRCxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMzQixNQUFNLEVBQUUsVUFBVSxFQUFFLHFCQUFxQixFQUFFLEdBQUcsS0FBSyxDQUFDO1FBQ3BELE1BQU0sTUFBTSxHQUFHLEdBQUcscUJBQXFCLGNBQWMsQ0FBQztRQUV0RCxNQUFNLElBQUksR0FBRyx3QkFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQy9DLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtTQUM3QixDQUFDLENBQUM7UUFDSCx1Q0FBdUM7UUFDdkMsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLFVBQVUsR0FBRyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBRWhFLGlCQUFpQjtRQUNqQixNQUFNLFVBQVUsR0FBRyxJQUFJLGVBQU0sQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ2hELFVBQVUsRUFBRSxVQUFVO1lBQ3RCLG9CQUFvQixFQUFFLFlBQVk7WUFDbEMsb0JBQW9CLEVBQUUsWUFBWTtZQUNsQyxnQkFBZ0IsRUFBRSxJQUFJO1lBRXRCLGdHQUFnRztZQUNoRyxzR0FBc0c7WUFDdEcscUdBQXFHO1lBQ3JHLGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87U0FDckMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFFaEUsa0JBQWtCO1FBQ2xCLE1BQU0sY0FBYyxHQUFHLElBQUksZ0RBQXVCLENBQ2hELElBQUksRUFDSixpQkFBaUIsRUFDakI7WUFDRSxVQUFVLEVBQUUsVUFBVTtZQUN0QixVQUFVLEVBQUUsSUFBSTtZQUNoQixNQUFNLEVBQUUsV0FBVztTQUNwQixDQUNGLENBQUMsY0FBYyxDQUFDO1FBQ2pCLElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFFOUQsOENBQThDO1FBQzlDLE1BQU0sWUFBWSxHQUFHLElBQUksMENBQXlCLENBQ2hELElBQUksRUFDSixrQkFBa0IsRUFDbEI7WUFDRSx3QkFBd0I7WUFDeEIsZ0NBQWdDO1lBQ2hDLHlCQUF5QjtZQUN6Qiw4QkFBOEI7WUFDOUIsMERBQTBEO1lBQzFELEtBQUs7WUFDTCxhQUFhLEVBQUU7Z0JBQ2I7b0JBQ0Usa0JBQWtCLEVBQUU7d0JBQ2xCLFVBQVUsRUFBRSxVQUFVLENBQUMsdUJBQXVCO3dCQUM5QyxvQkFBb0IsRUFBRSxxQ0FBb0IsQ0FBQyxTQUFTO3FCQUNyRDtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFFLGlCQUFpQixFQUFFLElBQUksRUFBRSxDQUFDO2lCQUN6QzthQUNGO1NBQ0YsQ0FDRixDQUFDO1FBQ0YsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUNwQyxLQUFLLEVBQUUsWUFBWSxDQUFDLGNBQWM7U0FDbkMsQ0FBQyxDQUFDO1FBRUgsdURBQXVEO1FBQ3ZELElBQUkscUJBQU8sQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDbkMsVUFBVSxFQUFFLFVBQVU7WUFDdEIsTUFBTSxFQUFFLDBCQUFZLENBQUMsU0FBUyxDQUM1QixJQUFJLHNCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUNuQztZQUNELElBQUk7U0FDTCxDQUFDLENBQUM7UUFFSCxvQ0FBb0M7UUFDcEMsSUFBSSxvQ0FBZ0IsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUU7WUFDbkQsT0FBTyxFQUFFLENBQUMsMEJBQU0sQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUMxQyxpQkFBaUIsRUFBRSxVQUFVO1lBQzdCLFlBQVk7WUFDWixpQkFBaUIsRUFBRSxDQUFDLElBQUksQ0FBQztTQUMxQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFsRkQsMENBa0ZDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBTdGFjaywgQXBwLCBDZm5PdXRwdXQsIFJlbW92YWxQb2xpY3kgfSBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XG5pbXBvcnQgeyBCYXNlU3RhY2tQcm9wcyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0Jhc2VTdGFja1Byb3BzXCI7XG5pbXBvcnQgeyBEbnNWYWxpZGF0ZWRDZXJ0aWZpY2F0ZSB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtY2VydGlmaWNhdGVtYW5hZ2VyXCI7XG5pbXBvcnQgeyBCdWNrZXQgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLXMzXCI7XG5pbXBvcnQgeyBDbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uLCBTU0xNZXRob2QsIFNlY3VyaXR5UG9saWN5UHJvdG9jb2wsIE9yaWdpblByb3RvY29sUG9saWN5IH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1jbG91ZGZyb250XCI7XG5pbXBvcnQgeyBCdWNrZXREZXBsb3ltZW50LCBTb3VyY2UgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLXMzLWRlcGxveW1lbnRcIjtcbmltcG9ydCB7IENsb3VkRnJvbnRUYXJnZXQgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLXJvdXRlNTMtdGFyZ2V0cy9saWJcIjtcbmltcG9ydCB7IEFSZWNvcmQsIEhvc3RlZFpvbmUsIFJlY29yZFRhcmdldCB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3Mtcm91dGU1M1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0YXRpY1NpdGVQcm9wcyBleHRlbmRzIEJhc2VTdGFja1Byb3BzIHtcbiAgZG9tYWluTmFtZTogc3RyaW5nO1xuICBzaXRlU3ViRG9tYWluOiBzdHJpbmc7XG59XG5cbi8qKlxuICogU3RhdGljIHNpdGUgaW5mcmFzdHJ1Y3R1cmUsIHdoaWNoIGRlcGxveXMgc2l0ZSBjb250ZW50IHRvIGFuIFMzIGJ1Y2tldC5cbiAqXG4gKiBUaGUgc2l0ZSByZWRpcmVjdHMgZnJvbSBIVFRQIHRvIEhUVFBTLCB1c2luZyBhIENsb3VkRnJvbnQgZGlzdHJpYnV0aW9uLFxuICogUm91dGU1MyBhbGlhcyByZWNvcmQsIGFuZCBBQ00gY2VydGlmaWNhdGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdGF0aWNTaXRlU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudDogQXBwLCBuYW1lOiBzdHJpbmcsIHByb3BzOiBTdGF0aWNTaXRlUHJvcHMpIHtcbiAgICBzdXBlcihwYXJlbnQsIG5hbWUsIHByb3BzKTtcbiAgICBjb25zdCB7IGRvbWFpbk5hbWUsIGRlcGxveW1lbnRFbnZpcm9ubWVudCB9ID0gcHJvcHM7XG4gICAgY29uc3QgcHJlZml4ID0gYCR7ZGVwbG95bWVudEVudmlyb25tZW50fS1jb21tb252YWx1ZWA7XG5cbiAgICBjb25zdCB6b25lID0gSG9zdGVkWm9uZS5mcm9tTG9va3VwKHRoaXMsIFwiWm9uZVwiLCB7XG4gICAgICBkb21haW5OYW1lOiBwcm9wcy5kb21haW5OYW1lLFxuICAgIH0pO1xuICAgIC8vIHN1YkRvbWFpbiBjb25zdHJ1Y3RpbmcgaGVyZSBwb3NzaWJsZVxuICAgIGNvbnN0IHNpdGVEb21haW4gPSBkb21haW5OYW1lO1xuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgXCJTaXRlXCIsIHsgdmFsdWU6IFwiaHR0cHM6Ly9cIiArIHNpdGVEb21haW4gfSk7XG5cbiAgICAvLyBDb250ZW50IGJ1Y2tldFxuICAgIGNvbnN0IHNpdGVCdWNrZXQgPSBuZXcgQnVja2V0KHRoaXMsIFwiU2l0ZUJ1Y2tldFwiLCB7XG4gICAgICBidWNrZXROYW1lOiBzaXRlRG9tYWluLFxuICAgICAgd2Vic2l0ZUluZGV4RG9jdW1lbnQ6IFwiaW5kZXguaHRtbFwiLFxuICAgICAgd2Vic2l0ZUVycm9yRG9jdW1lbnQ6IFwiZXJyb3IuaHRtbFwiLFxuICAgICAgcHVibGljUmVhZEFjY2VzczogdHJ1ZSxcblxuICAgICAgLy8gVGhlIGRlZmF1bHQgcmVtb3ZhbCBwb2xpY3kgaXMgUkVUQUlOLCB3aGljaCBtZWFucyB0aGF0IGNkayBkZXN0cm95IHdpbGwgbm90IGF0dGVtcHQgdG8gZGVsZXRlXG4gICAgICAvLyB0aGUgbmV3IGJ1Y2tldCwgYW5kIGl0IHdpbGwgcmVtYWluIGluIHlvdXIgYWNjb3VudCB1bnRpbCBtYW51YWxseSBkZWxldGVkLiBCeSBzZXR0aW5nIHRoZSBwb2xpY3kgdG9cbiAgICAgIC8vIERFU1RST1ksIGNkayBkZXN0cm95IHdpbGwgYXR0ZW1wdCB0byBkZWxldGUgdGhlIGJ1Y2tldCwgYnV0IHdpbGwgZXJyb3IgaWYgdGhlIGJ1Y2tldCBpcyBub3QgZW1wdHkuXG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksIC8vIE5PVCByZWNvbW1lbmRlZCBmb3IgcHJvZHVjdGlvbiBjb2RlXG4gICAgfSk7XG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCBcIkJ1Y2tldFwiLCB7IHZhbHVlOiBzaXRlQnVja2V0LmJ1Y2tldE5hbWUgfSk7XG5cbiAgICAvLyBUTFMgY2VydGlmaWNhdGVcbiAgICBjb25zdCBjZXJ0aWZpY2F0ZUFybiA9IG5ldyBEbnNWYWxpZGF0ZWRDZXJ0aWZpY2F0ZShcbiAgICAgIHRoaXMsXG4gICAgICBcIlNpdGVDZXJ0aWZpY2F0ZVwiLFxuICAgICAge1xuICAgICAgICBkb21haW5OYW1lOiBzaXRlRG9tYWluLFxuICAgICAgICBob3N0ZWRab25lOiB6b25lLFxuICAgICAgICByZWdpb246IFwidXMtZWFzdC0xXCIsIC8vIENsb3VkZnJvbnQgb25seSBjaGVja3MgdGhpcyByZWdpb24gZm9yIGNlcnRpZmljYXRlcy5cbiAgICAgIH1cbiAgICApLmNlcnRpZmljYXRlQXJuO1xuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgXCJDZXJ0aWZpY2F0ZVwiLCB7IHZhbHVlOiBjZXJ0aWZpY2F0ZUFybiB9KTtcblxuICAgIC8vIENsb3VkRnJvbnQgZGlzdHJpYnV0aW9uIHRoYXQgcHJvdmlkZXMgSFRUUFNcbiAgICBjb25zdCBkaXN0cmlidXRpb24gPSBuZXcgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihcbiAgICAgIHRoaXMsXG4gICAgICBcIlNpdGVEaXN0cmlidXRpb25cIixcbiAgICAgIHtcbiAgICAgICAgLy8gYWxpYXNDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIC8vICAgYWNtQ2VydFJlZjogY2VydGlmaWNhdGVBcm4sXG4gICAgICAgIC8vICAgbmFtZXM6IFtzaXRlRG9tYWluXSxcbiAgICAgICAgLy8gICBzc2xNZXRob2Q6IFNTTE1ldGhvZC5TTkksXG4gICAgICAgIC8vICAgc2VjdXJpdHlQb2xpY3k6IFNlY3VyaXR5UG9saWN5UHJvdG9jb2wuVExTX1YxXzFfMjAxNixcbiAgICAgICAgLy8gfSxcbiAgICAgICAgb3JpZ2luQ29uZmlnczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGN1c3RvbU9yaWdpblNvdXJjZToge1xuICAgICAgICAgICAgICBkb21haW5OYW1lOiBzaXRlQnVja2V0LmJ1Y2tldFdlYnNpdGVEb21haW5OYW1lLFxuICAgICAgICAgICAgICBvcmlnaW5Qcm90b2NvbFBvbGljeTogT3JpZ2luUHJvdG9jb2xQb2xpY3kuSFRUUF9PTkxZLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJlaGF2aW9yczogW3sgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUgfV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH1cbiAgICApO1xuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgXCJEaXN0cmlidXRpb25JZFwiLCB7XG4gICAgICB2YWx1ZTogZGlzdHJpYnV0aW9uLmRpc3RyaWJ1dGlvbklkLFxuICAgIH0pO1xuXG4gICAgLy8gUm91dGU1MyBhbGlhcyByZWNvcmQgZm9yIHRoZSBDbG91ZEZyb250IGRpc3RyaWJ1dGlvblxuICAgIG5ldyBBUmVjb3JkKHRoaXMsIFwiU2l0ZUFsaWFzUmVjb3JkXCIsIHtcbiAgICAgIHJlY29yZE5hbWU6IHNpdGVEb21haW4sXG4gICAgICB0YXJnZXQ6IFJlY29yZFRhcmdldC5mcm9tQWxpYXMoXG4gICAgICAgIG5ldyBDbG91ZEZyb250VGFyZ2V0KGRpc3RyaWJ1dGlvbilcbiAgICAgICksXG4gICAgICB6b25lLFxuICAgIH0pO1xuXG4gICAgLy8gRGVwbG95IHNpdGUgY29udGVudHMgdG8gUzMgYnVja2V0XG4gICAgbmV3IEJ1Y2tldERlcGxveW1lbnQodGhpcywgXCJEZXBsb3lXaXRoSW52YWxpZGF0aW9uXCIsIHtcbiAgICAgIHNvdXJjZXM6IFtTb3VyY2UuYXNzZXQoXCIuL3NpdGUtY29udGVudHNcIildLFxuICAgICAgZGVzdGluYXRpb25CdWNrZXQ6IHNpdGVCdWNrZXQsXG4gICAgICBkaXN0cmlidXRpb24sXG4gICAgICBkaXN0cmlidXRpb25QYXRoczogW1wiLypcIl0sXG4gICAgfSk7XG4gIH1cbn0iXX0=