"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfrastructureStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_rds_1 = require("aws-cdk-lib/aws-rds");
const fs_1 = require("fs");
const path = require("path");
class InfrastructureStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const { deploymentEnvironment } = props;
        const prefix = `${deploymentEnvironment}-commonvalue`;
        // --------------- VPC SECTION
        // 👇 create the VPC
        const vpc = new aws_ec2_1.Vpc(this, `${prefix}-vpc`, {
            /**
             * cidr - the CIDR block of the VPC. Must be between /16 (65536 IP Addresses) and /28 (16 IP addresses).
             * The default value for a CIDR range is 10.0.0.0/16.
             */
            cidr: '10.0.0.0/16',
            /**
             * natGateways - how many NAT gateways should be created for the VPC. By default, one NAT Gateway is created for each availability zone.
             * When testing you should lower the number of natGateways to 1 to avoid burning money.
             */
            natGateways: 0,
            maxAzs: 3,
            subnetConfiguration: [
                {
                    name: `${prefix}-public-subnet-1`,
                    subnetType: aws_ec2_1.SubnetType.PUBLIC,
                    cidrMask: 24,
                },
                {
                    name: `${prefix}-isolated-subnet-1`,
                    subnetType: aws_ec2_1.SubnetType.PRIVATE_ISOLATED,
                    cidrMask: 28,
                },
            ],
        });
        // --------------- EC2 SECTION
        // 👇 create a security group for the EC2 instance
        const ec2InstanceSG = new aws_ec2_1.SecurityGroup(this, 'ec2-instance-sg', {
            vpc,
        });
        ec2InstanceSG.addIngressRule(aws_ec2_1.Peer.anyIpv4(), aws_ec2_1.Port.tcp(22), 'allow SSH connections from anywhere');
        // 👇 create the EC2 instance
        const ec2Instance = new aws_ec2_1.Instance(this, `${prefix}-ec2-oracle`, {
            vpc,
            vpcSubnets: {
                subnetType: aws_ec2_1.SubnetType.PUBLIC,
            },
            securityGroup: ec2InstanceSG,
            instanceType: aws_ec2_1.InstanceType.of(aws_ec2_1.InstanceClass.BURSTABLE2, aws_ec2_1.InstanceSize.SMALL),
            machineImage: new aws_ec2_1.AmazonLinuxImage({
                generation: aws_ec2_1.AmazonLinuxGeneration.AMAZON_LINUX_2,
            }),
            //keypair needs to be created by hand first (over the web console for example)
            keyName: 'oracle-ec2-key-pair',
        });
        // 👇 load user data script aka startup script that will be executed on the very first boot
        const userDataScript = fs_1.readFileSync(path.resolve(__dirname, `./lib/scripts/oracle-start.sh`), 'utf-8');
        // 👇 add user data to the EC2 instance
        ec2Instance.addUserData(userDataScript);
        // --------------- DATABASE SECTION
        // 👇 create RDS instance
        const dbInstance = new aws_rds_1.DatabaseInstance(this, `${prefix}-postgres-db`, {
            vpc,
            vpcSubnets: {
                subnetType: aws_ec2_1.SubnetType.PRIVATE_ISOLATED,
            },
            engine: aws_rds_1.DatabaseInstanceEngine.postgres({
                version: aws_rds_1.PostgresEngineVersion.VER_14_2,
            }),
            instanceType: aws_ec2_1.InstanceType.of(aws_ec2_1.InstanceClass.BURSTABLE3, aws_ec2_1.InstanceSize.MICRO),
            credentials: aws_rds_1.Credentials.fromGeneratedSecret('postgres'),
            multiAz: false,
            backupRetention: aws_cdk_lib_1.Duration.days(0),
            deleteAutomatedBackups: true,
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            deletionProtection: false,
            databaseName: 'oracle-pg-database',
            publiclyAccessible: false,
        });
        dbInstance.connections.allowFrom(ec2Instance, aws_ec2_1.Port.tcp(5432));
    }
}
exports.InfrastructureStack = InfrastructureStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mcmFzdHJ1Y3R1cmUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmZyYXN0cnVjdHVyZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBeUU7QUFDekUsaURBQStLO0FBQy9LLGlEQUFtSDtBQUVuSCwyQkFBa0M7QUFFbEMsNkJBQTZCO0FBTTdCLE1BQWEsbUJBQW9CLFNBQVEsbUJBQUs7SUFDNUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUErQjtRQUN2RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEVBQUUscUJBQXFCLEVBQUUsR0FBRyxLQUFLLENBQUM7UUFDeEMsTUFBTSxNQUFNLEdBQUcsR0FBRyxxQkFBcUIsY0FBYyxDQUFDO1FBQ3RELDhCQUE4QjtRQUM5QixvQkFBb0I7UUFDcEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxhQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsTUFBTSxNQUFNLEVBQUU7WUFDekM7OztlQUdHO1lBQ0gsSUFBSSxFQUFFLGFBQWE7WUFDbkI7OztlQUdHO1lBQ0gsV0FBVyxFQUFFLENBQUM7WUFDZCxNQUFNLEVBQUUsQ0FBQztZQUNULG1CQUFtQixFQUFFO2dCQUNuQjtvQkFDRSxJQUFJLEVBQUUsR0FBRyxNQUFNLGtCQUFrQjtvQkFDakMsVUFBVSxFQUFFLG9CQUFVLENBQUMsTUFBTTtvQkFDN0IsUUFBUSxFQUFFLEVBQUU7aUJBQ2I7Z0JBQ0Q7b0JBQ0UsSUFBSSxFQUFFLEdBQUcsTUFBTSxvQkFBb0I7b0JBQ25DLFVBQVUsRUFBRSxvQkFBVSxDQUFDLGdCQUFnQjtvQkFDdkMsUUFBUSxFQUFFLEVBQUU7aUJBQ2I7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUNILDhCQUE4QjtRQUM5QixrREFBa0Q7UUFDbEQsTUFBTSxhQUFhLEdBQUcsSUFBSSx1QkFBYSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUMvRCxHQUFHO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsYUFBYSxDQUFDLGNBQWMsQ0FBQyxjQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsY0FBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxxQ0FBcUMsQ0FBQyxDQUFDO1FBQ2xHLDZCQUE2QjtRQUM3QixNQUFNLFdBQVcsR0FBRyxJQUFJLGtCQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsTUFBTSxhQUFhLEVBQUU7WUFDN0QsR0FBRztZQUNILFVBQVUsRUFBRTtnQkFDVixVQUFVLEVBQUUsb0JBQVUsQ0FBQyxNQUFNO2FBQzlCO1lBQ0QsYUFBYSxFQUFFLGFBQWE7WUFDNUIsWUFBWSxFQUFFLHNCQUFZLENBQUMsRUFBRSxDQUFDLHVCQUFhLENBQUMsVUFBVSxFQUFFLHNCQUFZLENBQUMsS0FBSyxDQUFDO1lBQzNFLFlBQVksRUFBRSxJQUFJLDBCQUFnQixDQUFDO2dCQUNqQyxVQUFVLEVBQUUsK0JBQXFCLENBQUMsY0FBYzthQUNqRCxDQUFDO1lBQ0YsOEVBQThFO1lBQzlFLE9BQU8sRUFBRSxxQkFBcUI7U0FDL0IsQ0FBQyxDQUFDO1FBQ0gsMkZBQTJGO1FBQzNGLE1BQU0sY0FBYyxHQUFHLGlCQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsK0JBQStCLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUV2Ryx1Q0FBdUM7UUFDdkMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN4QyxtQ0FBbUM7UUFDbkMseUJBQXlCO1FBQ3pCLE1BQU0sVUFBVSxHQUFHLElBQUksMEJBQWdCLENBQUMsSUFBSSxFQUFFLEdBQUcsTUFBTSxjQUFjLEVBQUU7WUFDckUsR0FBRztZQUNILFVBQVUsRUFBRTtnQkFDVixVQUFVLEVBQUUsb0JBQVUsQ0FBQyxnQkFBZ0I7YUFDeEM7WUFDRCxNQUFNLEVBQUUsZ0NBQXNCLENBQUMsUUFBUSxDQUFDO2dCQUN0QyxPQUFPLEVBQUUsK0JBQXFCLENBQUMsUUFBUTthQUN4QyxDQUFDO1lBQ0YsWUFBWSxFQUFFLHNCQUFZLENBQUMsRUFBRSxDQUFDLHVCQUFhLENBQUMsVUFBVSxFQUFFLHNCQUFZLENBQUMsS0FBSyxDQUFDO1lBQzNFLFdBQVcsRUFBRSxxQkFBVyxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQztZQUN4RCxPQUFPLEVBQUUsS0FBSztZQUNkLGVBQWUsRUFBRSxzQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDakMsc0JBQXNCLEVBQUUsSUFBSTtZQUM1QixhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO1lBQ3BDLGtCQUFrQixFQUFFLEtBQUs7WUFDekIsWUFBWSxFQUFFLG9CQUFvQjtZQUNsQyxrQkFBa0IsRUFBRSxLQUFLO1NBQzFCLENBQUMsQ0FBQztRQUNILFVBQVUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxjQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDaEUsQ0FBQztDQUNGO0FBaEZELGtEQWdGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IER1cmF0aW9uLCBSZW1vdmFsUG9saWN5LCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IFZwYywgU3VibmV0VHlwZSwgU2VjdXJpdHlHcm91cCwgUGVlciwgUG9ydCwgSW5zdGFuY2UsIEluc3RhbmNlVHlwZSwgSW5zdGFuY2VDbGFzcywgSW5zdGFuY2VTaXplLCBBbWF6b25MaW51eEltYWdlLCBBbWF6b25MaW51eEdlbmVyYXRpb24gfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCB7IERhdGFiYXNlSW5zdGFuY2UsIERhdGFiYXNlSW5zdGFuY2VFbmdpbmUsIFBvc3RncmVzRW5naW5lVmVyc2lvbiwgQ3JlZGVudGlhbHMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtcmRzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgQmFzZVN0YWNrUHJvcHMgfSBmcm9tICcuLi9pbnRlcmZhY2VzL0Jhc2VTdGFja1Byb3BzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbmludGVyZmFjZSBJbmZyYXN0cnVjdHVyZVN0YWNrUHJvcHMgZXh0ZW5kcyBCYXNlU3RhY2tQcm9wcyB7XG4gIC8vIFxufVxuXG5leHBvcnQgY2xhc3MgSW5mcmFzdHJ1Y3R1cmVTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEluZnJhc3RydWN0dXJlU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgeyBkZXBsb3ltZW50RW52aXJvbm1lbnQgfSA9IHByb3BzO1xuICAgIGNvbnN0IHByZWZpeCA9IGAke2RlcGxveW1lbnRFbnZpcm9ubWVudH0tY29tbW9udmFsdWVgO1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLSBWUEMgU0VDVElPTlxuICAgIC8vIPCfkYcgY3JlYXRlIHRoZSBWUENcbiAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHRoaXMsIGAke3ByZWZpeH0tdnBjYCwge1xuICAgICAgLyoqXG4gICAgICAgKiBjaWRyIC0gdGhlIENJRFIgYmxvY2sgb2YgdGhlIFZQQy4gTXVzdCBiZSBiZXR3ZWVuIC8xNiAoNjU1MzYgSVAgQWRkcmVzc2VzKSBhbmQgLzI4ICgxNiBJUCBhZGRyZXNzZXMpLlxuICAgICAgICogVGhlIGRlZmF1bHQgdmFsdWUgZm9yIGEgQ0lEUiByYW5nZSBpcyAxMC4wLjAuMC8xNi5cbiAgICAgICAqL1xuICAgICAgY2lkcjogJzEwLjAuMC4wLzE2JyxcbiAgICAgIC8qKlxuICAgICAgICogbmF0R2F0ZXdheXMgLSBob3cgbWFueSBOQVQgZ2F0ZXdheXMgc2hvdWxkIGJlIGNyZWF0ZWQgZm9yIHRoZSBWUEMuIEJ5IGRlZmF1bHQsIG9uZSBOQVQgR2F0ZXdheSBpcyBjcmVhdGVkIGZvciBlYWNoIGF2YWlsYWJpbGl0eSB6b25lLlxuICAgICAgICogV2hlbiB0ZXN0aW5nIHlvdSBzaG91bGQgbG93ZXIgdGhlIG51bWJlciBvZiBuYXRHYXRld2F5cyB0byAxIHRvIGF2b2lkIGJ1cm5pbmcgbW9uZXkuXG4gICAgICAgKi9cbiAgICAgIG5hdEdhdGV3YXlzOiAwLFxuICAgICAgbWF4QXpzOiAzLFxuICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogYCR7cHJlZml4fS1wdWJsaWMtc3VibmV0LTFgLFxuICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgIGNpZHJNYXNrOiAyNCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6IGAke3ByZWZpeH0taXNvbGF0ZWQtc3VibmV0LTFgLFxuICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCxcbiAgICAgICAgICBjaWRyTWFzazogMjgsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLSBFQzIgU0VDVElPTlxuICAgIC8vIPCfkYcgY3JlYXRlIGEgc2VjdXJpdHkgZ3JvdXAgZm9yIHRoZSBFQzIgaW5zdGFuY2VcbiAgICBjb25zdCBlYzJJbnN0YW5jZVNHID0gbmV3IFNlY3VyaXR5R3JvdXAodGhpcywgJ2VjMi1pbnN0YW5jZS1zZycsIHtcbiAgICAgIHZwYyxcbiAgICB9KTtcbiAgICBlYzJJbnN0YW5jZVNHLmFkZEluZ3Jlc3NSdWxlKFBlZXIuYW55SXB2NCgpLCBQb3J0LnRjcCgyMiksICdhbGxvdyBTU0ggY29ubmVjdGlvbnMgZnJvbSBhbnl3aGVyZScpO1xuICAgIC8vIPCfkYcgY3JlYXRlIHRoZSBFQzIgaW5zdGFuY2VcbiAgICBjb25zdCBlYzJJbnN0YW5jZSA9IG5ldyBJbnN0YW5jZSh0aGlzLCBgJHtwcmVmaXh9LWVjMi1vcmFjbGVgLCB7XG4gICAgICB2cGMsXG4gICAgICB2cGNTdWJuZXRzOiB7XG4gICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgfSxcbiAgICAgIHNlY3VyaXR5R3JvdXA6IGVjMkluc3RhbmNlU0csXG4gICAgICBpbnN0YW5jZVR5cGU6IEluc3RhbmNlVHlwZS5vZihJbnN0YW5jZUNsYXNzLkJVUlNUQUJMRTIsIEluc3RhbmNlU2l6ZS5TTUFMTCksXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBBbWF6b25MaW51eEltYWdlKHtcbiAgICAgICAgZ2VuZXJhdGlvbjogQW1hem9uTGludXhHZW5lcmF0aW9uLkFNQVpPTl9MSU5VWF8yLFxuICAgICAgfSksXG4gICAgICAvL2tleXBhaXIgbmVlZHMgdG8gYmUgY3JlYXRlZCBieSBoYW5kIGZpcnN0IChvdmVyIHRoZSB3ZWIgY29uc29sZSBmb3IgZXhhbXBsZSlcbiAgICAgIGtleU5hbWU6ICdvcmFjbGUtZWMyLWtleS1wYWlyJyxcbiAgICB9KTtcbiAgICAvLyDwn5GHIGxvYWQgdXNlciBkYXRhIHNjcmlwdCBha2Egc3RhcnR1cCBzY3JpcHQgdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIG9uIHRoZSB2ZXJ5IGZpcnN0IGJvb3RcbiAgICBjb25zdCB1c2VyRGF0YVNjcmlwdCA9IHJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBgLi9saWIvc2NyaXB0cy9vcmFjbGUtc3RhcnQuc2hgKSwgJ3V0Zi04Jyk7IFxuICAgXG4gICAgLy8g8J+RhyBhZGQgdXNlciBkYXRhIHRvIHRoZSBFQzIgaW5zdGFuY2VcbiAgICBlYzJJbnN0YW5jZS5hZGRVc2VyRGF0YSh1c2VyRGF0YVNjcmlwdCk7XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tIERBVEFCQVNFIFNFQ1RJT05cbiAgICAvLyDwn5GHIGNyZWF0ZSBSRFMgaW5zdGFuY2VcbiAgICBjb25zdCBkYkluc3RhbmNlID0gbmV3IERhdGFiYXNlSW5zdGFuY2UodGhpcywgYCR7cHJlZml4fS1wb3N0Z3Jlcy1kYmAsIHtcbiAgICAgIHZwYyxcbiAgICAgIHZwY1N1Ym5ldHM6IHtcbiAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELFxuICAgICAgfSxcbiAgICAgIGVuZ2luZTogRGF0YWJhc2VJbnN0YW5jZUVuZ2luZS5wb3N0Z3Jlcyh7XG4gICAgICAgIHZlcnNpb246IFBvc3RncmVzRW5naW5lVmVyc2lvbi5WRVJfMTRfMixcbiAgICAgIH0pLFxuICAgICAgaW5zdGFuY2VUeXBlOiBJbnN0YW5jZVR5cGUub2YoSW5zdGFuY2VDbGFzcy5CVVJTVEFCTEUzLCBJbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgY3JlZGVudGlhbHM6IENyZWRlbnRpYWxzLmZyb21HZW5lcmF0ZWRTZWNyZXQoJ3Bvc3RncmVzJyksXG4gICAgICBtdWx0aUF6OiBmYWxzZSxcbiAgICAgIGJhY2t1cFJldGVudGlvbjogRHVyYXRpb24uZGF5cygwKSxcbiAgICAgIGRlbGV0ZUF1dG9tYXRlZEJhY2t1cHM6IHRydWUsXG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBkZWxldGlvblByb3RlY3Rpb246IGZhbHNlLFxuICAgICAgZGF0YWJhc2VOYW1lOiAnb3JhY2xlLXBnLWRhdGFiYXNlJyxcbiAgICAgIHB1YmxpY2x5QWNjZXNzaWJsZTogZmFsc2UsXG4gICAgfSk7XG4gICAgZGJJbnN0YW5jZS5jb25uZWN0aW9ucy5hbGxvd0Zyb20oZWMySW5zdGFuY2UsIFBvcnQudGNwKDU0MzIpKTtcbiAgfVxufVxuXG4iXX0=