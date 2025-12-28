# Create Missing Database Tables
# This script creates all the missing tables in your Turso database

Write-Host "Creating missing database tables..." -ForegroundColor Cyan

# Check if .env file exists
if (!(Test-Path ".env")) {
    Write-Host "Error: .env file not found!" -ForegroundColor Red
    Write-Host "Please create a .env file with TURSO_DATABASE_URL and TURSO_AUTH_TOKEN" -ForegroundColor Yellow
    exit 1
}

# Load environment variables
Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]*?)\s*=\s*(.*?)\s*$') {
        $name = $matches[1]
        $value = $matches[2]
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

$TURSO_DATABASE_URL = $env:TURSO_DATABASE_URL
$TURSO_AUTH_TOKEN = $env:TURSO_AUTH_TOKEN

if (!$TURSO_DATABASE_URL -or !$TURSO_AUTH_TOKEN) {
    Write-Host "Error: TURSO_DATABASE_URL or TURSO_AUTH_TOKEN not set in .env file" -ForegroundColor Red
    exit 1
}

Write-Host "Database URL: $TURSO_DATABASE_URL" -ForegroundColor Gray

# Read SQL file
$sqlContent = Get-Content "create-missing-tables.sql" -Raw

# Execute SQL using turso CLI or HTTP API
Write-Host "`nAttempting to create tables..." -ForegroundColor Yellow

# Method 1: Try using turso CLI if installed
$tursoInstalled = Get-Command turso -ErrorAction SilentlyContinue

if ($tursoInstalled) {
    Write-Host "Using Turso CLI..." -ForegroundColor Green
    
    # Extract database name from URL
    $dbName = ($TURSO_DATABASE_URL -split '//')[1].Split('.')[0]
    
    Write-Host "Executing SQL on database: $dbName" -ForegroundColor Gray
    
    # Execute the SQL file
    Get-Content "create-missing-tables.sql" | turso db shell $dbName
    
    Write-Host "`n✓ Tables created successfully!" -ForegroundColor Green
} else {
    Write-Host "Turso CLI not found. Using HTTP API..." -ForegroundColor Yellow
    
    # Method 2: Use HTTP API
    $apiUrl = $TURSO_DATABASE_URL -replace 'libsql://', 'https://'
    $apiUrl = "$apiUrl/v2/pipeline"
    
    # Split SQL into individual statements
    $statements = $sqlContent -split ';' | Where-Object { $_.Trim() -ne '' }
    
    $requestBody = @{
        requests = @(
            $statements | ForEach-Object {
                @{
                    type = "execute"
                    stmt = @{
                        sql = $_.Trim() + ';'
                    }
                }
            }
        )
    } | ConvertTo-Json -Depth 10
    
    $headers = @{
        "Authorization" = "Bearer $TURSO_AUTH_TOKEN"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body $requestBody
        Write-Host "`n✓ Tables created successfully via HTTP API!" -ForegroundColor Green
    } catch {
        Write-Host "`nError creating tables: $_" -ForegroundColor Red
        Write-Host "`nPlease run the SQL manually:" -ForegroundColor Yellow
        Write-Host "1. Install Turso CLI: https://docs.turso.tech/cli/installation" -ForegroundColor Gray
        Write-Host "2. Or copy the SQL from create-missing-tables.sql and run it in your Turso dashboard" -ForegroundColor Gray
        exit 1
    }
}

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Restart your dev server: npm run dev" -ForegroundColor White
Write-Host "2. The missing tables are now created!" -ForegroundColor White
Write-Host "3. You can now access /api/subscriptions/plans and /api/public/properties" -ForegroundColor White
