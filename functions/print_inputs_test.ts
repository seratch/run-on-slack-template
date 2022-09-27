import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import handler from "./print_inputs.ts";

const { createContext } = SlackFunctionTester("my-function");
const env = { logLevel: "CRITICAL" };

Deno.test("Print all inputs", async () => {
  const inputs = { id: "xxx", name: "name", text: "foo" };
  await handler(createContext({ inputs, env }));
});
