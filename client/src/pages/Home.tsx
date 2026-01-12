import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Shield, 
  Users, 
  BarChart3, 
  CheckCircle2, 
  Phone,
  Mail,
  ChevronDown,
  Stethoscope,
  Pill,
  Heart,
  TrendingUp,
  Clock,
  FileCheck
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

/* ============================================
   DESIGN SYSTEM: Clinical Blueprint
   - Typography: Space Grotesk (headlines) + Inter (body)
   - Colors: Navy (#0A2540) + Teal (#0D9488) + Off-white
   - Layout: Asymmetric sections with blueprint grid texture
   ============================================ */

// Animated counter hook for statistics
function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(!startOnView);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (startOnView) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
          }
        },
        { threshold: 0.5 }
      );
      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [startOnView, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, hasStarted]);

  return { count, ref };
}

// Fade in animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background blueprint-grid">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Problem Statement */}
      <ProblemSection />
      
      {/* The Boomerang Protocol */}
      <BoomerangSection />
      
      {/* Who We Serve - Target Audiences */}
      <AudienceSection />
      
      {/* Safety Pillars */}
      <SafetySection />
      
      {/* Statistics & Results */}
      <StatsSection />
      
      {/* How It Works */}
      <ProcessSection />
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 lg:h-20">
        <a href="#" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-[#0D9488] flex items-center justify-center">
            <span className="text-white font-bold text-lg" style={{ fontFamily: 'Space Grotesk' }}>S</span>
          </div>
          <span className="text-xl font-bold text-[#0A2540]" style={{ fontFamily: 'Space Grotesk' }}>
            Surecan
          </span>
        </a>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#problem" className="text-sm font-medium text-[#0A2540]/70 hover:text-[#0D9488] transition-colors">
            The Challenge
          </a>
          <a href="#boomerang" className="text-sm font-medium text-[#0A2540]/70 hover:text-[#0D9488] transition-colors">
            Our Model
          </a>
          <a href="#audiences" className="text-sm font-medium text-[#0A2540]/70 hover:text-[#0D9488] transition-colors">
            Who We Serve
          </a>
          <a href="#safety" className="text-sm font-medium text-[#0A2540]/70 hover:text-[#0D9488] transition-colors">
            Safety
          </a>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488]/10"
            onClick={() => window.location.href = '/dashboard'}
          >
            Dashboard
          </Button>
          <Button 
            className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white"
            onClick={() => window.location.href = '/referral'}
          >
            Submit Referral
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-transparent to-[#0D9488]/5 pointer-events-none" />
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-xl"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D9488]/10 text-[#0D9488] text-sm font-medium rounded-full">
                <Shield className="w-4 h-4" />
                Authorised Prescriber Status
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0A2540] leading-tight mb-6"
              style={{ fontFamily: 'Space Grotesk' }}
            >
              Your Patient.{" "}
              <span className="text-[#0D9488]">Your Practice.</span>{" "}
              Our Specialist Support.
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-[#0A2540]/70 mb-8 leading-relaxed"
            >
              The Shared Care model that stabilises complex patients and returns them to you. 
              We handle the complexity—you are able to have your patients benefit from additional therapies, with a compliant and ethical ECS consult.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Button 
                size="lg"
                className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white gap-2"
                onClick={() => window.location.href = '/referral'}
              >
                Submit Referral
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-[#0A2540]/20 text-[#0A2540] hover:bg-[#0A2540]/5"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Contact Us
              </Button>
            </motion.div>
            
            {/* Trust indicators */}
            <motion.div 
              variants={fadeInUp}
              className="mt-12 pt-8 border-t border-[#0A2540]/10"
            >
              <p className="text-sm text-[#0A2540]/50 mb-4">Trusted by healthcare professionals across Australia</p>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#0A2540]" style={{ fontFamily: 'Space Mono' }}>450+</p>
                  <p className="text-xs text-[#0A2540]/60">Active Patients</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#0A2540]" style={{ fontFamily: 'Space Mono' }}>94%</p>
                  <p className="text-xs text-[#0A2540]/60">Retention Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#0A2540]" style={{ fontFamily: 'Space Mono' }}>100%</p>
                  <p className="text-xs text-[#0A2540]/60">Patient Return</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right: Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#0A2540]/10">
              <img 
                src="/images/hero-bridge.png" 
                alt="Surecan Shared Care Bridge Model"
                className="w-full h-auto"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#0D9488]/10 rounded-full blur-2xl" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#0A2540]/5 rounded-full blur-3xl" />
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <a href="#problem" className="flex flex-col items-center gap-2 text-[#0A2540]/40 hover:text-[#0D9488] transition-colors">
            <span className="text-xs">Scroll to explore</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section id="problem" className="py-24 bg-[#0A2540]">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.span 
            variants={fadeInUp}
            className="inline-block px-4 py-2 bg-white/10 text-[#0D9488] text-sm font-medium rounded-full mb-6"
          >
            The Industry Problem
          </motion.span>
          
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8"
            style={{ fontFamily: 'Space Grotesk' }}
          >
            The "Walled Garden" Approach is{" "}
            <span className="text-[#F87171]">Breaking Trust</span>
          </motion.h2>
          
          <motion.div variants={fadeInUp} className="space-y-6 text-lg text-white/70">
            <p>
              The Majority of cannabis clinics operate as closed loops—patients self-refer, 
              the clinic keeps them locked in and holds their prescriptions. Patients primary GPs lose visibility into their patient's care. We aim to remedy this disconnect.
            </p>
            <p>
              This model creates fear among healthcare providers: fear of losing patients, 
              fear of liability, and fear of being cut out of the care equation entirely.
            </p>
          </motion.div>
          
          {/* Old vs New comparison */}
          <motion.div 
            variants={fadeInUp}
            className="mt-16 grid md:grid-cols-2 gap-8"
          >
            <div className="p-8 bg-white/5 rounded-xl border border-white/10">
              <div className="w-12 h-12 rounded-full bg-[#F87171]/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-[#F87171] text-xl">✕</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>
                Old Model
              </h3>
              <ul className="space-y-3 text-left text-white/60">
                <li className="flex items-start gap-3">
                  <span className="text-[#F87171] mt-1">→</span>
                  Patient self-refers to clinic
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#F87171] mt-1">→</span>
                  Clinic keeps patient - Preventing Patient autonomy of choice
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#F87171] mt-1">→</span>
                  Primary Care GP loses visibility over their patient
                </li>
              </ul>
            </div>
            
            <div className="p-8 bg-[#0D9488]/20 rounded-xl border border-[#0D9488]/30">
              <div className="w-12 h-12 rounded-full bg-[#0D9488]/30 flex items-center justify-center mb-4 mx-auto">
                <CheckCircle2 className="w-6 h-6 text-[#0D9488]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>
                Surecan Model
              </h3>
              <ul className="space-y-3 text-left text-white/80">
                <li className="flex items-start gap-3">
                  <span className="text-[#0D9488] mt-1">→</span>
                  GP refers complex patient OR Patient self-refers and the primary GP is informed for a holistic care model.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0D9488] mt-1">→</span>
                  Surecan clinicians stabilise patient if eligable. This structured on the New Bulk Billing Incentives Program
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0D9488] mt-1">→</span>
                  Patient "boomerangs" back to GP
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function BoomerangSection() {
  return (
    <section id="boomerang" className="py-24 bg-background">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="text-center mb-16">
            <motion.span 
              variants={fadeInUp}
              className="inline-block px-4 py-2 bg-[#0D9488]/10 text-[#0D9488] text-sm font-medium rounded-full mb-6"
            >
              The Core Innovation
            </motion.span>
            
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A2540] mb-6"
              style={{ fontFamily: 'Space Grotesk' }}
            >
              The Boomerang Protocol
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-[#0A2540]/70 max-w-2xl mx-auto"
            >
              We stabilize the patient and return them for chronic disease management. 
              We explicitly refuse to take over primary care duties.
            </motion.p>
          </div>
          
          {/* Boomerang Flow Diagram */}
          <motion.div 
            variants={fadeInUp}
            className="max-w-4xl mx-auto mb-16"
          >
            <img 
              src="/images/boomerang-flow.png" 
              alt="Boomerang Protocol Flow - Referral Out, Stabilization, Return to GP"
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </motion.div>
          
          {/* Core Promise */}
          <motion.div 
            variants={fadeInUp}
            className="max-w-3xl mx-auto bg-gradient-to-r from-[#0A2540] to-[#0A2540]/90 rounded-2xl p-8 md:p-12 text-center"
          >
            <blockquote className="text-2xl md:text-3xl font-medium text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>
              "We handle the complexity, you keep the patient and maintain visibility over GP care"
            </blockquote>
            <p className="text-white/60">— The Surecan Promise</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function AudienceSection() {
  const audiences = [
    {
      icon: Stethoscope,
      title: "General Practitioners",
      painPoint: "Unknown treatments from rogue and competitive Clinics, undermining the care and intentions of the patients usual GP.",
      solution: "We stabilise and return patients for CDM. We never take over primary care duties, without shared care co-ordination.",
      color: "#0D9488"
    },
    {
      icon: Pill,
      title: "Pharmacists",
      painPoint: "Online clinics use centralised dispensaries, removing local pharmacies, often channeling the patient, who may or may not, receive quality care for complex ailments.",
      solution: "If you refer a patient to us, the script is not held ransom. It is accessible and visible on SafeScript, and a patient review is sent back to you, to ensure interdisciplinary care. We send scripts to the referring pharmacy, or pharmacy of choice.",
      color: "#0A2540"
    },
    {
      icon: Heart,
      title: "Allied Health",
      painPoint: "Patients in too much pain or anxiety to engage effectively with therapy.",
      solution: "We stabilise symptoms so patients can return and complete their treatment plan. We make your therapy work better. We can support your patients transparently and help educate everyone involved.",
      color: "#F59E0B"
    }
  ];

  return (
    <section id="audiences" className="py-24 bg-[#F8FAFC]">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="text-center mb-16">
            <motion.span 
              variants={fadeInUp}
              className="inline-block px-4 py-2 bg-[#0D9488]/10 text-[#0D9488] text-sm font-medium rounded-full mb-6"
            >
              Who We Serve
            </motion.span>
            
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A2540] mb-6"
              style={{ fontFamily: 'Space Grotesk' }}
            >
              Built for Healthcare Partners
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-[#0A2540]/70 max-w-2xl mx-auto"
            >
              Our Shared Care model addresses the specific concerns of each healthcare provider.
              We are a product agnostic clinic, that does not have any conflicts of interest. We care for the outcomes, and work to optimise patient outcomes for Chronic Conditions. 
              We aim to help bridge medical care in a manner that is ethical, compliant and highly experienced.
            </motion.p>
          </div>
          
          {/* Network Diagram */}
          <motion.div 
            variants={fadeInUp}
            className="max-w-2xl mx-auto mb-16"
          >
            <img 
              src="/images/network-diagram.png" 
              alt="Shared Care Model Network"
              className="w-full h-auto"
            />
          </motion.div>
          
          {/* Audience Cards */}
          <motion.div 
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {audiences.map((audience, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-[#0A2540]/5"
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${audience.color}15` }}
                >
                  <audience.icon className="w-7 h-7" style={{ color: audience.color }} />
                </div>
                
                <h3 className="text-xl font-bold text-[#0A2540] mb-4" style={{ fontFamily: 'Space Grotesk' }}>
                  {audience.title}
                </h3>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-[#F87171] mb-2">Pain Point:</p>
                  <p className="text-[#0A2540]/70 text-sm">{audience.painPoint}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-[#0D9488] mb-2">Our Solution:</p>
                  <p className="text-[#0A2540]/70 text-sm">{audience.solution}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function SafetySection() {
  const pillars = [
    {
      icon: Shield,
      title: "Authorized Prescriber",
      description: "AP status removes TGA delays. Direct prescribing authority for faster patient access.",
      stat: "0",
      statLabel: "TGA Delays"
    },
    {
      icon: Users,
      title: "Nurse-Led Model",
      description: "3:1 nurse-to-doctor ratio. Nurses handle intake, consent, and education. Doctors focus on clinical assessment. No tick and flick consults, proper attention is provided with excellent collaborative support.",
      stat: "3:1",
      statLabel: "Nurse Ratio"
    },
    {
      icon: BarChart3,
      title: "Compliance Monitoring",
      description: "Cubiko + Halo Connect integration. Automated TGA permit tracking. No patient falls through the cracks.",
      stat: "100%",
      statLabel: "Compliance"
    }
  ];

  return (
    <section id="safety" className="py-24 bg-background">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="text-center mb-16">
            <motion.span 
              variants={fadeInUp}
              className="inline-block px-4 py-2 bg-[#0D9488]/10 text-[#0D9488] text-sm font-medium rounded-full mb-6"
            >
              Clinical Governance
            </motion.span>
            
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A2540] mb-6"
              style={{ fontFamily: 'Space Grotesk' }}
            >
              The Safety Framework
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-[#0A2540]/70 max-w-2xl mx-auto"
            >
              Three pillars that ensure clinical excellence and regulatory compliance.
            </motion.p>
          </div>
          
          {/* Safety Pillars Image */}
          <motion.div 
            variants={fadeInUp}
            className="max-w-4xl mx-auto mb-16"
          >
            <img 
              src="/images/safety-pillars.png" 
              alt="Medical Safety Framework - Three Pillars"
              className="w-full h-auto"
            />
          </motion.div>
          
          {/* Pillar Cards */}
          <motion.div 
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative bg-white rounded-xl p-8 shadow-sm border border-[#0A2540]/5 overflow-hidden"
              >
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0D9488]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-[#0D9488]/10 flex items-center justify-center mb-6">
                    <pillar.icon className="w-7 h-7 text-[#0D9488]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#0A2540] mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                    {pillar.title}
                  </h3>
                  
                  <p className="text-[#0A2540]/70 mb-6">
                    {pillar.description}
                  </p>
                  
                  <div className="pt-4 border-t border-[#0A2540]/10">
                    <p className="text-3xl font-bold text-[#0D9488]" style={{ fontFamily: 'Space Mono' }}>
                      {pillar.stat}
                    </p>
                    <p className="text-sm text-[#0A2540]/50">{pillar.statLabel}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Compliance Dashboard Preview */}
          <motion.div 
            variants={fadeInUp}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#0A2540]/5">
              <div className="p-4 bg-[#0A2540] text-white">
                <h4 className="font-medium" style={{ fontFamily: 'Space Grotesk' }}>Live Compliance Dashboard</h4>
              </div>
              <img 
                src="/images/surecan_compliance_dashboard.png" 
                alt="Live Compliance Monitoring Dashboard"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection() {
  const revenueCounter = useCountUp(52, 2000);
  const efficiencyCounter = useCountUp(150, 2000);
  const retentionCounter = useCountUp(94, 2000);

  return (
    <section className="py-24 bg-[#0A2540]">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="text-center mb-16">
            <motion.span 
              variants={fadeInUp}
              className="inline-block px-4 py-2 bg-white/10 text-[#0D9488] text-sm font-medium rounded-full mb-6"
            >
              Proven Results
            </motion.span>
            
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: 'Space Grotesk' }}
            >
              The Numbers Speak
            </motion.h2>
          </div>
          
          {/* Stats Grid */}
          <motion.div 
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            <motion.div 
              variants={fadeInUp}
              ref={revenueCounter.ref}
              className="text-center p-8 bg-white/5 rounded-xl border border-white/10"
            >
              <TrendingUp className="w-10 h-10 text-[#0D9488] mx-auto mb-4" />
              <p className="text-5xl font-bold text-white mb-2" style={{ fontFamily: 'Space Mono' }}>
                +{revenueCounter.count}%
              </p>
              <p className="text-white/60">Revenue Per Session</p>
              <p className="text-sm text-white/40 mt-2">Force Multiplier Workflow</p>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              ref={efficiencyCounter.ref}
              className="text-center p-8 bg-white/5 rounded-xl border border-white/10"
            >
              <Clock className="w-10 h-10 text-[#0D9488] mx-auto mb-4" />
              <p className="text-5xl font-bold text-white mb-2" style={{ fontFamily: 'Space Mono' }}>
                {efficiencyCounter.count}%
              </p>
              <p className="text-white/60">More Patient Care Time</p>
              <p className="text-sm text-white/40 mt-2">Nurse-Led Model</p>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              ref={retentionCounter.ref}
              className="text-center p-8 bg-white/5 rounded-xl border border-white/10"
            >
              <FileCheck className="w-10 h-10 text-[#0D9488] mx-auto mb-4" />
              <p className="text-5xl font-bold text-white mb-2" style={{ fontFamily: 'Space Mono' }}>
                {retentionCounter.count}%
              </p>
              <p className="text-white/60">Patient Retention</p>
              <p className="text-sm text-white/40 mt-2">Compliance Monitoring</p>
            </motion.div>
          </motion.div>
          
          {/* Charts Row */}
          <motion.div 
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.div 
              variants={fadeInUp}
              className="bg-white rounded-xl overflow-hidden"
            >
              <img 
                src="/images/surecan_outcome_stabilization.png" 
                alt="Patient Pain Reduction Over Time"
                className="w-full h-auto"
              />
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="bg-white rounded-xl overflow-hidden"
            >
              <img 
                src="/images/surecan_financial_comparison.png" 
                alt="Financial Efficiency Comparison"
                className="w-full h-auto"
              />
            </motion.div>
          </motion.div>
          
          {/* Workflow Efficiency */}
          <motion.div 
            variants={fadeInUp}
            className="mt-8 max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-xl overflow-hidden">
              <img 
                src="/images/surecan_workflow_efficiency.png" 
                alt="Patient Care Minutes Comparison"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    {
      number: "01",
      title: "Refer Complex Patient",
      description: "GP identifies a patient who could benefit from cannabinoid therapy. Simple referral process.",
      icon: Stethoscope
    },
    {
      number: "02",
      title: "Surecan Stabilizes",
      description: "Our nurse-led model handles intake, education, and consent. Doctor provides focused clinical assessment.",
      icon: Shield
    },
    {
      number: "03",
      title: "Patient Returns to GP",
      description: "Once stable, patient 'boomerangs' back for ongoing CDM. GP retains longitudinal care and revenue.",
      icon: Heart
    }
  ];

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="text-center mb-16">
            <motion.span 
              variants={fadeInUp}
              className="inline-block px-4 py-2 bg-[#0D9488]/10 text-[#0D9488] text-sm font-medium rounded-full mb-6"
            >
              Simple Process
            </motion.span>
            
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A2540] mb-6"
              style={{ fontFamily: 'Space Grotesk' }}
            >
              How It Works
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-[#0A2540]/70 max-w-2xl mx-auto"
            >
              A straightforward three-step process that respects your practice and your patients.
            </motion.p>
          </div>
          
          {/* Process Steps */}
          <motion.div 
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative flex gap-8 mb-12 last:mb-0"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[39px] top-20 w-0.5 h-full bg-[#0D9488]/20 dotted-line" />
                )}
                
                {/* Step number */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-[#0D9488] flex items-center justify-center">
                    <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Mono' }}>
                      {step.number}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3 mb-3">
                    <step.icon className="w-5 h-5 text-[#0D9488]" />
                    <h3 className="text-xl font-bold text-[#0A2540]" style={{ fontFamily: 'Space Grotesk' }}>
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-[#0A2540]/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-[#0A2540] to-[#0A2540]/95 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0D9488]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#0D9488]/5 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <motion.h2 
                variants={fadeInUp}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
                style={{ fontFamily: 'Space Grotesk' }}
              >
                Ready to Partner?
              </motion.h2>
              
              <motion.p 
                variants={fadeInUp}
                className="text-lg text-white/70 mb-10 max-w-xl mx-auto"
              >
                Join the Shared Care network. Keep your patients, grow your revenue, 
                and provide better outcomes together.
              </motion.p>
              
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              >
                <Button 
                  size="lg"
                  className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Schedule a Call
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email Us
                </Button>
              </motion.div>
              
              {/* Contact Info */}
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-8 justify-center text-white/60"
              >
                <div className="flex items-center gap-2 justify-center">
                  <Phone className="w-4 h-4" />
                  <span>1300 SURECAN</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Mail className="w-4 h-4" />
                  <span>partners@surecan.com.au</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 bg-[#0A2540] border-t border-white/10">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0D9488] flex items-center justify-center">
              <span className="text-white font-bold" style={{ fontFamily: 'Space Grotesk' }}>S</span>
            </div>
            <span className="text-lg font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
              Surecan Clinic
            </span>
          </div>
          
          <p className="text-white/40 text-sm">
            © 2025 Surecan Clinic. The Shared Care Bridge. All rights reserved.
          </p>
          
          <div className="flex gap-6">
            <a href="#" className="text-white/40 hover:text-[#0D9488] text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-white/40 hover:text-[#0D9488] text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
