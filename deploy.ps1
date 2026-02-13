# Bible Fun - Bump version and deploy to GitHub (for GitHub Pages)
# Run from project root (BibleFun-main).
#
# Usage:
#   .\deploy.ps1              Deploy current files (commit + push), keep version as in VERSION
#   .\deploy.ps1 1.8.1        Set version to 1.8.1, update index.html, then commit + push

param(
    [Parameter(Position = 0)]
    [string]$NewVersion = ""
)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }

$versionFile = Join-Path $root "VERSION"
$indexPath   = Join-Path $root "index.html"

# Ensure VERSION exists
if (-not (Test-Path $versionFile)) {
    "1.8.0" | Set-Content $versionFile -NoNewline
}

# Optional: set new version
if ($NewVersion -ne "") {
    $NewVersion = $NewVersion.Trim()
    if ($NewVersion -notmatch '^\d+\.\d+\.\d+') {
        Write-Host "Version should be like 1.8.1 (major.minor.patch)"
        exit 1
    }
    $NewVersion | Set-Content $versionFile -NoNewline
    Write-Host "Set VERSION to $NewVersion"
    # Update title in index.html
    $indexContent = Get-Content $indexPath -Raw
    $indexContent = $indexContent -replace '<title>Bible Fun - v[\d.]+</title>', "<title>Bible Fun - v$NewVersion</title>"
    Set-Content $indexPath $indexContent -NoNewline
    Write-Host "Updated index.html title to v$NewVersion"
}

$version = (Get-Content $versionFile -Raw).Trim()
Write-Host "Deploying version $version"

# Git
$branch = git rev-parse --abbrev-ref HEAD 2>$null
if (-not $branch) {
    Write-Host "Not a git repo. Run: git init && git remote add origin <your-repo-url>"
    exit 1
}

git add -A
$status = git status --short
if (-not $status) {
    Write-Host "Nothing to commit (working tree clean)."
    exit 0
}

git commit -m "Release v$version"
git push origin $branch
Write-Host "Pushed to origin/$branch — GitHub Pages will update shortly."
