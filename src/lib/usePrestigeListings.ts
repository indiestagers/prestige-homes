"use client";

import { useEffect, useState } from "react";
import { listings as staticListings } from "@/data/listings";
import {
  createPrestigeDraft,
  fetchPrestigeListings,
  isPrestigeSupabaseConfigured,
  type PrestigeListingDraft,
} from "@/lib/prestigeSupabase";

export function usePrestigeListings(includeDrafts = false) {
  const [listings, setListings] = useState<PrestigeListingDraft[]>(
    staticListings.map((listing) => createPrestigeDraft(listing)),
  );
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    let active = true;

    (async () => {
      if (!isPrestigeSupabaseConfigured) return;
      setStatus("loading");
      const { listings: remoteListings, error } = await fetchPrestigeListings({
        includeDrafts,
      });
      if (!active) return;
      if (error) {
        setStatus("error");
        return;
      }
      if (remoteListings.length > 0) setListings(remoteListings);
      setStatus("ready");
    })();

    return () => {
      active = false;
    };
  }, [includeDrafts]);

  return { listings, setListings, status };
}
