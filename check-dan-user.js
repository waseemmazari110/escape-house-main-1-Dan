const Database = require('better-sqlite3');

const db = new Database('./escape-houses.db');

const users = db.prepare('SELECT id, name, email, role FROM user WHERE name LIKE ?').all('%Dan%');
console.log('Users matching "Dan":', JSON.stringify(users, null, 2));

const allUsers = db.prepare('SELECT id, name, email, role FROM user').all();
console.log('\nAll users:', JSON.stringify(allUsers, null, 2));

db.close();
