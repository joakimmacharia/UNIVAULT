# UniVault - Group Project Documentation

## 1. Problem Statement
JKUAT university students frequently face challenges in securing affordable, reliable, and convenient storage for their belongings during holiday breaks and inter-semester recesses. Transporting items back home is often expensive and impractical, while relying on informal storage arrangements can lead to theft or damage. Simultaneously, property owners and landlords in the Juja area have unused, secure space that could be monetized. Currently, there is no centralized, trustworthy platform that seamlessly connects students seeking temporary storage with local landlords, leading to inefficiencies, security risks, and lost revenue opportunities. UniVault bridges this gap by providing a secure, automated, and AI-assisted marketplace tailored for student storage needs.

## 2. Systems Development Methodology
The project followed the **Agile Systems Development Life Cycle (SDLC)**, utilizing iterative sprints to allow for continuous feedback and adaptation. The stages employed were:

1. **Requirements Elicitation & Analysis**: 
   - Conducted user research targeting JKUAT students and Juja landlords to determine core needs (e.g., smart locker PINs, affordable pricing, strict data security).
   - Defined system requirements, including the integration of an AI storage advisor (David) and secure role-based access control.
2. **System & Architecture Design**:
   - Architected the PostgreSQL database schema and defined Row-Level Security (RLS) policies using Supabase.
   - Wireframed the Human-Computer Interface (UI/UX) for both the student (tenant) and landlord portals.
   - Designed the RESTful API architecture and endpoint specifications for the Node.js/Express backend.
3. **Implementation (Development)**:
   - *Sprint 1*: Database provisioning, authentication setup, and core backend CRUD operations.
   - *Sprint 2*: Frontend UI component development, client-side routing, and responsive design implementation.
   - *Sprint 3*: Integration of the Google Gemini AI for the assistant and connecting frontend interfaces to the backend APIs.
   - *Sprint 4*: Payment gateway integration (e.g., M-Pesa/Stripe), automated invoicing, and SMS/Email notification systems.
4. **Testing & Quality Assurance**:
   - Performed comprehensive API endpoint testing using Postman.
   - Conducted UI/UX usability testing focusing on the booking flow and AI chat interface.
   - Rigorously verified Supabase RLS policies to ensure landlords could only manage their own units and students could only access their own bookings.
5. **Deployment & Review**:
   - Deployed the Node.js backend server and the frontend web application.
   - Conducted a final sprint review to validate that all implemented features resolved the issues outlined in the problem statement.

## 3. Team Member Contributions
The project was executed by a team of 4 members, divided into specialized roles to ensure a high-quality, scalable application:

### Frontend Team
* **Member 1: Human-Computer Interface (UI/UX) & Component Architecture**
  * Designed the visual identity, wireframes, and high-fidelity mockups for the UniVault platform to ensure an intuitive user experience.
  * Developed the core responsive layout components, including the storage catalogue grid, interactive booking modals, and navigation systems.
  * Ensured UI accessibility (a11y) standards were met and implemented the overarching CSS/styling design system for a polished, premium interface.
* **Member 2: Client-Side State Management, API & Payment UI Integration**
  * Handled the seamless connection between the frontend components and the backend Express APIs through asynchronous data fetching and error handling.
  * Managed global application state, including tracking the authenticated user's session and the dynamic booking selection state.
  * Built the real-time interactive chat interface for "David" (the AI assistant) and managed the frontend JWT authentication flows and route guarding.
  * Developed the secure payment checkout UI, handling client-side validation for transactions and providing real-time feedback on payment status.

### Backend Team
* **Member 3: Database Schema Design & Core API Development**
  * Architected the Supabase PostgreSQL database, defining tables (`storage_units`, `bookings`, `profiles`) and their relational mappings.
  * Authored complex Row-Level Security (RLS) policies at the database level to ensure strict data isolation between students and landlords.
  * Developed the core RESTful API endpoints in Express (Controllers and Routes) handling the storage catalogue and the complete booking lifecycle (creation, retrieval, and cancellation).
* **Member 4: AI Systems, Security Middleware & Financial Integrations**
  * Integrated the Google Gemini (`gemini-2.0-flash`) SDK into the backend to power the "David" AI advisor, crafting the system prompts and managing model fallbacks for high availability.
  * Implemented critical backend security layers, including the JWT validation middleware (`protectRoute`) to verify and decode Supabase authentication tokens.
  * Developed the business logic algorithms for the Smart Locker PIN generation and dynamic price calculations based on customized storage durations.
  * Engineered the backend payment gateway integrations (e.g., Daraja API for M-Pesa), constructed secure webhook endpoints to process transaction callbacks, and built the automated SMS/Email receipt notification system.
