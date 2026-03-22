# Cleanup AI-style comments from source files
$files = Get-ChildItem -Path "c:\Users\Nicky\nexus-gear\client\src","c:\Users\Nicky\nexus-gear\server\src" -Recurse -Include *.ts,*.tsx

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $original = $content

    # Remove leading numbered prefixes like "// 1. ", "// 3.1 ", "// 4. " but keep the description
    $content = $content -replace '(//\s*)\d+(\.\d+)?\.\s+', '$1'

    # Remove "Step N:" patterns
    $content = $content -replace '(//\s*)Step\s+\d+:\s*', '$1'

    # Remove phrases like "นำเข้า X เข้ามา", "Import X เข้ามา"
    $content = $content -replace ' เข้ามา(ใช้งาน)?', ''

    # Remove "เพิ่มบรรทัดนี้" / "เพิ่มตัวนี้"
    $content = $content -replace '\s*เพิ่มบรรทัดนี้\s*', ''
    $content = $content -replace '\s*เพิ่มตัวนี้\s*', ''

    # Remove "(เช็ก Path โฟลเดอร์ auth ของคุณให้ตรงด้วยนะครับ)"
    $content = $content -replace '\s*\(เช็ก?\s*Path.*?นะครับ\)', ''

    # Remove "หมายเหตุ: ถ้าในไฟล์..." style long notes
    $content = $content -replace '//\s*หมายเหตุ:.*?นะครับ\s*\r?\n', ''

    # Remove "ที่ frontend X ใช้" / "ที่ frontend X เรียก"
    $content = $content -replace '\s*<-\s*ตรงกับที่\s+frontend.*', ''
    $content = $content -replace '\s*<-\s*ที่\s+frontend.*', ''

    # Remove "ต้องใส่ตรงนี้ ... ถึงจะ..."
    $content = $content -replace '\s*ต้องใส่ตรงนี้\s+.*?ได้', ''

    # Remove " (ไม่ Hardcode)" style parenthetical
    $content = $content -replace '\s*\(ไม่\s*Hardcode\)', ''

    # Remove "เพื่อ..." tutorial explanations at end of comments
    $content = $content -replace '\s+เพื่อรับคำสั่ง\s+\w+\s+จากตัวแม่', ''
    $content = $content -replace '\s+เพื่อป้องกันคนไม่มี Token', ''
    $content = $content -replace '\s+เพื่อให้ Guard ใช้ตรวจสอบได้', ''
    $content = $content -replace '\s+เพื่อป้องกัน TypeORM สร้างเป็น Array', ''

    # Remove "export ให้ X ใช้ได้"
    $content = $content -replace '\s*export ให้.*?ใช้ได้', ''

    # Clean up "แนบ Token" standalone comments
    $content = $content -replace '\s*//\s*แนบ Token\s*$', '' 

    # Remove "[AI SUMMARY]" tags
    $content = $content -replace '\s*\[AI SUMMARY\]\s*', ' '

    # Remove "(เฉพาะตอน Demo)" 
    $content = $content -replace '\s*\(เฉพาะตอน Demo\)', ''

    # Remove "ให้ตรงกับเงื่อนไข Backend" 
    $content = $content -replace '\s*\(ให้ตรงกับเงื่อนไข Backend\)', ''

    # Remove "// แก้จาก X เป็น Y เพื่อ..." 
    $content = $content -replace '//\s*แก้จาก\s+\S+\s+เป็น\s+\S+\s+เพื่อ.*', '//'

    # Remove "(เอาเวลาปัจจุบันไปเทียบ)"
    $content = $content -replace '\s*\(เอาเวลาปัจจุบันไปเทียบ\)', ''

    # Clean "// ใช้ instance ที่ attach token อัตโนมัติ"
    $content = $content -replace '\s*//\s*ใช้ instance ที่ attach token อัตโนมัติ', ''

    # Remove empty comments "// " at end of lines
    $content = $content -replace '\s*//\s*$', ''

    if ($content -ne $original) {
        Set-Content $file.FullName $content -Encoding UTF8 -NoNewline
        Write-Host "Cleaned: $($file.FullName)"
    }
}

Write-Host "Done!"
