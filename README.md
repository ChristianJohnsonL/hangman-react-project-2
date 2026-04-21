# Hangman

Hangman game

## Requirements

- Node.js
- Docker Desktop (needs to be open and running)

## Setup

Install dependencies:
```bash
npm install
```

Create the database table (once):
```bash
node dynamo/db/setup.js
```

## Running it

You need 3 terminals:

```bash
# Terminal 1 - database
cd dynamo && docker compose up

# Terminal 2 - server
npm run server

# Terminal 3 - app
npm start
```

App runs at http://localhost:3000
