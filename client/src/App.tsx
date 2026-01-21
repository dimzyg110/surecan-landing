import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ReferralForm from "./pages/ReferralForm";
import Dashboard from "./pages/Dashboard";
import FAQ from "./pages/FAQ";
import DrLewisProfile from "./pages/DrLewisProfile";
import PharmacyPartnership from "./pages/PharmacyPartnership";
import MarketingDashboard from "./pages/MarketingDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import ClinicianDashboard from "./pages/ClinicianDashboard";
import PatientAppointments from "./pages/PatientAppointments";
import BookAppointment from "./pages/BookAppointment";
import SubmitReferral from "./pages/SubmitReferral";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/referral"} component={ReferralForm} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/dr-lewis"} component={DrLewisProfile} />
      <Route path={"/pharmacy-partnership"} component={PharmacyPartnership} />
      <Route path={"/marketing"} component={MarketingDashboard} />
      <Route path={"/patient"} component={PatientDashboard} />
      <Route path={"/patient/appointments"} component={PatientAppointments} />
      <Route path={"/clinician"} component={ClinicianDashboard} />
      <Route path={"/book"} component={BookAppointment} />
      <Route path={"/submit-referral"} component={SubmitReferral} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
