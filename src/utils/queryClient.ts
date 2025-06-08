import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 1000, // Время устаревания данных. Устарвшие данные будут перезапрошены
      gcTime: 1 * 60 * 1000, // Время удаления данных. inactive -> delete. Освободит память
    },
  },
});
