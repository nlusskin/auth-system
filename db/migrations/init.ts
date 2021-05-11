import { Knex } from 'knex';

exports.up = async (Knex:Knex) => {
  // Users
  await Knex.schema.createTable('users', t => {
    t.string('userId').unique();
    t.string('password');
    t.dateTime('createdAt')
  });


  
  // Refresh tokens
  await Knex.schema.createTable('refreshTokens', t => {
    t.increments();
    t.string('userId');
    t.string('token');
    t.boolean('revoked');
    t.dateTime('iat');
  
    t.foreign('userId').references('userId').inTable('users');
  });


}


exports.down = async (Knex:Knex) => {
  Knex.schema.dropTable('users');

  Knex.schema.dropTable('refreshTokens');
}