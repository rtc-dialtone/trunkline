import { QueryInterface } from "knex";
import { default as pino } from "pino";
import { IMessage, IMutableMessage } from "../lib/models/message";
import { SqlMessageView } from "../lib/views/sql/sql-message-view";

let sqlClient: jest.Mocked<QueryInterface>;

jest.mock("knex", () => {
  sqlClient = {
    insert: jest.fn(),
  } as Partial<QueryInterface> as any;

  return jest.fn().mockReturnValue(jest.fn().mockReturnValue(sqlClient));
});

describe("views.sql.message", () => {
  let messageView: SqlMessageView;

  beforeEach(() => {
    messageView = new SqlMessageView({
      dbhost: "host.com",
      dbpass: "pass",
      dbtable: "table",
      dbuser: "user",
      logger: pino(),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    it("should create", async () => {
      const expectedMutMsg: IMutableMessage = {
        data: "hello",
        mimeType: "text/plain",
      };
      const expectedMsg: IMessage = {...expectedMutMsg,
        createdAt: new Date(),
        createdBy: "test1",
        id: "test",
        sentTo: "test2",
      };

      sqlClient.insert.mockResolvedValueOnce(expectedMsg);
      const msg = await messageView.create(expectedMsg.createdBy, expectedMsg.sentTo, {
        data: expectedMutMsg.data,
        mimeType: expectedMutMsg.mimeType,
      });

      expect(msg).toEqual(expectedMsg);
      expect(sqlClient.insert).toHaveBeenCalledTimes(1);
      expect(sqlClient.insert).toBeCalledWith({...expectedMutMsg,
        createdBy: expectedMsg.createdBy,
        sentTo: expectedMsg.sentTo,
      });
    });
  });
});
