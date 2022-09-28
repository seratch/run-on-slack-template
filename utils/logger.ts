import * as log from "https://deno.land/std@0.157.0/log/mod.ts";

export const Logger = function (
  level?: string,
): log.Logger {
  const logLevel: log.LevelName = level === undefined
    ? "DEBUG"
    : level as log.LevelName;
  log.setup({
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
};
