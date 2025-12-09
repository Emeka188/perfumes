# Download placeholder product images into the assets/ folder
# Run this from the repository root in PowerShell (Windows) if you want placeholder JPGs.

$dest = Join-Path -Path $PSScriptRoot -ChildPath ".\"

Invoke-WebRequest -Uri 'https://picsum.photos/seed/akunne1/800/800' -OutFile "$dest\product1.jpg"
Invoke-WebRequest -Uri 'https://picsum.photos/seed/akunne2/800/800' -OutFile "$dest\product2.jpg"
Invoke-WebRequest -Uri 'https://picsum.photos/seed/akunne3/800/800' -OutFile "$dest\product3.jpg"
Invoke-WebRequest -Uri 'https://picsum.photos/seed/akunne4/800/800' -OutFile "$dest\product4.jpg"
Invoke-WebRequest -Uri 'https://picsum.photos/seed/akunne5/800/800' -OutFile "$dest\product5.jpg"
Invoke-WebRequest -Uri 'https://picsum.photos/seed/akunne6/800/800' -OutFile "$dest\product6.jpg"

Write-Output "Downloaded placeholders to $dest"
