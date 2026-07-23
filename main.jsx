import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import StudioSite from "./studio-site.jsx";
import WhatsAppSite from "./karat-site.jsx";

// Two sites on one domain (swarnixai.in):
//   #/            → Studio-first homepage           → Login goes to studio.swarnixai.in
//   #/whatsapp    → full Inventory + WhatsApp suite  → Login goes to app.swarnixai.in
// A hash router keeps both as static single-page routes on Vercel with no rewrites.
function Router() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onHash = () => {
      setHash(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const route = hash.replace(/^#/, "").replace(/^\/+/, "").toLowerCase();
  const isWhatsApp = route.startsWith("whatsapp");
  return isWhatsApp ? <WhatsAppSite /> : <StudioSite />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
