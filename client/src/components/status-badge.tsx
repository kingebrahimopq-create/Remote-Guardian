import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export function DeviceStatusBadge({ status }: StatusBadgeProps) {
  const isOnline = status.toLowerCase() === 'online';
  
  return (
    <Badge 
      variant={isOnline ? "default" : "secondary"} 
      className={`
        gap-1.5 px-2.5 py-1 text-xs font-semibold no-default-hover-elevate
        ${isOnline ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'}
      `}
    >
      {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
      {isOnline ? "متصل" : "غير متصل"}
    </Badge>
  );
}

export function CommandStatusBadge({ status }: StatusBadgeProps) {
  const s = status.toLowerCase();
  
  if (s === 'completed') {
    return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/20 gap-1"><CheckCircle2 className="w-3 h-3"/>مكتمل</Badge>;
  }
  if (s === 'failed') {
    return <Badge variant="destructive" className="gap-1"><AlertCircle className="w-3 h-3"/>فشل</Badge>;
  }
  if (s === 'sent') {
    return <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/20 gap-1"><Wifi className="w-3 h-3"/>أرسل</Badge>;
  }
  return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3"/>قيد الانتظار</Badge>;
}
