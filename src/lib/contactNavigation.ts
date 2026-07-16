"use client";

export function goToContactSection() {
  const contact = document.getElementById("contact");

  if (!contact) {
    window.location.assign("/#contact");
    return;
  }

  window.history.replaceState(null, "", "/#contact");
  contact.scrollIntoView({ behavior: "smooth", block: "start" });
}
