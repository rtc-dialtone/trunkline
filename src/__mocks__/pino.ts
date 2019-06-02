import { Logger } from "pino";

const genPino = jest.genMockFromModule("pino") as jest.Mock;

/**
 * Note: to regenerate this mock...
 * 1) Grab the BaseLogger definition from the .d.ts file
 * 2) Copy it over the object contents (well, the bits we need) below
 * 3) Replace types with mock info
 */

// tslint:disable: max-line-length
// tslint:disable: object-literal-sort-keys
const customPino: Partial<Logger> = {
  /**
   * Creates a child logger, setting all key-value pairs in `bindings` as properties in the log lines. All serializers will be applied to the given pair.
   * Child loggers use the same output stream as the parent and inherit the current log level of the parent at the time they are spawned.
   * From v2.x.x the log level of a child is mutable (whereas in v1.x.x it was immutable), and can be set independently of the parent.
   * If a `level` property is present in the object passed to `child` it will override the child logger level.
   *
   * @param bindings: an object of key-value pairs to include in log lines as properties.
   * @returns a child logger instance.
   */
  child: jest.fn().mockReturnThis(),

  /**
   * Log at `'fatal'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
   * If more args follows `msg`, these will be used to format `msg` using `util.format`.
   *
   * @param obj: object to be serialized
   * @param msg: the log message to write
   * @param ...args: format string values when `msg` is a format string
   */
  fatal: jest.fn(),
  /**
   * Log at `'error'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
   * If more args follows `msg`, these will be used to format `msg` using `util.format`.
   *
   * @param obj: object to be serialized
   * @param msg: the log message to write
   * @param ...args: format string values when `msg` is a format string
   */
  error: jest.fn(),
  /**
   * Log at `'warn'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
   * If more args follows `msg`, these will be used to format `msg` using `util.format`.
   *
   * @param obj: object to be serialized
   * @param msg: the log message to write
   * @param ...args: format string values when `msg` is a format string
   */
  warn: jest.fn(),
  /**
   * Log at `'info'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
   * If more args follows `msg`, these will be used to format `msg` using `util.format`.
   *
   * @param obj: object to be serialized
   * @param msg: the log message to write
   * @param ...args: format string values when `msg` is a format string
   */
  info: jest.fn(),
  /**
   * Log at `'debug'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
   * If more args follows `msg`, these will be used to format `msg` using `util.format`.
   *
   * @param obj: object to be serialized
   * @param msg: the log message to write
   * @param ...args: format string values when `msg` is a format string
   */
  debug: jest.fn(),
  /**
   * Log at `'trace'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
   * If more args follows `msg`, these will be used to format `msg` using `util.format`.
   *
   * @param obj: object to be serialized
   * @param msg: the log message to write
   * @param ...args: format string values when `msg` is a format string
   */
  trace: jest.fn(),

  /**
   * Flushes the content of the buffer in extreme mode. It has no effect if extreme mode is not enabled.
   */
  flush: jest.fn(),

  /**
   * A utility method for determining if a given log level will write to the destination.
   */
  isLevelEnabled: jest.fn().mockImplementation(() => true),
};
// tslint:enable: object-literal-sort-keys
// tslint:enable: max-line-length

// a value that we can set on our customPino mock
// and ensure that it's not used by anyone else, and is false
// this helps us bypass a check where fastify looks at the innerds of pino
const unusedValueLiteral = "__unusedFalseyMockValue";
(customPino as any)[unusedValueLiteral] = false;

// return our mock from the generated mock (which is a function)
// this mirrors pinos root api, being a function
genPino.mockReturnValue(customPino);

// export the function as the default
export default genPino;

// these are needed as fastify inspects the innerds of pino
// to see where, remove these and run tests
export const symbols = {
  serializersSym: unusedValueLiteral,
};
export const stdSerializers = {
  err: jest.fn(),
};
