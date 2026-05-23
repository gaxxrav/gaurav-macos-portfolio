# Gaurav MacOS Portfolio

## Live Stats Backend

The live Chess.com and Monkeytype panels in `Playground/chess-stats.live` and `Playground/monkeytype.live` are powered by a small FastAPI service in `backend/`.

### Run locally

```bash
python3 -m pip install -r backend/requirements.txt
npm run dev:backend
npm run dev
```

The frontend calls `/api/chess/stats/:username` and `/api/monkeytype/profile/:username` through the Vite proxy, which forwards requests to `http://127.0.0.1:8000`.
