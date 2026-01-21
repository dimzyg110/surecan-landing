import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Calendar, Clock, User, Video, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function PatientAppointments() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showBookingForm, setShowBookingForm] = useState(false);

  const { data: appointments, isLoading: appointmentsLoading, refetch } = trpc.appointments.list.useQuery();
  const { data: clinicians } = trpc.appointments.getAvailableClinicians.useQuery();
  const cancelMutation = trpc.appointments.cancel.useMutation();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "patient")) {
      setLocation("/");
    }
  }, [loading, isAuthenticated, user, setLocation]);

  if (loading || appointmentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#0D9488] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "patient") {
    return null;
  }

  const handleCancelAppointment = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await cancelMutation.mutateAsync({ id });
      toast.success("Appointment cancelled successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to cancel appointment");
    }
  };

  const upcomingAppointments = appointments?.filter(
    (apt) => apt.status === "scheduled" && new Date(apt.scheduledAt) > new Date()
  );
  const pastAppointments = appointments?.filter(
    (apt) => apt.status === "completed" || new Date(apt.scheduledAt) < new Date()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-white">
      {/* Header */}
      <header className="bg-white border-b border-[#0A2540]/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setLocation("/patient")}>
              ← Back
            </Button>
            <h1 className="text-xl font-bold text-[#0A2540]">My Appointments</h1>
          </div>
          <Button
            className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white"
            onClick={() => setShowBookingForm(true)}
          >
            Book New Appointment
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Upcoming Appointments */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#0A2540] mb-6">Upcoming Appointments</h2>
          {upcomingAppointments && upcomingAppointments.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={handleCancelAppointment}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Calendar className="w-12 h-12 text-[#0A2540]/20 mx-auto mb-4" />
              <p className="text-[#0A2540]/60 mb-4">You have no upcoming appointments</p>
              <Button
                className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white"
                onClick={() => setShowBookingForm(true)}
              >
                Book Your First Appointment
              </Button>
            </Card>
          )}
        </section>

        {/* Past Appointments */}
        {pastAppointments && pastAppointments.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[#0A2540] mb-6">Past Appointments</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {pastAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  isPast
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingFormModal
          clinicians={clinicians || []}
          onClose={() => setShowBookingForm(false)}
          onSuccess={() => {
            setShowBookingForm(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}

interface AppointmentCardProps {
  appointment: any;
  onCancel?: (id: number) => void;
  isPast?: boolean;
}

function AppointmentCard({ appointment, onCancel, isPast }: AppointmentCardProps) {
  const appointmentDate = new Date(appointment.scheduledAt);
  const isToday = appointmentDate.toDateString() === new Date().toDateString();

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#0A2540] mb-1">
            {appointment.appointmentType === "initial" ? "Initial Consultation" : "Follow-up"}
          </h3>
          <div className="flex items-center gap-2 text-sm text-[#0A2540]/60">
            <Calendar className="w-4 h-4" />
            {appointmentDate.toLocaleDateString("en-AU", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center gap-2 text-sm text-[#0A2540]/60 mt-1">
            <Clock className="w-4 h-4" />
            {appointmentDate.toLocaleTimeString("en-AU", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            ({appointment.duration} minutes)
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            appointment.status === "scheduled"
              ? "bg-[#0D9488]/10 text-[#0D9488]"
              : appointment.status === "completed"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {appointment.status}
        </span>
      </div>

      {appointment.notes && (
        <p className="text-sm text-[#0A2540]/60 mb-4">{appointment.notes}</p>
      )}

      {!isPast && appointment.status === "scheduled" && (
        <div className="flex gap-3">
          {isToday && (
            <Button
              className="flex-1 bg-[#0D9488] hover:bg-[#0D9488]/90 text-white gap-2"
              onClick={() => window.open(appointment.videoRoomUrl || "#", "_blank")}
            >
              <Video className="w-4 h-4" />
              Join Video Call
            </Button>
          )}
          {onCancel && (
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => onCancel(appointment.id)}
            >
              Cancel
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

interface BookingFormModalProps {
  clinicians: any[];
  onClose: () => void;
  onSuccess: () => void;
}

function BookingFormModal({ clinicians, onClose, onSuccess }: BookingFormModalProps) {
  const [selectedClinician, setSelectedClinician] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentType, setAppointmentType] = useState<"initial" | "follow_up">("initial");
  const [notes, setNotes] = useState("");

  const createMutation = trpc.appointments.create.useMutation();
  const createCheckoutMutation = trpc.stripe.createCheckoutSession.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClinician || !appointmentDate || !appointmentTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Step 1: Create the appointment
      const scheduledAt = new Date(`${appointmentDate}T${appointmentTime}`);
      const appointment = await createMutation.mutateAsync({
        clinicianId: Number(selectedClinician),
        scheduledAt: scheduledAt.toISOString(),
        duration: 30,
        appointmentType,
        notes: notes || undefined,
      });

      // Step 2: Create Stripe checkout session for payment
      const productType = appointmentType === "initial" 
        ? "INITIAL_CONSULTATION" 
        : "FOLLOW_UP_CONSULTATION";
      
      const { checkoutUrl } = await createCheckoutMutation.mutateAsync({
        appointmentId: appointment.appointmentId,
        productType,
      });

      // Step 3: Redirect to Stripe checkout
      if (checkoutUrl) {
        toast.success("Redirecting to payment...");
        window.open(checkoutUrl, "_blank");
      }
      
      // Close modal and refresh appointments
      onSuccess();
    } catch (error) {
      toast.error("Failed to book appointment");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#0A2540]">Book Appointment</h2>
          <button
            onClick={onClose}
            className="text-[#0A2540]/40 hover:text-[#0A2540] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Clinician Selection */}
          <div>
            <label className="block text-sm font-medium text-[#0A2540] mb-2">
              Select Clinician *
            </label>
            <select
              value={selectedClinician}
              onChange={(e) => setSelectedClinician(e.target.value)}
              className="w-full px-4 py-2 border border-[#0A2540]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
              required
            >
              <option value="">Choose a clinician...</option>
              {clinicians.map((clinician) => (
                <option key={clinician.id} value={clinician.id}>
                  {clinician.name} {clinician.specialization ? `- ${clinician.specialization}` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block text-sm font-medium text-[#0A2540] mb-2">
              Appointment Type *
            </label>
            <select
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value as "initial" | "follow_up")}
              className="w-full px-4 py-2 border border-[#0A2540]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
              required
            >
              <option value="initial">Initial Consultation - $150 AUD (30-45 mins)</option>
              <option value="follow_up">Follow-up Consultation - $75 AUD (15-20 mins)</option>
            </select>
            <p className="mt-2 text-sm text-[#0A2540]/60">
              💳 Payment will be processed securely via Stripe after booking
            </p>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-[#0A2540] mb-2">Date *</label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 border border-[#0A2540]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
              required
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-[#0A2540] mb-2">Time *</label>
            <input
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="w-full px-4 py-2 border border-[#0A2540]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#0A2540] mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-[#0A2540]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
              placeholder="Any specific concerns or questions..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#0D9488] hover:bg-[#0D9488]/90 text-white"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Booking..." : "Book Appointment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
