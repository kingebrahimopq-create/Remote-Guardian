import { z } from 'zod';
import { insertDeviceSchema, insertLocationSchema, insertLogSchema, insertCommandSchema, devices, locations, logs, commands } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
};

export const api = {
  devices: {
    list: {
      method: 'GET' as const,
      path: '/api/devices' as const,
      responses: {
        200: z.array(z.custom<typeof devices.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/devices/:id' as const,
      responses: {
        200: z.custom<typeof devices.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    getByDeviceId: {
      method: 'GET' as const,
      path: '/api/devices/by-device-id/:deviceId' as const,
      responses: {
        200: z.custom<typeof devices.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/devices' as const,
      input: insertDeviceSchema,
      responses: {
        201: z.custom<typeof devices.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/devices/:id' as const,
      input: z.object({
        name: z.string().optional(),
        status: z.string().optional(),
        batteryLevel: z.number().optional(),
      }),
      responses: {
        200: z.custom<typeof devices.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  locations: {
    listByDevice: {
      method: 'GET' as const,
      path: '/api/devices/:deviceId/locations' as const,
      responses: {
        200: z.array(z.custom<typeof locations.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/locations' as const,
      input: insertLocationSchema,
      responses: {
        201: z.custom<typeof locations.$inferSelect>(),
      },
    },
  },
  logs: {
    list: {
      method: 'GET' as const,
      path: '/api/logs' as const,
      responses: {
        200: z.array(z.custom<typeof logs.$inferSelect>()),
      },
    },
    listByDevice: {
      method: 'GET' as const,
      path: '/api/devices/:deviceId/logs' as const,
      responses: {
        200: z.array(z.custom<typeof logs.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/logs' as const,
      input: insertLogSchema,
      responses: {
        201: z.custom<typeof logs.$inferSelect>(),
      },
    },
  },
  commands: {
    listByDevice: {
      method: 'GET' as const,
      path: '/api/devices/:deviceId/commands' as const,
      responses: {
        200: z.array(z.custom<typeof commands.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/commands' as const,
      input: insertCommandSchema,
      responses: {
        201: z.custom<typeof commands.$inferSelect>(),
      },
    },
    updateStatus: {
      method: 'PUT' as const,
      path: '/api/commands/:id/status' as const,
      input: z.object({ status: z.string() }),
      responses: {
        200: z.custom<typeof commands.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
