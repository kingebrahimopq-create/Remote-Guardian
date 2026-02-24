import { db } from "./db";
import { 
  devices, locations, logs, commands,
  type DeviceResponse, type CreateDeviceRequest, type UpdateDeviceRequest,
  type LocationResponse, type InsertLocation,
  type LogResponse, type InsertLog,
  type CommandResponse, type CreateCommandRequest, type UpdateCommandRequest
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getDevices(): Promise<DeviceResponse[]>;
  getDevice(id: number): Promise<DeviceResponse | undefined>;
  getDeviceByDeviceId(deviceId: string): Promise<DeviceResponse | undefined>;
  createDevice(device: CreateDeviceRequest): Promise<DeviceResponse>;
  updateDevice(id: number, updates: UpdateDeviceRequest): Promise<DeviceResponse>;
  
  getLocationsByDevice(deviceId: string): Promise<LocationResponse[]>;
  createLocation(location: InsertLocation): Promise<LocationResponse>;
  
  getLogs(): Promise<LogResponse[]>;
  getLogsByDevice(deviceId: string): Promise<LogResponse[]>;
  createLog(log: InsertLog): Promise<LogResponse>;
  
  getCommandsByDevice(deviceId: string): Promise<CommandResponse[]>;
  createCommand(command: CreateCommandRequest): Promise<CommandResponse>;
  updateCommandStatus(id: number, status: string): Promise<CommandResponse>;
}

export class DatabaseStorage implements IStorage {
  async getDevices(): Promise<DeviceResponse[]> {
    return await db.select().from(devices).orderBy(desc(devices.lastSeen));
  }

  async getDevice(id: number): Promise<DeviceResponse | undefined> {
    const [device] = await db.select().from(devices).where(eq(devices.id, id));
    return device;
  }

  async getDeviceByDeviceId(deviceId: string): Promise<DeviceResponse | undefined> {
    const [device] = await db.select().from(devices).where(eq(devices.deviceId, deviceId));
    return device;
  }

  async createDevice(device: CreateDeviceRequest): Promise<DeviceResponse> {
    const [created] = await db.insert(devices).values(device).returning();
    return created;
  }

  async updateDevice(id: number, updates: UpdateDeviceRequest): Promise<DeviceResponse> {
    const [updated] = await db.update(devices)
      .set(updates)
      .where(eq(devices.id, id))
      .returning();
    return updated;
  }

  async getLocationsByDevice(deviceId: string): Promise<LocationResponse[]> {
    return await db.select().from(locations)
      .where(eq(locations.deviceId, deviceId))
      .orderBy(desc(locations.timestamp));
  }

  async createLocation(location: InsertLocation): Promise<LocationResponse> {
    const [created] = await db.insert(locations).values(location).returning();
    return created;
  }

  async getLogs(): Promise<LogResponse[]> {
    return await db.select().from(logs).orderBy(desc(logs.timestamp)).limit(50);
  }

  async getLogsByDevice(deviceId: string): Promise<LogResponse[]> {
    return await db.select().from(logs)
      .where(eq(logs.deviceId, deviceId))
      .orderBy(desc(logs.timestamp));
  }

  async createLog(log: InsertLog): Promise<LogResponse> {
    const [created] = await db.insert(logs).values(log).returning();
    return created;
  }

  async getCommandsByDevice(deviceId: string): Promise<CommandResponse[]> {
    return await db.select().from(commands)
      .where(eq(commands.deviceId, deviceId))
      .orderBy(desc(commands.createdAt));
  }

  async createCommand(command: CreateCommandRequest): Promise<CommandResponse> {
    const [created] = await db.insert(commands).values(command).returning();
    return created;
  }

  async updateCommandStatus(id: number, status: string): Promise<CommandResponse> {
    const [updated] = await db.update(commands)
      .set({ status })
      .where(eq(commands.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
