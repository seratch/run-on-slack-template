import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { def as manageTriggers } from "../functions/manage_reaction_added_event_trigger.ts";
import { default as eventWorkflowDef } from "./reaction_added_event_workflow.ts";

/**
 * https://api.slack.com/future/workflows
 */
const workflow = DefineWorkflow({
  callback_id: "reaction-added-event-setup-workflow",
  title: "The reaction_added Event Workflow Configurator",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: ["interactivity"],
  },
});

workflow.addStep(manageTriggers, {
  interactivity: workflow.inputs.interactivity,
  workflowCallbackId: eventWorkflowDef.definition.callback_id,
});

export default workflow;
