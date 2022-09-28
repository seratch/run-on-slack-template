import { Trigger } from "deno-slack-api/types.ts";
import workflowDef from "../../workflows/message_metadata_receiver_workflow.ts";
import { IncidentEvent } from "../../event_types/incident.ts";

/**
 * See https://api.slack.com/future/triggers/event
 */
const trigger: Trigger<typeof workflowDef.definition> = {
  type: "event",
  name: "message_metadata_posted event trigger",
  workflow: `#/workflows/${workflowDef.definition.callback_id}`,
  event: {
    event_type: "slack#/events/message_metadata_posted",
    metadata_event_type: IncidentEvent.definition.name,
    // TODO: Listing all the channels to enable here is required
    channel_ids: ["CLT1F93TP"],
  },
  inputs: {
    channelId: { value: "{{data.channel_id}}" },
    id: { value: "{{data.metadata.event_payload.incident_id}}" },
    title: { value: "{{data.metadata.event_payload.incident_title}}" },
    summary: { value: "{{data.metadata.event_payload.incident_summary}}" },
    severity: { value: "{{data.metadata.event_payload.incident_severity}}" },
  },
};

export default trigger;
