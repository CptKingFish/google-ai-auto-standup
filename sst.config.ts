import { type SSTConfig } from "sst";
import { Cron, NextjsSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "google-ai-auto-standup",
      region: "ap-southeast-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site");

      new Cron(stack, "cron", {
        schedule: "rate(15 minutes)",
        job: {
          function: {
            handler: "functions/src/cron.handler",
            environment: {
              GITHUB_API_URL: process.env.GITHUB_API_URL!,
              GITHUB_TOKEN: process.env.GITHUB_TOKEN!,
              REPO_OWNER: process.env.REPO_OWNER!,
              REPO_NAME: process.env.REPO_NAME!,
            },
          },
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
