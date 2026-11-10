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
