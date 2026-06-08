#!/bin/bash
# Start the Veritas backend server
cd "$(dirname "$0")"

# Create and activate virtual environment if needed
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

# Install dependencies if needed
pip install -r requirements.txt -q 2>&1 | tail -5

# Run the server
echo "Starting Veritas API on port ${PORT:-8000}..."
python main.py