import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export function useWatchlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const getWatchlistFromStorage = () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return [];
      const parsedUser = JSON.parse(userData);
      return parsedUser.watchlist || [];
    } catch (error) {
      console.error("Error reading watchlist:", error);
      return [];
    }
  };

  const updateWatchlistInStorage = (newWatchlist: number[]) => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;
      const parsedUser = JSON.parse(userData);
      parsedUser.watchlist = newWatchlist;
      localStorage.setItem("user", JSON.stringify(parsedUser));
    } catch (error) {
      console.error("Error updating watchlist:", error);
    }
  };

  const { data: watchlist = [] } = useQuery({
    queryKey: ["watchlist"],
    queryFn: getWatchlistFromStorage,
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
      const currentWatchlist = getWatchlistFromStorage();
      let newWatchlist: number[];

      if (action === "add") {
        newWatchlist = [...new Set([...currentWatchlist, movieId])];
      } else {
        newWatchlist = currentWatchlist.filter((id: number) => id !== movieId);
      }

      updateWatchlistInStorage(newWatchlist);
      return newWatchlist;
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
