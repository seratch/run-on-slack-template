import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { def as handleInteractivity } from "../functions/handle_interactivity.ts";

/**
 * https://api.slack.com/future/workflows
 */
const workflow = DefineWorkflow({
  callback_id: "block-actions-workflow",
  title: "Block Actions Workflow",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      channel: { type: Schema.slack.types.channel_id },
      user: { type: Schema.slack.types.user_id },
    },
    required: ["interactivity"],
  },
});

workflow.addStep(handleInteractivity, {
  interactivity: workflow.inputs.interactivity,
});

export default workflow;
