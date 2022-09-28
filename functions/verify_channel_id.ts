import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";
import { SlackAPIClient } from "deno-slack-api/types.ts";
import { Logger } from "../utils/logger.ts";
import { FunctionSourceFile } from "../utils/function_source_file.ts";

/**
 * See https://api.slack.com/future/functions/custom
 */
export const def = DefineFunction({
  callback_id: "verify-channel-id",
  title: "Verify a channel ID",
  description: "Verfify a channel ID",
  source_file: FunctionSourceFile(import.meta.url),
  input_parameters: {
    properties: {
      channelId: { type: Schema.slack.types.channel_id },
    },
    required: ["channelId"],
  },
  output_parameters: {
    properties: {
      channelId: { type: Schema.slack.types.channel_id },
    },
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

  const client: SlackAPIClient = SlackAPI(token);
  const response = await client.conversations.info({
    channel_id: inputs.channelId,
  });
  if (response.ok) {
    return { outputs: { channelId: inputs.channelId } };
  } else {
    const error = `Invalid channel ID detected: ${response.error}`;
    logger.error(error);
    logger.debug(response);
    return { outputs: {}, error };
  }
});
