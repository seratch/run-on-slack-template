import { DefineEvent, Schema } from "deno-slack-sdk/mod.ts";

const IncidentEvent = DefineEvent({
  name: "my_incident_event",
  title: "Incident",
  type: Schema.types.object,
  properties: {
    id: { type: Schema.types.string },
    title: { type: Schema.types.string },
    summary: { type: Schema.types.string },
    severity: { type: Schema.types.string },
  },
  required: ["id", "title", "summary", "severity"],
  additionalProperties: false,
});
export default IncidentEvent;
