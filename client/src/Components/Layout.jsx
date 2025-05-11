import React from "react";
import UserNavbar from "./UserNavbar";

export const Layout = ({ children }) => {
  return (
    <>
      <style>{`
        .layout-wrapper {
          display: flex !important;
          flex-direction: column !important;
          min-height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden !important;
        }

        .layout-main {
          flex: 1 !important;
          margin-top: 0 !important;
          padding-top: 0 !important;
        }
      `}</style>

      <div className="layout-wrapper">
        <UserNavbar />
        <main className="layout-main">
          {children}
        </main>
      </div>
    </>
  );
};