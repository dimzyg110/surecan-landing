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
