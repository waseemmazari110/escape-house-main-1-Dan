# Setup Node.js environment for VS Code terminal
Write-Host "Searching for Node.js installations..." -ForegroundColor Cyan

$nodeAvailable = Get-Command node -ErrorAction SilentlyContinue
if ($nodeAvailable) {
    Write-Host "Node.js is already available: $($nodeAvailable.Source)" -ForegroundColor Green
    node -v
    npm -v
    exit 0
}

$nodePaths = @(
    "C:\Program Files\nodejs",
    "C:\Program Files (x86)\nodejs",
    "${env:LOCALAPPDATA}\Programs\nodejs"
)

$nvmPaths = @(
    "C:\ProgramData\nvm",
    "${env:APPDATA}\nvm"
)

$nvmRoot = $null
foreach ($path in $nvmPaths) {
    if ($path -and (Test-Path $path)) {
        Write-Host "Found nvm directory: $path" -ForegroundColor Yellow
        $nvmRoot = $path
        break
    }
}

if ($nvmRoot) {
    Write-Host "Scanning for nvm Node versions..." -ForegroundColor Cyan
    $versions = Get-ChildItem $nvmRoot -Directory -Filter "v*" -ErrorAction SilentlyContinue
    $preferred = $versions | Where-Object { $_.Name -match "v(18|20)\." } | Select-Object -First 1
    
    if ($preferred) {
        $nodePath = $preferred.FullName
        Write-Host "Found Node version: $($preferred.Name)" -ForegroundColor Green
        $env:PATH = "$nodePath;$env:PATH"
    } elseif ($versions.Count -gt 0) {
        $nodePath = $versions[0].FullName
        Write-Host "Using Node version: $($versions[0].Name)" -ForegroundColor Yellow
        $env:PATH = "$nodePath;$env:PATH"
    }
}

foreach ($path in $nodePaths) {
    if (Test-Path "$path\node.exe") {
        Write-Host "Found Node.js at: $path" -ForegroundColor Green
        $env:PATH = "$path;$env:PATH"
        break
    }
}

$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCheck) {
    Write-Host "Node.js successfully configured!" -ForegroundColor Green
    node -v
    npm -v
    exit 0
} else {
    Write-Host "Could not locate Node.js installation" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/ (v20.x LTS recommended)" -ForegroundColor Yellow
    Write-Host "After installation, restart VS Code." -ForegroundColor Yellow
    exit 1
}
