import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Read .env.local dynamically to prevent hardcoding secrets in Git
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (!fs.existsSync(envLocalPath)) {
    console.error('❌ Error: .env.local file not found. Make sure to run this script from the project root.');
    process.exit(1);
}

console.log('📖 Reading variables from .env.local...');
const envContent = fs.readFileSync(envLocalPath, 'utf8');
const lines = envContent.split(/\r?\n/);
const variables = [];

for (const line of lines) {
    const trimmed = line.trim();
    // Ignore empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const parts = trimmed.split('=');
    if (parts.length >= 2) {
        const name = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        // Remove surrounding quotes if they exist
        const cleanValue = value.replace(/^["']|["']$/g, '');
        
        // Skip NextAuth URL or local specific configurations if desired, 
        // but generally we want to sync them.
        variables.push({ name, value: cleanValue });
    }
}

const envs = ['production', 'preview', 'development'];

console.log('🚀 Starting Vercel Environment Variables Sync...');

for (const varDef of variables) {
    for (const env of envs) {
        console.log(`Adding ${varDef.name} to ${env}...`);
        try {
            // We use --force to overwrite if exists
            const cmd = `npx vercel env add ${varDef.name} ${env} --value "${varDef.value}" --yes --force`;
            execSync(cmd, { encoding: 'utf-8', stdio: 'pipe' });
            console.log(`✅ Success for ${varDef.name} in ${env}`);
        } catch (error) {
            console.error(`❌ Error adding ${varDef.name} to ${env}:`, error.stderr || error.message);
        }
    }
}

console.log('🚀 Triggering Vercel Redeployment...');
try {
    execSync('npx vercel --prod --yes', { encoding: 'utf-8', stdio: 'inherit' });
    console.log('✅ Deployment triggered successfully!');
} catch (error) {
    console.error('❌ Deployment trigger failed:', error.message);
}

console.log('🎉 All tasks completed!');

