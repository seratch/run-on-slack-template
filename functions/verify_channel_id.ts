import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";
import { SlackAPIClient } from "deno-slack-api/types.ts";
import { getLogger } from "../utils/logger.ts";
import { resolveFunctionSourceFile } from "../utils/source_file_resoluion.ts";

/**
 * See https://api.slack.com/future/functions/custom
 */
export const def = DefineFunction({
  callback_id: "verify-channel-id",
  title: "Verify a channel ID",
  description: "Verfify a channel ID",
  source_file: resolveFunctionSourceFile(import.meta.url),
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

const handler: SlackFunctionHandler<typeof def.definition> = async ({
  inputs,
  env,
  token,
}) => {
  const logger = await getLogger(env.logLevel);
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
};

export default handler;
