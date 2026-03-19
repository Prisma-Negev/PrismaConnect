alter table "public"."deals" add column "ai_context" text;
alter table "public"."deals" add column "project_type" text;

create policy "Enable ALL for authenticated users only"
on "public"."deals"
as permissive
for all
to authenticated
using (true)
with check (true);
