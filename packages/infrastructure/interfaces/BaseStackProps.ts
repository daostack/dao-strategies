import { AppProps } from "aws-cdk-lib";

export interface BaseStackProps extends AppProps {
    deploymentEnvironment: string;
    env?: {
        account: string | undefined;
        region: string | undefined;
    }
}
