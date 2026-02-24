import { useParams } from "wouter";
import { useDevice } from "@/hooks/use-devices";
import { useDeviceLogs } from "@/hooks/use-logs";
import { useDeviceLocations } from "@/hooks/use-locations";
import { useDeviceCommands, useCreateCommand } from "@/hooks/use-commands";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, Battery, MapPin, Activity, Terminal, Send, Search } from "lucide-react";
import { DeviceStatusBadge, CommandStatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/format-date";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DeviceDetails() {
  const { id } = useParams<{ id: string }>();
  const deviceIdNum = parseInt(id, 10);
  
  const { data: device, isLoading: deviceLoading } = useDevice(deviceIdNum);
  const deviceIdStr = device?.deviceId || "";
  
  const { data: logs, isLoading: logsLoading } = useDeviceLogs(deviceIdStr);
  const { data: locations, isLoading: locationsLoading } = useDeviceLocations(deviceIdStr);
  const { data: commands, isLoading: commandsLoading } = useDeviceCommands(deviceIdStr);
  
  const createCommand = useCreateCommand();
  const { toast } = useToast();
  
  const [selectedCommand, setSelectedCommand] = useState<string>("");

  const handleSendCommand = () => {
    if (!selectedCommand) {
      toast({ title: "تنبيه", description: "الرجاء اختيار نوع الأمر أولاً", variant: "destructive" });
      return;
    }
    
    createCommand.mutate({
      deviceId: deviceIdStr,
      command: selectedCommand
    }, {
      onSuccess: () => {
        toast({ title: "تم الإرسال", description: "تم إرسال الأمر للجهاز بنجاح." });
        setSelectedCommand("");
      },
      onError: () => {
        toast({ title: "خطأ", description: "فشل إرسال الأمر", variant: "destructive" });
      }
    });
  };

  if (deviceLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!device) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Smartphone className="w-16 h-16 mx-auto text-muted-foreground opacity-20 mb-4" />
          <h2 className="text-2xl font-bold">الجهاز غير موجود</h2>
          <p className="text-muted-foreground mt-2">لم يتم العثور على الجهاز المطلوب أو تم حذفه.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header Card */}
      <Card className="border-border/50 shadow-md bg-gradient-to-br from-card to-muted/20 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-background border shadow-sm flex items-center justify-center shrink-0">
                <Smartphone className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{device.name}</h1>
                <p className="text-sm font-mono text-muted-foreground mt-1 bg-muted px-2 py-1 rounded inline-block">
                  ID: {device.deviceId}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <DeviceStatusBadge status={device.status} />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Battery className="w-4 h-4" />
                    <span>{device.batteryLevel}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-background rounded-xl border p-4 text-center min-w-[200px] shadow-sm">
              <p className="text-xs text-muted-foreground mb-1">آخر تزامن</p>
              <p className="font-semibold">{formatDate(device.lastSeen)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="locations" className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-14 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="locations" className="rounded-lg data-[state=active]:shadow-sm text-base">
            <MapPin className="w-4 h-4 ml-2" /> المواقع
          </TabsTrigger>
          <TabsTrigger value="logs" className="rounded-lg data-[state=active]:shadow-sm text-base">
            <Activity className="w-4 h-4 ml-2" /> السجلات
          </TabsTrigger>
          <TabsTrigger value="commands" className="rounded-lg data-[state=active]:shadow-sm text-base">
            <Terminal className="w-4 h-4 ml-2" /> الأوامر
          </TabsTrigger>
        </TabsList>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4 animate-fade-in-up">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>سجل المواقع</CardTitle>
              <CardDescription>آخر المواقع الجغرافية المسجلة للجهاز</CardDescription>
            </CardHeader>
            <CardContent>
              {locationsLoading ? (
                <Skeleton className="h-64 w-full rounded-xl" />
              ) : locations?.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-xl">
                  <MapPin className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-3" />
                  <p className="text-muted-foreground">لا توجد بيانات مواقع مسجلة</p>
                </div>
              ) : (
                <div className="rounded-xl border overflow-hidden">
                  <table className="w-full text-sm text-right">
                    <thead className="bg-muted text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-semibold">التاريخ والوقت</th>
                        <th className="px-4 py-3 font-semibold">خط العرض (Lat)</th>
                        <th className="px-4 py-3 font-semibold">خط الطول (Lng)</th>
                        <th className="px-4 py-3 font-semibold w-16">إجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {locations?.map((loc) => (
                        <tr key={loc.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 font-medium">{formatDate(loc.timestamp)}</td>
                          <td className="px-4 py-3 font-mono">{loc.lat.toFixed(6)}</td>
                          <td className="px-4 py-3 font-mono">{loc.lng.toFixed(6)}</td>
                          <td className="px-4 py-3">
                            <a 
                              href={`https://maps.google.com/?q=${loc.lat},${loc.lng}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-primary hover:underline flex items-center text-xs"
                            >
                              عرض <Search className="w-3 h-3 ml-1" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-4 animate-fade-in-up">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>سجلات النظام</CardTitle>
              <CardDescription>الأحداث والتنبيهات الصادرة من الجهاز</CardDescription>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <Skeleton className="h-64 w-full rounded-xl" />
              ) : logs?.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-xl">
                  <Activity className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-3" />
                  <p className="text-muted-foreground">لا توجد سجلات</p>
                </div>
              ) : (
                <div className="rounded-xl border overflow-hidden">
                  <table className="w-full text-sm text-right">
                    <thead className="bg-muted text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-semibold w-24">المستوى</th>
                        <th className="px-4 py-3 font-semibold">الرسالة</th>
                        <th className="px-4 py-3 font-semibold w-48">التاريخ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {logs?.map((log) => (
                        <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                              log.level === 'error' ? 'bg-destructive/10 text-destructive' :
                              log.level === 'warning' ? 'bg-amber-500/10 text-amber-600' :
                              'bg-primary/10 text-primary'
                            }`}>
                              {log.level.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3">{log.message}</td>
                          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(log.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commands Tab */}
        <TabsContent value="commands" className="space-y-6 animate-fade-in-up">
          {/* Send Command Card */}
          <Card className="border-primary/20 shadow-md bg-primary/5">
            <CardHeader>
              <CardTitle className="text-primary">إرسال أمر جديد</CardTitle>
              <CardDescription>التحكم في الجهاز عن بعد</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="w-full sm:w-72 space-y-2">
                  <label className="text-sm font-medium">نوع الأمر</label>
                  <Select value={selectedCommand} onValueChange={setSelectedCommand}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="اختر أمراً..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOCK">قفل الجهاز (LOCK)</SelectItem>
                      <SelectItem value="RING">رنين الإنذار (RING)</SelectItem>
                      <SelectItem value="WIPE" className="text-destructive focus:text-destructive">مسح البيانات (WIPE)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleSendCommand} 
                  disabled={createCommand.isPending || !selectedCommand}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  {createCommand.isPending ? "جاري الإرسال..." : (
                    <>
                      <Send className="w-4 h-4 ml-2 rtl-flip" /> إرسال الأمر
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Command History Card */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>سجل الأوامر</CardTitle>
            </CardHeader>
            <CardContent>
              {commandsLoading ? (
                <Skeleton className="h-64 w-full rounded-xl" />
              ) : commands?.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-xl">
                  <Terminal className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-3" />
                  <p className="text-muted-foreground">لم يتم إرسال أية أوامر لهذا الجهاز</p>
                </div>
              ) : (
                <div className="rounded-xl border overflow-hidden">
                  <table className="w-full text-sm text-right">
                    <thead className="bg-muted text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-semibold">الأمر</th>
                        <th className="px-4 py-3 font-semibold w-32">الحالة</th>
                        <th className="px-4 py-3 font-semibold w-48">وقت الإنشاء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {commands?.map((cmd) => (
                        <tr key={cmd.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 font-mono font-medium">{cmd.command}</td>
                          <td className="px-4 py-3">
                            <CommandStatusBadge status={cmd.status} />
                          </td>
                          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(cmd.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
