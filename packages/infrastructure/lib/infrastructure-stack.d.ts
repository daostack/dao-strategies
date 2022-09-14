import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BaseStackProps } from '../interfaces/BaseStackProps';
export interface InfrastructureStackProps extends BaseStackProps {
}
export declare class InfrastructureStack extends Stack {
    constructor(scope: Construct, id: string, props: InfrastructureStackProps);
}
