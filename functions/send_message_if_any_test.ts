import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";
import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import handler from "./send_message_if_any.ts";

// Replaces globalThis.fetch with the mocked copy
mf.install();

mf.mock("POST@/api/chat.postMessage", () => {
  return new Response(`{"ok": true, "message": {"ts": "111.222"}}`, {
    status: 200,
  });
});

const { createContext } = SlackFunctionTester("my-function");
const env = { logLevel: "CRITICAL" };

Deno.test("Send a message when both channel and message exist", async () => {
  const inputs = { channelId: "C111", messageText: "Hey, how are you doing?" };
  const { outputs } = await handler(createContext({ inputs, env }));
  assertEquals(outputs?.messageTs, "111.222");
});

Deno.test("Skip sending when channel is missing", async () => {
  const inputs = { messageText: "Hey, how are you doing?" };
  const { outputs } = await handler(createContext({ inputs, env }));
  assertEquals(outputs?.messageTs, undefined);
});

Deno.test("Skip sending when messageText is missing", async () => {
  const inputs = { channelId: "C111" };
  const { outputs } = await handler(createContext({ inputs, env }));
  assertEquals(outputs?.messageTs, undefined);
});
