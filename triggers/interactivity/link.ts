import { Trigger } from "deno-slack-api/types.ts";
import workflowDef from "../../workflows/link_trigger_workflow.ts";

console.log(workflowDef.definition.callback_id);
/**
 * See https://api.slack.com/future/triggers/link
 */
const trigger: Trigger<typeof workflowDef.definition> = {
  type: "shortcut",
  name: "Sample trigger",
  workflow: `#/workflows/${workflowDef.definition.callback_id}`,
  inputs: {
    interactivity: { value: "{{data.interactivity}}" },
    channel: { value: "{{data.channel_id}}" },
  },
};

export default trigger;
