import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";
import { Logger } from "../utils/logger.ts";
import { FunctionSourceFile } from "../utils/function_source_file.ts";
import { IncidentEvent } from "../event_types/incident.ts";

/**
 * See https://api.slack.com/future/functions/custom
 */
export const def = DefineFunction({
  callback_id: "send-metadata-message",
  title: "Send a message with its metadata",
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
      messageTs: { type: Schema.types.string },
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

  const client = SlackAPI(token);
  const response = await client.chat.postMessage({
    channel: inputs.channelId,
    text: "We have an incident!",
    metadata: {
      event_type: IncidentEvent,
      event_payload: {
        id: crypto.randomUUID(),
        title: "A critical incident",
        summary: "Something wrong is happening!",
        severity: "Critical",
      },
    },
  });
  if (response.ok) {
    return {
      outputs: {
        channelId: inputs.channelId,
        messageTs: response.message.ts,
      },
    };
  } else {
    const error = `Failed to send a message: ${response.error}`;
    logger.error(error);
    return { outputs: {}, error };
  }
});
