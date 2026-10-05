/* ============================================================
   Centralized image assets + prototype mock data.
   All external images use stable Unsplash URLs so they are easy
   to swap for owned assets later. Keep photographic parity with
   the reference design (storage rooms + portraits).
   ============================================================ */

// David — Personal Storage Advisor (friendly African male in a UniVault polo).
// Swap this single import to change David everywhere in the app.
import davidPic from '../assets/david-pic.webp';

export const DAVID_IMG = davidPic;
export const DAVID_IMG_WIDE = davidPic;

export const DAVID = {
  name: 'David',
  role: 'Personal Storage Advisor',
  img: DAVID_IMG,
};

// Storage room photography
export const ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=800&q=80',
];

export const roomImage = (seed = 0) =>
  ROOM_IMAGES[Math.abs(Number(seed) || 0) % ROOM_IMAGES.length];

// Generic user avatars for messages / reviews
export const AVATARS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80',
];
export const avatarFor = (seed = 0) => AVATARS[Math.abs(Number(seed) || 0) % AVATARS.length];

// Landlord lifestyle image (Become a Landlord hero)
export const LANDLORD_HERO_IMG =
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80';

// Landing hero — a bright, beautiful room (Airbnb-style photography)
export const HERO_ROOM_IMG =
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1100&q=80';

// Student reviews (real portrait photos + short testimonials)
export const REVIEWS = [
  { name: 'James Otieno', school: 'JKUAT · Computer Science', rating: 5, avatar: avatarFor(3),
    text: 'The whole process took less than 5 minutes. Dropped my things before travelling and picked them up spotless. Genuinely effortless.' },
  { name: 'Mary Wanjiru', school: 'JKUAT · Actuarial Science', rating: 5, avatar: avatarFor(1),
    text: 'Very secure and close to campus. The landlord was verified and the room had CCTV — my parents felt completely at ease.' },
  { name: 'Brian Kiprop', school: 'JKUAT · Mechanical Eng.', rating: 5, avatar: avatarFor(0),
    text: 'Way cheaper than carrying everything home every holiday. Paid with M-Pesa in seconds. I recommend it to my whole class.' },
];

/* ---------------- Fallback / demo listings ----------------
   Used only when the backend returns no units so the redesigned
   UI still demonstrates full visual parity with the prototype. */
export const DEMO_UNITS = [
  {
    id: 'demo-1', unit_number: 'Spacious Room in Gachororo', size: 'large',
    location: 'Gachororo, Juja', distance: '0.6 km from JKUAT', price_per_month: 1200,
    rating: 4.6, reviews: 28, featured: true,
    amenities: ['24/7 Security', 'CCTV', 'Easy Access', 'Dry Space'],
    description: 'Large, clean and secure room ideal for storing items during the holidays.',
  },
  {
    id: 'demo-2', unit_number: 'Storage Space in Theta', size: 'medium',
    location: 'Theta, Juja', distance: '1.1 km from JKUAT', price_per_month: 900,
    rating: 4.3, reviews: 16, featured: false,
    amenities: ['Secure', 'CCTV', 'Clean', 'Ground Floor'],
    description: 'Comfortable mid-size storage space close to campus.',
  },
  {
    id: 'demo-3', unit_number: 'Room in Muthega', size: 'medium',
    location: 'Muthega, Juja', distance: '2.2 km from JKUAT', price_per_month: 1000,
    rating: 4.7, reviews: 31, featured: false,
    amenities: ['24/7 Security', 'Dry Space', 'Easy Access'],
    description: 'Quiet and secure room in Muthega.',
  },
  {
    id: 'demo-4', unit_number: 'Lockable Space in Kimbo', size: 'small',
    location: 'Kimbo, Juja', distance: '1.5 km from JKUAT', price_per_month: 850,
    rating: 4.4, reviews: 19, featured: false,
    amenities: ['Lockable', 'CCTV', 'Secure'],
    description: 'Affordable lockable space, perfect for smaller loads.',
  },
];

export const DEMO_CONVERSATIONS = [
  { id: 1, name: 'John Mwangi', sub: '(Spacious Room in Gachororo)', time: '2 min ago', unread: true, avatar: avatarFor(0), online: true,
    messages: [
      { from: 'them', text: 'Hi Patrick, your booking is confirmed ✅', time: '10:24 AM' },
      { from: 'me', text: 'Great! Can I come drop off my items on Sunday?', time: '10:30 AM' },
      { from: 'them', text: "Yes, anytime between 9AM – 6PM. I'll be around.", time: '10:32 AM' },
    ] },
  { id: 2, name: 'Mary Wanjiku', sub: '(Storage in Theta)', time: '2 hours ago', unread: false, avatar: avatarFor(1), online: false,
    messages: [{ from: 'them', text: 'Your booking has been confirmed.', time: 'Yesterday' }] },
  { id: 3, name: 'UniVault Support', sub: "David · here to help", time: '1 day ago', unread: false, avatar: DAVID_IMG, support: true, online: true,
    messages: [{ from: 'them', text: "Hi, I'm David from UniVault Support. How can I help you today?", time: 'Mon' }] },
  { id: 4, name: 'Peter Kamau', sub: '(Lockable Space in Kimbo)', time: '2 days ago', unread: false, avatar: avatarFor(3), online: false,
    messages: [{ from: 'them', text: 'Thanks for reaching out!', time: '2 days ago' }] },
];

export const HELP_TOPICS = [
  { icon: 'HelpCircle', title: 'How does UniVault work?', desc: 'Learn how to find and book storage easily.' },
  { icon: 'CreditCard', title: 'Payments & Refunds', desc: 'Everything about payments and refunds.' },
  { icon: 'ShieldCheck', title: 'Safety & Security', desc: 'How we keep your items safe and secure.' },
  { icon: 'CalendarCheck', title: 'Managing Bookings', desc: 'Change or cancel your booking.' },
  { icon: 'Package', title: 'Storage Guidelines', desc: 'What you can and cannot store.' },
  { icon: 'Home', title: 'For Landlords', desc: 'Learn how to list your space.' },
];
