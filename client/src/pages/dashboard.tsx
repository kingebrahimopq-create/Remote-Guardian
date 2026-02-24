import { useDevices } from "@/hooks/use-devices";
import { useLogs } from "@/hooks/use-logs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Smartphone, Activity, AlertTriangle, ShieldCheck } from "lucide-react";
import { DeviceStatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/format-date";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: devices, isLoading: devicesLoading } = useDevices();
  const { data: logs, isLoading: logsLoading } = useLogs();

  const totalDevices = devices?.length || 0;
  const onlineDevices = devices?.filter(d => d.status === 'online').length || 0;
  
  // Get latest 5 logs
  const recentLogs = logs ? [...logs].sort((a, b) => 
    new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
  ).slice(0, 5) : [];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-foreground">لوحة القيادة</h1>
        <p className="text-muted-foreground mt-2">نظرة عامة على حالة الأجهزة المتصلة ونشاط النظام.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 shadow-sm hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي الأجهزة</CardTitle>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {devicesLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-4xl font-bold">{totalDevices}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">الأجهزة المتصلة</CardTitle>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            {devicesLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-4xl font-bold text-emerald-600">{onlineDevices}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">تنبيهات حديثة</CardTitle>
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            {logsLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-4xl font-bold">{logs?.filter(l => l.level !== 'info').length || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Devices */}
        <Card className="border-border/50 shadow-sm col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" />
              أحدث الأجهزة
            </CardTitle>
            <CardDescription>آخر الأجهزة التي تم تحديث حالتها</CardDescription>
          </CardHeader>
          <CardContent>
            {devicesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : devices?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                لا توجد أجهزة متصلة
              </div>
            ) : (
              <div className="space-y-4">
                {devices?.slice(0, 4).map((device) => (
                  <Link href={`/devices/${device.id}`} key={device.id}>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="bg-background shadow-sm border p-2 rounded-lg group-hover:scale-105 transition-transform">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{device.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{device.deviceId}</p>
                        </div>
                      </div>
                      <DeviceStatusBadge status={device.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Logs */}
        <Card className="border-border/50 shadow-sm col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              أحدث السجلات
            </CardTitle>
            <CardDescription>النشاطات الأخيرة عبر جميع الأجهزة</CardDescription>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            ) : recentLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                لا توجد سجلات
              </div>
            ) : (
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {recentLogs.map((log) => (
                  <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Icon indicator */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-background bg-muted text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        log.level === 'error' ? 'bg-destructive' : 
                        log.level === 'warning' ? 'bg-amber-500' : 'bg-primary'
                      }`} />
                    </div>
                    {/* Content */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border/50 bg-card shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{log.level === 'error' ? 'خطأ' : log.level === 'warning' ? 'تحذير' : 'معلومة'}</span>
                        <time className="text-xs text-muted-foreground">{formatDate(log.timestamp)}</time>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{log.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
