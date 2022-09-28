import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { def as printInputs } from "../functions/print_inputs.ts";

/**
 * A Workflow is a set of steps that are executed in order.
 * Each step in a Workflow is a function.
 * https://api.slack.com/future/workflows
 */
const workflow = DefineWorkflow({
  callback_id: "message-metadata-receiver-workflow",
  title: "Message Metadata Receiver Workflow",
  input_parameters: {
    properties: {
      channelId: { type: Schema.slack.types.channel_id },
      id: { type: Schema.types.string },
      title: { type: Schema.types.string },
      summary: { type: Schema.types.string },
      severity: { type: Schema.types.string },
    },
    required: ["channelId"],
  },
});

workflow.addStep(printInputs, {
  id: workflow.inputs.id,
});

export default workflow;
