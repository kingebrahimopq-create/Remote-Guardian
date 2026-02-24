import { LayoutDashboard, Smartphone, Shield, LogOut, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const items = [
  { title: "لوحة القيادة", url: "/", icon: LayoutDashboard },
  { title: "الأجهزة", url: "/devices", icon: Smartphone },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar side="right" variant="inset">
      <SidebarHeader className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight">الحارس عن بعد</span>
            <span className="text-xs text-muted-foreground">لوحة التحكم الإدارية</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold px-4 mb-2 opacity-50">
            القائمة الرئيسية
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location === item.url || (item.url !== "/" && location.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`
                        transition-all duration-200 py-6 px-4
                        ${isActive ? "bg-primary/10 text-primary font-bold border-r-4 border-primary" : "hover:bg-muted"}
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3 w-full">
                        <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors py-6">
                <LogOut className="w-5 h-5 rtl-flip" />
                <span>تسجيل الخروج</span>
             </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
