import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";
import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import handler from "./create_message_template.ts";

// Replaces globalThis.fetch with the mocked copy
mf.install();

mf.mock("POST@/api/apps.datastore.put", () => {
  return new Response(`{"ok": true, "item": {"id": "111.222"}}`, {
    status: 200,
  });
});

const { createContext } = SlackFunctionTester("my-function");
const env = { logLevel: "CRITICAL" };

Deno.test("Print all inputs", async () => {
  const inputs = { templateName: "name", templateText: "foo" };
  const { outputs } = await handler(createContext({ inputs, env }));
  assertEquals(outputs?.templateId, "111.222");
});
