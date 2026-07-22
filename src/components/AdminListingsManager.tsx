"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  createPrestigeDraft,
  deletePrestigeListing,
  ensurePrestigeListingId,
  fetchPrestigeListings,
  formatMoneyInput,
  isPrestigeSupabaseConfigured,
  parseMoneyInput,
  prestigeSupabase,
  savePrestigeListing,
  uploadPrestigeListingImage,
  PRESTIGE_STATUSES,
  prestigeStatusLabel,
  type PrestigeListingDraft,
} from "@/lib/prestigeSupabase";
import { usePrestigeListings } from "@/lib/usePrestigeListings";
import ImageCropFrame from "@/components/ImageCropFrame";

const statuses = PRESTIGE_STATUSES;

export default function AdminListingsManager() {
  const { listings, setListings } = usePrestigeListings(true);
  const [sessionEmail, setSessionEmail] = useState("");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [draft, setDraft] = useState<PrestigeListingDraft>(createPrestigeDraft());
  const [editorOpen, setEditorOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [cropQueue, setCropQueue] = useState<File[]>([]);

  useEffect(() => {
    if (!prestigeSupabase) return;

    prestigeSupabase.auth.getSession().then(({ data }) => {
      setSessionEmail(data.session?.user.email || "");
      if (data.session) refreshAdminListings();
    });

    const { data: listener } = prestigeSupabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSessionEmail(nextSession?.user.email || "");
        if (nextSession) setTimeout(refreshAdminListings, 0);
      },
    );

    return () => listener.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refreshAdminListings() {
    const { listings: remoteListings, error } = await fetchPrestigeListings({
      includeDrafts: true,
    });
    if (!error && remoteListings.length > 0) setListings(remoteListings);
  }

  function updateDraft(field: keyof PrestigeListingDraft, value: unknown) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  // Remove a photo from the draft. If it was the cover, promote the next
  // remaining photo so the listing always has a valid cover.
  function removePhoto(image: string) {
    setDraft((current) => {
      const gallery = (current.gallery || []).filter((g) => g !== image);
      const nextImage = current.image === image ? gallery[0] || "" : current.image;
      return { ...current, gallery, image: nextImage };
    });
  }

  function openEditor(listing: PrestigeListingDraft) {
    setDraft(createPrestigeDraft(listing));
    setMessage({ type: "", text: "" });
    setEditorOpen(true);
  }

  function createNewListing() {
    setDraft(createPrestigeDraft());
    setMessage({ type: "", text: "" });
    setEditorOpen(true);
  }

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!prestigeSupabase) return;

    setBusy(true);
    setMessage({ type: "loading", text: "Signing in..." });
    const { error } = await prestigeSupabase.auth.signInWithPassword(authForm);
    setBusy(false);

    if (error) {
      setMessage({
        type: "error",
        text: `Could not sign in: ${error.message}`,
      });
      return;
    }

    setAuthForm({ email: "", password: "" });
    setMessage({ type: "success", text: "Signed in." });
  }

  async function handleSignOut() {
    if (!prestigeSupabase) return;
    await prestigeSupabase.auth.signOut();
    setSessionEmail("");
    setEditorOpen(false);
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanGallery = Array.from(new Set((draft.gallery || []).filter(Boolean)));
    const coverImage = draft.image.trim() || cleanGallery[0] || "";

    const nextListing = {
      ...draft,
      id: ensurePrestigeListingId(draft),
      image: coverImage,
      gallery: cleanGallery,
      features: draft.features || [],
    };

    if (
      !nextListing.title.trim() ||
      !nextListing.address.trim() ||
      !nextListing.city.trim() ||
      !nextListing.image.trim()
    ) {
      setMessage({
        type: "error",
        text: "Add a title, address, city, and at least one uploaded photo before saving.",
      });
      return;
    }

    setBusy(true);
    setMessage({ type: "loading", text: "Saving listing..." });

    try {
      const saved = await savePrestigeListing(nextListing);
      await refreshAdminListings();
      setDraft(saved);
      setMessage({ type: "success", text: "Listing updated on the website." });
    } catch (error) {
      console.warn(error);
      setMessage({
        type: "error",
        text: "Could not save. Check the Prestige Supabase policies and admin user.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!draft.id) return;

    setBusy(true);
    try {
      await deletePrestigeListing(draft.id);
      await refreshAdminListings();
      setEditorOpen(false);
      setMessage({ type: "success", text: "Listing deleted." });
    } catch (error) {
      console.warn(error);
      setMessage({ type: "error", text: "Could not delete this listing." });
    } finally {
      setBusy(false);
    }
  }

  // Files wait here until the admin positions each one in the landscape
  // frame; each confirmed frame is uploaded, then the next file is shown.
  function queueFilesForCrop(files: File[]) {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (images.length > 0) setCropQueue((current) => [...current, ...images]);
  }

  async function handleCropComplete(blob: Blob) {
    const currentFile = cropQueue[0];
    const listingId = ensurePrestigeListingId(draft);
    setBusy(true);
    setMessage({ type: "loading", text: "Uploading photo..." });

    try {
      const baseName =
        currentFile?.name.replace(/\.[^.]+$/, "") || `photo-${Date.now()}`;
      const framedFile = new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
      const url = await uploadPrestigeListingImage(framedFile, listingId);

      setDraft((current) => ({
        ...current,
        id: listingId,
        image: current.image || url,
        gallery: Array.from(new Set([...(current.gallery || []), url].filter(Boolean))),
      }));
      setMessage({ type: "success", text: "Photo added." });
    } catch (error) {
      console.warn(error);
      setMessage({ type: "error", text: "Could not upload that photo." });
    } finally {
      setBusy(false);
      setCropQueue((current) => current.slice(1));
    }
  }

  function handleCropCancel() {
    setCropQueue((current) => current.slice(1));
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    queueFilesForCrop(Array.from(event.target.files || []));
    event.target.value = "";
  }

  function handleImageDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    queueFilesForCrop(Array.from(event.dataTransfer.files || []));
  }

  const activeListings = listings.filter((listing) => listing.published !== false);

  return (
    <section className="min-h-screen bg-ivory px-6 py-28 lg:px-12">
      <div className="mx-auto max-w-6xl">
        {!sessionEmail ? (
          <div className="mx-auto max-w-3xl rounded-sm border border-border-warm bg-white/80 p-6 shadow-2xl shadow-ink/5">
            <p className="font-body text-[11px] uppercase tracking-[0.35em] text-gold">
              Prestige Admin
            </p>
            <h1 className="mt-4 font-display text-4xl leading-none tracking-tight text-ink sm:text-5xl">
              Realtor sign in
            </h1>
            {!isPrestigeSupabaseConfigured && (
              <p className="mt-5 bg-red-50 p-4 font-body text-sm font-semibold text-red-900">
                Prestige Supabase is not configured yet. Add the project publishable key.
              </p>
            )}
            <form className="mt-8 grid gap-4 md:grid-cols-[1fr_1fr_auto]" onSubmit={handleSignIn}>
              <label className="grid gap-2 font-body text-sm font-semibold text-ink">
                Email
                <input
                  className="min-h-12 border border-border-warm bg-ivory px-4 outline-none focus:border-gold"
                  type="email"
                  value={authForm.email}
                  onChange={(event) =>
                    setAuthForm((current) => ({ ...current, email: event.target.value }))
                  }
                  autoComplete="email"
                />
              </label>
              <label className="grid gap-2 font-body text-sm font-semibold text-ink">
                Password
                <input
                  className="min-h-12 border border-border-warm bg-ivory px-4 outline-none focus:border-gold"
                  type="password"
                  value={authForm.password}
                  onChange={(event) =>
                    setAuthForm((current) => ({ ...current, password: event.target.value }))
                  }
                  autoComplete="current-password"
                />
              </label>
              <button
                className="self-end bg-ink px-7 py-3 font-body text-xs font-bold uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold hover:text-ink disabled:opacity-50"
                type="submit"
                disabled={busy || !isPrestigeSupabaseConfigured}
              >
                Sign In
              </button>
            </form>
            {message.text && <StatusMessage type={message.type} text={message.text} />}
          </div>
        ) : (
          <>
            <div className="mb-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="font-body text-[11px] uppercase tracking-[0.35em] text-gold">
                  Prestige Admin
                </p>
                <h1 className="mt-4 font-display text-5xl leading-none tracking-tight text-ink sm:text-6xl">
                  Active Listings
                </h1>
              </div>
              <div className="grid gap-2 text-left md:text-right">
                <span className="font-body text-sm font-semibold text-stone">
                  {sessionEmail}
                </span>
                <button
                  className="font-body text-xs font-bold uppercase tracking-[0.2em] text-ink underline decoration-gold underline-offset-4"
                  type="button"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </div>
            </div>

            <div className="mb-5 flex justify-end">
              <button
                className="bg-gold px-6 py-3 font-body text-xs font-bold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-ivory"
                type="button"
                onClick={createNewListing}
              >
                Add Listing
              </button>
            </div>

            <div className="grid gap-4">
              {activeListings.map((listing) => (
                <article
                  className="grid gap-5 rounded-sm border border-border-warm bg-white/85 p-4 shadow-xl shadow-ink/5 md:grid-cols-[150px_1fr_auto] md:items-center"
                  key={listing.id}
                >
                  <div className="relative aspect-[1.35] overflow-hidden bg-cream">
                    <Image src={listing.image} alt={listing.title} fill className="object-contain" />
                  </div>
                  <div>
                    <span className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                      {prestigeStatusLabel(listing.status)}
                    </span>
                    <h2 className="mt-2 font-display text-2xl tracking-tight text-ink">
                      {listing.title}
                    </h2>
                    <p className="font-body text-sm text-stone">
                      {listing.address}, {listing.city}, {listing.state}
                    </p>
                    <strong className="mt-2 block font-display text-xl text-ink">
                      {formatMoneyInput(listing.price)}
                    </strong>
                  </div>
                  <button
                    className="bg-ink px-6 py-3 font-body text-xs font-bold uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold hover:text-ink"
                    type="button"
                    onClick={() => openEditor(listing)}
                  >
                    Edit
                  </button>
                </article>
              ))}
            </div>
          </>
        )}

        {sessionEmail && editorOpen && (
          <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/70 p-4 backdrop-blur-md">
            <form
              className="max-h-[92vh] w-full max-w-6xl overflow-auto rounded-sm bg-ivory p-5 shadow-2xl"
              onSubmit={handleSave}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="font-body text-[11px] uppercase tracking-[0.35em] text-gold">
                    Listing Editor
                  </p>
                  <h2 className="mt-2 font-display text-3xl leading-none text-ink sm:text-5xl">
                    {draft.id ? draft.title : "Create new listing"}
                  </h2>
                </div>
                <button
                  className="grid h-11 w-11 place-items-center rounded-full bg-ink text-2xl leading-none text-ivory"
                  type="button"
                  aria-label="Close editor"
                  onClick={() => setEditorOpen(false)}
                >
                  ×
                </button>
              </div>

              <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                <section className="rounded-sm border border-border-warm bg-white/80 p-5">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <span className="font-body text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
                        Photos
                      </span>
                      <h3 className="mt-1 font-display text-3xl text-ink">
                        Upload images
                      </h3>
                    </div>
                    <b className="rounded-full bg-cream px-3 py-1 font-body text-xs text-ink">
                      {draft.gallery.length} Photos
                    </b>
                  </div>
                  <label
                    className="grid min-h-36 cursor-pointer place-items-center border border-dashed border-ink/30 bg-cream/60 p-5 text-center font-body text-sm font-semibold text-ink transition-colors hover:border-gold hover:bg-gold/10"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={handleImageDrop}
                  >
                    <input
                      className="sr-only"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple={true}
                      onChange={handleImageUpload}
                      disabled={busy}
                    />
                    <span>
                      Drop photos here or click to select multiple images
                    </span>
                  </label>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {(draft.gallery.length ? draft.gallery : [draft.image])
                      .filter(Boolean)
                      .slice(0, 8)
                      .map((image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className={`group relative aspect-[4/3] overflow-hidden border ${
                            draft.image === image ? "border-gold" : "border-transparent"
                          }`}
                        >
                          <button
                            type="button"
                            className="absolute inset-0 h-full w-full"
                            aria-label="Use as cover photo"
                            onClick={() => updateDraft("image", image)}
                          >
                            <Image src={image} alt="" fill className="object-contain" />
                          </button>
                          {draft.image === image && (
                            <span className="pointer-events-none absolute bottom-1 left-1 bg-gold px-2 py-0.5 font-body text-[9px] font-bold uppercase tracking-[0.15em] text-ink">
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            aria-label="Remove photo"
                            onClick={() => removePhoto(image)}
                            className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-ink/85 text-lg leading-none text-ivory shadow-lg transition-colors hover:bg-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                  </div>
                </section>

                <section className="rounded-sm border border-border-warm bg-white/80 p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Listing Title">
                      <input value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} />
                    </Field>
                    <Field label="Status">
                      <select value={draft.status} onChange={(event) => updateDraft("status", event.target.value)}>
                        {statuses.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Price">
                      <input
                        value={formatMoneyInput(draft.price)}
                        onChange={(event) => updateDraft("price", parseMoneyInput(event.target.value))}
                      />
                    </Field>
                    <Field label="Address">
                      <input value={draft.address} onChange={(event) => updateDraft("address", event.target.value)} />
                    </Field>
                    <Field label="City">
                      <input value={draft.city} onChange={(event) => updateDraft("city", event.target.value)} />
                    </Field>
                    <Field label="State">
                      <input value={draft.state} onChange={(event) => updateDraft("state", event.target.value)} />
                    </Field>
                    <Field label="Sqft">
                      <input type="number" value={draft.sqft} onChange={(event) => updateDraft("sqft", Number(event.target.value))} />
                    </Field>
                    <Field label="Beds">
                      <input type="number" value={draft.beds} onChange={(event) => updateDraft("beds", Number(event.target.value))} />
                    </Field>
                    <Field label="Baths">
                      <input type="number" step="0.5" value={draft.baths} onChange={(event) => updateDraft("baths", Number(event.target.value))} />
                    </Field>
                    <label className="flex items-center gap-3 font-body text-sm font-semibold text-ink sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={draft.published}
                        onChange={(event) => updateDraft("published", event.target.checked)}
                      />
                      Published on website
                    </label>
                  </div>
                </section>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  className="bg-gold px-6 py-3 font-body text-xs font-bold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-ivory disabled:opacity-50"
                  type="submit"
                  disabled={busy}
                >
                  Update Website
                </button>
                {draft.id && (
                  <button
                    className="border border-red-900/25 px-6 py-3 font-body text-xs font-bold uppercase tracking-[0.2em] text-red-900"
                    type="button"
                    onClick={handleDelete}
                    disabled={busy}
                  >
                    Delete
                  </button>
                )}
                {message.text && <StatusMessage type={message.type} text={message.text} />}
              </div>
            </form>
          </div>
        )}
      </div>

      {cropQueue.length > 0 && (
        <ImageCropFrame
          key={cropQueue.length}
          file={cropQueue[0]}
          busy={busy}
          queueLabel={cropQueue.length > 1 ? `${cropQueue.length} left` : undefined}
          onComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </section>
  );
}

function Field({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: React.ReactElement;
  wide?: boolean;
}) {
  return (
    <label
      className={`grid gap-2 font-body text-sm font-semibold text-ink ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      {label}
      <span className="contents [&>input]:min-h-12 [&>input]:border [&>input]:border-border-warm [&>input]:bg-ivory [&>input]:px-4 [&>input]:outline-none [&>input]:focus:border-gold [&>select]:min-h-12 [&>select]:border [&>select]:border-border-warm [&>select]:bg-ivory [&>select]:px-4 [&>select]:outline-none [&>select]:focus:border-gold [&>textarea]:border [&>textarea]:border-border-warm [&>textarea]:bg-ivory [&>textarea]:p-4 [&>textarea]:outline-none [&>textarea]:focus:border-gold">
        {children}
      </span>
    </label>
  );
}

function StatusMessage({ type, text }: { type: string; text: string }) {
  return (
    <p
      className={`font-body text-sm font-semibold ${
        type === "error"
          ? "text-red-900"
          : type === "success"
            ? "text-green-800"
            : "text-stone"
      }`}
    >
      {text}
    </p>
  );
}
