@echo off
REM One-off Google Cloud setup for the personal website (Windows cmd, gcloud signed in as the project owner).
REM Creates a deploy-only service account and a keyless Workload Identity Federation link
REM that trusts ONLY the GitHub repo NikashBaboolal/Personal-Website (repo id 1472944372).
REM The Firebase Hosting sites themselves (nikash, nikashb1) are created by the GitHub Actions workflow.
setlocal
set PROJECT_ID=nikash-website-938bc
set REPO_ID=1472944372
set SA_EMAIL=github-deployer@%PROJECT_ID%.iam.gserviceaccount.com

call gcloud config set project %PROJECT_ID%
call gcloud services enable firebasehosting.googleapis.com firebase.googleapis.com iam.googleapis.com iamcredentials.googleapis.com sts.googleapis.com cloudresourcemanager.googleapis.com serviceusage.googleapis.com
call gcloud iam service-accounts create github-deployer --display-name="GitHub Actions Firebase Hosting deployer"
for %%R in (roles/firebasehosting.admin roles/serviceusage.serviceUsageConsumer roles/firebase.viewer) do (
  call gcloud projects add-iam-policy-binding %PROJECT_ID% --member="serviceAccount:%SA_EMAIL%" --role="%%R" --condition=None --quiet >nul && echo granted %%R
)
call gcloud iam workload-identity-pools create github --location=global --display-name="GitHub Actions"
call gcloud iam workload-identity-pools providers create-oidc github --location=global --workload-identity-pool=github --display-name="GitHub" --issuer-uri="https://token.actions.githubusercontent.com" --attribute-mapping="google.subject=assertion.sub,attribute.repository_id=assertion.repository_id,attribute.ref=assertion.ref" --attribute-condition="assertion.repository_id=='%REPO_ID%'"
for /f %%N in ('gcloud projects describe %PROJECT_ID% --format^="value(projectNumber)"') do set PROJECT_NUMBER=%%N
call gcloud iam service-accounts add-iam-policy-binding %SA_EMAIL% --role=roles/iam.workloadIdentityUser --member="principalSet://iam.googleapis.com/projects/%PROJECT_NUMBER%/locations/global/workloadIdentityPools/github/attribute.repository_id/%REPO_ID%" --quiet >nul && echo bound workloadIdentityUser

echo.
echo ==== SETUP DONE ====
echo PROJECT_NUMBER=%PROJECT_NUMBER%
endlocal
