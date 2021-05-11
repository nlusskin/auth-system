// Update with your config settings.

module.exports = {

  development: {
    client: "sqlite3",
    connection: {
      filename: "./db/dev.sqlite"
    },
    migrations: {
      directory: './db/migrations',
      extension: 'ts'
    }
  },

};
