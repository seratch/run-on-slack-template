import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

/**
 * https://api.slack.com/future/workflows
 */
const workflow = DefineWorkflow({
  callback_id: "reaction-added-event-workflow",
  title: "The reaction_addd Event Workflow",
  input_parameters: {
    properties: {
      channelId: { type: Schema.slack.types.channel_id },
      messageTs: { type: Schema.types.string },
      reaction: { type: Schema.types.string },
  },
    required: ["channelId", "messageTs", "reaction"],
  },
});

export default workflow;
