export type ListingStatus = "for-sale" | "pending" | "sold";

export type Listing = {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  status: ListingStatus;
  description: string;
  image: string;
  featured?: boolean;
};

// Edit this file to add/remove listings. Each listing renders on the
// Listings page and (if `featured: true`) on the home page Featured section.
export const listings: Listing[] = [
  {
    id: "9832-sw-46th-ct",
    title: "Luxury Villa with a View",
    address: "9832 SW 46th Court",
    city: "North Port",
    state: "FL",
    price: 600000,
    beds: 4,
    baths: 2,
    sqft: 3064,
    status: "for-sale",
    description:
      "An expansive 4-bedroom retreat with vaulted ceilings, a chef's kitchen, and sweeping outdoor entertaining space. Designed for families that live large.",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=85",
    featured: true,
  },
  {
    id: "5440-agostino-way",
    title: "Cozy Minimalist Home",
    address: "5440 Agostino Way",
    city: "North Port",
    state: "FL",
    price: 495000,
    beds: 3,
    baths: 1.5,
    sqft: 2000,
    status: "for-sale",
    description:
      "A two-story residence with sleek architectural lines, abundant natural light, and a calm, contemporary palette throughout.",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=85",
    featured: true,
  },
  {
    id: "99-vivante-blvd",
    title: "Modern & Quiet Oasis",
    address: "99 Vivante Boulevard",
    city: "North Port",
    state: "FL",
    price: 380000,
    beds: 2,
    baths: 2,
    sqft: 1698,
    status: "for-sale",
    description:
      "A peaceful 2-bedroom condo with thoughtful finishes, an open layout, and a private balcony — turn-key for the discerning buyer.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=85",
    featured: true,
  },
  {
    id: "mid-century",
    title: "Mid-Century Styled Home",
    address: "Address available on request",
    city: "North Port",
    state: "FL",
    price: 389900,
    beds: 3,
    baths: 2,
    sqft: 2653,
    status: "sold",
    description:
      "Recently sold. A textbook mid-century gem with restored original features and a generous floor plan.",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&q=85",
  },
];
