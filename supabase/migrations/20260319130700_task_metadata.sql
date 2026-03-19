alter table "public"."tasks" add column "deal_id" uuid references public.deals(id) on delete cascade;
alter table "public"."tasks" add column "note" text;
alter table "public"."tasks" add column "completed" boolean default false;
