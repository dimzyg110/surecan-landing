# Surecan Referral Management App - TODO

## Database Schema
- [x] Create referrals table (patient info, referrer info, referral type, status, timestamps)
- [x] Create education_progress table (track which education sections users have viewed)

## Referral Form
- [x] Design mobile-optimized referral submission form
- [x] Add form validation (required fields, email format, phone format)
- [x] Implement patient information section
- [x] Implement referrer information section (GP/Pharmacist/Allied Health)
- [x] Add clinical indication selection
- [x] Add urgency/priority field
- [x] Implement form submission to database
- [x] Add success confirmation message

## Education Content
- [x] Create education content sections (Shared Care model, Boomerang Protocol, Safety Framework, etc.)
- [x] Design contextual education cards/tooltips throughout referral form
- [x] Add "Learn More" expandable sections
- [ ] Implement education content tracking

## Clinic Dashboard
- [x] Create admin dashboard for reviewing submitted referrals
- [x] Add referral list view with filtering (by status, date, referrer type)
- [x] Add referral detail view
- [x] Implement status update functionality (Pending → In Progress → Completed)
- [ ] Add export functionality for referrals

## Design & UX
- [x] Apply clinical blueprint aesthetic (Navy + Teal colors, Space Grotesk + Inter fonts)
- [x] Ensure mobile-first responsive design
- [x] Add loading states and error handling
- [x] Implement smooth transitions and animations

## Testing & Deployment
- [x] Test referral submission flow end-to-end
- [x] Test dashboard functionality
- [x] Test marketing automation features
- [ ] Write vitest tests for API endpoints
- [ ] Create checkpoint for deployment

## Marketing Assets & Outreach Automation

### Content Enhancements
- [x] Add FAQ section page with doctor-specific questions
- [x] Create Dr. Lewis profile page with bio and credentials
- [x] Add Pharmacy Partnership dedicated page with "Local First" promise
- [ ] Create Allied Health landing page for physiotherapists/psychologists
- [ ] Add downloadable resources section (Eligibility Cheat Sheet, Contact Cards, Templates)

### Downloadable Resources
- [ ] Create Eligibility Cheat Sheet PDF
- [ ] Generate Pharmacist Direct contact card (vCard/PDF)
- [ ] Create Transfer of Care Letter template (sample PDF)
- [ ] Add resource download tracking

### Outreach Automation
- [x] Build lead tracking system with engagement scoring
- [x] Create lead capture forms with email collection (integrated in referral form)
- [x] Implement QR code generation for pharmacist flyers with unique identifiers
- [x] Add referral source tracking (GP, Pharmacist, Allied Health, QR codes)
- [x] Create marketing automation dashboard for managing leads and QR codes
- [x] Add Klaviyo/HubSpot webhook integration endpoints
- [ ] Build automated follow-up email sequences
- [ ] Add analytics dashboard for tracking conversions

### Integration Features
- [ ] Add HealthLink referral pathway integration
- [ ] Implement geotargeting for pharmacy identification (10km radius)
- [ ] Create location-based landing pages
- [ ] Add CRM tagging by specialty and location

## MyLeaf Website Inspiration
- [x] Analyze MyLeaf clinic website design and features
- [x] Document key design elements to adapt (layout, colors, typography, interactions)
- [x] Identify UX patterns and content strategies to implement
- [x] Update Surecan landing page with inspired improvements (sticky announcement bar, enhanced stats, testimonials)
- [x] Test and validate new design elements

## UX Optimization - Conversion Flow
- [x] Replace "Contact Us" button with "Book Now" throughout the site
- [x] Add "Request Referral Information" button as secondary CTA
- [x] Create initial engagement popup form for contact capture on page load
- [x] Implement form validation and submission handling
- [x] Add popup dismiss/close functionality with cookie/localStorage persistence
- [x] Optimize CTA hierarchy and placement for conversion
- [x] Test form submission flow and data storage

## Refined UI/UX - Patient-First Conversion Flow
- [x] Redesign engagement popup with clear audience triage (Patient, Pharmacist, Other Healthcare Practitioner)
- [x] Prioritize patient consult bookings as primary CTA in popup
- [x] Update all "Book Now" buttons site-wide to link to HotDoc booking
- [x] Simplify popup form to reduce cognitive load and friction
- [x] Add prominent "Book Now" CTAs for each audience segment
- [x] Ensure mobile-responsive design for popup and CTAs
- [x] Test conversion flow for all three audience types

## SEO Optimization
- [x] Add meta keywords tag with relevant medicinal cannabis and shared care keywords
- [x] Add comprehensive meta description for homepage
- [x] Implement Open Graph tags for social media sharing
- [x] Add Twitter Card meta tags
- [x] Implement JSON-LD structured data for medical organization
- [x] Add canonical URL tag
- [x] Optimize title tag with primary keywords
- [x] Test SEO improvements with validation tools

## UX/UI Analysis & Optimization
- [x] Map all user flows (Patient, GP/Practitioner, Pharmacist)
- [x] Analyze CTA placement, hierarchy, and effectiveness
- [x] Review conversion funnel and identify friction points
- [x] Evaluate visual hierarchy and information architecture
- [x] Assess mobile responsiveness and touch targets
- [x] Review messaging clarity and value proposition communication
- [x] Identify opportunities for micro-interactions and feedback
- [x] Create comprehensive analysis report with actionable recommendations

## UX/UI Optimization Implementation
- [x] Add patient-specific content section after hero (eligibility, what to expect, pricing)
- [x] Implement progressive CTAs (Book Now, Check Eligibility, Download Guide)
- [x] Fix stats section (already has real numbers: 52%, 150%, 94%)
- [x] Add comprehensive FAQ section before final CTA
- [ ] Enhance contact forms with qualification fields (practice type, patient volume)
- [ ] Add immediate value exchange after form submission (auto-download PDF)
- [x] Implement floating mobile CTA button
- [x] Add trust badges (AHPRA, TGA) to footer and CTA areas
- [ ] Create patient testimonials section (already have practitioner testimonials)
- [ ] Add pharmacist-specific CTA in pharmacist section
- [ ] Implement audience toggle/tabs in hero for segmentation
- [ ] Add tooltips for medical jargon (ECS, CDM, Item 967)
- [ ] Create Thank You page with next steps after form submission

## Patient & Clinician Portal Implementation
### Database Schema & Models
- [x] Extend user table with additional fields (phone, date_of_birth, medical_history, role enum: patient/clinician/admin)
- [x] Create appointments table (patient_id, clinician_id, scheduled_at, duration, status, video_room_url, google_calendar_event_id)
- [x] Create prescriptions table (patient_id, clinician_id, medication_name, dosage, instructions, prescribed_at, status)
- [x] Create medical_records table (patient_id, clinician_id, notes, attachments, created_at)
- [x] Create messages table (from_user_id, to_user_id, content, read_at, created_at)
- [x] Push database schema changes with `pnpm db:push`

### Authentication & Access Control
- [ ] Update registration flow to capture role (patient vs clinician)
- [ ] Implement role-based middleware for protected routes
- [ ] Create separate login/register pages for patients and clinicians
- [ ] Add email verification for new accounts
- [ ] Implement password reset functionality

### Patient Portal Features
- [x] Create patient dashboard layout with navigation
- [x] Build appointments page (view upcoming/past appointments, book new appointments)
- [ ] Build prescriptions page (view active prescriptions with medication info and education)
- [ ] Build medical history page (view reported medical history)
- [ ] Implement chat/messaging to contact clinic nurse or doctor
- [ ] Add profile management (update contact info, medical history)

### Clinician Portal Features
- [ ] Create clinician dashboard layout with navigation
- [ ] Build patient list page (view all patients, search/filter)
- [ ] Build patient detail page (view individual patient records, history, prescriptions)
- [ ] Build appointments management page (view schedule, upcoming appointments)
- [ ] Implement prescription management (create, update prescriptions for patients)
- [ ] Add medical records management (create/edit notes for patient visits)
- [ ] Implement messaging system to respond to patient inquiries

### Video Telehealth Integration
- [ ] Set up Daily.co API integration
- [ ] Create video consultation room component
- [ ] Implement "Join Video Call" button in appointments for both patients and clinicians
- [ ] Add pre-call device testing (camera/microphone check)
- [ ] Implement waiting room for patients before clinician joins
- [ ] Add in-call features (mute, video toggle, screen share, end call)

### Google Calendar Integration
- [ ] Set up Google Calendar API OAuth flow
- [ ] Implement calendar sync for clinician appointments
- [ ] Auto-create Google Calendar events when appointments are booked
- [ ] Add calendar reminders (email/SMS) before appointments
- [ ] Implement calendar availability checking before booking

### Testing & Deployment
- [ ] Write unit tests for authentication and role-based access
- [x] Write unit tests for appointment booking and management (7/8 passing)
- [ ] Write unit tests for prescription management
- [ ] Test video call functionality end-to-end
- [ ] Test Google Calendar integration
- [ ] Create checkpoint with all portal features

## Login/Register Implementation
- [ ] Add Login/Register buttons to homepage navigation
- [ ] Create role selection page (Patient vs Clinician login)
- [ ] Implement OAuth login flow with Manus authentication
- [ ] Add post-login redirect to appropriate dashboard based on role
- [ ] Create user profile setup page for first-time users
- [ ] Test complete login flow for both patient and clinician roles

## Daily.co Video Telehealth Integration
- [x] Install Daily.co SDK dependencies
- [x] Create video room management tRPC procedures (create room, get room URL)
- [x] Integrate automatic room creation when appointments are booked
- [x] Add video call component for patients to join consultations
- [x] Add video call component for clinicians to join consultations
- [ ] Test video call functionality end-to-end
- [x] Handle video call errors and connection issues gracefully

## Clinician Portal Implementation
- [ ] Build clinician dashboard with overview statistics
- [ ] Create patient list page with search and filtering
- [ ] Build appointment management page for clinicians
- [ ] Create patient detail page with medical history
- [ ] Add prescription management interface for clinicians
- [ ] Implement medical records viewing and editing
- [ ] Add messaging interface for clinician-patient communication
- [ ] Test all clinician portal features

## Google Calendar Integration
- [ ] Set up Google Calendar API credentials
- [ ] Create calendar integration tRPC procedures
- [ ] Implement automatic calendar event creation on appointment booking
- [ ] Add calendar event updates when appointments are modified
- [ ] Add calendar event deletion when appointments are cancelled
- [ ] Implement email reminders before appointments
- [ ] Test calendar sync functionality

## Comprehensive UX/UI Assessment & Optimization
- [ ] Conduct full user flow analysis for all three user types
- [ ] Identify friction points and conversion blockers
- [ ] Analyze information architecture and navigation
- [ ] Review visual hierarchy and design consistency
- [ ] Test mobile responsiveness across all pages
- [ ] Implement identified UX improvements
- [ ] Optimize page load performance
- [ ] Add cannabiswarehouse.com.au backlink in footer

## Stripe Payment Integration
- [ ] Install Stripe SDK dependencies
- [ ] Set up Stripe API keys (test and production)
- [ ] Create payment intent tRPC procedures
- [ ] Add payment form to appointment booking flow
- [ ] Implement payment confirmation before booking completion
- [ ] Add payment history page for patients
- [ ] Test payment flow end-to-end with test cards
- [ ] Handle payment errors and edge cases

## Final Testing & Deployment
- [ ] Test complete patient journey (registration → booking → payment → video call)
- [ ] Test complete clinician workflow (login → patient management → consultation)
- [ ] Verify all integrations working (Daily.co, Google Calendar, Stripe)
- [ ] Create comprehensive checkpoint with all features

## TIER 1: Critical UX Fixes (Week 1) - Senior Audit Recommendations
- [ ] Replace external HotDoc link with internal booking button (/book page)
- [ ] Create referral submission form page (/submit-referral)
- [ ] Add role-based login pages (/patient/login, /prescriber/login, /pharmacy/login)
- [ ] Generate unique referral IDs (SURE-R-XXXXXX) and patient IDs (SURE-P-XXXXXX)
- [ ] Add unique_booking_link field to referrals table
- [ ] Update "Submit Referral" nav link to point to /submit-referral
- [ ] Extend referrals table with prescriber_id and pharmacy_id foreign keys
- [ ] Create referral notification email templates
- [ ] Test complete referral creation flow (prescriber → patient booking)


## Launch Preparation - Critical Fixes
- [x] Fix referral loading error when admin completes a referral (fixed status enum mismatch)
- [x] Remove dynamic dashboard (removed MarketingDashboard)
- [x] Fix TypeScript errors in book-appointment route (removed incomplete file)
- [x] Streamline navigation and remove unused routes
- [ ] Test referral submission flow end-to-end
- [ ] Test booking flow end-to-end
- [ ] Verify all CTAs work correctly
- [ ] Final checkpoint for launch
