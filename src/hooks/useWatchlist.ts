import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export function useWatchlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: watchlist = [] } = useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const res = await fetch("/api/user/watchlist");
      const data = await res.json();
      return data.watchlist;
    },
    enabled: !!user,
  });

  const { mutate: toggleWatchlist } = useMutation({
    mutationFn: async ({
      movieId,
      action,
    }: {
      movieId: number;
      action: "add" | "remove";
    }) => {
      const res = await fetch("/api/user/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, action }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  return {
    watchlist,
    toggleWatchlist,
    isInWatchlist: (movieId: number) => watchlist.includes(movieId),
  };
}
