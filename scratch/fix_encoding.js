
const fs = require('fs');
const path = 'c:\\PROYECTOS\\DIICZONE_APP\\components\\workstation\\cm\\CMWorkstationLayout.js';

try {
    let data = fs.readFileSync(path);
    let text = data.toString('utf8');

    // Fixing mangled quotes and other characters
    let fixed = text
        .replace(/\\>/g, '">')
        .replace(/\\ /g, '" ')
        .replace(/\\"/g, '"')
        .replace(/\\}/g, '"}')
        .replace(/\\\)/g, '")')
        .replace(/\\\[/g, '"[')
        .replace(/\\\]/g, '"]')
        .replace(/\\</g, '"<')
        .replace(/\\n/g, '\n')
        .replace(/Sincronizaci\?n/g, 'Sincronización')
        .replace(/\?LITE/g, 'ÉLITE')
        .replace(/Configuraci\?n/g, 'Configuración')
        .replace(/Pr\?ximamente/g, 'Próximamente');

    // Also fix the case where backslash was used instead of double quote for attribute values
    // e.g. className=\bg-gradient... -> className="bg-gradient..."
    fixed = fixed.replace(/className=\\([^\s>]+)/g, 'className="$1"');
    
    // More aggressive quote fixing
    fixed = fixed.replace(/=\\([^\s>]+)/g, '="$1"');

    fs.writeFileSync(path, fixed, 'utf8');
    console.log('File recovery attempt 1 complete.');
} catch (err) {
    console.error('Error fixing file:', err);
}
