import { Serverless } from "serverless/aws";

const serverlessConfiguration: Serverless = {
  service: {
    name: "image-analysis-ts",
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: ">=1.72.0",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  // Add the serverless-webpack plugin
  plugins: ["serverless-webpack"],
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "rekognition:DetectLabels",
        Resource: "*",
      },
      {
        Effect: "Allow",
        Action: "translate:TranslateText",
        Resource: "*",
      },
    ],
  },
  functions: {
    analyseImage: {
      handler: "handler.main",
      events: [
        {
          http: {
            method: "get",
            path: "analyse",
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
