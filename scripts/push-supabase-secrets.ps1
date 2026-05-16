# Run once: npx supabase login
# Then: .\scripts\push-supabase-secrets.ps1

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

npx supabase secrets set --env-file supabase/.env.functions --project-ref vqdypjshpoaiodfofazn
Write-Host "Done. Place a test order to verify emails."
