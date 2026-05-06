export type TeamMember = {
  name: string;
  role: string;
  image: string;
  bio?: string;
  email?: string;
  phone?: string;
};

// IMPORTANT: Replace placeholder team members (2–4) with real team
// names, photos, and bios before launch. Place real photos in `public/team/`
// and reference like `/team/jane.jpg`.
export const team: TeamMember[] = [
  {
    name: "Luis Matos",
    role: "Broker / Owner",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=85",
    bio: "Luis founded Prestige Florida Homes Realty to deliver concierge-level service to buyers and sellers across the North Port and greater Sarasota area.",
    email: "luismatosthebroker@gmail.com",
    phone: "913-201-3242",
  },
  {
    name: "Team Member Two",
    role: "Senior Realtor",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=85",
    bio: "Replace with real bio. Specialty in waterfront and luxury single-family homes.",
  },
  {
    name: "Team Member Three",
    role: "Buyer Specialist",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=85",
    bio: "Replace with real bio. Helps first-time and relocation buyers find their fit.",
  },
  {
    name: "Team Member Four",
    role: "Listing Specialist",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=85",
    bio: "Replace with real bio. Markets sellers' homes with professional photography and strategy.",
  },
];
