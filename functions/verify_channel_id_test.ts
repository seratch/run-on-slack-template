import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";
import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import handler from "./verify_channel_id.ts";

// Replaces globalThis.fetch with the mocked copy
mf.install();

mf.mock("POST@/api/conversations.info", async (req) => {
  const body = await req.formData();
  if (body.get("channel_id")?.toString().startsWith("C")) {
    return new Response(`{"ok": true, "channel": {}}`, {
      status: 200,
    });
  }
  return new Response(`{"ok": false, "error": "channel_not_found"}`, {
    status: 200,
  });
});

const { createContext } = SlackFunctionTester("my-function");
const env = { logLevel: "CRITICAL" };

Deno.test("Verify a valid channel ID", async () => {
  const inputs = { channelId: "C12345" };
  const { outputs } = await handler(createContext({ inputs, env }));
  assertEquals(outputs?.channelId, inputs.channelId);
});

Deno.test("Verify an invalid channel ID", async () => {
  const inputs = { channelId: "invalid" };
  const { outputs } = await handler(createContext({ inputs, env }));
  assertEquals(outputs?.channelId, undefined);
});
