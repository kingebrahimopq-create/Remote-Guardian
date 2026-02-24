import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useDevices() {
  return useQuery({
    queryKey: [api.devices.list.path],
    queryFn: async () => {
      const res = await fetch(api.devices.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch devices");
      const data = await res.json();
      return api.devices.list.responses[200].parse(data);
    },
  });
}

export function useDevice(id: number) {
  const url = buildUrl(api.devices.get.path, { id });
  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch device");
      const data = await res.json();
      return api.devices.get.responses[200].parse(data);
    },
    enabled: !!id,
  });
}

export function useUpdateDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number, name?: string, status?: string, batteryLevel?: number }) => {
      const url = buildUrl(api.devices.update.path, { id });
      const validated = api.devices.update.input.parse(updates);
      
      const res = await fetch(url, {
        method: api.devices.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update device");
      const data = await res.json();
      return api.devices.update.responses[200].parse(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.devices.list.path] });
      queryClient.invalidateQueries({ queryKey: [buildUrl(api.devices.get.path, { id: data.id })] });
    },
  });
}
