# Hangman React Project 2

## Run with Docker

### 1. Prerequisite
- Instal Docker Desktop and make sure it is running.

### 2. Build image
```powershell
docker build -t hangman2 .
```

### 3. Run container
```powershell
docker run --rm -p 3000:3000 -e HOST=0.0.0.0 -e PORT=3000 hangman2 npm start
```

### 4. Open app
- http://localhost:3000

## Run without Docker (npm)

### 1. Install dependencies
```powershell
npm install
```

### 2. Start app
```powershell
npm start
```

### 3. Open app
- http://localhost:3000

## Stop
- Press `Ctrl + C` in the terminal.
