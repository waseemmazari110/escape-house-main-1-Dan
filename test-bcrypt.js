const bcrypt = require('bcryptjs');

const password = 'Test123456';

async function test() {
  // Hash password
  const hash1 = await bcrypt.hash(password, 10);
  console.log('Hash 1:', hash1);
  
  // Verify with same password
  const valid1 = await bcrypt.compare(password, hash1);
  console.log('Verification 1:', valid1);
  
  // Generate another hash
  const hash2 = await bcrypt.hash(password, 10);
  console.log('Hash 2:', hash2);
  
  // Verify with same password
  const valid2 = await bcrypt.compare(password, hash2);
  console.log('Verification 2:', valid2);
  
  // Cross-verify
  const crossValid = await bcrypt.compare(password, hash2);
  console.log('Cross-verification:', crossValid);
}

test();
