import fs from 'fs';

const envText = fs.readFileSync('.env', 'utf-8');
const env = envText.split('\n').reduce((acc, line) => {
    const [key, ...rest] = line.split('=');
    const val = rest.join('=');
    if (key && val) acc[key.trim()] = val.trim();
    return acc;
}, {});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

async function test() {
    const res = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`);
    const result = await res.json();
    if(result && result.paths) {
        const rpcs = Object.keys(result.paths).filter(p => p.startsWith('/rpc/'));
        console.log("RPCs available:", rpcs);
    }
}

test();
