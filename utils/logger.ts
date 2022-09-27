import * as log from "https://deno.land/std@0.157.0/log/mod.ts";

export async function getLogger(
  level?: string,
): Promise<log.Logger> {
  const logLevel: log.LevelName = level === undefined
    ? "DEBUG"
    : level as log.LevelName;
  await log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler(logLevel),
    },
    loggers: {
      default: {
        level: logLevel,
        handlers: ["console"],
      },
    },
  });
  return log.getLogger();
}
