import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const orderData = {
        customer_name: "Test Name",
        customer_phone: "123456789",
        delivery_type: "envio",
        address: "Test Address",
        references: "Test Refs",
        delivery_day: "Lunes",
        payment_method: "Efectivo",
        notes: "Test notes",
        items: [{ id: 'm1', quantity: 1 }], 
        subtotal: 1000,
        total: 1000,
        delivery_cost: 0, 
        coupon_code: null,
        discount_amount: 0,
        discount_percent: 0,
    };

    const { data, error } = await supabase.from('orders').insert([orderData]);
    if (error) {
        console.error("Error inserting order:");
        console.error(JSON.stringify(error, null, 2));
    } else {
        console.log("Success:", data);
    }
}

test();
