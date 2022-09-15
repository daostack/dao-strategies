import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Vpc, SubnetType, SecurityGroup, Peer, Port, Instance, InstanceType, InstanceClass, InstanceSize, AmazonLinuxImage, AmazonLinuxGeneration } from 'aws-cdk-lib/aws-ec2';
import { DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion, Credentials } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
import { readFileSync } from 'fs';
import { BaseStackProps } from '../interfaces/BaseStackProps';
import * as path from 'path';

interface InfrastructureStackProps extends BaseStackProps {
  // 
}

export class InfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props: InfrastructureStackProps) {
    super(scope, id, props);

    const { deploymentEnvironment } = props;
    const prefix = `${deploymentEnvironment}`;
    // --------------- VPC SECTION
    // 👇 create the VPC
    const vpc = new Vpc(this, `${prefix}-vpc`, {
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
          name: `public-subnet-1`,
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: `isolated-subnet-1`,
          subnetType: SubnetType.PRIVATE_ISOLATED,
          cidrMask: 28,
        },
      ],
    });
    // --------------- EC2 SECTION
    // 👇 create a security group for the EC2 instance
    const ec2InstanceSG = new SecurityGroup(this, 'ec2-instance-sg', {
      vpc,
    });
    ec2InstanceSG.addIngressRule(Peer.anyIpv4(), Port.tcp(22), 'allow SSH connections from anywhere');
    // 👇 create the EC2 instance
    const ec2Instance = new Instance(this, `ec2-oracle`, {
      vpc,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
      securityGroup: ec2InstanceSG,
      instanceType: InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.SMALL),
      machineImage: new AmazonLinuxImage({
        generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      //keypair needs to be created by hand first (over the web console for example)
      keyName: `${deploymentEnvironment}-ec2-backend-key-pair`,
    });
    // 👇 load user data script aka startup script that will be executed on the very first boot
    const userDataScript = readFileSync(path.resolve(__dirname, `./scripts/oracle-start.sh`), 'utf-8'); 
   
    // 👇 add user data to the EC2 instance
    ec2Instance.addUserData(userDataScript);
    // --------------- DATABASE SECTION
    // 👇 create RDS instance
    const dbInstance = new DatabaseInstance(this, `${prefix}-db-backend`, {
      vpc,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED,
      },
      engine: DatabaseInstanceEngine.postgres({
        version: PostgresEngineVersion.VER_14_2,
      }),
      instanceType: InstanceType.of(
        InstanceClass.BURSTABLE3,
        InstanceSize.MICRO,
      ),
      credentials: Credentials.fromGeneratedSecret('postgres'),
      multiAz: false,
      allowMajorVersionUpgrade: false,
      autoMinorVersionUpgrade: true,
      backupRetention: Duration.days(0),
      deleteAutomatedBackups: true,
      removalPolicy: RemovalPolicy.DESTROY,
      deletionProtection: false,
      databaseName: 'backenddb',
      publiclyAccessible: false,
    });
    dbInstance.connections.allowFrom(ec2Instance, Port.tcp(5432));
  }
}

