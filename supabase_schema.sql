-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create reviews table
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  author_name text not null,
  rating smallint not null check (rating >= 1 and rating <= 5),
  content text not null,
  source text not null default 'google',
  url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create replies table
create table public.replies (
  id uuid primary key default uuid_generate_v4(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  content text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'published')),
  is_selected boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create indexes for foreign keys (Supabase Best Practice for Performance)
create index idx_replies_review_id on public.replies(review_id);

-- 4. Setup RLS (Row Level Security)
alter table public.reviews enable row level security;
alter table public.replies enable row level security;

-- 5. Create permissive policies for development (Change these before going to production!)
create policy "Enable read access for all users" on public.reviews for select using (true);
create policy "Enable insert access for all users" on public.reviews for insert with check (true);
create policy "Enable update access for all users" on public.reviews for update using (true);

create policy "Enable read access for all users" on public.replies for select using (true);
create policy "Enable insert access for all users" on public.replies for insert with check (true);
create policy "Enable update access for all users" on public.replies for update using (true);

-- 6. Trigger for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_replies_updated_at
  before update on public.replies
  for each row
  execute function public.handle_updated_at();
