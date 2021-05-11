import knex from 'knex';

const DB_PATH = './db/dev.sqlite'

const Knex = knex({
  client: 'sqlite3',
  connection: {
    filename: DB_PATH
  }
});

export default Knex;