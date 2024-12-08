import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { useSettings } from "@/contexts/SettingsContext";

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
  const { showAlert } = useAlert();
  const { settings } = useSettings();

  const getWatchlistFromStorage = (): number[] => {
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

  const updateWatchlistInStorage = (newWatchlist: number[]): void => {
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
      console.log("Toggling watchlist:", { movieId, action, movieTitle });
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
      console.log("Mutation success:", data);
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });

      if (!settings.showAlerts) return;

      if (data.action === "add") {
        showAlert({
          message: "Added to Watchlist!",
          subMessage: data.movieTitle
            ? `"${data.movieTitle}" is now in your collection`
            : undefined,
          type: "add",
        });
      } else {
        showAlert({
          message: "Watchlist Updated",
          subMessage: "Movie removed successfully",
          type: "remove",
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
