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

const orderData = {
    customer_name: "Test Name",
    phone: "123456",
    delivery: true, // boolean!
    status: 'pending',
    subtotal: 1000,
    total: 1000,
    notes: "test notes",
    channel: 'web',
    cantidad_viandas: 1,
    coupon_code: null,
    discount_amount: 0,
    discount_percent: 0,
};

async function test() {
    console.log("Sending to: " + supabaseUrl);
    const res = await fetch(`${supabaseUrl}/rest/v1/orders`, {
        method: 'POST',
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(orderData)
    });
    const result = await res.text();
    console.log(result);
}

test();
