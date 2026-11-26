#!/usr/bin/env bash
# One-off Google Cloud setup, run once in Cloud Shell (signed in as the project owner):
#   1. enables the APIs Firebase Hosting + keyless GitHub deploys need
#   2. creates the Hosting sites nikash (nikash.web.app) and nikashb1 (nikashb1.web.app)
#   3. creates a deploy-only service account and a Workload Identity Federation
#      provider that trusts ONLY this GitHub repository (no JSON keys anywhere)
set -uo pipefail

PROJECT_ID="nikash-website-938bc"
REPO_ID="1472944372" # GitHub numeric id of NikashBaboolal/Personal-Website
SA_NAME="github-deployer"
POOL="github"
PROVIDER="github"

gcloud config set project "$PROJECT_ID"
PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud services enable firebasehosting.googleapis.com firebase.googleapis.com \
  iam.googleapis.com iamcredentials.googleapis.com sts.googleapis.com \
  cloudresourcemanager.googleapis.com serviceusage.googleapis.com

TOKEN="$(gcloud auth print-access-token)"
for SITE in nikash nikashb1; do
  echo "--- site ${SITE}"
  curl -sS -X POST \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "x-goog-user-project: ${PROJECT_ID}" \
    -H "Content-Type: application/json" -d '{}' \
    "https://firebasehosting.googleapis.com/v1beta1/projects/${PROJECT_ID}/sites?siteId=${SITE}"
  echo
done

gcloud iam service-accounts create "$SA_NAME" --display-name="GitHub Actions Firebase Hosting deployer" || true
for ROLE in roles/firebasehosting.admin roles/serviceusage.serviceUsageConsumer roles/firebase.viewer; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${SA_EMAIL}" --role="$ROLE" --condition=None >/dev/null && echo "granted $ROLE"
done

gcloud iam workload-identity-pools create "$POOL" --location=global --display-name="GitHub Actions" || true
gcloud iam workload-identity-pools providers create-oidc "$PROVIDER" \
  --location=global --workload-identity-pool="$POOL" \
  --display-name="GitHub" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository_id=assertion.repository_id,attribute.ref=assertion.ref" \
  --attribute-condition="assertion.repository_id=='${REPO_ID}'" || true

gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL}/attribute.repository_id/${REPO_ID}" >/dev/null \
  && echo "bound workloadIdentityUser"

echo
echo "SETUP DONE"
echo "PROJECT_NUMBER=${PROJECT_NUMBER}"
echo "WIF_PROVIDER=projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL}/providers/${PROVIDER}"
echo "SERVICE_ACCOUNT=${SA_EMAIL}"
