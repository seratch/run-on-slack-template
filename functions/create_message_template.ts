import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";
import { SlackAPIClient } from "deno-slack-api/types.ts";
import { getLogger } from "../utils/logger.ts";
import { resolveFunctionSourceFile } from "../utils/source_file_resoluion.ts";
import { save } from "../datastores/message_templates.ts";

/**
 * See https://api.slack.com/future/functions/custom
 */
export const def = DefineFunction({
  callback_id: "create-message-template",
  title: "Create a new message template",
  description: "Create a new message template",
  source_file: resolveFunctionSourceFile(import.meta.url),
  input_parameters: {
    properties: {
      templateName: {
        type: Schema.types.string,
        description: "Template name",
      },
      templateText: {
        type: Schema.types.string,
        description: "Message to be posted",
      },
    },
    required: ["templateName", "templateText"],
  },
  output_parameters: {
    properties: {
      templateId: {
        type: Schema.types.string,
        description: "Datastore ID",
      },
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
  const result = await save(client, env, inputs);
  if (result.ok) {
    return { outputs: { templateId: result.item.id } };
  } else {
    const error = `Failed to insert a new record: ${result.error}`;
    logger.error(error);
    logger.debug(result);
    return { outputs: {}, error };
  }
};

export default handler;
