#!/bin/bash

# Deploy Analytics Edge Function to Supabase
echo "Deploying track-event Edge Function..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Installing Supabase CLI..."
    npm install -g supabase
fi

# Login to Supabase (if not already logged in)
echo "Please make sure you're logged in to Supabase:"
echo "Run: supabase login"
echo "Then set your project: supabase link --project-ref YOUR_PROJECT_REF"
echo ""

# Deploy the function
supabase functions deploy track-event

echo "Deployment complete!"
echo "Make sure your environment variables are set in Supabase Dashboard:"
echo "- SUPABASE_URL"
echo "- SUPABASE_SERVICE_ROLE_KEY"
