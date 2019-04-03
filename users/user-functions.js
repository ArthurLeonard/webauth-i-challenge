
const db = require('../data/dbConfig.js');

module.exports = {
    addUser,
    findUser,
    findUserBy,
    findUserByID
};

function findUser () {
    return db('users').select('id', 'username', 'password');      // abstraction for the sqlite commants
}

function findUserBy ( filter ) {
    return db('users').where(filter);
}

function findUserByID (id) {
    return db('users').where( {id} ).first();
}

async function addUser (user) {
    const [id] = await db('users').insert(user);
    return findUserByID(id);
}


// function find() {
//   return db('users').select('id', 'username', 'password');
// }

// function findBy(filter) {
//   return db('users').where(filter);
// }

// async function add(user) {
//   const [id] = await db('users').insert(user);

//   return findById(id);
// }

// function findById(id) {
//   return db('users')
//     .where({ id })
//     .first();
// }
