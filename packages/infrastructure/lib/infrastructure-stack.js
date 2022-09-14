"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfrastructureStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_rds_1 = require("aws-cdk-lib/aws-rds");
const fs_1 = require("fs");
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
        const userDataScript = fs_1.readFileSync('./lib/scripts/oracle-start.sh', 'utf8');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mcmFzdHJ1Y3R1cmUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmZyYXN0cnVjdHVyZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBeUU7QUFDekUsaURBQStLO0FBQy9LLGlEQUFtSDtBQUVuSCwyQkFBa0M7QUFPbEMsTUFBYSxtQkFBb0IsU0FBUSxtQkFBSztJQUM1QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQStCO1FBQ3ZFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sRUFBRSxxQkFBcUIsRUFBRSxHQUFHLEtBQUssQ0FBQztRQUN4QyxNQUFNLE1BQU0sR0FBRyxHQUFHLHFCQUFxQixjQUFjLENBQUM7UUFFdEQsOEJBQThCO1FBQzlCLG9CQUFvQjtRQUNwQixNQUFNLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxNQUFNLE1BQU0sRUFBRTtZQUN6Qzs7O2VBR0c7WUFDSCxJQUFJLEVBQUUsYUFBYTtZQUNuQjs7O2VBR0c7WUFDSCxXQUFXLEVBQUUsQ0FBQztZQUNkLE1BQU0sRUFBRSxDQUFDO1lBQ1QsbUJBQW1CLEVBQUU7Z0JBQ25CO29CQUNFLElBQUksRUFBRSxHQUFHLE1BQU0sa0JBQWtCO29CQUNqQyxVQUFVLEVBQUUsb0JBQVUsQ0FBQyxNQUFNO29CQUM3QixRQUFRLEVBQUUsRUFBRTtpQkFDYjtnQkFDRDtvQkFDRSxJQUFJLEVBQUUsR0FBRyxNQUFNLG9CQUFvQjtvQkFDbkMsVUFBVSxFQUFFLG9CQUFVLENBQUMsZ0JBQWdCO29CQUN2QyxRQUFRLEVBQUUsRUFBRTtpQkFDYjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsOEJBQThCO1FBQzlCLGtEQUFrRDtRQUNsRCxNQUFNLGFBQWEsR0FBRyxJQUFJLHVCQUFhLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQy9ELEdBQUc7U0FDSixDQUFDLENBQUM7UUFFSCxhQUFhLENBQUMsY0FBYyxDQUMxQixjQUFJLENBQUMsT0FBTyxFQUFFLEVBQ2QsY0FBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFDWixxQ0FBcUMsQ0FDdEMsQ0FBQztRQUVGLDZCQUE2QjtRQUM3QixNQUFNLFdBQVcsR0FBRyxJQUFJLGtCQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsTUFBTSxhQUFhLEVBQUU7WUFDN0QsR0FBRztZQUNILFVBQVUsRUFBRTtnQkFDVixVQUFVLEVBQUUsb0JBQVUsQ0FBQyxNQUFNO2FBQzlCO1lBQ0QsYUFBYSxFQUFFLGFBQWE7WUFDNUIsWUFBWSxFQUFFLHNCQUFZLENBQUMsRUFBRSxDQUMzQix1QkFBYSxDQUFDLFVBQVUsRUFDeEIsc0JBQVksQ0FBQyxLQUFLLENBQ25CO1lBQ0QsWUFBWSxFQUFFLElBQUksMEJBQWdCLENBQUM7Z0JBQ2pDLFVBQVUsRUFBRSwrQkFBcUIsQ0FBQyxjQUFjO2FBQ2pELENBQUM7WUFDRiw4RUFBOEU7WUFDOUUsT0FBTyxFQUFFLHFCQUFxQjtTQUMvQixDQUFDLENBQUM7UUFFSCwyRkFBMkY7UUFDM0YsTUFBTSxjQUFjLEdBQUcsaUJBQVksQ0FBQywrQkFBK0IsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUU3RSx1Q0FBdUM7UUFDdkMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUV4QyxtQ0FBbUM7UUFFbkMseUJBQXlCO1FBQ3pCLE1BQU0sVUFBVSxHQUFHLElBQUksMEJBQWdCLENBQUMsSUFBSSxFQUFFLEdBQUcsTUFBTSxjQUFjLEVBQUU7WUFDckUsR0FBRztZQUNILFVBQVUsRUFBRTtnQkFDVixVQUFVLEVBQUUsb0JBQVUsQ0FBQyxnQkFBZ0I7YUFDeEM7WUFDRCxNQUFNLEVBQUUsZ0NBQXNCLENBQUMsUUFBUSxDQUFDO2dCQUN0QyxPQUFPLEVBQUUsK0JBQXFCLENBQUMsUUFBUTthQUN4QyxDQUFDO1lBQ0YsWUFBWSxFQUFFLHNCQUFZLENBQUMsRUFBRSxDQUMzQix1QkFBYSxDQUFDLFVBQVUsRUFDeEIsc0JBQVksQ0FBQyxLQUFLLENBQ25CO1lBQ0QsV0FBVyxFQUFFLHFCQUFXLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDO1lBQ3hELE9BQU8sRUFBRSxLQUFLO1lBQ2QsZUFBZSxFQUFFLHNCQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNqQyxzQkFBc0IsRUFBRSxJQUFJO1lBQzVCLGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87WUFDcEMsa0JBQWtCLEVBQUUsS0FBSztZQUN6QixZQUFZLEVBQUUsb0JBQW9CO1lBQ2xDLGtCQUFrQixFQUFFLEtBQUs7U0FDMUIsQ0FBQyxDQUFDO1FBRUgsVUFBVSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLGNBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUVoRSxDQUFDO0NBQ0Y7QUFsR0Qsa0RBa0dDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRHVyYXRpb24sIFJlbW92YWxQb2xpY3ksIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgVnBjLCBTdWJuZXRUeXBlLCBJbnN0YW5jZSwgQW1hem9uTGludXhJbWFnZSwgQW1hem9uTGludXhHZW5lcmF0aW9uLCBJbnN0YW5jZUNsYXNzLCBJbnN0YW5jZVNpemUsIEluc3RhbmNlVHlwZSwgUG9ydCwgUGVlciwgU2VjdXJpdHlHcm91cCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0IHsgRGF0YWJhc2VJbnN0YW5jZSwgRGF0YWJhc2VJbnN0YW5jZUVuZ2luZSwgUG9zdGdyZXNFbmdpbmVWZXJzaW9uLCBDcmVkZW50aWFscyB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1yZHMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBCYXNlU3RhY2tQcm9wcyB9IGZyb20gJy4uL2ludGVyZmFjZXMvQmFzZVN0YWNrUHJvcHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEluZnJhc3RydWN0dXJlU3RhY2tQcm9wcyBleHRlbmRzIEJhc2VTdGFja1Byb3BzIHtcblxufVxuXG5leHBvcnQgY2xhc3MgSW5mcmFzdHJ1Y3R1cmVTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEluZnJhc3RydWN0dXJlU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuICAgIGNvbnN0IHsgZGVwbG95bWVudEVudmlyb25tZW50IH0gPSBwcm9wcztcbiAgICBjb25zdCBwcmVmaXggPSBgJHtkZXBsb3ltZW50RW52aXJvbm1lbnR9LWNvbW1vbnZhbHVlYDtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLSBWUEMgU0VDVElPTlxuICAgIC8vIPCfkYcgY3JlYXRlIHRoZSBWUENcbiAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHRoaXMsIGAke3ByZWZpeH0tdnBjYCwge1xuICAgICAgLyoqXG4gICAgICAgKiBjaWRyIC0gdGhlIENJRFIgYmxvY2sgb2YgdGhlIFZQQy4gTXVzdCBiZSBiZXR3ZWVuIC8xNiAoNjU1MzYgSVAgQWRkcmVzc2VzKSBhbmQgLzI4ICgxNiBJUCBhZGRyZXNzZXMpLlxuICAgICAgICogVGhlIGRlZmF1bHQgdmFsdWUgZm9yIGEgQ0lEUiByYW5nZSBpcyAxMC4wLjAuMC8xNi5cbiAgICAgICAqL1xuICAgICAgY2lkcjogJzEwLjAuMC4wLzE2JyxcbiAgICAgIC8qKlxuICAgICAgICogbmF0R2F0ZXdheXMgLSBob3cgbWFueSBOQVQgZ2F0ZXdheXMgc2hvdWxkIGJlIGNyZWF0ZWQgZm9yIHRoZSBWUEMuIEJ5IGRlZmF1bHQsIG9uZSBOQVQgR2F0ZXdheSBpcyBjcmVhdGVkIGZvciBlYWNoIGF2YWlsYWJpbGl0eSB6b25lLlxuICAgICAgICogV2hlbiB0ZXN0aW5nIHlvdSBzaG91bGQgbG93ZXIgdGhlIG51bWJlciBvZiBuYXRHYXRld2F5cyB0byAxIHRvIGF2b2lkIGJ1cm5pbmcgbW9uZXkuXG4gICAgICAgKi9cbiAgICAgIG5hdEdhdGV3YXlzOiAwLFxuICAgICAgbWF4QXpzOiAzLFxuICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogYCR7cHJlZml4fS1wdWJsaWMtc3VibmV0LTFgLFxuICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgIGNpZHJNYXNrOiAyNCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6IGAke3ByZWZpeH0taXNvbGF0ZWQtc3VibmV0LTFgLFxuICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCxcbiAgICAgICAgICBjaWRyTWFzazogMjgsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tIEVDMiBTRUNUSU9OXG4gICAgLy8g8J+RhyBjcmVhdGUgYSBzZWN1cml0eSBncm91cCBmb3IgdGhlIEVDMiBpbnN0YW5jZVxuICAgIGNvbnN0IGVjMkluc3RhbmNlU0cgPSBuZXcgU2VjdXJpdHlHcm91cCh0aGlzLCAnZWMyLWluc3RhbmNlLXNnJywge1xuICAgICAgdnBjLFxuICAgIH0pO1xuXG4gICAgZWMySW5zdGFuY2VTRy5hZGRJbmdyZXNzUnVsZShcbiAgICAgIFBlZXIuYW55SXB2NCgpLFxuICAgICAgUG9ydC50Y3AoMjIpLFxuICAgICAgJ2FsbG93IFNTSCBjb25uZWN0aW9ucyBmcm9tIGFueXdoZXJlJyxcbiAgICApO1xuXG4gICAgLy8g8J+RhyBjcmVhdGUgdGhlIEVDMiBpbnN0YW5jZVxuICAgIGNvbnN0IGVjMkluc3RhbmNlID0gbmV3IEluc3RhbmNlKHRoaXMsIGAke3ByZWZpeH0tZWMyLW9yYWNsZWAsIHtcbiAgICAgIHZwYyxcbiAgICAgIHZwY1N1Ym5ldHM6IHtcbiAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICB9LFxuICAgICAgc2VjdXJpdHlHcm91cDogZWMySW5zdGFuY2VTRyxcbiAgICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKFxuICAgICAgICBJbnN0YW5jZUNsYXNzLkJVUlNUQUJMRTIsXG4gICAgICAgIEluc3RhbmNlU2l6ZS5TTUFMTCxcbiAgICAgICksXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBBbWF6b25MaW51eEltYWdlKHtcbiAgICAgICAgZ2VuZXJhdGlvbjogQW1hem9uTGludXhHZW5lcmF0aW9uLkFNQVpPTl9MSU5VWF8yLFxuICAgICAgfSksXG4gICAgICAvL2tleXBhaXIgbmVlZHMgdG8gYmUgY3JlYXRlZCBieSBoYW5kIGZpcnN0IChvdmVyIHRoZSB3ZWIgY29uc29sZSBmb3IgZXhhbXBsZSlcbiAgICAgIGtleU5hbWU6ICdvcmFjbGUtZWMyLWtleS1wYWlyJyxcbiAgICB9KTtcblxuICAgIC8vIPCfkYcgbG9hZCB1c2VyIGRhdGEgc2NyaXB0IGFrYSBzdGFydHVwIHNjcmlwdCB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgb24gdGhlIHZlcnkgZmlyc3QgYm9vdFxuICAgIGNvbnN0IHVzZXJEYXRhU2NyaXB0ID0gcmVhZEZpbGVTeW5jKCcuL2xpYi9zY3JpcHRzL29yYWNsZS1zdGFydC5zaCcsICd1dGY4Jyk7XG5cbiAgICAvLyDwn5GHIGFkZCB1c2VyIGRhdGEgdG8gdGhlIEVDMiBpbnN0YW5jZVxuICAgIGVjMkluc3RhbmNlLmFkZFVzZXJEYXRhKHVzZXJEYXRhU2NyaXB0KTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLSBEQVRBQkFTRSBTRUNUSU9OXG5cbiAgICAvLyDwn5GHIGNyZWF0ZSBSRFMgaW5zdGFuY2VcbiAgICBjb25zdCBkYkluc3RhbmNlID0gbmV3IERhdGFiYXNlSW5zdGFuY2UodGhpcywgYCR7cHJlZml4fS1wb3N0Z3Jlcy1kYmAsIHtcbiAgICAgIHZwYyxcbiAgICAgIHZwY1N1Ym5ldHM6IHtcbiAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELFxuICAgICAgfSxcbiAgICAgIGVuZ2luZTogRGF0YWJhc2VJbnN0YW5jZUVuZ2luZS5wb3N0Z3Jlcyh7XG4gICAgICAgIHZlcnNpb246IFBvc3RncmVzRW5naW5lVmVyc2lvbi5WRVJfMTRfMixcbiAgICAgIH0pLFxuICAgICAgaW5zdGFuY2VUeXBlOiBJbnN0YW5jZVR5cGUub2YoXG4gICAgICAgIEluc3RhbmNlQ2xhc3MuQlVSU1RBQkxFMyxcbiAgICAgICAgSW5zdGFuY2VTaXplLk1JQ1JPLFxuICAgICAgKSxcbiAgICAgIGNyZWRlbnRpYWxzOiBDcmVkZW50aWFscy5mcm9tR2VuZXJhdGVkU2VjcmV0KCdwb3N0Z3JlcycpLFxuICAgICAgbXVsdGlBejogZmFsc2UsXG4gICAgICBiYWNrdXBSZXRlbnRpb246IER1cmF0aW9uLmRheXMoMCksXG4gICAgICBkZWxldGVBdXRvbWF0ZWRCYWNrdXBzOiB0cnVlLFxuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgZGVsZXRpb25Qcm90ZWN0aW9uOiBmYWxzZSxcbiAgICAgIGRhdGFiYXNlTmFtZTogJ29yYWNsZS1wZy1kYXRhYmFzZScsXG4gICAgICBwdWJsaWNseUFjY2Vzc2libGU6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgZGJJbnN0YW5jZS5jb25uZWN0aW9ucy5hbGxvd0Zyb20oZWMySW5zdGFuY2UsIFBvcnQudGNwKDU0MzIpKTtcblxuICB9XG59XG4iXX0=