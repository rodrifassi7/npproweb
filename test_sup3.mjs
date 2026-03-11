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

const totalItems = 1;
const formData = {
    name: 'Test',
    phone: '123456',
    deliveryType: 'envio',
    address: 'Test 123',
    references: 'ref',
    deliveryDay: 'Lunes',
    paymentMethod: 'MP',
    notes: 'note'
};
const orderNotes = `
WEB ORDER DETALLES:
- Cliente: ${formData.name}
- Tipo Entrega: ${formData.deliveryType}
- Dirección: ${formData.address}
- Referencias: ${formData.references}
- Día: ${formData.deliveryDay}
- Medio Pago: ${formData.paymentMethod}
- Total Items: ${totalItems}
- Notas cliente: ${formData.notes}
`.trim();

const orderData = {
    customer_name: formData.name,
    phone: formData.phone,
    delivery: formData.deliveryType,
    status: 'pending',
    subtotal: 1000,
    total: 1000,
    notes: orderNotes,
    channel: 'web',
    cantidad_viandas: totalItems,
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
