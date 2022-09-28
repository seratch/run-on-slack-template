import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { def as verifyChannelId } from "../functions/verify_channel_id.ts";

/**
 * A Workflow is a set of steps that are executed in order.
 * Each step in a Workflow is a function.
 * https://api.slack.com/future/workflows
 */
const workflow = DefineWorkflow({
  callback_id: "channel-event-workflow",
  title: "Channel Event Workflow",
  input_parameters: {
    properties: {
      channelId: { type: Schema.slack.types.channel_id },
      messageTs: { type: Schema.types.string },
    },
    required: ["channelId"],
  },
});

const verificationStep = workflow.addStep(verifyChannelId, {
  channelId: workflow.inputs.channelId,
});
workflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: verificationStep.outputs.channelId,
  message: "Hi there!",
});

export default workflow;
