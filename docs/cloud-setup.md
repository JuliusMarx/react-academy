# Konten einrichten (Supabase + GitHub-Login)

Lernende können sich optional mit GitHub anmelden. Ihr Lernstand liegt dann zusätzlich in Supabase und ist auf jedem Gerät da. Ein Supabase-Projekt reicht für **beide** Academies (Angular und React): Jede speichert eine eigene Zeile pro Person (`app` = `angular-academy` bzw. `react-academy`), das Konto ist dasselbe.

Solange in `src/app/core/site.ts` unter `cloud` nichts eingetragen ist, ist die Funktion aus: Es gibt keine Kontoseite in der Navigation, und die Datenschutzerklärung erwähnt keine Konten.

## 1. Supabase-Projekt anlegen

1. Auf <https://supabase.com> ein Konto anlegen und **New project** wählen.
2. Region **Central EU (Frankfurt)** wählen (die Datenschutzerklärung nennt Frankfurt).
3. Im Projekt **SQL Editor** öffnen und dieses Skript ausführen:

```sql
-- Lernstand: eine Zeile pro Person und Academy
create table public.progress (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  app text not null check (app in ('angular-academy', 'react-academy')),
  data jsonb not null check (pg_column_size(data) < 500000),
  updated_at timestamptz not null default now(),
  primary key (user_id, app)
);

alter table public.progress enable row level security;

-- Jede Person sieht und ändert nur ihre eigenen Zeilen
create policy "own progress" on public.progress
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.progress to authenticated;

-- updated_at setzt immer die Datenbank (die App vergleicht damit, ob sich etwas geändert hat)
create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger progress_touch before insert or update on public.progress
  for each row execute function public.touch_updated_at();

-- "Konto löschen" auf der Kontoseite: löscht das Konto, der Lernstand fällt per Cascade mit weg
create function public.delete_my_account() returns void
language sql security definer set search_path = '' as $$
  delete from auth.users where id = (select auth.uid());
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
```

## 2. GitHub-OAuth-App anlegen

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. **Application name:** z. B. „Academy“. **Homepage URL:** `https://angular-academy-de.netlify.app`.
3. **Authorization callback URL:** `https://<projekt-ref>.supabase.co/auth/v1/callback` – die genaue Adresse zeigt Supabase unter **Authentication → Sign In / Providers → GitHub**.
4. Nach dem Anlegen **Generate a new client secret** klicken.

## 3. GitHub in Supabase einschalten

1. Supabase → **Authentication → Sign In / Providers → GitHub** aktivieren.
2. **Client ID** und **Client Secret** aus Schritt 2 eintragen und speichern. Das Secret bleibt in Supabase – es kommt nie in den Code.

## 4. Erlaubte Rücksprungadressen

Supabase → **Authentication → URL Configuration**:

- **Site URL:** `https://angular-academy-de.netlify.app`
- **Redirect URLs:**
  - `https://angular-academy-de.netlify.app/**`
  - `https://react-academy-de.netlify.app/**`
  - für lokale Tests: `http://localhost:4200/**`, `http://localhost:4210/**`, `http://localhost:4331/**`, `http://localhost:4330/**`

## 5. Zugangsdaten eintragen

Supabase → **Project Settings → API Keys** (bzw. **Data API**):

- **Project URL**, z. B. `https://abcdefgh.supabase.co`
- **Publishable key** (`sb_publishable_…`; bei älteren Projekten der `anon`-Key)

Beides in **beiden** Repos in `src/app/core/site.ts` unter `cloud` eintragen. Diese Werte sind öffentlich gedacht – die Daten schützt die Row Level Security aus Schritt 1. **Nie** den `secret`- oder `service_role`-Key eintragen.

## So funktioniert der Abgleich

- Der Lernstand bleibt im Browser gespeichert; die Cloud ist eine Kopie (`CloudService` in `src/app/core/cloud.service.ts`).
- Jede Änderung wird nach 2 Sekunden hochgeladen. Beim Öffnen der Seite und wenn der Tab wieder in den Vordergrund kommt, holt die App neuere Stände.
- Hat sich nur die Cloud geändert, übernimmt die App sie unverändert (auch Abwahlen von einem anderen Gerät). Haben sich beide Seiten geändert – oder meldet man sich zum ersten Mal auf einem Gerät an –, werden sie zusammengeführt (`progress-merge.ts`): Erledigtes bleibt erledigt, Notizen werden kombiniert.
- Die Supabase-Bibliothek wird nur geladen, wenn jemand angemeldet ist oder sich anmeldet.

## 6. Statistik und Admin-Dashboard

Ein zweites Skript im **SQL Editor** legt die Zählung der Seitenaufrufe und das Dashboard an (`/de/admin`, nur für Admins sichtbar):

```sql
-- Seitenaufrufe: ohne Cookie und ohne Besucher-Kennung, nur Seite, Sprache, Zeit (+ Konto, wenn angemeldet)
create table public.page_views (
  id uuid primary key default gen_random_uuid(),
  app text not null check (app in ('angular-academy', 'react-academy')),
  path text not null check (char_length(path) <= 200),
  lang text check (lang in ('de', 'en')),
  user_id uuid default auth.uid() references auth.users (id) on delete set null,
  signed_in boolean generated always as (user_id is not null) stored,
  created_at timestamptz not null default now()
);
create index page_views_app_created on public.page_views (app, created_at);

alter table public.page_views enable row level security;

-- Jeder darf einen Aufruf eintragen, aber nur für sich selbst (oder anonym) – lesen darf niemand direkt
create policy "record own views" on public.page_views
  for insert to anon, authenticated
  with check (user_id is not distinct from (select auth.uid()));
grant insert on public.page_views to anon, authenticated;

-- Admins: nur hier im SQL Editor pflegbar, nicht über die App
create table public.admins (user_id uuid primary key references auth.users (id) on delete cascade);
alter table public.admins enable row level security;

create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Zahlen fürs Dashboard (nur für Admins)
create function public.admin_stats(p_app text, p_days int default 30) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  since timestamptz := date_trunc('day', now()) - make_interval(days => p_days - 1);
begin
  if not public.is_admin() then
    raise exception 'admins only' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'views', (
      select jsonb_build_object(
        'total', count(*),
        'signedIn', count(*) filter (where signed_in),
        'anonymous', count(*) filter (where not signed_in),
        'today', count(*) filter (where created_at >= date_trunc('day', now())))
      from public.page_views where app = p_app and created_at >= since),
    'daily', (
      select coalesce(jsonb_agg(jsonb_build_object(
          'day', to_char(d.day, 'YYYY-MM-DD'), 'signedIn', d.signed_in, 'anonymous', d.anonymous) order by d.day), '[]')
      from (
        select day,
          count(v.id) filter (where v.signed_in) as signed_in,
          count(v.id) filter (where not v.signed_in) as anonymous
        from generate_series(since, date_trunc('day', now()), interval '1 day') as day
        left join public.page_views v
          on v.app = p_app and v.created_at >= day and v.created_at < day + interval '1 day'
        group by day) d),
    'topPages', (
      select coalesce(jsonb_agg(jsonb_build_object('path', t.path, 'views', t.views) order by t.views desc), '[]')
      from (
        select path, count(*) as views from public.page_views
        where app = p_app and created_at >= since
        group by path order by views desc limit 15) t),
    'activeUsers', (
      select count(distinct user_id) from public.page_views
      where app = p_app and created_at >= since and user_id is not null),
    'users', (
      select jsonb_build_object(
        'total', count(*),
        'new', count(*) filter (where created_at >= since),
        'activeWeek', count(*) filter (where last_sign_in_at >= now() - interval '7 days'),
        'github', count(*) filter (where raw_app_meta_data -> 'providers' ? 'github'),
        'email', count(*) filter (where raw_app_meta_data -> 'providers' ? 'email'))
      from auth.users),
    'learners', (
      select jsonb_build_object(
        'withProgress', count(*),
        'completedLessons', coalesce(sum(jsonb_array_length(data -> 'completedLessons')), 0),
        'certificates', count(*) filter (where data ? 'certificate'))
      from public.progress where app = p_app));
end $$;
revoke execute on function public.admin_stats(text, int) from public, anon;
grant execute on function public.admin_stats(text, int) to authenticated;
```

Dann dich selbst zum Admin machen. Die ID steht unter **Authentication → Users** bei deinem Konto:

```sql
insert into public.admins (user_id) values ('<deine-user-id>');
```

Aufrufe von `localhost` zählen nicht. Zum Ausprobieren lokal im Browser `localStorage.setItem('<prefix>.track-local', '1')` setzen (`<prefix>` = `angular-academy` bzw. `react-academy`).

## 7. E-Mails (Bestätigung, Passwort vergessen)

Ohne eigenen Mailserver schickt Supabase E-Mails **nur an Mitglieder deines Supabase-Teams** und nur wenige pro Stunde. Ohne SMTP: unter **Authentication → Sign In / Providers → Email** „Confirm email“ ausschalten und in `site.ts` `cloud.emails: false` lassen (blendet „Passwort vergessen?“ aus). Mit SMTP: unter **Authentication → Emails → SMTP Settings** einen SMTP-Zugang eintragen (z. B. Brevo, kostenlos bis 300 Mails am Tag; Absender-Adresse dort bestätigen; ohne eigene Domain besser den SMTP-Server des eigenen Mail-Anbieters) und `cloud.emails: true` setzen. Die Vorlagen unter **Authentication → Emails → Templates** kann man auf Deutsch übersetzen.
