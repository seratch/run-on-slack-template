import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";
import { Logger } from "../utils/logger.ts";
import { FunctionSourceFile } from "../utils/function_source_file.ts";

/**
 * See https://api.slack.com/future/functions/custom
 */
export const def = DefineFunction({
  callback_id: "handle-message-interactivity",
  title: "Handle interactivity within a channel message",
  source_file: FunctionSourceFile(import.meta.url),
  input_parameters: {
    properties: {
      channelId: { type: Schema.slack.types.channel_id },
      userId: { type: Schema.slack.types.user_id },
    },
    required: ["channelId", "userId"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(def, async ({
  inputs,
  env,
  token,
}) => {
  const logger = Logger(env.logLevel);
  logger.debug(inputs);

  if (inputs.channelId === undefined) {
    return { outputs: {} };
  }

  const client = SlackAPI(token);
  await client.chat.postMessage({
    channel: inputs.channelId,
    //user: inputs.userId,
    text: "Hi there! How many functions have you created?",
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Hi there! How many functions have you created?",
        },
      },
      {
        "type": "actions",
        "block_id": "buttons",
        "elements": [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "1",
            },
            action_id: "button-1",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "2",
            },
            action_id: "button-2",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "3",
            },
            action_id: "button-3",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "More than 3!",
            },
            action_id: "button-more",
          },
        ],
      },
    ],
  });
  return {
    completed: false,
  };
})
  .addBlockActionsHandler(
    ["button-1", "button-2", "button-3", "button-more"],
    async ({ body, action, env, token }) => {
      const logger = Logger(env.logLevel);
      logger.debug(JSON.stringify(body, null, 2));

      const client = SlackAPI(token);
      await client.views.open({
        interactivity_pointer: body.interactivity.interactivity_pointer,
        view: {
          "type": "modal",
          "title": {
            "type": "plain_text",
            "text": "Clicked!",
          },
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": `You clicked *${action.text.text}*!`,
              },
            },
          ],
        },
      });
      return { completed: true };
    },
  );
