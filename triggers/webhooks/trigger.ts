import { Trigger } from "deno-slack-api/types.ts";
import workflowDef from "../../workflows/channel_event_workflow.ts";

/**
 * See https://api.slack.com/future/triggers/webhook
 * required scopes: reactions:read
 */
const trigger: Trigger<typeof workflowDef.definition> = {
  type: "webhook",
  name: "Incoming webhook trigger",
  workflow: `#/workflows/${workflowDef.definition.callback_id}`,
  inputs: {
    channelId: {
      value: "{{data.channel_id}}",
    },
  },
};

export default trigger;
