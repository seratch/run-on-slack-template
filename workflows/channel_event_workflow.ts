import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { def as verifyChannelId } from "../functions/verify_channel_id.ts";
import { def as sendMessageIfAny } from "../functions/send_message_if_any.ts";
import { def as handleMessageInteractivity } from "../functions/handle_message_interactivity.ts";
import { def as printInputs } from "../functions/print_inputs.ts";

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
      userId: { type: Schema.slack.types.user_id },
      channelId: { type: Schema.slack.types.channel_id },
      messageTs: { type: Schema.types.string },
    },
    required: ["channelId"],
  },
});

const verificationStep = workflow.addStep(verifyChannelId, {
  channelId: workflow.inputs.channelId,
});
const sendMessageStep = workflow.addStep(sendMessageIfAny, {
  channelId: verificationStep.outputs.channelId,
  messageText: "Hi there!",
});
workflow.addStep(printInputs, {
  channel: sendMessageStep.outputs.channelId,
  ts: sendMessageStep.outputs.messageTs,
});
workflow.addStep(
  handleMessageInteractivity,
  {
    channelId: verificationStep.outputs.channelId,
    userId: workflow.inputs.userId,
  },
);

export default workflow;
