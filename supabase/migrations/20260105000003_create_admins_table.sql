-- Create a table for admins
create table public.admins (
  id uuid not null references auth.users(id) on delete cascade primary key,
  email text,
  is_approved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.admins enable row level security;

-- Create policies
create policy "Admins are viewable by everyone"
  on public.admins for select
  using ( true );

create policy "Users can insert their own admin profile"
  on public.admins for insert
  with check ( auth.uid() = id );

create policy "Users can update own admin profile"
  on public.admins for update
  using ( auth.uid() = id );

-- Create a trigger to automatically create an admin entry for new users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.admins (id, email, is_approved)
  values (new.id, new.email, false);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
