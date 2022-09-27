import { Trigger } from "deno-slack-api/types.ts";
import workflowDef from "../../workflows/channel_event_workflow.ts";

/**
 * See https://api.slack.com/future/triggers/scheduled
 */
const trigger: Trigger<typeof workflowDef.definition> = {
  type: "scheduled",
  name: "Scheduled trigger",
  workflow: `#/workflows/${workflowDef.definition.callback_id}`,
  inputs: {
    // TODO: set a valid channel ID here
    channelId: { value: "CLT1F93TP" },
  },
  schedule: {
    // TODO: adjust the following start/end_time
    start_time: "2022-09-27T10:20:00Z",
    end_time: "2037-12-31T23:59:59Z",
    // Monthly
    // frequency: {
    //   type: "monthly",
    //   on_days: ["Monday"],
    //   on_week_num: 3,
    //   repeats_every: 1,
    // },
    // Weekly
    // frequency: {
    //   type: "weekly",
    //   on_days: ["Monday"],
    //   repeats_every: 1,
    // },
    // Daily
    frequency: {
      type: "daily",
      repeats_every: 1,
    },
  },
};

export default trigger;
