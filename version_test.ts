#!/usr/bin/env -S deno test --quiet --allow-read
/**
 * @file version_test.ts
 * @brief TEST for module to display version information for a Deno program.
 *
 * @author     Simon Rowe <simon@wiremoons.com>
 * @license    open-source released under "MIT License"
 * @source     https://github.com/wiremoons/version/version_test.ts
 * @source     jsr:@wiremoons/version_test
 *
 * @date originally created: 24 Aug 2021
 * @date updated significantly: 05 Sep 2021
 * @date moved to jsr.io: 25 Aug 2025
 *
 * @details TEST script for the module to display version information for a Deno program.
 * The output fields to display can be customised using the `interface` named: `VersionOptions`.
 *
 * @note TEST script that can be run with Deno using the command:
 * @code deno test --allow-read
 */

//--------------------------------
// MODULE IMPORTS
//--------------------------------

import { assertEquals, assertStringIncludes } from "jsr:@std/assert@1.x";
import { fromFileUrl } from "jsr:@std/path@1.x";
import { getFileModTime, isString, version } from "./version.ts";

//--------------------------------
// PERMISSIONS CHECK
//--------------------------------
// request '--allow-read' permission if not granted with: deno test --allow-read
const permCheck = await Deno.permissions.query({ name: "read" });
if (permCheck.state === "prompt") {
  console.log(
    "\nTo avoid the permission prompt, run tests with:  deno test --allow-read\n",
  );
  const status = await Deno.permissions.request({ name: "read" });
  if (status.state !== "granted") {
    console.error(
      "ERROR: deno requires '--allow-read' permission to run tests that check for a files modification time.",
    );
    Deno.exit(1);
  }
}

//--------------------------------
// MODULE IMPORT TEST FUNCTIONS
//--------------------------------

// Check all the modules needed for the tests are imported

Deno.test("'jsr:@std/assert' module is imported: 'assertStringIncludes()'", () => {
  if (!assertStringIncludes) {
    throw Error("missing module");
  }
});

Deno.test("'jsr:@std/assert' module is imported: 'assertEquals()'", () => {
  if (!assertEquals) {
    throw Error("missing module");
  }
});

Deno.test("'jsr:@std/path' module is imported: 'fromFileUrl()'", () => {
  if (!fromFileUrl) {
    throw Error("missing module");
  }
});

Deno.test("'./version.ts' module and function is imported: 'version()'", () => {
  if (!version) {
    throw Error("missing module");
  }
});

Deno.test("'./version.ts' function is imported: 'getFileModTime()'", () => {
  if (!getFileModTime) {
    throw Error("missing module");
  }
});

Deno.test("'./version.ts' function is imported: 'isString()'", () => {
  if (!isString) {
    throw Error("missing module");
  }
});

//--------------------------------
// APPLICATION TEST FUNCTIONS
//--------------------------------

// Obtain executing systems details for test output checks
const denoVer = Deno.version.deno;
const denoArch = Deno.build.arch;
const denoCpuCores = navigator.hardwareConcurrency;

// NOTE: the tests below will need to be updated if being run on different systems!

Deno.test("'version()' application test : default", async () => {
  const testModTime = await getFileModTime("./version_test.ts");
  let actual = "";

  // assumes this test is running on a local macOS M1 system
  if (denoArch == "aarch64") {
    actual = `
 Application 'version_test.ts' is version '0.0.1 [DEFAULT]'.
 Last modified on: ${testModTime}
 Running Deno version '${denoVer}' on 'Darwin [aarch64 with ${denoCpuCores} CPU cores]'.
 Copyright (c) 2021 [DEFAULT] Deno Dinosaur <deno@deno.land> [DEFAULT].

 For licenses and further information visit:
   - https://github.com/<username_here>/ [DEFAULT]
   - https://deno.land/
   `;
  }
  // assumes this test is running is GitHub Action default Ubuntu system
  if (denoArch == "x86_64") {
    actual = `
 Application 'version_test.ts' is version '0.0.1 [DEFAULT]'.
 Last modified on: ${testModTime}
 Running Deno version '${denoVer}' on 'Linux [x86_64 with ${denoCpuCores} CPU cores]'.
 Copyright (c) 2021 [DEFAULT] Deno Dinosaur <deno@deno.land> [DEFAULT].

 For licenses and further information visit:
   - https://github.com/<username_here>/ [DEFAULT]
   - https://deno.land/
   `;
  }
  const verData: string = await version();
  assertEquals(verData, actual);
});

// Tests for 'isString()' below:
Deno.test("isString() 'type_guard' exported function tests : check is string (text)", () => {
  const actual1 = true;
  const test1 = isString("This is a test string.");
  assertEquals(test1, actual1);
});

Deno.test("isString() 'type_guard' exported function tests : check is string (variable)", () => {
  const actual2 = true;
  const testData2 = "This is a test string.";
  const test2 = isString(testData2);
  assertEquals(test2, actual2);
});

Deno.test("isString() 'type_guard' exported function tests : check number is string (false)", () => {
  const actual3 = false;
  const testData3 = 33;
  const test3 = isString(testData3);
  assertEquals(test3, actual3);
});

Deno.test("isString() 'type_guard' exported function tests : check boolean is string (false)", () => {
  const actual4 = false;
  const testData4 = true;
  const test4 = isString(testData4);
  assertEquals(test4, actual4);
});

Deno.test("isString() 'type_guard' exported function tests : check object is string (false)", () => {
  const actual5 = false;
  const testData5 = { "test": 123 };
  const test5 = isString(testData5);
  assertEquals(test5, actual5);
});

Deno.test("isString() 'type_guard' exported function tests : check undefined is string (false)", () => {
  const actual6 = false;
  const testData6 = undefined;
  const test6 = isString(testData6);
  assertEquals(test6, actual6);
});

// Tests for 'getFileModTime()' below:
const testModTime = await getFileModTime("./version.ts");

Deno.test("'getFileModTime()' exported function test : exist file (true)", async () => {
  const actual1 = testModTime;
  const test1 = await getFileModTime("./version.ts");
  assertEquals(test1, actual1);
});
