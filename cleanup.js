const fs = require('fs');
const path = require('path');
const glob = require('child_process').execSync;

// Get all .ts and .tsx files
const files = glob('dir /s /b client\\src\\*.ts client\\src\\*.tsx server\\src\\*.ts server\\src\\*.tsx', { cwd: 'c:\\Users\\Nicky\\nexus-gear', encoding: 'utf-8' })
  .split('\n').map(f => f.trim()).filter(f => f);

const patterns = [
  // Remove "// N. " numbered step prefixes but keep rest of comment
  [/\/\/\s*\d+(\.\d+)?\.\s+/g, '// '],
  // Remove "// Step N:" patterns
  [/\/\/\s*Step\s+\d+:\s*/g, '// '],
  // Remove "เข้ามาใช้งาน" / "เข้ามา" at end of import comments
  [/\s+เข้ามา(ใช้งาน)?/g, ''],
  // Remove "เพิ่มบรรทัดนี้" 
  [/\s*,?\s*เพิ่มบรรทัดนี้/g, ''],
  // Remove "เพิ่มตัวนี้"
  [/\s*เพิ่มตัวนี้/g, ''],
  // Remove "← ตรงกับที่ frontend X เรียก"
  [/\s*←\s*ตรงกับที่\s+frontend.*$/gm, ''],
  // Remove "← ที่ frontend X ใช้"
  [/\s*←\s*ที่\s+frontend.*$/gm, ''],
  // Remove "export ให้ X ใช้ได้"
  [/\s*\/\/\s*export ให้.*?ใช้ได้/g, ''],
  // Remove standalone "// แนบ Token" comments
  [/\s*\/\/\s*แนบ Token\s*$/gm, ''],
  // Remove "[AI SUMMARY]" tags
  [/\s*\[AI SUMMARY\]\s*/g, ' '],
  // Remove "(เฉพาะตอน Demo)"
  [/\s*\(เฉพาะตอน Demo\)/g, ''],
  // Remove "// ใช้ instance ที่ attach token อัตโนมัติ"  
  [/\s*\/\/\s*ใช้ instance ที่ attach token อัตโนมัติ/g, ''],
  // Remove "ต้องใส่ตรงนี้ ... ได้"
  [/\s*ต้องใส่ตรงนี้\s+.*?ได้/g, ''],
  // Remove "(ไม่ Hardcode)"
  [/\s*\(ไม่\s*Hardcode\)/g, ''],
  // Remove "เพื่อป้องกันคนไม่มี Token"
  [/\s*เพื่อป้องกันคนไม่มี Token/g, ''],
  // Remove "เพื่อให้ Guard ใช้ตรวจสอบได้"
  [/\s*เพื่อให้ Guard ใช้ตรวจสอบได้/g, ''],
  // Remove "เพื่อป้องกัน TypeORM สร้างเป็น Array"
  [/\s*เพื่อป้องกัน TypeORM สร้างเป็น Array/g, ''],
  // Remove "เพื่อรับคำสั่ง Save จากตัวแม่"
  [/\s*เพื่อรับคำสั่ง\s+\w+\s+จากตัวแม่/g, ''],
  // Remove full-line tutorial comments like "// นำเข้า X"
  [/^\s*\/\/\s*นำเข้า\s+\w+.*\n/gm, ''],
  // Remove "// Inject X"
  [/\s*\/\/\s*Inject\s+\w+\s+เข้ามา.*$/gm, ''],
  // Remove "(เช็ก Path ... นะครับ)" style notes
  [/\s*\/\/\s*⚠️?\s*หมายเหตุ:.*นะครับ\s*$/gm, ''],
  // Remove "// เส้นทางสำหรับ ..."
  [/^\s*\/\/\s*เส้นทางสำหรับ\s+.*$/gm, ''],
  // Remove "// ปล่อยว่างไว้ได้เลยครับ ..."
  [/^\s*\/\/\s*ปล่อยว่างไว้ได้เลยครับ.*$/gm, ''],
  // Remove empty // lines that have nothing after
  [/^(\s*)\/\/\s*$/gm, ''],
  // Clean up multiple blank lines
  [/\n{3,}/g, '\n\n'],
];

let changed = 0;
for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    const original = content;
    for (const [regex, replacement] of patterns) {
      content = content.replace(regex, replacement);
    }
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf-8');
      console.log('Cleaned:', path.basename(file));
      changed++;
    }
  } catch(e) { /* skip */ }
}
console.log(`\nTotal files cleaned: ${changed}`);
