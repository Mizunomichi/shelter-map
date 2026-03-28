#!/bin/bash
# ShelterMap Setup Script

set -e

echo "🏗️  Setting up ShelterMap..."

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed."; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3 is required but not installed."; exit 1; }

echo "✅ Prerequisites check passed"

# Setup Python virtual environment
echo "📦 Setting up Python environment..."
cd supabase/functions
python3 -m venv venv
source venv/bin/activate || . venv/Scripts/activate
pip install -r requirements.txt
cd ../..

echo "✅ Python environment ready"

# Setup frontend
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Frontend dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f frontend/.env ]; then
    echo "📝 Creating .env file..."
    cp frontend/.env.example frontend/.env
    echo "⚠️  Please update frontend/.env with your Supabase credentials"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Install Supabase CLI: https://supabase.com/docs/guides/cli"
echo "2. Run 'supabase init' to initialize Supabase"
echo "3. Run 'supabase start' to start local Supabase"
echo "4. Run 'supabase db push' to apply migrations"
echo "5. Update frontend/.env with your Supabase URL and keys"
echo "6. Run 'cd frontend && npm run dev' to start the development server"
echo ""
