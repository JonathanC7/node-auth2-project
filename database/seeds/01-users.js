
exports.seed = function(knex) {
  return knex('users').insert([
    {id: 1, username: 'jcanela7', password: 'Random', department: 'finance'}
  ])
};
