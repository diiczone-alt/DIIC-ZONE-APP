const fs = require('fs');
const content = fs.readFileSync('app/dashboard/crm/page.js', 'utf8');
let openBraces = 0;
let openParens = 0;
let inComment = false;
let inString = null;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i+1];
    
    if (inComment) {
        if (char === '*' && nextChar === '/') {
            inComment = false;
            i++;
        }
        continue;
    }
    
    if (inString) {
        if (char === inString && content[i-1] !== '\\') {
            inString = null;
        }
        continue;
    }
    
    if (char === '/' && nextChar === '*') {
        inComment = true;
        i++;
        continue;
    }
    
    if (char === '/' && nextChar === '/') {
        // Skip till end of line
        while (i < content.length && content[i] !== '\n') i++;
        continue;
    }
    
    if (char === '"' || char === "'" || char === '`') {
        inString = char;
        continue;
    }
    
    if (char === '{') openBraces++;
    if (char === '}') openBraces--;
    if (char === '(') openParens++;
    if (char === ')') openParens--;
}

console.log(`Open Braces: ${openBraces}`);
console.log(`Open Parens: ${openParens}`);
