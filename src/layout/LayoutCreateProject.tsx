import React from "react";
import logo from "../../renderer/logo.png";
import { Link } from "../../renderer/Link";

// export { LayoutCreateProject };

export default LayoutCreateProject;

function LayoutCreateProject({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="layout">
      <Sidebar>
        <Logo />
        <Link className="navitem" href="/create-project">
          Home
        </Link>
        <Link className="navitem" href="/create-project/list">
          Work List
        </Link>
        <Link className="navitem" href="/create-project/create">
          Create
        </Link>
        <Link className="navitem" href="/create-project/1/edit">
          Edit
        </Link>
        <Link className="navitem" href="/create-project/1/view">
          View
        </Link>
      </Sidebar>
      <div>
        
        <Content>{children}</Content>
      </div>
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
