# trunkline

![project logo](./.github/logo.png)

Batteries included multi-protocol WebRtc communications backend. 📶🔋

![alpha badge](https://img.shields.io/badge/status-alpha-orange.svg)
[![Build Status](https://dev.azure.com/bengreenier/rtc-dialtone/_apis/build/status/rtc-dialtone.trunkline?branchName=master)](https://dev.azure.com/bengreenier/rtc-dialtone/_build/latest?definitionId=13&branchName=master)

Scaling WebRTC can be tricky - there are many moving parts and services required to establish a basic call. Even in the best conditions, these components can be tough to understand and hard to manage. This project aims to help reduce the burden of maintaining an application-specific service that facilitates WebRTC session establishment and ongoing message handoff. It has three goals:

+ Be easy to run, both locally and in the cloud
+ Be easily understood and monitored at runtime
+ Support multiple configurations out of the box

## Quickstart

+ Download the [latest binary release](https://github.com/rtc-dialtone/trunkline/releases/latest) for your os.
+ Run it 🚀

## Configuration

> Note: When using environment variables (or a `.env` file) names must be prefixed with `TRUNKLINE_` - for example: `TRUNKLINE_PORT=3000`.

trunkline can be configured at runtime, using environment variables, a `.env` file, or CLI arguments. The supported values are listed below:

### Database

> CLI flag: `--database`

Configures the backing database type.

+ Default: `memory`
+ Options: `memory`, `sql`

### Port

> CLI flag: `--port` or `-P`

Configures the http listening port.

+ Default: `3000`

### Protocols

> CLI flag: `--protocols`

Configures the listening wire protocols.

+ Default: `http`
+ Options: `http`, more soon.

### Verbosity

> CLI flag: `--verbosity` or `-V`

Configures the logging verbosity.

+ Default: `info`
+ Options: `trace`, `debug`, `info`, `warn`, `error`, `fatal`, `silent`

## API

The protocol-specific API surfaces that trunkline supports.

### Http

+ OpenAPI Visualized: [Redoc](https://redocly.github.io/redoc/?url=https://raw.githubusercontent.com/rtc-dialtone/trunkline/master/src/lib/protocols/http-swagger.yml&nocors)
+ OpenAPI Raw: [http-swagger.yml](./src/lib/protocols/http-swagger.yml)

## License

GPL-3.0