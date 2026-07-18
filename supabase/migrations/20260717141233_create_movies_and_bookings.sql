/*
# Create movies and bookings tables for CineWave

## Overview
CineWave is a movie ticket booking app with authentication. Movies are shared
public catalog data (readable by everyone, anon included). Bookings are
private per-user records scoped to the authenticated owner.

## 1. New Tables

### `movies`
Public catalog of movies shown in the app.
- `id` (uuid, primary key)
- `title` (text, not null) — movie title
- `genre` (text, not null) — primary genre, e.g. "Sci-Fi"
- `genres` (text[], not null default '{}') — multiple genre tags for filtering
- `description` (text, not null) — short synopsis
- `poster_url` (text, not null) — poster image URL
- `backdrop_url` (text) — large hero backdrop image URL (nullable)
- `rating` (numeric, 0-10) — aggregate rating, e.g. 8.4
- `runtime_min` (integer) — runtime in minutes
- `ticket_price` (numeric, not null) — price per ticket in USD
- `featured` (boolean, default false) — marks the "Featured This Week" movie
- `release_year` (integer) — release year
- `director` (text) — director name
- `created_at` (timestamptz, default now())

### `bookings`
Private per-user booking records (one row per booked showing).
- `id` (uuid, primary key)
- `user_id` (uuid, not null, defaults to authenticated user) — owner
- `movie_id` (uuid, not null, references movies) — which movie
- `movie_title` (text, not null) — denormalized snapshot of title at booking time
- `poster_url` (text) — denormalized snapshot of poster
- `show_date` (date, not null) — date of showing
- `show_time` (text, not null) — time of showing, e.g. "19:30"
- `seats` (text[], not null) — booked seat labels, e.g. {"A1","A2"}
- `num_seats` (integer, not null) — count of seats
- `unit_price` (numeric, not null) — price per ticket at booking time
- `total_price` (numeric, not null) — total amount
- `status` (text, default 'confirmed') — booking status
- `created_at` (timestamptz, default now())

## 2. Indexes
- `movies_genre_idx` on movies(genre) for category filtering
- `movies_featured_idx` on movies(featured) for hero lookup
- `bookings_user_id_idx` on bookings(user_id) for "My Bookings" queries

## 3. Security (RLS)

### movies — public/shared catalog
- RLS enabled.
- SELECT open to `anon, authenticated` (catalog is intentionally public).
- No INSERT/UPDATE/DELETE via anon key (catalog managed server-side / seeded).

### bookings — owner-scoped private data
- RLS enabled.
- Four policies (SELECT/INSERT/UPDATE/DELETE) scoped to `authenticated`
  with `auth.uid() = user_id` ownership checks.
- `user_id` defaults to `auth.uid()` so frontend inserts that omit user_id
  still satisfy the INSERT WITH CHECK.

## 4. Notes
- Movies are seeded separately after this migration.
- Bookings store denormalized movie title/poster so "My Bookings" renders
  correctly even if a movie is later removed from the catalog.
*/

-- ---------- movies ----------
CREATE TABLE IF NOT EXISTS movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  genre text NOT NULL,
  genres text[] NOT NULL DEFAULT '{}',
  description text NOT NULL,
  poster_url text NOT NULL,
  backdrop_url text,
  rating numeric(3,1) DEFAULT 0,
  runtime_min integer DEFAULT 120,
  ticket_price numeric(8,2) NOT NULL DEFAULT 12.00,
  featured boolean NOT NULL DEFAULT false,
  release_year integer,
  director text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS movies_genre_idx ON movies(genre);
CREATE INDEX IF NOT EXISTS movies_featured_idx ON movies(featured);

ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "movies_read_all" ON movies;
CREATE POLICY "movies_read_all"
ON movies FOR SELECT
TO anon, authenticated
USING (true);

-- ---------- bookings ----------
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id uuid NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  movie_title text NOT NULL,
  poster_url text,
  show_date date NOT NULL,
  show_time text NOT NULL,
  seats text[] NOT NULL,
  num_seats integer NOT NULL,
  unit_price numeric(8,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_movie_id_idx ON bookings(movie_id);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_bookings" ON bookings;
CREATE POLICY "select_own_bookings"
ON bookings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_bookings" ON bookings;
CREATE POLICY "insert_own_bookings"
ON bookings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_bookings" ON bookings;
CREATE POLICY "update_own_bookings"
ON bookings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_bookings" ON bookings;
CREATE POLICY "delete_own_bookings"
ON bookings FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
