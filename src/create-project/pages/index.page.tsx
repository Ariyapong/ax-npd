import React from "react";
import { LayoutCatalogs } from "@/layout/LayoutCatalogs";
import { usePageContext } from "../../../renderer/usePageContext";

import { Page as CreatePage } from "./create-project.page";
import { Page as EditPage } from "./edit-project.page";
import { Page as ViewPage } from "./view-project.page";
import { Page as ListPage } from "./list-project.page";

export { Page };
export { LayoutCatalogs as Layout };

function Page({ children }: { children: React.ReactNode }) {
  const pageContext = usePageContext();
  const { view }: any = pageContext.routeParams;

  // const innerView =
  //   view === "create" ? (
  //     <CreatePage />
  //   ) : view === "edit" ? (
  //     <EditPage />
  //   ) : view === "view" ? (
  //     <ViewPage />
  //   ) : (
  //     <ListPage />
  //   );

  console.log("check route param : ", view);

  return (
    <div>
      <h1>NPD Create Project Flow</h1>
      <div>
        <InnerView view={view} />
        {/* {innerView} */}
      </div>
    </div>
  );
}

// implement nested routing
function InnerView({
  view,
}: {
  view: "list" | "create" | "edit" | "view";
}): any {
  console.log("cehck view : ", view);
  if( view === "list") {
    return <ListPage />;
  }
  if (view === "create") {
    return <CreatePage />;
  }
  if (view === "edit") {
    return <EditPage />;
  }
  if (view === "view") {
    return <ViewPage />;
  }
}
