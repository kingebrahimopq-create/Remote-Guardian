import { pgTable, text, serial, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  deviceId: text("device_id").notNull().unique(), // The unique ID from the Android app
  name: text("name").notNull(),
  status: text("status").notNull().default("offline"), // online, offline
  batteryLevel: integer("battery_level").notNull().default(100),
  lastSeen: timestamp("last_seen").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  deviceId: text("device_id").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const logs = pgTable("logs", {
  id: serial("id").primaryKey(),
  deviceId: text("device_id").notNull(),
  message: text("message").notNull(),
  level: text("level").notNull().default("info"), // info, warning, error
  timestamp: timestamp("timestamp").defaultNow(),
});

export const commands = pgTable("commands", {
  id: serial("id").primaryKey(),
  deviceId: text("device_id").notNull(),
  command: text("command").notNull(), // e.g., 'LOCK', 'RING', 'WIPE'
  status: text("status").notNull().default("pending"), // pending, sent, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for inserts
export const insertDeviceSchema = createInsertSchema(devices).omit({ id: true, createdAt: true, lastSeen: true });
export const insertLocationSchema = createInsertSchema(locations).omit({ id: true, timestamp: true });
export const insertLogSchema = createInsertSchema(logs).omit({ id: true, timestamp: true });
export const insertCommandSchema = createInsertSchema(commands).omit({ id: true, createdAt: true, status: true });

// Explicit Types
export type Device = typeof devices.$inferSelect;
export type InsertDevice = z.infer<typeof insertDeviceSchema>;

export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type Log = typeof logs.$inferSelect;
export type InsertLog = z.infer<typeof insertLogSchema>;

export type Command = typeof commands.$inferSelect;
export type InsertCommand = z.infer<typeof insertCommandSchema>;

// API request types
export type CreateDeviceRequest = InsertDevice;
export type UpdateDeviceRequest = Partial<InsertDevice> & { lastSeen?: Date, status?: string, batteryLevel?: number };
export type CreateCommandRequest = InsertCommand;
export type UpdateCommandRequest = { status: string };

// API response types
export type DeviceResponse = Device;
export type LocationResponse = Location;
export type LogResponse = Log;
export type CommandResponse = Command;
