export { render };

export { onHydrationEnd };
export { onPageTransitionStart };
export { onPageTransitionEnd };

// enable client side routing
export const clientRouting = true;
export const hydrationCanBeAborted = true;

import React from "react";
import ReactDOM, { hydrateRoot, createRoot } from "react-dom/client";
import { PageShell } from "./PageShell";
import type { PageContextClient } from "./types";
import "./index.css";
import { LayoutDefault } from "@/layout/LayoutDefault";

let root: ReactDOM.Root;
// This render() hook only supports SSR, see https://vite-plugin-ssr.com/render-modes for how to modify render() to support SPA
async function render(pageContext: PageContextClient) {
  const Layout: any = pageContext.exports.Layout || LayoutDefault;
  const { Page, pageProps, isHydration } = pageContext;
  if (!Page)
    throw new Error(
      "Client-side render() hook expects pageContext.Page to be defined"
    );

  const page = (
    <PageShell pageContext={pageContext}>
      <Layout>
        <Page {...pageProps} />
      </Layout>
    </PageShell>
  );

  const pageContainer = document.getElementById("page-view")!;

  console.log("debug -> isHydration", isHydration);
  console.log("inner html -> ", pageContainer.innerHTML);

  if (pageContainer.innerHTML === "" || !isHydration) {
    // SPA
    console.log("SPA -> createRoot");
    if (!root) {
      root = createRoot(pageContainer);
    }
    root.render(page);
  } else {
    // SSR
    console.log("SSR -> Hydration");
    root = hydrateRoot(pageContainer, page);
  }
}

function onHydrationEnd() {
  console.log("Hydration finished; page is now interactive.");
}
function onPageTransitionStart() {
  console.log("Page transition start");
  document.querySelector("body")!.classList.add("page-is-transitioning");
}
function onPageTransitionEnd() {
  console.log("Page transition end");
  document.querySelector("body")!.classList.remove("page-is-transitioning");
}

/* To enable Client-side Routing:
export const clientRouting = true
// !! WARNING !! Before doing so, read https://vite-plugin-ssr.com/clientRouting */
