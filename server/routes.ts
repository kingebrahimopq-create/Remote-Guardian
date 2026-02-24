import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Devices
  app.get(api.devices.list.path, async (req, res) => {
    const list = await storage.getDevices();
    res.json(list);
  });

  app.get(api.devices.get.path, async (req, res) => {
    const device = await storage.getDevice(Number(req.params.id));
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }
    res.json(device);
  });

  app.get(api.devices.getByDeviceId.path, async (req, res) => {
    const device = await storage.getDeviceByDeviceId(req.params.deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }
    res.json(device);
  });

  app.post(api.devices.create.path, async (req, res) => {
    try {
      const input = api.devices.create.input.parse(req.body);
      const created = await storage.createDevice(input);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(api.devices.update.path, async (req, res) => {
    try {
      const input = api.devices.update.input.parse(req.body);
      
      const existing = await storage.getDevice(Number(req.params.id));
      if (!existing) {
         return res.status(404).json({ message: "Device not found" });
      }

      const updated = await storage.updateDevice(Number(req.params.id), input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Locations
  app.get(api.locations.listByDevice.path, async (req, res) => {
    const locs = await storage.getLocationsByDevice(req.params.deviceId);
    res.json(locs);
  });

  app.post(api.locations.create.path, async (req, res) => {
    try {
      const input = api.locations.create.input.parse(req.body);
      const created = await storage.createLocation(input);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Logs
  app.get(api.logs.list.path, async (req, res) => {
    const list = await storage.getLogs();
    res.json(list);
  });

  app.get(api.logs.listByDevice.path, async (req, res) => {
    const list = await storage.getLogsByDevice(req.params.deviceId);
    res.json(list);
  });

  app.post(api.logs.create.path, async (req, res) => {
    try {
      const input = api.logs.create.input.parse(req.body);
      const created = await storage.createLog(input);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Commands
  app.get(api.commands.listByDevice.path, async (req, res) => {
    const list = await storage.getCommandsByDevice(req.params.deviceId);
    res.json(list);
  });

  app.post(api.commands.create.path, async (req, res) => {
    try {
      const input = api.commands.create.input.parse(req.body);
      const created = await storage.createCommand(input);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(api.commands.updateStatus.path, async (req, res) => {
    try {
      const input = api.commands.updateStatus.input.parse(req.body);
      const updated = await storage.updateCommandStatus(Number(req.params.id), input.status);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const devices = await storage.getDevices();
  if (devices.length === 0) {
    const d1 = await storage.createDevice({
      deviceId: "android-xyz-123",
      name: "هاتف أحمد (Samsung Galaxy S23)",
    });
    
    const d2 = await storage.createDevice({
      deviceId: "android-abc-456",
      name: "جهاز العائلة (Pixel 7)",
    });

    await storage.updateDevice(d1.id, { status: "online", batteryLevel: 85 });
    await storage.updateDevice(d2.id, { status: "offline", batteryLevel: 12 });

    await storage.createLocation({
      deviceId: d1.deviceId,
      lat: 24.7136,
      lng: 46.6753,
    });

    await storage.createLog({
      deviceId: d1.deviceId,
      message: "تم تشغيل التطبيق بنجاح",
      level: "info"
    });
    
    await storage.createLog({
      deviceId: d2.deviceId,
      message: "البطارية منخفضة جداً",
      level: "warning"
    });

    await storage.createCommand({
      deviceId: d1.deviceId,
      command: "RING",
    });
  }
}
