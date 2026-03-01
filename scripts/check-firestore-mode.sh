#!/usr/bin/env bash
# Check whether Firestore (default) is Native mode. Firebase JS SDK only works with Native mode.
# Usage: ./scripts/check-firestore-mode.sh [PROJECT_ID]
# Requires: gcloud CLI (gcloud auth login, gcloud config set project PROJECT_ID)

set -e
PROJECT_ID="${1:-patronage-realtor}"

echo "Listing Firestore databases for project: $PROJECT_ID"
echo ""

if ! gcloud firestore databases list --project="$PROJECT_ID" 2>/dev/null; then
  echo "Run: gcloud auth login"
  echo "Then: gcloud config set project $PROJECT_ID"
  echo "Or: ./scripts/check-firestore-mode.sh YOUR_PROJECT_ID"
  exit 1
fi

echo ""
echo "If (default) shows type DATASTORE_MODE, the Firebase JS SDK cannot use it."
echo "Fix options:"
echo "  1) If (default) is empty, switch to Native:"
echo "     gcloud firestore databases update --type=firestore-native --database='(default)' --project=$PROJECT_ID"
echo "  2) Or create a new Native database and set in .env:"
echo "     gcloud firestore databases create --location=us-central1 --type=firestore-native --database=default-native --project=$PROJECT_ID"
echo "     Then add: VITE_FIREBASE_FIRESTORE_DATABASE_ID=default-native"
