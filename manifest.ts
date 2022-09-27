import { Manifest } from "deno-slack-sdk/mod.ts";
import { def as messageTemplates } from "./datastores/message_templates.ts";
import channelEventWorkflow from "./workflows/channel_event_workflow.ts";
import interactivityWorkflow from "./workflows/interactivity_workflow.ts";
import datastoreWorkflow from "./workflows/datastore_workflow.ts";

/**
 * See https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "my-app-name",
  description: "A template for building Slack apps with Deno",
  icon: "assets/icon.png",
  workflows: [
    channelEventWorkflow,
    interactivityWorkflow,
    datastoreWorkflow,
  ],
  datastores: [messageTemplates],
  outgoingDomains: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    // for triggers/channel_events/rewaction_added.ts
    "reactions:read",
    // for datastores/message_templates.ts
    "datastore:read",
    "datastore:write",
  ],
});
