create table "public"."users" (
    "id" uuid not null default uuid_generate_v4(),
    "email" varchar,
    "phone" text,
    "name" text,
    "picture_url" text,
    "metadata" jsonb,
    "created_at" timestamp(6) with time zone not null default now(),
    "updated_at" timestamp(6) with time zone not null default now()
);

alter table "public"."users" enable row level security;


-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, phone, name, picture_url, metadata)
  values (new.id, new.email, new.phone, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data::jsonb);
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table "public"."organizations" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text,
    "domain" text,
    "has_completed_onboarding" boolean not null default false,
    "completed_onboarding_at" timestamp(6) with time zone,
    "allows_email_domain_signup" boolean not null default false,
    "created_at" timestamp(6) with time zone default now(),
    "updated_at" timestamp(6) with time zone default now()
);


alter table "public"."organizations" enable row level security;


create table "public"."users_organizations" (
    "user_id" uuid not null,
    "organization_id" uuid not null,
    "created_at" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp(6) with time zone not null default CURRENT_TIMESTAMP
);


alter table "public"."users_organizations" enable row level security;


CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX organizations_pkey ON public.organizations USING btree (id);

CREATE UNIQUE INDEX users_organizations_pkey ON public.users_organizations USING btree (user_id, organization_id);

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."users_organizations" add constraint "users_organizations_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."users_organizations" validate constraint "users_organizations_organization_id_fkey";

alter table "public"."users_organizations" add constraint "users_organizations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."users_organizations" validate constraint "users_organizations_user_id_fkey";