import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { Logger } from "../utils/logger.ts";
import { FunctionSourceFile } from "../utils/function_source_file.ts";

/**
 * See https://api.slack.com/future/functions/custom
 */
export const def = DefineFunction({
  callback_id: "printer",
  title: "Print inputs",
  description: "Print inputs",
  source_file: FunctionSourceFile(import.meta.url),
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

export default SlackFunction(def, ({
  inputs,
  env,
}) => {
  const logger = Logger(env.logLevel);
  logger.debug(inputs);

  return { outputs: {} };
});
