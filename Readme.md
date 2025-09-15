---

````markdown
# Lab: Password Recovery in n8n using SQLite and bcrypt

This lab demonstrates how to **recover or reset the owner user password in n8n** using SQLite and Node.js (`bcrypt`). It shows how to generate a compatible hash and update the password directly in the database.

---

## Objective

- Simulate a forgotten password scenario for an n8n user.
- Backup the SQLite database.
- Generate a bcrypt hash compatible with n8n.
- Update the password directly in SQLite.
- Test login with the new password.

---

## Requirements

- Ubuntu Server or any system with:
  - Docker and Docker Compose installed.
  - Node.js installed (for bcrypt hashing).
  - **SQLite** installed (`sqlite3`) to manipulate the database.
- n8n installed with persistence in `~/n8n/n8n_data`.

---

## Step 1: Backup the database

Before making any changes:

```bash
cp ~/n8n/n8n_data/database.sqlite ~/n8n/n8n_data/database_backup.sqlite
````

Verify the backup exists:

```bash
ls -lh ~/n8n/n8n_data/
```

---

## Step 2: Open SQLite and inspect users

```bash
sqlite3 ~/n8n/n8n_data/database.sqlite
```

List available tables:

```sql
.tables
```

View current users (mockup example):

```sql
.headers on
.mode column
SELECT id, email, firstName, lastName, password FROM user;
```

Example output:

```
id | email                | firstName | lastName | password
1  | example@domain.com   | Alice     | Smith    | $2a$10$abcdefghijk...
```

Exit SQLite:

```sql
.quit
```

---

## Step 3: Create Node.js script to generate bcrypt hash compatible with n8n

1. Install `bcrypt`:

```bash
npm install bcrypt
```

2. Create `generate_n8n_hash.js`:

```javascript
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
```

3. Run the script with your desired password (mockup):

```bash
node generate_n8n_hash.js LabPassword123#
```

* This outputs a **hash compatible with n8n** that can be used in SQLite.

---

## Step 4: Update the password in SQLite

1. Open SQLite:

```bash
sqlite3 ~/n8n/n8n_data/database.sqlite
```

2. Update the password with the generated hash (mockup example):

```sql
UPDATE user 
SET password='$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
WHERE email='example@domain.com';
.quit
```

> Replace the hash with the one generated from the script and the email with your user.

---

## Step 5: Restart n8n

```bash
docker-compose restart
```

* Ensures n8n reads the new password from SQLite.

---

## Step 6: Test login

* Open your browser:

```
http://localhost:5678
```

* Email: `example@domain.com`
* Password: `LabPassword123#` (or your generated password)

✅ Login should succeed if everything worked correctly.

---

## Why we used Node.js and bcrypt

1. n8n stores passwords as **bcrypt hashes**, not plain text.
2. Hashes must follow a **specific format n8n recognizes**.
3. Node.js + bcrypt allows generating hashes **compatible with n8n**.
4. Secure, reproducible, and flexible for lab environments.

---

## Best Practices

* Always backup the database before making changes.
* Do not use random external hashes.
* Use the Node.js script to ensure compatibility.
* Repeatable for multiple users in lab environments.

---

## Summary Flow

```
New password -> Node.js script (bcrypt) -> Compatible hash -> SQLite -> n8n -> Successful login
```

---

> This README serves as a complete guide for password recovery labs in n8n using SQLite and bcrypt.
