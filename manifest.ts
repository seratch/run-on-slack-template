import { Manifest } from "deno-slack-sdk/mod.ts";
import { def as messageTemplates } from "./datastores/message_templates.ts";
import interactivityWorkflow from "./workflows/interactivity_workflow.ts";
import interactiveBlocksWorkflow from "./workflows/interactive_blocks_workflow.ts";
import channelEventWorkflow from "./workflows/channel_event_workflow.ts";
import linkTriggerWorkflow from "./workflows/link_trigger_workflow.ts";
import datastoreWorkflow from "./workflows/datastore_workflow.ts";

/**
 * See https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "My awesome app",
  description: "A template for building Slack apps with Deno",
  icon: "assets/icon.png",
  workflows: [
    interactivityWorkflow,
    interactiveBlocksWorkflow,
    channelEventWorkflow,
    linkTriggerWorkflow,
    datastoreWorkflow,
  ],
  datastores: [messageTemplates],
  outgoingDomains: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    // for triggers/channel_events/app_mentioned.ts
    "app_mentions:read",
    // for triggers/channel_events/reaction_added.ts
    "reactions:read",
    // for datastores/message_templates.ts
    "datastore:read",
    "datastore:write",
    // for functions/verify_channel_id.ts
    "channels:read",
  ],
});
