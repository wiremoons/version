[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/hyperium/hyper/master/LICENSE)
[![](https://img.shields.io/badge/deno-v2.4.5-green.svg)](https://github.com/denoland/deno)
[![JSR version](https://img.shields.io/jsr/v/@wiremoons/version)](https://jsr.io/@wiremoons/version)

# 'version()'

A Deno specific module written in TypeScript used to display basic version
information for any command line application.

## Modules Overview

A brief description of the modules purpose is below.

- `version.ts` : contains function `version()` used to display basic version
  information for any Deno command line application.

For more information, see the source code itself, as that includes additional
comments. The tests for each module also provide examples of usage.

## Using 'version()'

The recommended approach for using `version()` in a project is via JSR.

See: https://jsr.io/@wiremoons/version for details, if you are currently viewing
this information on the [version() GitHub repo](https://github.com/wiremoons/version).

## Example Output

The following is an example output from a Deno CLI program using this module:

```shell
% ~> qpass -v

Application 'qpass.ts' is version '0.3.0'.
Last modified on: Mon, 25 Aug 2025 13:18:17 GMT
Running Deno version '2.4.4' on 'Darwin [aarch64 with 14 CPU cores]'.
Copyright (c) 2023-2025 Simon Rowe.

For licenses and further information visit:
 - https://github.com/wiremoons/qpass/
 - https://deno.land/
```

## Tests

The `version` module and supporting exports have associated tests. These can be
run with the command: `deno task test`

## License

The code provided is covered by the **MIT License**. See
http://opensource.org/licenses/mit. A copy of the applications license is
included with the code.
