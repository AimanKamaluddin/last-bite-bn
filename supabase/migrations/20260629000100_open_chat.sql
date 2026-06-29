-- Open buyer-to-merchant chat system
-- Buyers can message any merchant profile, and merchants can reply from their inbox.

create table if not exists public.open_chat_threads (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references auth.users(id) on delete cascade,
  merchant_id uuid not null references public.merchants(id) on delete cascade,
  status text not null default 'open' check (status in ('open', 'closed', 'blocked')),
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (buyer_id, merchant_id)
);

create table if not exists public.open_chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.open_chat_threads(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 1000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists open_chat_threads_buyer_idx on public.open_chat_threads (buyer_id, last_message_at desc);
create index if not exists open_chat_threads_merchant_idx on public.open_chat_threads (merchant_id, last_message_at desc);
create index if not exists open_chat_messages_thread_idx on public.open_chat_messages (thread_id, created_at asc);

alter table public.open_chat_threads enable row level security;
alter table public.open_chat_messages enable row level security;

drop policy if exists "Buyers and merchants can view their chat threads" on public.open_chat_threads;
create policy "Buyers and merchants can view their chat threads"
on public.open_chat_threads
for select
using (
  auth.uid() = buyer_id
  or exists (
    select 1 from public.merchants m
    where m.id = open_chat_threads.merchant_id
      and m.user_id = auth.uid()
  )
);

drop policy if exists "Authenticated buyers can start open chats" on public.open_chat_threads;
create policy "Authenticated buyers can start open chats"
on public.open_chat_threads
for insert
with check (
  auth.uid() = buyer_id
  and exists (
    select 1 from public.merchants m
    where m.id = open_chat_threads.merchant_id
      and m.approval_status = 'approved'
  )
);

drop policy if exists "Participants can update their chat thread" on public.open_chat_threads;
create policy "Participants can update their chat thread"
on public.open_chat_threads
for update
using (
  auth.uid() = buyer_id
  or exists (
    select 1 from public.merchants m
    where m.id = open_chat_threads.merchant_id
      and m.user_id = auth.uid()
  )
)
with check (
  auth.uid() = buyer_id
  or exists (
    select 1 from public.merchants m
    where m.id = open_chat_threads.merchant_id
      and m.user_id = auth.uid()
  )
);

drop policy if exists "Participants can view open chat messages" on public.open_chat_messages;
create policy "Participants can view open chat messages"
on public.open_chat_messages
for select
using (
  exists (
    select 1 from public.open_chat_threads t
    where t.id = open_chat_messages.thread_id
      and (
        t.buyer_id = auth.uid()
        or exists (
          select 1 from public.merchants m
          where m.id = t.merchant_id
            and m.user_id = auth.uid()
        )
      )
  )
);

drop policy if exists "Participants can send open chat messages" on public.open_chat_messages;
create policy "Participants can send open chat messages"
on public.open_chat_messages
for insert
with check (
  auth.uid() = sender_id
  and exists (
    select 1 from public.open_chat_threads t
    where t.id = open_chat_messages.thread_id
      and t.status = 'open'
      and (
        t.buyer_id = auth.uid()
        or exists (
          select 1 from public.merchants m
          where m.id = t.merchant_id
            and m.user_id = auth.uid()
        )
      )
  )
);

drop policy if exists "Participants can mark open chat messages read" on public.open_chat_messages;
create policy "Participants can mark open chat messages read"
on public.open_chat_messages
for update
using (
  exists (
    select 1 from public.open_chat_threads t
    where t.id = open_chat_messages.thread_id
      and (
        t.buyer_id = auth.uid()
        or exists (
          select 1 from public.merchants m
          where m.id = t.merchant_id
            and m.user_id = auth.uid()
        )
      )
  )
)
with check (
  exists (
    select 1 from public.open_chat_threads t
    where t.id = open_chat_messages.thread_id
      and (
        t.buyer_id = auth.uid()
        or exists (
          select 1 from public.merchants m
          where m.id = t.merchant_id
            and m.user_id = auth.uid()
        )
      )
  )
);

create or replace function public.touch_open_chat_thread()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.open_chat_threads
  set last_message_at = new.created_at,
      updated_at = now()
  where id = new.thread_id;
  return new;
end;
$$;

drop trigger if exists on_open_chat_message_insert on public.open_chat_messages;
create trigger on_open_chat_message_insert
after insert on public.open_chat_messages
for each row execute function public.touch_open_chat_thread();
