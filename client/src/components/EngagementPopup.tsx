import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, User, Pill, Stethoscope, ArrowRight } from "lucide-react";

interface EngagementPopupProps {
  onClose: () => void;
}

type UserType = "patient" | "pharmacist" | "practitioner" | null;

export function EngagementPopup({ onClose }: EngagementPopupProps) {
  const [userType, setUserType] = useState<UserType>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    practice: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    
    // If patient, redirect immediately to HotDoc
    if (type === "patient") {
      window.open("https://www.hotdoc.com.au/medical-centres/surecan", "_blank");
      // Close popup after brief delay
      setTimeout(() => {
        onClose();
      }, 500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          practice: formData.practice,
          role: userType === "pharmacist" ? "Pharmacist" : "Allied Health",
          source: "engagement_popup",
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        // Set cookie to prevent popup from showing again
        document.cookie = `surecan_popup_shown=true; max-age=${30 * 24 * 60 * 60}; path=/`;
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Set cookie to prevent popup from showing again for 7 days
    document.cookie = `surecan_popup_shown=true; max-age=${7 * 24 * 60 * 60}; path=/`;
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-teal-600 text-white px-8 py-6">
          <h2 className="text-2xl font-bold mb-2">Welcome to Surecan</h2>
          <p className="text-white/90 text-sm">
            How can we help you today?
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {!userType ? (
            /* Triage Step */
            <div className="space-y-4">
              <p className="text-gray-700 text-center mb-6">
                Please select the option that best describes you:
              </p>

              {/* Patient Option - Primary CTA */}
              <button
                onClick={() => handleUserTypeSelect("patient")}
                className="w-full group relative overflow-hidden rounded-xl border-2 border-primary bg-gradient-to-r from-primary to-teal-600 p-6 text-left transition-all hover:shadow-lg hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-white/20">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        I'm a Patient
                      </h3>
                      <p className="text-white/90 text-sm">
                        Book a consult for medicinal cannabis treatment
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Pharmacist Option */}
              <button
                onClick={() => handleUserTypeSelect("pharmacist")}
                className="w-full group rounded-xl border-2 border-gray-200 bg-white p-6 text-left transition-all hover:border-primary hover:shadow-md hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Pill className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        I'm a Pharmacist
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Learn about our shared care partnership model
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </button>

              {/* Healthcare Practitioner Option */}
              <button
                onClick={() => handleUserTypeSelect("practitioner")}
                className="w-full group rounded-xl border-2 border-gray-200 bg-white p-6 text-left transition-all hover:border-primary hover:shadow-md hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Stethoscope className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        I'm a Healthcare Practitioner
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Discover referral pathways and clinical support
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            </div>
          ) : isSuccess ? (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Thank You!
              </h3>
              <p className="text-gray-600">
                We'll be in touch shortly with more information about our Shared Care model.
              </p>
            </div>
          ) : (
            /* Contact Form for Pharmacist/Practitioner */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {userType === "pharmacist"
                    ? "Pharmacy Partnership Information"
                    : "Practitioner Referral Information"}
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Please provide your details and we'll send you comprehensive information about our Shared Care model.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Dr. John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="john.smith@clinic.com.au"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="04XX XXX XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {userType === "pharmacist" ? "Pharmacy Name" : "Practice/Clinic Name"}
                </label>
                <input
                  type="text"
                  value={formData.practice}
                  onChange={(e) =>
                    setFormData({ ...formData, practice: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder={
                    userType === "pharmacist"
                      ? "Your Pharmacy Name"
                      : "Your Practice Name"
                  }
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold rounded-lg transition-all"
              >
                {isSubmitting ? "Submitting..." : "Get Information"}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By submitting, you agree to receive information about Surecan's Shared Care model
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
