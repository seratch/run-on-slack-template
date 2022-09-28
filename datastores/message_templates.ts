import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";
import { Env } from "deno-slack-sdk/types.ts";
import { SlackAPIClient } from "deno-slack-api/types.ts";
import { Logger } from "../utils/logger.ts";

export const DATASTORE_NAME = "message_templates";

// requires "datastore:read", "datastore:write"
export const def = DefineDatastore({
  name: DATASTORE_NAME,
  primary_key: "id",
  attributes: {
    id: {
      type: Schema.types.string,
      required: true,
    },
    name: {
      type: Schema.types.string,
      required: true,
    },
    text: {
      type: Schema.types.string,
      required: true,
    },
  },
});

export interface SaveArgs {
  id?: string;
  templateName: string;
  templateText: string;
}

export async function save(
  client: SlackAPIClient,
  env: Env,
  args: SaveArgs,
) {
  const logger = Logger(env.logLevel);
  logger.debug(`Saving a recored: ${JSON.stringify(args)}`);
  const result = await client.apps.datastore.put({
    datastore: DATASTORE_NAME,
    item: {
      id: args.id ?? crypto.randomUUID(),
      name: args.templateName,
      message: args.templateText,
    },
  });
  logger.debug(`Save result: ${JSON.stringify(result)}`);
  return result;
}

export async function findById(
  client: SlackAPIClient,
  env: Env,
  id: string,
) {
  const logger = Logger(env.logLevel);
  logger.debug(`Finding a record for id: ${id}`);
  const result = await client.apps.datastore.get({
    datastore: DATASTORE_NAME,
    item: { id },
  });
  logger.debug(`Found: ${JSON.stringify(result)}`);
  return result;
}

export async function deleteById(
  client: SlackAPIClient,
  env: Env,
  id: string,
) {
  const logger = Logger(env.logLevel);
  logger.debug(`Deleting a record for id: ${id}`);
  const result = await client.apps.datastore.delete({
    datastore: DATASTORE_NAME,
    item: { id },
  });
  logger.debug(`Deletion result: ${JSON.stringify(result)}`);
  return result;
}
