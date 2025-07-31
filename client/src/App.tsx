import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Admin from "@/pages/admin";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chat" component={Chat} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/admin" component={Admin} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
