#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';
import { readFileSync } from 'fs';
import * as path from 'path';
import { BaseStackProps } from '../interfaces/BaseStackProps';

const app = new cdk.App();
const env = JSON.parse(readFileSync(path.resolve(__dirname, `../env-config/${process.env.ENV_MODE}.json`), 'utf-8')) as BaseStackProps;

new InfrastructureStack(app, 'InfrastructureStack', {
  deploymentEnvironment: env.deploymentEnvironment
});