import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function usePokemonList(userId: string) {
  const [pokemon, setPokemon] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetchList();
  }, [userId]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("pokemon")
        .select(
          "id, pk_name, pk_level, pk_hp, pk_max_hp, pk_types, pk_front_image, created_at",
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
        setPokemon([]);
        return;
      }
      setPokemon(data ?? []);
    } finally {
      setLoading(false);
    }
  };

  return { pokemon, loading, refetch: fetchList };
}
