import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Calendar, FileText, MessageSquare, Pill, Users, Video } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ClinicianDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "clinician")) {
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

  if (!isAuthenticated || user?.role !== "clinician") {
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
              <h1 className="text-xl font-bold text-[#0A2540]">Surecan Clinician Portal</h1>
              <p className="text-sm text-[#0A2540]/60">Dr. {user.name}</p>
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
          {/* Patient List Card */}
          <DashboardCard
            icon={<Users className="w-8 h-8 text-[#0D9488]" />}
            title="Patient List"
            description="View and manage all your patients"
            onClick={() => setLocation("/clinician/patients")}
          />

          {/* Appointments Card */}
          <DashboardCard
            icon={<Calendar className="w-8 h-8 text-[#0D9488]" />}
            title="Appointments"
            description="View your schedule and upcoming consultations"
            onClick={() => setLocation("/clinician/appointments")}
          />

          {/* Prescriptions Card */}
          <DashboardCard
            icon={<Pill className="w-8 h-8 text-[#0D9488]" />}
            title="Prescriptions"
            description="Manage patient prescriptions"
            onClick={() => setLocation("/clinician/prescriptions")}
          />

          {/* Medical Records Card */}
          <DashboardCard
            icon={<FileText className="w-8 h-8 text-[#0D9488]" />}
            title="Medical Records"
            description="Access and update patient records"
            onClick={() => setLocation("/clinician/records")}
          />

          {/* Messages Card */}
          <DashboardCard
            icon={<MessageSquare className="w-8 h-8 text-[#0D9488]" />}
            title="Messages"
            description="Respond to patient inquiries"
            onClick={() => setLocation("/clinician/messages")}
          />

          {/* Video Consultation Card */}
          <DashboardCard
            icon={<Video className="w-8 h-8 text-[#0D9488]" />}
            title="Start Video Call"
            description="Join or start a video consultation"
            onClick={() => setLocation("/clinician/video")}
            highlight
          />
        </div>

        {/* Today's Schedule */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-[#0A2540]/10">
          <h2 className="text-xl font-bold text-[#0A2540] mb-4">Today's Schedule</h2>
          <p className="text-[#0A2540]/60 mb-4">You have no appointments scheduled for today.</p>
          <Button
            className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white"
            onClick={() => setLocation("/clinician/appointments")}
          >
            View Full Schedule
          </Button>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-[#0A2540]/10">
          <h2 className="text-xl font-bold text-[#0A2540] mb-4">Recent Activity</h2>
          <p className="text-[#0A2540]/60">No recent activity to display.</p>
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
