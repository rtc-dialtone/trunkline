# trunkline

Batteries included multi-protocol WebRtc communications backend. 📶🔋

![coming soon badge](https://img.shields.io/badge/status-alpha-orange.svg)

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

> `CLI flag: `--verbosity` or `-V`

Configures the logging verbosity.

+ Default: `info`
+ Options: `trace`, `debug`, `info`, `warn`, `error`, `fatal`, `silent`

## API

The protocol-specific API surfaces that trunkline supports.

### Http

Docs coming soon. 😅

## License

GPL-3.0