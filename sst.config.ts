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
        schedule: "rate(1 minute)",
        job: "functions/src/cron.handler",
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
