import { resolveRoute } from "vite-plugin-ssr/routing";

import type { PageContext } from "../../../renderer/types";

export default (pageContext: PageContext) => {
  console.log("trigger result route", pageContext.urlPathname);
  {
    const result = resolveRoute("/discover", pageContext.urlPathname);
    if (result.match) {
      result.routeParams.view = "index";
      console.log("check route result : ", result);
      return result;
    }
  }
  {
    const result = resolveRoute(
      "/create-project/create",
      pageContext.urlPathname
    );
    if (result.match) {
      result.routeParams.view = "create";
      console.log("check route result : ", result);
      return result;
    }
  }
  {
    const result = resolveRoute(
      "/create-project/list",
      pageContext.urlPathname
    );
    if (result.match) {
      result.routeParams.view = "list";
      console.log("check route result : ", result);
      return result;
    }
  }
  {
    const result = resolveRoute("/create-project/@id", pageContext.urlPathname);
    if (result.match) {
      result.routeParams.view = "overview";
      console.log("check route result : ", result);
      return result;
    }
  }
  {
    const result = resolveRoute(
      "/create-project/@id/edit",
      pageContext.urlPathname
    );
    if (result.match) {
      result.routeParams.view = "edit";
      console.log("check route result : ", result);
      return result;
    }
  }
  {
    const result = resolveRoute(
      "/create-project/@id/view",
      pageContext.urlPathname
    );
    if (result.match) {
      result.routeParams.view = "view";
      console.log("check route result : ", result);
      return result;
    }
  }

  console.log("return false");
  return false;
};
