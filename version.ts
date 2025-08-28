/**
 * @file version.ts
 * @brief Display version information for a Deno command line program.
 *
 * @author     Simon Rowe <simon@wiremoons.com>
 * @license    open-source released under "MIT License"
 * @source     https://github.com/wiremoons/version/version.ts
 * @source     jsr:@wiremoons/version
 *
 * @date originally created: 24 Aug 2021
 * @date updated significantly: 31 Aug 2021
 * @date moved to jsr.io: 25 Aug 2025
 * @date improve remote handling for 'getFileModTime()': 28 Aug 2025
 *
 * @details Display version information for a Deno command line (CLI) program. The output fields displayed can
 * be customised using the `interface` named: `VersionOptions`.
 *
 * @note The program should be used as a module, but can be run also with Deno using the command:
 * @code deno task run
 */

//--------------------------------
// MODULE IMPORTS
//--------------------------------
import { basename } from "jsr:@std/path@1.x/basename";
import { fromFileUrl } from "jsr:@std/path@1.x";

/** Options for the function `version()` via 'VersionOptions' interface
 * @details Pass in the four (4) *VersionOptions* object parameters to modify the `version()` text output.
 * @param version : string - The version of the program the output is to represent. Example: '0.0.1'
 * @param copyrightName : string - Copyright holder for the program. Example: 'Deno Dinosaur <deno@deno.land>'
 * @param licenseUrl : string - Program website where the license can be found. Example: 'https://github.com/<username_here>/'
 * @param crYear : string - The year the copyright applies from. Examples: '2021' or '2023-2025'
 */
export interface VersionOptions {
  version: string;
  copyrightName: string;
  licenseUrl: string;
  crYear: string;
}

//--------------------------------
// UTILITY FUNCTIONS
//--------------------------------

/** Type guard for string */
export function isString(arg: unknown): arg is string {
  return typeof arg === "string";
}

/** Capitalise the first character of a string */
export function toTitleCaseFirst(str: string): string {
  if (!isString(str) || str.length === 0) return str;
  return str = str.charAt(0).toUpperCase() + str.substring(1);
}

/** Obtain `filePath` modification date and time */
export async function getFileModTime(
  filePath: string,
): Promise<string> {
  if (filePath.length < 1) {
    return Promise.reject(new Error("UNKNOWN as no file path available."));
  }
  // check if the execution is remote as would not allow `Deno.lstat`.
  if (filePath.startsWith("https://") || filePath.startsWith("http://")) {
    return Promise.reject(new Error("UNKNOWN due to remote execution."));
  }
  // maybe have a URL path instead of OS path? Convert to an OS path if needed.
  if (filePath.startsWith("file:")) {
    filePath = fromFileUrl(filePath);
  }
  // get file stat and extract modified time value
  try {
    const fileInfo = await Deno.lstat(filePath);
    return fileInfo.mtime
      ? fileInfo.mtime.toUTCString()
      : "UNKNOWN no file modification time available.";
  } catch {
    return Promise.reject(
      new Error(`UNKNOWN Deno.lstat failed for ${filePath}`),
    );
  }
}

//--------------------------------
// APPLICATION FUNCTIONS
//--------------------------------

/** Display version information for `Deno.mainModule` program.
 *
 * @param verData : VersionOptions - an object with custom settings.
 */
export async function version(
  verData?: Partial<VersionOptions>,
): Promise<string> {
  const {
    version = "0.0.1 [DEFAULT]",
    copyrightName = "Deno Dinosaur <deno@deno.land> [DEFAULT]",
    licenseUrl = "https://github.com/<username_here>/ [DEFAULT]",
    crYear = "2021 [DEFAULT]",
  } = verData ?? {};

  let fileModTime: string;
  try {
    fileModTime = await getFileModTime(Deno.mainModule);
  } catch (err) {
    err instanceof Error
      ? fileModTime = err.message
      : fileModTime = "UNKNOWN unspecified error.";
  }

  return (`
 Application '${basename(Deno.mainModule)}' is version '${version}'.
 Last modified on: ${fileModTime}
 Running Deno version '${Deno.version.deno}' on '${
    toTitleCaseFirst(Deno.build.os)
  } [${Deno.build.arch} with ${navigator.hardwareConcurrency} CPU cores]'.
 Copyright (c) ${crYear} ${copyrightName}.

 For licenses and further information visit:
   - ${licenseUrl}
   - https://deno.land/
   `);
}

//--------------------------------
// MAIN - used for testing only
//--------------------------------
if (import.meta.main) {
  const versionData = await version();
  console.log("\nDEFAULT OUTPUT:");
  console.log(versionData);

  console.log("CUSTOMISED OUTPUT:");
  // define the output options to use:
  const versionOptions = {
    version: "1.0.6",
    copyrightName: "John Doe <example.com>",
    licenseUrl: "https://github.com/example/my_application/",
    crYear: "2022",
  };
  // call the `version` module function using the options configured as `versionOptions`
  const versionData2 = await version(versionOptions);
  console.log(versionData2);
}
