import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Calendar, FileText, MessageSquare, Pill, User, Video } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function PatientDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "patient")) {
      setLocation("/");
    }
  }, [loading, isAuthenticated, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#0D9488] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "patient") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-white">
      {/* Header */}
      <header className="bg-white border-b border-[#0A2540]/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0D9488] flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0A2540]">Surecan Patient Portal</h1>
              <p className="text-sm text-[#0A2540]/60">Welcome, {user.name}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              // Logout functionality
              window.location.href = "/";
            }}
          >
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Appointments Card */}
          <DashboardCard
            icon={<Calendar className="w-8 h-8 text-[#0D9488]" />}
            title="My Appointments"
            description="View and manage your upcoming consultations"
            onClick={() => setLocation("/patient/appointments")}
          />

          {/* Prescriptions Card */}
          <DashboardCard
            icon={<Pill className="w-8 h-8 text-[#0D9488]" />}
            title="My Prescriptions"
            description="Access your active prescriptions and medication info"
            onClick={() => setLocation("/patient/prescriptions")}
          />

          {/* Medical History Card */}
          <DashboardCard
            icon={<FileText className="w-8 h-8 text-[#0D9488]" />}
            title="Medical History"
            description="Review your reported medical history"
            onClick={() => setLocation("/patient/medical-history")}
          />

          {/* Messages Card */}
          <DashboardCard
            icon={<MessageSquare className="w-8 h-8 text-[#0D9488]" />}
            title="Messages"
            description="Contact your clinic nurse or doctor"
            onClick={() => setLocation("/patient/messages")}
          />

          {/* Profile Card */}
          <DashboardCard
            icon={<User className="w-8 h-8 text-[#0D9488]" />}
            title="My Profile"
            description="Update your contact information"
            onClick={() => setLocation("/patient/profile")}
          />

          {/* Video Consultation Card */}
          <DashboardCard
            icon={<Video className="w-8 h-8 text-[#0D9488]" />}
            title="Join Video Call"
            description="Join your scheduled video consultation"
            onClick={() => setLocation("/patient/video")}
            highlight
          />
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-[#0A2540]/10">
          <h2 className="text-xl font-bold text-[#0A2540] mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white"
              onClick={() => setLocation("/patient/appointments")}
            >
              Book New Appointment
            </Button>
            <Button
              variant="outline"
              className="border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488]/5"
              onClick={() => setLocation("/patient/messages")}
            >
              Send Message to Clinic
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  highlight?: boolean;
}

function DashboardCard({ icon, title, description, onClick, highlight }: DashboardCardProps) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-xl border text-left transition-all hover:shadow-lg ${
        highlight
          ? "bg-gradient-to-br from-[#0D9488] to-[#0D9488]/90 border-[#0D9488] text-white"
          : "bg-white border-[#0A2540]/10 hover:border-[#0D9488]"
      }`}
    >
      <div className="mb-4">{icon}</div>
      <h3 className={`text-lg font-bold mb-2 ${highlight ? "text-white" : "text-[#0A2540]"}`}>
        {title}
      </h3>
      <p className={`text-sm ${highlight ? "text-white/80" : "text-[#0A2540]/60"}`}>
        {description}
      </p>
    </button>
  );
}
