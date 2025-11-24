const fs = require('fs');
const path = require('path');

const files = ['.env.local', '.env'];

files.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        console.log(`Checking ${file}...`);
        const stats = fs.statSync(filePath);
        console.log(`  Size: ${stats.size} bytes`);

        const content = fs.readFileSync(filePath, 'utf8');
        console.log(`  Raw Content Length: ${content.length}`);
        console.log(`  First 50 chars: ${JSON.stringify(content.slice(0, 50))}`);

        const lines = content.split('\n');
        lines.forEach((line, index) => {
            const trimmed = line.trim();
            if (!trimmed) return;
            // Mask values for security
            const parts = trimmed.split('=');
            if (parts.length > 1) {
                console.log(`  Line ${index + 1}: ${parts[0]} = [HIDDEN]`);
            } else {
                console.log(`  Line ${index + 1}: ${trimmed.substring(0, 10)}...`);
            }
        });
    } else {
        console.log(`${file} does not exist.`);
    }
});
