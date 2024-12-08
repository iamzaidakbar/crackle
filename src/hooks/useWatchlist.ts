import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

interface WatchlistHook {
  watchlist: number[];
  toggleWatchlist: (params: {
    movieId: number;
    action: "add" | "remove";
    movieTitle?: string;
  }) => void;
  isInWatchlist: (movieId: number) => boolean;
}

export function useWatchlist(): WatchlistHook {
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
      movieTitle,
    }: {
      movieId: number;
      action: "add" | "remove";
      movieTitle?: string;
    }) => {
      const currentWatchlist = getWatchlistFromStorage();
      let newWatchlist: number[];

      if (action === "add") {
        newWatchlist = [...new Set([...currentWatchlist, movieId])];
      } else {
        newWatchlist = currentWatchlist.filter((id: number) => id !== movieId);
      }

      updateWatchlistInStorage(newWatchlist);
      return { newWatchlist, action, movieTitle };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });

      if (data.action === "add") {
        toast.success(
          data.movieTitle
            ? `Added "${data.movieTitle}" to watchlist`
            : "Added to watchlist",
          {
            duration: 3000,
            icon: "🎬",
            style: {
              background: "#1f2937",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }
        );
      } else {
        toast.success("Removed from watchlist", {
          icon: "✅",
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        });
      }
    },
  });

  return {
    watchlist,
    toggleWatchlist,
    isInWatchlist: (movieId: number) => watchlist.includes(movieId),
  };
}
