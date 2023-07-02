import React from "react";
import logo from "../../renderer/logo.png";
import { Link } from "../../renderer/Link";

export { LayoutDefault };

function LayoutDefault({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="layout">
      <Sidebar>
        <Logo />
        <Link className="navitem" href="/">
          Home
        </Link>
        {/* <Link className="navitem" href="/about">
                  About
                </Link> */}
        <Link className="navitem" href="/report">
          Report
        </Link>
        <Link className="navitem" href="/workflow">
          Workflow
        </Link>
        <Link className="navitem" href="/pivot">
          Pivot
        </Link>
        <Link className="navitem" href="/create-project">
          Create Project
        </Link>
        <Link className="navitem" href="/create-project/list">
          Work List
        </Link>
      </Sidebar>
      <Content>{children}</Content>
    </div>
  );
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        lineHeight: "1.8em",
      }}
    >
      {children}
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={
        {
          // padding: 20,
          // paddingBottom: 50,
          // borderLeft: '2px solid #eee',
          // minHeight: '100vh'
        }
      }
    >
      {children}
    </div>
  );
}

function Logo() {
  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 10,
      }}
    >
      <a href="/">
        <img src={logo} height={64} width={64} alt="logo" />
      </a>
    </div>
  );
}
