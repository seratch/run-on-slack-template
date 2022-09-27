export function resolveFunctionSourceFile(importMetaUrl: string): string {
  return new URL("", importMetaUrl).pathname.split("/").slice(-2).join(
    "/",
  );
}
