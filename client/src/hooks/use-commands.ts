import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

export function useDeviceCommands(deviceId: string) {
  const url = buildUrl(api.commands.listByDevice.path, { deviceId });
  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch commands");
      const data = await res.json();
      return api.commands.listByDevice.responses[200].parse(data);
    },
    enabled: !!deviceId,
  });
}

export function useCreateCommand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { deviceId: string, command: string }) => {
      const validated = api.commands.create.input.parse(input);
      const res = await fetch(api.commands.create.path, {
        method: api.commands.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to create command");
      const data = await res.json();
      return api.commands.create.responses[201].parse(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: [buildUrl(api.commands.listByDevice.path, { deviceId: data.deviceId })] 
      });
    },
  });
}
