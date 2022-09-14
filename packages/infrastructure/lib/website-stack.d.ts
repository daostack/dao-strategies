import { Stack, App } from "aws-cdk-lib";
import { BaseStackProps } from "../interfaces/BaseStackProps";
export interface StaticSiteProps extends BaseStackProps {
    domainName: string;
    siteSubDomain: string;
}
/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 */
export declare class StaticSiteStack extends Stack {
    constructor(parent: App, name: string, props: StaticSiteProps);
}
