import { Trigger } from "deno-slack-api/types.ts";
import workflowDef from "../../workflows/channel_event_workflow.ts";

/**
 * See https://api.slack.com/future/triggers/event
 * required scopes: reactions:read
 */
const trigger: Trigger<typeof workflowDef.definition> = {
  type: "event",
  name: "app_mentioned event trigger",
  workflow: `#/workflows/${workflowDef.definition.callback_id}`,
  event: {
    event_type: "slack#/events/app_mentioned",
    // TODO: Listing all the channels to enable here is required
    channel_ids: ["CLT1F93TP"],
  },
  inputs: {
    channelId: { value: "{{data.channel_id}}" },
    messageTs: { value: "{{data.message_ts}}" },
    userId: { value: "{{data.user_id}}" },
  },
};

export default trigger;
