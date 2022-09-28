import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";
import { Logger } from "../utils/logger.ts";
import { FunctionSourceFile } from "../utils/function_source_file.ts";
import { save } from "../datastores/message_templates.ts";

/**
 * See https://api.slack.com/future/functions/custom
 */
export const def = DefineFunction({
  callback_id: "create-message-template",
  title: "Create a new message template",
  source_file: FunctionSourceFile(import.meta.url),
  input_parameters: {
    properties: {
      templateName: { type: Schema.types.string },
      templateText: { type: Schema.types.string },
    },
    required: ["templateName", "templateText"],
  },
  output_parameters: {
    properties: {
      templateId: { type: Schema.types.string },
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
  const result = await save(client, env, inputs);
  if (result.ok) {
    return { outputs: { templateId: result.item.id } };
  } else {
    const error = `Failed to insert a new record: ${result.error}`;
    logger.error(error);
    logger.debug(result);
    return { outputs: {}, error };
  }
});
