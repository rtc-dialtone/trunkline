import { QueryInterface } from "knex";

const genKnex = jest.genMockFromModule("knex") as jest.Mock;

const customKnex: Partial<QueryInterface> & PromiseLike<any> = {
  delete: jest.fn().mockReturnThis(),
  first: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  then: jest.fn().mockImplementation(() => Promise.reject()),
  update: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
};

genKnex.mockReturnValue(jest.fn().mockReturnValue(customKnex));

export default genKnex;
