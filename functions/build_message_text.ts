import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { Logger } from "../utils/logger.ts";
import { resolveFunctionSourceFile } from "../utils/source_file_resoluion.ts";

/**
 * See https://api.slack.com/future/functions/custom
 */
export const def = DefineFunction({
  callback_id: "build-message-text",
  title: "Build a new message text",
  description: "Build a new message text",
  source_file: resolveFunctionSourceFile(import.meta.url),
  input_parameters: {
    properties: {
      messageText: {
        type: Schema.types.string,
        description: "Message to be posted",
      },
    },
    required: ["messageText"],
  },
  output_parameters: {
    properties: {
      updatedMessageText: {
        type: Schema.types.string,
        description: "Updated message to be posted",
      },
    },
    required: ["updatedMessageText"],
  },
});

export default SlackFunction(def, ({
  inputs,
  env,
}) => {
  const logger = Logger(env.logLevel);
  logger.debug(inputs);

  const { messageText } = inputs;
  const updatedMessageText =
    `:wave: You submitted the following message: \n\n>${messageText}`;
  return { outputs: { updatedMessageText } };
});
