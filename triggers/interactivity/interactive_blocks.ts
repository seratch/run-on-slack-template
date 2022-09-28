import { Trigger } from "deno-slack-api/types.ts";
import workflowDef from "../../workflows/interactive_blocks_workflow.ts";

/**
 * See https://api.slack.com/future/triggers/link
 */
const trigger: Trigger<typeof workflowDef.definition> = {
  type: "shortcut",
  name: "Interactive Blocks Trigger",
  workflow: `#/workflows/${workflowDef.definition.callback_id}`,
  inputs: {
    interactivity: { value: "{{data.interactivity}}" },
    channel: { value: "{{data.channel_id}}" },
    user: { value: "{{data.user_id}}" },
  },
};

export default trigger;
