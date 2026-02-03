-- 1. Create coupons table
create table if not exists public.coupons (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  discount_type text check (discount_type in ('percent', 'fixed')) not null,
  discount_value numeric not null check (discount_value > 0),
  active boolean default true,
  starts_at timestamptz,
  expires_at timestamptz,
  max_redemptions integer check (max_redemptions is null or max_redemptions > 0),
  redemptions_count integer default 0 check (redemptions_count >= 0),
  per_customer_limit integer default 1 check (per_customer_limit > 0),
  notes text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.coupons enable row level security;

-- RLS Policy: Allow anyone to read coupons (or restrict to secure function only if preferred, but usually reading metadata ok)
-- Better: Use a secure function to validate, but for Admin we need read access.
create policy "Enable read access for authenticated users (Admin)" 
on public.coupons for select 
to authenticated 
using (true);

-- 2. Add columns to EXISTING orders table
-- Assumes table 'orders' exists. If not, create it.
-- We use 'alter table' inside a do block to avoid errors if columns exist, or just direct alter.

alter table public.orders 
add column if not exists coupon_code text,
add column if not exists discount_amount numeric default 0,
add column if not exists discount_percent numeric default 0;

-- 3. Database Function to Validate Coupon
create or replace function public.validate_coupon(input_code text, input_phone text default null)
returns json
language plpgsql
security definer
as $$
declare
  coupon_record record;
  usage_count integer;
begin
  select * from public.coupons 
  where code = upper(trim(input_code))
  into coupon_record;

  if coupon_record.id is null then
    return json_build_object('valid', false, 'message', 'Cupón no existe');
  end if;

  if coupon_record.active = false then
    return json_build_object('valid', false, 'message', 'Cupón inactivo');
  end if;

  if coupon_record.expires_at is not null and coupon_record.expires_at < now() then
    return json_build_object('valid', false, 'message', 'Cupón expirado');
  end if;

  if coupon_record.max_redemptions is not null and coupon_record.redemptions_count >= coupon_record.max_redemptions then
    return json_build_object('valid', false, 'message', 'Cupón agotado');
  end if;

  -- Check per_customer_limit
  if input_phone is not null and coupon_record.per_customer_limit is not null then
    select count(*) into usage_count 
    from public.orders 
    where coupon_code = coupon_record.code 
    and customer_phone = input_phone;

    if usage_count >= coupon_record.per_customer_limit then
       return json_build_object('valid', false, 'message', 'Límite de uso alcanzado');
    end if;
  end if;

  -- Return success with coupon details
  return json_build_object(
    'valid', true, 
    'message', 'Cupón válido',
    'percent', coupon_record.discount_value,
    'code', coupon_record.code
  );
end;
$$;
