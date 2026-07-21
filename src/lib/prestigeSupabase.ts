import { createClient } from "@supabase/supabase-js";

export type PrestigeListingStatus = "for-sale" | "pending" | "sold";

export type PrestigeListingDraft = {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  status: PrestigeListingStatus;
  description: string;
  image: string;
  featured: boolean;
  gallery: string[];
  features: string[];
  published: boolean;
  displayOrder: number;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_PRESTIGE_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_PRESTIGE_SUPABASE_KEY || "";
const LISTING_IMAGES_BUCKET = process.env.NEXT_PUBLIC_PRESTIGE_LISTING_BUCKET || "listing-images";

export const isPrestigeSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_KEY);

export const prestigeSupabase = isPrestigeSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

const emptyDraft: PrestigeListingDraft = {
  id: "",
  title: "",
  address: "",
  city: "North Port",
  state: "FL",
  price: 0,
  beds: 3,
  baths: 2,
  sqft: 1800,
  status: "for-sale",
  description: "",
  image: "",
  featured: true,
  gallery: [],
  features: [],
  published: true,
  displayOrder: 0,
};

function uniqueTrimmed(values: string[] = []) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function mapRowToListing(row: Record<string, unknown>): PrestigeListingDraft {
  const galleryUrls = uniqueTrimmed((row.gallery_urls as string[]) || []);
  return {
    id: row.id as string,
    title: (row.title as string) || "",
    address: (row.address as string) || "",
    city: (row.city as string) || "",
    state: (row.state as string) || "FL",
    price: Number(row.price || 0),
    beds: Number(row.beds || 0),
    baths: Number(row.baths || 0),
    sqft: Number(row.sqft || 0),
    status: (row.status as PrestigeListingStatus) || "for-sale",
    description: (row.description as string) || "",
    image: (row.image_url as string) || galleryUrls[0] || "",
    featured: !!row.featured,
    gallery: galleryUrls,
    features: (row.features as string[]) || [],
    published: row.published !== false,
    displayOrder: Number(row.display_order || 0),
  };
}

async function compressListingImage(file: File): Promise<File> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = objectUrl;
    });

    // Downscale only if oversized — never crop. Preserves the photo's real
    // composition instead of forcing every upload into a fixed rectangle.
    const maxDimension = 1920;
    const scale = Math.min(
      1,
      maxDimension / Math.max(img.naturalWidth, img.naturalHeight),
    );
    const targetWidth = Math.round(img.naturalWidth * scale);
    const targetHeight = Math.round(img.naturalHeight * scale);

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.9),
    );
    if (!blob) return file;

    const baseName = file.name.replace(/\.[^.]+$/, "") || "listing-photo";
    return new File([blob], `${baseName}-thumb.jpg`, { type: "image/jpeg" });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function createPrestigeDraft(
  overrides: Partial<PrestigeListingDraft> = {},
): PrestigeListingDraft {
  return {
    ...emptyDraft,
    ...overrides,
    gallery: (overrides.gallery || []).filter(Boolean),
    features: overrides.features || [],
    published: overrides.published !== false,
  };
}

export function ensurePrestigeListingId(draft: PrestigeListingDraft): string {
  return (
    draft.id ||
    `${draft.title}-${draft.address}`
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 72) ||
    `listing-${Date.now()}`
  );
}

export function formatMoneyInput(value: unknown): string {
  const digits = String(value).replace(/[^\d]/g, "");
  return digits ? `$${Number(digits).toLocaleString("en-US")}` : "$";
}

export function parseMoneyInput(value: unknown): number {
  const digits = String(value).replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

export async function fetchPrestigeListings({
  includeDrafts = false,
}: { includeDrafts?: boolean } = {}): Promise<{
  listings: PrestigeListingDraft[];
  error: Error | null;
}> {
  if (!prestigeSupabase) return { listings: [], error: null };

  let query = prestigeSupabase
    .from("listings")
    .select("*")
    .order("display_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (!includeDrafts) query = query.eq("published", true);

  const { data, error } = await query;
  return { listings: error ? [] : (data || []).map(mapRowToListing), error };
}

export async function savePrestigeListing(
  draft: PrestigeListingDraft,
): Promise<PrestigeListingDraft> {
  if (!prestigeSupabase) throw new Error("Prestige Supabase is not configured.");

  const gallery = uniqueTrimmed(draft.gallery || []);
  const image = draft.image.trim() || gallery[0] || "";

  const { data, error } = await prestigeSupabase
    .from("listings")
    .upsert(
      {
        id: draft.id,
        title: draft.title.trim(),
        address: draft.address.trim(),
        city: draft.city.trim(),
        state: draft.state.trim() || "FL",
        price: Number(draft.price || 0),
        beds: Number(draft.beds || 0),
        baths: Number(draft.baths || 0),
        sqft: Number(draft.sqft || 0),
        status: draft.status,
        description: draft.description.trim(),
        image_url: image,
        gallery_urls: gallery,
        features: draft.features || [],
        featured: !!draft.featured,
        published: !!draft.published,
        display_order: Number(draft.displayOrder || 0),
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (error) throw error;
  return mapRowToListing(data);
}

export async function deletePrestigeListing(id: string): Promise<void> {
  if (!prestigeSupabase) throw new Error("Prestige Supabase is not configured.");
  const { error } = await prestigeSupabase.from("listings").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadPrestigeListingImage(
  file: File,
  listingId: string,
): Promise<string> {
  if (!prestigeSupabase) throw new Error("Prestige Supabase is not configured.");

  const compressed = await compressListingImage(file);
  const safeName = compressed.name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const uniqueId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const path = `${listingId}/${uniqueId}-${safeName}`;

  const { error } = await prestigeSupabase.storage
    .from(LISTING_IMAGES_BUCKET)
    .upload(path, compressed, {
      cacheControl: "31536000",
      upsert: false,
      contentType: compressed.type,
    });
  if (error) throw error;

  const { data } = prestigeSupabase.storage.from(LISTING_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
