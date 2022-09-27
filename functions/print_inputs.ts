import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { getLogger } from "../utils/logger.ts";
import { resolveFunctionSourceFile } from "../utils/source_file_resoluion.ts";

/**
 * See https://api.slack.com/future/functions/custom
 */
export const def = DefineFunction({
  callback_id: "printer",
  title: "Print inputs",
  description: "Print inputs",
  source_file: resolveFunctionSourceFile(import.meta.url),
  input_parameters: {
    properties: {
      // You can customize these keys
      id: {
        type: Schema.types.string,
      },
      name: {
        type: Schema.types.string,
      },
      text: {
        type: Schema.types.string,
      },
    },
    required: [],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

const handler: SlackFunctionHandler<typeof def.definition> = async ({
  inputs,
  env,
}) => {
  const logger = await getLogger(env.logLevel);
  logger.debug(inputs);
  return await { outputs: {} };
};

export default handler;
