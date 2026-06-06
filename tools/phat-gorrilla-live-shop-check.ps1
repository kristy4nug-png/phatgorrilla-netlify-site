param(
    [string]$BrandUrl = 'https://phatgorrilla.com',
    [string]$ShopHost = 'shop.phatgorrilla.com',
    [string]$LocalAdminUrl = 'http://localhost:8090/wp-admin',
    [switch]$NoOpen
)

$ErrorActionPreference = 'Continue'

function Write-Status {
    param(
        [string]$Label,
        [string]$Status,
        [string]$Detail = ''
    )

    $line = "{0,-28} {1}" -f $Label, $Status
    if ($Detail) {
        $line = "$line - $Detail"
    }
    Write-Host $line
}

$shopUrl = "https://$ShopHost"

Write-Host ''
Write-Host 'Phat Gorrilla live shop check'
Write-Host '================================'
Write-Host "Brand site: $BrandUrl"
Write-Host "Shop site:  $shopUrl"
Write-Host "Local WP:   $LocalAdminUrl"
Write-Host ''

try {
    $dns = Resolve-DnsName -Name $ShopHost -ErrorAction Stop
    $records = $dns | Where-Object { $_.Type -in @('A', 'AAAA', 'CNAME') }
    if ($records) {
        $summary = ($records | ForEach-Object {
            if ($_.Type -eq 'CNAME') { "CNAME=$($_.NameHost)" } else { "$($_.Type)=$($_.IPAddress)" }
        }) -join ', '
        Write-Status 'DNS' 'OK' $summary
    } else {
        Write-Status 'DNS' 'WARN' 'No A, AAAA or CNAME records found.'
    }
} catch {
    Write-Status 'DNS' 'FAIL' $_.Exception.Message
}

try {
    $tcp = Test-NetConnection -ComputerName $ShopHost -Port 443 -InformationLevel Quiet
    if ($tcp) {
        Write-Status 'HTTPS port 443' 'OK' 'TCP connection succeeded.'
    } else {
        Write-Status 'HTTPS port 443' 'FAIL' 'TCP connection failed.'
    }
} catch {
    Write-Status 'HTTPS port 443' 'FAIL' $_.Exception.Message
}

foreach ($url in @($BrandUrl, $shopUrl, $LocalAdminUrl)) {
    try {
        $response = Invoke-WebRequest -Uri $url -Method Get -UseBasicParsing -TimeoutSec 15 -MaximumRedirection 5 -ErrorAction Stop
        Write-Status $url 'OK' "HTTP $($response.StatusCode)"
    } catch {
        $message = $_.Exception.Message
        if (-not $message) {
            $message = 'Request failed without a detailed response.'
        }
        Write-Status $url 'WARN' $message
    }
}

if (-not $NoOpen) {
    Start-Process $BrandUrl
    Start-Process $shopUrl
    Start-Process $LocalAdminUrl
    Write-Host ''
    Write-Host 'Opened brand site, shop target and local WooCommerce admin in your browser.'
} else {
    Write-Host ''
    Write-Host 'NoOpen was set, so no browser tabs were opened.'
}

Write-Host ''
Write-Host 'Done. No secrets were used and no changes were made.'
