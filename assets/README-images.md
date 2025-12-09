Place your real product photos here named `product1.jpg` through `product6.jpg`.

Quick automated placeholder download (PowerShell):

```powershell
# run from repository root
New-Item -ItemType Directory -Path .\assets -Force
Invoke-WebRequest -Uri 'https://picsum.photos/seed/akunne1/800/800' -OutFile '.\assets\product1.jpg'
Invoke-WebRequest -Uri 'https://picsum.photos/seed/akunne2/800/800' -OutFile '.\assets\product2.jpg'
Invoke-WebRequest -Uri 'https://picsum.photos/seed/akunne3/800/800' -OutFile '.\assets\product3.jpg'
Invoke-WebRequest -Uri 'https://picsum.photos/seed/akunne4/800/800' -OutFile '.\assets\product4.jpg'
Invoke-WebRequest -Uri 'https://picsum.photos/seed/akunne5/800/800' -OutFile '.\assets\product5.jpg'
Invoke-WebRequest -Uri 'https://picsum.photos/seed/akunne6/800/800' -OutFile '.\assets\product6.jpg'
```

Notes:
- These are royalty-free placeholder images from picsum.photos. Replace them with your own product photos (same filenames) for the final site.
- Recommended sizes: 800×800 or 1200×1200 JPEG, optimized for web (use a tool like `jpegoptim` or an online compressor).
