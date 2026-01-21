import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Users, 
  TrendingUp,
  Calendar,
  FileText,
  Mail,
  Phone
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function PrescriberDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch referrals for the current prescriber
  const { data: referrals, isLoading: referralsLoading, refetch } = trpc.referrals.listByPrescriber.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/");
    }
  }, [loading, isAuthenticated, setLocation]);

  if (loading || referralsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#0D9488] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Filter referrals by status
  const filteredReferrals = referrals?.filter(ref => 
    statusFilter === "all" || ref.status === statusFilter
  ) || [];

  // Calculate statistics
  const stats = {
    total: referrals?.length || 0,
    pending: referrals?.filter(r => r.status === "pending").length || 0,
    contacted: referrals?.filter(r => r.status === "contacted").length || 0,
    booked: referrals?.filter(r => r.status === "booked").length || 0,
    completed: referrals?.filter(r => r.status === "completed").length || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-white">
      {/* Header */}
      <header className="bg-white border-b border-[#0A2540]/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" onClick={() => setLocation("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-[#0A2540]" style={{ fontFamily: 'Space Grotesk' }}>
            Referral Tracking Dashboard
          </h1>
          <p className="text-[#0A2540]/60 mt-2">
            Monitor your patient referrals and track outcomes
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Referrals"
            value={stats.total}
            color="bg-[#0D9488]"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label="Pending"
            value={stats.pending}
            color="bg-yellow-500"
          />
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            label="Booked"
            value={stats.booked}
            color="bg-blue-500"
          />
          <StatCard
            icon={<CheckCircle2 className="w-6 h-6" />}
            label="Completed"
            value={stats.completed}
            color="bg-green-500"
          />
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-3 flex-wrap">
          <FilterButton
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
            label="All"
          />
          <FilterButton
            active={statusFilter === "pending"}
            onClick={() => setStatusFilter("pending")}
            label="Pending"
          />
          <FilterButton
            active={statusFilter === "contacted"}
            onClick={() => setStatusFilter("contacted")}
            label="Contacted"
          />
          <FilterButton
            active={statusFilter === "booked"}
            onClick={() => setStatusFilter("booked")}
            label="Booked"
          />
          <FilterButton
            active={statusFilter === "completed"}
            onClick={() => setStatusFilter("completed")}
            label="Completed"
          />
        </div>

        {/* Referrals List */}
        <div className="space-y-4">
          {filteredReferrals.length > 0 ? (
            filteredReferrals.map((referral) => (
              <ReferralCard key={referral.id} referral={referral} onUpdate={refetch} />
            ))
          ) : (
            <Card className="p-12 text-center">
              <FileText className="w-16 h-16 text-[#0A2540]/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0A2540] mb-2">
                {statusFilter === "all" ? "No Referrals Yet" : `No ${statusFilter} Referrals`}
              </h3>
              <p className="text-[#0A2540]/60 mb-6">
                {statusFilter === "all" 
                  ? "Your referrals will appear here once you submit them through the referral form."
                  : `You don't have any referrals with status "${statusFilter}".`}
              </p>
              <Button
                className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white"
                onClick={() => setLocation("/submit-referral")}
              >
                Submit New Referral
              </Button>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-[#0A2540]/60">{label}</p>
          <p className="text-2xl font-bold text-[#0A2540]">{value}</p>
        </div>
      </div>
    </Card>
  );
}

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

function FilterButton({ active, onClick, label }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        active
          ? "bg-[#0D9488] text-white"
          : "bg-white text-[#0A2540]/60 hover:bg-[#0A2540]/5 border border-[#0A2540]/10"
      }`}
    >
      {label}
    </button>
  );
}

interface ReferralCardProps {
  referral: any;
  onUpdate: () => void;
}

function ReferralCard({ referral, onUpdate }: ReferralCardProps) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    contacted: "bg-blue-100 text-blue-800",
    booked: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-lg font-bold text-[#0A2540]">
              {referral.patientName}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[referral.status as keyof typeof statusColors]}`}>
              {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-3 text-sm text-[#0A2540]/70">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Referral ID: {referral.referralId}</span>
            </div>
            {referral.patientEmail && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{referral.patientEmail}</span>
              </div>
            )}
            {referral.patientPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{referral.patientPhone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Submitted: {new Date(referral.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {referral.clinicalIndication && (
            <div className="mt-3 p-3 bg-[#0A2540]/5 rounded-lg">
              <p className="text-sm text-[#0A2540]/80">
                <strong>Clinical Indication:</strong> {referral.clinicalIndication}
              </p>
            </div>
          )}

          {referral.uniqueBookingLink && referral.status === "pending" && (
            <div className="mt-3 p-3 bg-[#0D9488]/10 rounded-lg">
              <p className="text-sm text-[#0D9488] font-medium mb-2">
                📋 Patient Booking Link:
              </p>
              <code className="text-xs bg-white px-2 py-1 rounded border border-[#0D9488]/20 break-all">
                {referral.uniqueBookingLink}
              </code>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`/referral/${referral.referralId}`, "_blank")}
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
