import React from "react";
import { LayoutCatalogs } from "@/layout/LayoutCatalogs";

export { Page };
export { LayoutCatalogs as Layout };

function Page(pageProps: any) {
  console.log('cpageProps : ', pageProps)
  return <div>Create Project - Edit Page {pageProps.pageId}</div>;
}
