import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

// Pages
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Devices from "@/pages/devices";
import DeviceDetails from "@/pages/device-details";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/devices" component={Devices} />
      <Route path="/devices/:id" component={DeviceDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  } as React.CSSProperties;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* RTL Wrapper for the entire app */}
        <div dir="rtl" className="min-h-screen bg-background text-foreground">
          <SidebarProvider style={style}>
            <div className="flex h-screen w-full overflow-hidden">
              <AppSidebar />
              <div className="flex flex-col flex-1 min-w-0">
                <header className="flex items-center justify-between p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm z-10 sticky top-0">
                  <SidebarTrigger className="hover-elevate" />
                  {/* Additional header items could go here */}
                </header>
                <main className="flex-1 overflow-auto pb-10">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
