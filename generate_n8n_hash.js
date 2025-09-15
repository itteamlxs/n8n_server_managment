const bcrypt = require('bcrypt');

async function main() {
  const password = process.argv[2];
  if (!password) {
    console.log("Usage: node generate_n8n_hash.js <your_new_password>");
    process.exit(1);
  }

  const saltRounds = 10; // n8n uses 10 by default
  const hash = await bcrypt.hash(password, saltRounds);

  console.log("Generated hash for n8n:");
  console.log(hash);
}

main();
