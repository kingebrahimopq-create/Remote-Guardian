import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useLogs() {
  return useQuery({
    queryKey: [api.logs.list.path],
    queryFn: async () => {
      const res = await fetch(api.logs.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch logs");
      const data = await res.json();
      return api.logs.list.responses[200].parse(data);
    },
  });
}

export function useDeviceLogs(deviceId: string) {
  const url = buildUrl(api.logs.listByDevice.path, { deviceId });
  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch device logs");
      const data = await res.json();
      return api.logs.listByDevice.responses[200].parse(data);
    },
    enabled: !!deviceId,
  });
}
