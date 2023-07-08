import React from "react";
// import { LayoutCatalogs } from "@/layout/LayoutCatalogs";
import LayoutCreateProject from "@/layout/LayoutCreateProject";
import { usePageContext } from "../../../renderer/usePageContext";

/* import { Page as ListPage } from "./list-project.page";
import { Page as CreatePage } from "./create-project.page";
import { Page as EditPage } from "./edit-project.page";
import { Page as ViewPage } from "./view-project.page";
import { Page as OverviewPage } from "./overview-project.page"; */

export { Page };
export { LayoutCreateProject as Layout };

function Page({ children }: { children: React.ReactNode }) {
  const pageContext = usePageContext();
  const { view, id }: any = pageContext.routeParams;

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
      <div>
        <div>
          <h1>NPD Design Domain</h1>
        </div>
        {/* <InnerView view={view} id={id} /> */}
      </div>
    </div>
  );
}

// implement nested routing
/* function InnerView({
  view,
  id,
}: {
  view: "overview" | "list" | "create" | "edit" | "view";
  id: string;
}): any {
  console.log("cehck view : ", view);
  if (view === "overview") {
    return <OverviewPage />;
  }
  if (view === "list") {
    return <ListPage />;
  }
  if (view === "create") {
    return <CreatePage />;
  }
  if (view === "edit") {
    return <EditPage pageId={id} />;
  }
  if (view === "view") {
    return <ViewPage pageId={id} />;
  }
  return <>Index Page</>;
} */
