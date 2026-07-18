import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export function useMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .order("created_at", { ascending: true });
      if (!active) return;
      if (error) setError(error.message);
      else setMovies(data ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { movies, loading, error };
}

export function useFeaturedMovie() {
  const { movies, loading, error } = useMovies();
  const featured = movies.find((m) => m.featured) ?? movies[0] ?? null;
  return { featured, loading, error };
}

export const GENRES = [
  "All",
  "Sci-Fi",
  "Drama",
  "Horror",
  "Action",
  "Romance",
  "Comedy",
  "Adventure",
  "Thriller",
  "Fantasy",
];
