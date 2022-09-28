import { Trigger } from "deno-slack-api/types.ts";
import workflowDef from "../../workflows/datastore_workflow.ts";

/**
 * See https://api.slack.com/future/triggers/link
 */
const trigger: Trigger<typeof workflowDef.definition> = {
  type: "shortcut",
  name: "Datastore trigger",
  workflow: `#/workflows/${workflowDef.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
  },
};

export default trigger;
