import React from "react";

export { LayoutCatalogs };
function LayoutCatalogs({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="layout-catalogs">
      <div>
        <h1>Layout Catalogs</h1>
      </div>
      <div>{children}</div>
    </div>
  );
}
