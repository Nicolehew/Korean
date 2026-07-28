# Hangeul Quest

Gamified Korean learning app — level map, unlock-gated units, student/parent/teacher
dashboards. Next.js 16 (App Router) + Tailwind v4 + Supabase + Vercel.

"Hangeul Quest" and the current color palette are placeholders — swap in your
school's branding whenever you're ready (`src/app/layout.tsx`, `src/app/manifest.ts`,
`src/app/globals.css`, `public/icons/`).

## 1. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com) (or via the Supabase MCP
   tools if you're driving this from Claude Code).
2. In the SQL editor, run every file in `supabase/migrations/` **in numeric order**
   (0001 through 0005) — they build on each other (0001 creates the schema, 0002-0005
   harden functions/RLS/indexes based on Supabase's own advisor output and fix a
   real bug in the signup trigger). Running only 0001 will leave a broken
   `handle_new_user` trigger that fails on every signup.
3. From Project Settings → API, copy the Project URL and anon public key.

## 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. For seeding
(step 3), also fill in `SUPABASE_SERVICE_ROLE_KEY` from the same API settings page —
**never commit this key or expose it to the browser.**

Without `.env.local`, the app still boots — the landing/login/signup pages render,
but anything requiring auth redirects to `/login` and won't do anything useful until
Supabase is wired up.

## 3. Seed the curriculum

```bash
npm install
npm run seed
```

This loads the draft curriculum in `scripts/content.ts` (Beginner level fully built
out across 5 units, one sample unit each for Elementary through Advanced) into your
database. Edit `scripts/content.ts` directly to add real lesson content, then re-run
`npm run seed` (it only inserts, so start from an empty database or clear the content
tables first if re-seeding).

## 4. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`. Sign up as a Student to try the learning loop, or as
a Parent (parent accounts see nothing until linked to a student — see below).

## Known gaps to fill in before this is production-ready

- **Teacher/admin accounts**: self-signup only ever creates `student` or `parent`
  roles (see `handle_new_user` in the migration and `src/lib/actions/auth.ts`) —
  letting anyone grant themselves `teacher` via a public form would be a real
  privilege-escalation hole. Promote a user manually for now:
  `update profiles set role = 'teacher' where id = '<user-id>';`
- **Linking parents to students**: `parent_student_links` has no UI yet. Insert rows
  directly, or build an invite-code flow (student generates a code, parent enters it).
- **Classes/rosters**: same story — `classes` and `class_students` are managed via
  SQL editor until a class-creation UI exists.
- **Achievements**: the `achievements`/`user_achievements` tables exist and the
  Rewards page reads them, but nothing awards them yet. Add a check (e.g. in
  `submitLessonResult`, `src/lib/actions/progress.ts`) for milestones like "7-day
  streak" or "first unit completed."
- **Matching exercises**: rendered as sequential multiple-choice (pick the right
  translation one at a time) rather than a drag-and-drop board, to keep the MVP
  lesson player simple. Revisit if that flattens the game feel too much.
- **Audio**: `audio_url` fields point at `/audio/...` paths that don't exist yet —
  either record native-speaker audio into `public/audio/`, or wire up TTS.
- **Score validation happens client-side**: `submitLessonResult` (`src/lib/actions/progress.ts`)
  trusts the `scorePct` it's passed. The RLS policies on `user_progress`/
  `user_unit_progress` only check row ownership, not plausibility — a student
  could call the Supabase REST API directly with their own session and mark any
  unit "completed." Fine for an MVP with students you know; before this matters
  for grading/certificates, move scoring into a Postgres RPC function that
  recomputes the score server-side from `exercise_questions.correct_answer`
  instead of trusting the client.

## Regenerating real Supabase types

Once your project exists, replace the hand-written types in `src/types/domain.ts`
with generated ones:

```bash
npx supabase gen types typescript --project-id <your-project-ref> > src/types/database.ts
```

Then parameterize `createClient()` in `src/lib/supabase/client.ts` and `server.ts`
with `<Database>` again (removed for now — see the comments there — because a
placeholder type actively broke inference on every query).

## Deploying

Push to a Git repo and import it on [Vercel](https://vercel.com/new). Add the same
environment variables from `.env.local` (except `SUPABASE_SERVICE_ROLE_KEY`, which
only the local seed script needs) in the Vercel project settings.
