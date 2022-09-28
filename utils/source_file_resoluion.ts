export function resolveFunctionSourceFile(
  // Pass the value of import.meta.url in a function code
  importMetaUrl: string,
  // If you have sub diretories under "functions" dir, set the depth.
  // When you place functions/pto/data_submission.ts, the depth for the source file is 1.
  depth = 0,
): string {
  const sliceStart = -2 - depth;
  const path = new URL("", importMetaUrl).pathname;
  return path.split("/").slice(sliceStart).join("/");
}
