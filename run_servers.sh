cd "$(dirname "$0")/api/src" || { echo "directory not found"; exit 1; }

if [ -f ".venv/bin/activate" ]; then
  source .venv/bin/activate
else
  echo "Virtual environment not found. Please run: python -m venv .venv"
  exit 1
fi

echo "Starting FastAPI server..."
uvicorn app:app --reload &
sleep 2

cd "$(dirname "$0")" || { echo "directory not found"; exit 1; }
echo "Starting React frontend..."
npm run dev
