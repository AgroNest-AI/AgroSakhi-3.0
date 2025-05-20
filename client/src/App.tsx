import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "./context/UserContext";
import { LanguageProvider } from "./context/LanguageContext";
import { VoiceProvider } from "./context/VoiceContext";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/home";
import IoTDevices from "./pages/iot-devices";
import Marketplace from "./pages/marketplace";
import Learning from "./pages/learning";
import Dashboard from "./pages/dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/iot" component={IoTDevices} />
        <Route path="/market" component={Marketplace} />
        <Route path="/learn" component={Learning} />
        <Route path="/dashboard" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <LanguageProvider>
            <VoiceProvider>
              <Toaster />
              <Router />
            </VoiceProvider>
          </LanguageProvider>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
