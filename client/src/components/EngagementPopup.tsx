import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, User, Phone, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EngagementPopupProps {
  onClose: () => void;
}

export function EngagementPopup({ onClose }: EngagementPopupProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    practice: "",
    role: "GP"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Store in database or send to API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'engagement_popup',
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
        // Set cookie to prevent showing again for 30 days
        document.cookie = `surecan_popup_shown=true; max-age=${30 * 24 * 60 * 60}; path=/`;
        
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close popup"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-[#0D9488] to-[#0A2540] p-8 text-white">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
            Welcome to Surecan
          </h2>
          <p className="text-white/90 text-sm">
            Join 450+ healthcare professionals using our Shared Care model
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition-all"
                    placeholder="Dr. John Smith"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition-all"
                    placeholder="john.smith@clinic.com.au"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition-all"
                    placeholder="04XX XXX XXX"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="practice" className="block text-sm font-medium text-gray-700 mb-1">
                  Practice/Clinic Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="practice"
                    name="practice"
                    value={formData.practice}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition-all"
                    placeholder="Your Practice Name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Role *
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="GP">General Practitioner</option>
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="Physiotherapist">Physiotherapist</option>
                  <option value="Psychologist">Psychologist</option>
                  <option value="Allied Health">Allied Health Professional</option>
                  <option value="Other">Other Healthcare Professional</option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0D9488] hover:bg-[#0D9488]/90 text-white py-6 text-base font-medium"
              >
                {isSubmitting ? "Submitting..." : "Get Started with Surecan"}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By submitting, you agree to receive information about Surecan's Shared Care model
              </p>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600">
                We'll be in touch shortly to discuss how Surecan can support your practice.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
