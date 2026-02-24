import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useDeviceLocations(deviceId: string) {
  const url = buildUrl(api.locations.listByDevice.path, { deviceId });
  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch locations");
      const data = await res.json();
      return api.locations.listByDevice.responses[200].parse(data);
    },
    enabled: !!deviceId,
  });
}
