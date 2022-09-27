import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import handler from "./build_message_text.ts";

const { createContext } = SlackFunctionTester("my-function");
const env = { logLevel: "CRITICAL" };

Deno.test("Transform a message", async () => {
  const inputs = { messageText: "Hey, how are you doing?" };
  const { outputs } = await handler(createContext({ inputs, env }));
  assertEquals(
    outputs?.updatedMessageText,
    ":wave: You submitted the following message: \n\n>Hey, how are you doing?",
  );
});
