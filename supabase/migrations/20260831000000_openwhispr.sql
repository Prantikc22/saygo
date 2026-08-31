create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  preferred_language text not null default 'auto',
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.transcripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null check (char_length(text) > 0),
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  language text not null default 'Auto detected',
  model text not null default 'Saygo S1 Voice Engine',
  source text not null default 'microphone',
  created_at timestamptz not null default now()
);
create index if not exists transcripts_user_created_idx on public.transcripts(user_id, created_at desc);

create table if not exists public.dictionary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  phrase text not null,
  pronunciation text,
  created_at timestamptz not null default now(),
  unique(user_id, phrase)
);
create index if not exists dictionary_user_idx on public.dictionary_entries(user_id);

create table if not exists public.customers (
  customer_id text primary key,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists customers_email_idx on public.customers(lower(email));

create table if not exists public.subscriptions (
  subscription_id text primary key,
  customer_id text not null references public.customers(customer_id) on delete cascade,
  subscription_status text not null,
  price_id text not null,
  product_id text not null,
  items jsonb not null default '[]'::jsonb,
  scheduled_change timestamptz,
  next_billed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists subscriptions_customer_idx on public.subscriptions(customer_id);
create index if not exists subscriptions_status_idx on public.subscriptions(subscription_status);

alter table public.profiles enable row level security;
alter table public.transcripts enable row level security;
alter table public.dictionary_entries enable row level security;
alter table public.customers enable row level security;
alter table public.subscriptions enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "transcripts_all_own" on public.transcripts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "dictionary_all_own" on public.dictionary_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "customers_select_own" on public.customers for select using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
create policy "subscriptions_select_own" on public.subscriptions for select using (
  exists (select 1 from public.customers c where c.customer_id = subscriptions.customer_id and lower(c.email) = lower(coalesce(auth.jwt() ->> 'email', '')))
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

grant usage on schema public to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.transcripts to authenticated;
grant select, insert, update, delete on public.dictionary_entries to authenticated;
grant select on public.customers, public.subscriptions to authenticated;
