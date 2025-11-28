
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Ingredients Table
create table if not exists ingredients (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  unit text not null check (unit in ('kg', 'l', 'un')),
  price numeric not null,
  quantity numeric not null,
  price_per_base_unit numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Products Table
create table if not exists products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  labor_cost numeric not null default 0,
  packaging_cost numeric not null default 0,
  profit_margin numeric not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Product Ingredients Junction Table
create table if not exists product_ingredients (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade not null,
  ingredient_id uuid references ingredients(id) on delete restrict not null,
  quantity_used numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Fixed Costs Table
create table if not exists fixed_costs (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  value numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Settings Table (for estimated monthly sales)
create table if not exists settings (
  key text primary key,
  value text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default setting for estimated monthly sales if not exists
insert into settings (key, value)
values ('estimated_monthly_sales', '1000')
on conflict (key) do nothing;

-- Enable Row Level Security (RLS)
alter table ingredients enable row level security;
alter table products enable row level security;
alter table product_ingredients enable row level security;
alter table fixed_costs enable row level security;
alter table settings enable row level security;

-- Create policies to allow public access (since we are using anon key for everything for now)
-- In a real production app with auth, we would restrict this to authenticated users.
create policy "Public Access Ingredients" on ingredients for all using (true);
create policy "Public Access Products" on products for all using (true);
create policy "Public Access Product Ingredients" on product_ingredients for all using (true);
create policy "Public Access Fixed Costs" on fixed_costs for all using (true);
create policy "Public Access Settings" on settings for all using (true);
