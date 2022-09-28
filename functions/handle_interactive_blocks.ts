import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";
import { Logger } from "../utils/logger.ts";
import { FunctionSourceFile } from "../utils/function_source_file.ts";
import { buildNewModalView } from "./modals.ts";

/**
 * See https://api.slack.com/future/functions/custom
 */
export const def = DefineFunction({
  callback_id: "handle-interactive-blocks",
  title: "Handle button clicks in interactive_blocks",
  source_file: FunctionSourceFile(import.meta.url),
  input_parameters: {
    properties: {
      action: { type: Schema.types.object },
      interactivity: { type: Schema.slack.types.interactivity },
      messageLink: { type: Schema.types.string },
      messageTs: { type: Schema.types.string },
    },
    required: ["action", "interactivity"],
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

  if (inputs.action.action_id === "deny") {
    const client = SlackAPI(token);
    await client.views.open({
      interactivity_pointer: inputs.interactivity.interactivity_pointer,
      view: buildNewModalView(),
    });
    return {
      completed: false,
    };
  }
  return {
    completed: true,
    outputs: {},
  };
})
  .addBlockActionsHandler(
    "clear-inputs",
    async ({ body, env, token }) => {
      const logger = Logger(env.logLevel);
      logger.debug(JSON.stringify(body, null, 2));
      const client = SlackAPI(token);
      await client.views.update({
        interactivity_pointer: body.interactivity.interactivity_pointer,
        view_id: body.view.id,
        view: buildNewModalView(),
      });
      return {
        completed: false,
      };
    },
  )
  .addViewSubmissionHandler(
    ["deny-reason-submission"],
    ({ view, env }) => {
      const logger = Logger(env.logLevel);
      const values = view.state.values;
      logger.debug(JSON.stringify(values, null, 2));
      const reason = String(Object.values(values)[0]["deny-reason"].value);
      if (reason.length <= 5) {
        console.log(reason);
        const errors: Record<string, string> = {};
        const blockId = Object.keys(values)[0];
        errors[blockId] = "The reason must be longer than 5 characters";
        return { response_action: "errors", errors };
      }
      // nothing to return if you want to close this modal
      return;
    },
  )
  .addViewClosedHandler(
    ["deny-reason-submission", "deny-reason-confirmation"],
    ({ view, env }) => {
      const logger = Logger(env.logLevel);
      logger.debug(JSON.stringify(view, null, 2));
      return;
    },
  );
