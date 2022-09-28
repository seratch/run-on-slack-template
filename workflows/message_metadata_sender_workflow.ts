import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { def as sendMessageMetadata } from "../functions/send_metadata_message.ts";

/**
 * A Workflow is a set of steps that are executed in order.
 * Each step in a Workflow is a function.
 * https://api.slack.com/future/workflows
 */
const workflow = DefineWorkflow({
  callback_id: "message-metadata-sender-workflow",
  title: "Message Metadata Sender Workflow",
  input_parameters: {
    properties: {
      channelId: { type: Schema.slack.types.channel_id },
    },
    required: ["channelId"],
  },
});

workflow.addStep(sendMessageMetadata, {
  channelId: workflow.inputs.channelId,
});

export default workflow;
