# Gaurav MacOS Portfolio

## Chess Stats Backend

The live Chess.com stats panel in `Playground/chess-stats.live` is powered by a small FastAPI service in `backend/`.

### Run locally

```bash
python3 -m pip install -r backend/requirements.txt
npm run dev:backend
npm run dev
```

The frontend calls `/api/chess/stats/mikal_jakson` through the Vite proxy, which forwards requests to `http://127.0.0.1:8000`.
