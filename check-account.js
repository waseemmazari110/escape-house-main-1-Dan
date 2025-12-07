// Quick script to check account data
import Database from 'better-sqlite3';

const db = new Database('./.data/database.sqlite');

const userId = 'qV4hndgIre6BNDu0jlX7rydTyGb2ijx5';
const accounts = db.prepare('SELECT * FROM account WHERE userId = ?').all(userId);

console.log('Accounts for user:');
console.log(JSON.stringify(accounts, null, 2));

db.close();
