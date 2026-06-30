-- Cancel a customer's reserved order and return its reserved quantity to listing stock.
-- This runs in one database transaction, locks the order row, and prevents double refill.
create or replace function public.cancel_order_and_restore_stock(p_order_id uuid)
returns table (
  id uuid,
  listing_id uuid,
  quantity integer,
  status text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order record;
begin
  select o.id, o.listing_id, o.quantity, o.status, o.user_id
  into v_order
  from public.orders o
  where o.id = p_order_id
  for update;

  if not found then
    raise exception 'Order not found';
  end if;

  if v_order.user_id <> auth.uid() then
    raise exception 'You can only cancel your own order';
  end if;

  if v_order.status <> 'reserved' then
    raise exception 'Only reserved orders can be cancelled by the customer';
  end if;

  update public.orders
  set status = 'cancelled', updated_at = now()
  where orders.id = p_order_id;

  update public.listings
  set quantity_available = quantity_available + v_order.quantity,
      updated_at = now()
  where listings.id = v_order.listing_id;

  return query
  select v_order.id, v_order.listing_id, v_order.quantity, 'cancelled'::text;
end;
$$;

grant execute on function public.cancel_order_and_restore_stock(uuid) to authenticated;
