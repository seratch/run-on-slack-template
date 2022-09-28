import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { def as handleInteractiveBlocks } from "../functions/handle_interactive_blocks.ts";

/**
 * https://api.slack.com/future/workflows
 */
const workflow = DefineWorkflow({
  callback_id: "interactive-blocks-workflow",
  title: "Interactive Blocks Workflow",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      channel: { type: Schema.slack.types.channel_id },
      user: { type: Schema.slack.types.user_id },
    },
    required: ["interactivity"],
  },
});

const sendMessageStep = workflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: workflow.inputs.channel,
  message: `Do you approve <@${workflow.inputs.user}>'s time off request?`,
  interactive_blocks: [
    {
      "type": "actions",
      "block_id": "approve-deny-buttons",
      "elements": [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Approve",
          },
          action_id: "approve",
          style: "primary",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Deny",
          },
          action_id: "deny",
          style: "danger",
        },
      ],
    },
  ],
});

workflow.addStep(handleInteractiveBlocks, {
  action: sendMessageStep.outputs.action,
  interactivity: sendMessageStep.outputs.interactivity,
  messageLink: sendMessageStep.outputs.message_link,
  messageTs: sendMessageStep.outputs.message_ts,
});

export default workflow;
