import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";
import { Logger } from "../utils/logger.ts";
import { FunctionSourceFile } from "../utils/function_source_file.ts";

/**
 * See https://api.slack.com/future/functions/custom
 */
export const def = DefineFunction({
  callback_id: "manage-reaction-added-event-trigger",
  title: "Manage a reaction_added event trigger",
  source_file: FunctionSourceFile(import.meta.url),
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      workflowCallbackId: { type: Schema.types.string },
    },
    required: ["interactivity"],
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

  const client = SlackAPI(token);
  const allTriggers = await client.workflows.triggers.list({});
  let triggerToUpdate = undefined;
  // find the trigger to update
  if (allTriggers.triggers) {
    for (const trigger of allTriggers.triggers) {
      if (
        trigger.workflow.callback_id === inputs.workflowCallbackId &&
        trigger.event_type === "slack#/events/reaction_added"
      ) {
        triggerToUpdate = trigger;
      }
    }
  }
  const channelIds = triggerToUpdate?.channel_ids != undefined
    ? triggerToUpdate.channel_ids
    : [];
  await client.views.open({
    interactivity_pointer: inputs.interactivity.interactivity_pointer,
    view: {
      "type": "modal",
      "callback_id": "configure-workflow",
      "title": {
        "type": "plain_text",
        "text": "Workflow Configuration",
      },
      "notify_on_close": true,
      "submit": {
        "type": "plain_text",
        "text": "Confirm",
      },
      "blocks": [
        {
          "type": "input",
          "block_id": "block",
          "element": {
            "type": "multi_channels_select",
            "placeholder": {
              "type": "plain_text",
              "text": "Select channels to add",
            },
            "initial_channels": channelIds,
            "action_id": "channels",
          },
          "label": {
            "type": "plain_text",
            "text": "Channels to enable the workflow",
          },
        },
      ],
    },
  });
  return {
    completed: false,
  };
})
  .addViewSubmissionHandler(
    ["configure-workflow"],
    async ({ view, inputs, env, token }) => {
      const logger = Logger(env.logLevel);
      const { workflowCallbackId } = inputs;
      const channelIds = view.state.values.block.channels.selected_channels;
      const triggerInputs = {
        channelId: {
          value: "{{data.channel_id}}",
        },
        messageTs: {
          value: "{{data.message_ts}}",
        },
        reaction: {
          value: "{{data.reaction}}",
        },
      };

      const client = SlackAPI(token);
      const authTest = await client.auth.test({});
      logger.info(authTest);

      const allTriggers = await client.workflows.triggers.list({});
      let modalMessage = "The configuration is done!";
      try {
        let triggerToUpdate = undefined;
        // find the trigger to update
        if (allTriggers.triggers) {
          for (const trigger of allTriggers.triggers) {
            if (
              trigger.workflow.callback_id === workflowCallbackId &&
              trigger.event_type === "slack#/events/reaction_added"
            ) {
              triggerToUpdate = trigger;
            }
          }
        }
        logger.info(triggerToUpdate);

        if (triggerToUpdate === undefined) {
          const creation = await client.workflows.triggers.create({
            type: "event",
            name: "reaction_added event trigger",
            workflow: `#/workflows/${workflowCallbackId}`,
            event: {
              event_type: "slack#/events/reaction_added",
              channel_ids: channelIds,
            },
            inputs: triggerInputs,
          });
          logger.info(`A new trigger created: ${JSON.stringify(creation)}`);
        } else {
          const update = await client.workflows.triggers.update({
            trigger_id: triggerToUpdate.id,
            type: "event",
            name: "reaction_added event trigger",
            workflow: `#/workflows/${workflowCallbackId}`,
            event: {
              event_type: "slack#/events/reaction_added",
              channel_ids: channelIds,
            },
            inputs: triggerInputs,
          });
          logger.info(`A new trigger updated: ${JSON.stringify(update)}`);
        }
        for (const channelId of channelIds) {
          const joinResult = await client.conversations.join({
            channel: channelId,
          });
          logger.debug(joinResult);
        }
      } catch (e) {
        logger.error(e);
        modalMessage = e;
      }
      // nothing to return if you want to close this modal
      return {
        response_action: "update",
        view: {
          "type": "modal",
          "callback_id": "configure-workflow",
          "notify_on_close": true,
          "title": {
            "type": "plain_text",
            "text": "Workflow Configuration",
          },
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": modalMessage,
              },
            },
          ],
        },
      };
    },
  )
  .addViewClosedHandler(
    ["configure-workflow"],
    ({ view, env }) => {
      const logger = Logger(env.logLevel);
      logger.debug(JSON.stringify(view, null, 2));
      return {
        outputs: {},
        completed: true,
      };
    },
  );
