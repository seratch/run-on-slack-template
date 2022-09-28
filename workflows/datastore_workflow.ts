import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { def as createMessageTemplate } from "../functions/create_message_template.ts";
import { def as printInputs } from "../functions/print_inputs.ts";

/**
 * https://api.slack.com/future/workflows
 */
const workflow = DefineWorkflow({
  callback_id: "datastore-workflow",
  title: "Datastore Workflow",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: ["interactivity"],
  },
});

/**
 * https://api.slack.com/future/functions#open-a-form
 */
const inputFormStep = workflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Send message to channel",
    interactivity: workflow.inputs.interactivity,
    submit_label: "Send message",
    fields: {
      elements: [{
        name: "templateName",
        title: "Template name",
        type: Schema.types.string,
        default: "My template",
      }, {
        name: "templateText",
        title: "Message text",
        type: Schema.types.string,
        long: true,
      }],
      required: ["templateName", "templateText"],
    },
  },
);

const createMessageTemplateStep = workflow.addStep(createMessageTemplate, {
  templateName: inputFormStep.outputs.fields.templateName,
  templateText: inputFormStep.outputs.fields.templateText,
});

workflow.addStep(printInputs, {
  id: createMessageTemplateStep.outputs.templateId,
  name: inputFormStep.outputs.fields.templateName,
  text: inputFormStep.outputs.fields.templateText,
});

export default workflow;
