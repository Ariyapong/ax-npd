import React from "react";
import { LayoutCatalogs } from "@/layout/LayoutCatalogs";

export { Page };
export { LayoutCatalogs as Layout };

function Page(pageProps: any) {
  return <div>Create Project - View Page {pageProps.pageId}</div>;
}
