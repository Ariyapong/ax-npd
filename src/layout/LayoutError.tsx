import React from "react";

export { LayoutError };
function LayoutError({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <h1>Layout Error</h1>
      <div>{children}</div>
    </div>
  );
}
