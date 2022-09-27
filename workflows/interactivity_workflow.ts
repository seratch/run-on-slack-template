import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { def as buildMessageText } from "../functions/build_message_text.ts";

/**
 * https://api.slack.com/future/workflows
 */
const workflow = DefineWorkflow({
  callback_id: "interactivity-workflow",
  title: "Interactivity Workflow",
  description: "TODO",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity"],
  },
});

/**
 * https://api.slack.com/future/functions#open-a-form
 */
const inputFormStep = workflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Send message to channel",
    interactivity: workflow.inputs.interactivity,
    submit_label: "Send message",
    fields: {
      elements: [{
        name: "channel",
        title: "Channel to send message to",
        type: Schema.slack.types.channel_id,
        default: workflow.inputs.channel,
      }, {
        name: "messageText",
        title: "Message",
        type: Schema.types.string,
        long: true,
      }],
      required: ["channel", "messageText"],
    },
  },
);

const buildMessageStep = workflow.addStep(buildMessageText, {
  messageText: inputFormStep.outputs.fields.messageText,
});

workflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: inputFormStep.outputs.fields.channel,
  message: buildMessageStep.outputs.updatedMessageText,
});

export default workflow;
