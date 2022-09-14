import { AppProps } from "aws-cdk-lib";

export interface BaseStackProps extends AppProps {
    deploymentEnvironment: string;
}
