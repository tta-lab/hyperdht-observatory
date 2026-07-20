import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("Observatory package and runtime paths do not depend on the Kepos repository", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8")) as {
    name: string;
    scripts: Record<string, string>;
  };
  const runtimeSources = await Promise.all(
    [
      "src/bootstrap-benchmark-cli.ts",
      "src/dht-crawler.ts",
      "src/dht-report.ts",
      "src/dht-validator.ts",
    ].map((file) => readFile(file, "utf8")),
  );

  assert.equal(packageJson.name, "hyperdht-observatory");
  assert.deepEqual(packageJson.scripts, {
    typecheck: "tsc --noEmit",
    test: "node --import tsx --test",
    "crawl:dht": "tsx src/dht-crawler.ts",
    "report:dht": "tsx src/dht-report.ts",
    "validate:dht": "tsx src/dht-validator.ts",
    "benchmark:bootstrap": "tsx src/bootstrap-benchmark-cli.ts",
  });
  assert.doesNotMatch(runtimeSources.join("\n"), /kepos-neo|from "\.\.\/(?:keys|mux)\.js"/);
});
