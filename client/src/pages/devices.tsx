import { useDevices } from "@/hooks/use-devices";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Battery, Search, ArrowLeft } from "lucide-react";
import { DeviceStatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/format-date";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "wouter";

export default function Devices() {
  const { data: devices, isLoading } = useDevices();
  const [search, setSearch] = useState("");

  const filteredDevices = devices?.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.deviceId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">الأجهزة</h1>
          <p className="text-muted-foreground mt-2">إدارة ومراقبة جميع الأجهزة المتصلة.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="بحث عن جهاز..." 
            className="pl-4 pr-10 rounded-xl border-border/50 bg-card shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : filteredDevices?.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-2xl border border-dashed border-border/60">
          <Smartphone className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium">لم يتم العثور على أجهزة</h3>
          <p className="text-muted-foreground mt-1">جرب تغيير مصطلح البحث.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices?.map((device) => (
            <Link href={`/devices/${device.id}`} key={device.id}>
              <Card className="group border-border/50 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden relative rounded-2xl">
                {/* Decorative background accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors" />
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-background shadow-sm border p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Smartphone className="w-6 h-6 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{device.name}</h3>
                        <p className="text-xs text-muted-foreground font-mono mt-1">{device.deviceId}</p>
                      </div>
                    </div>
                    <DeviceStatusBadge status={device.status} />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Battery className="w-4 h-4" /> نسبة البطارية
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{device.batteryLevel}%</span>
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${device.batteryLevel > 20 ? 'bg-emerald-500' : 'bg-destructive'}`}
                            style={{ width: `${device.batteryLevel}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm border-t pt-3">
                      <span className="text-muted-foreground">آخر ظهور</span>
                      <span className="font-medium">{formatDate(device.lastSeen)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                    <ArrowLeft className="w-4 h-4 mr-1 rtl-flip" />
                    عرض التفاصيل
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
