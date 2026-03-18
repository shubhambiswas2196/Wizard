"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

export function TopPanel({ user, orgName }: { user: any; orgName: string }) {
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    return parts.map((part, index) => {
      const href = "/" + parts.slice(0, index + 1).join("/");
      const label = part.charAt(0).toUpperCase() + part.slice(1);
      return { label, href };
    });
  };

  const breadcrumbs = getBreadcrumbs();
  const avatarInitial = (user.first_name || user.email || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <header className="topbar-app">
      <div className="breadcrumbs">
        {breadcrumbs.map((bc, i) => (
          <React.Fragment key={bc.href}>
            <div className="breadcrumb-item" style={{ fontWeight: i === breadcrumbs.length - 1 ? '700' : '500', fontSize: i === breadcrumbs.length - 1 ? '1.1rem' : '0.95rem' }}>
              <Link href={bc.href}>{bc.label}</Link>
            </div>
            {i < breadcrumbs.length - 1 && (
              <div className="breadcrumb-separator">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="search-zone">
        <div className="search-input-wrapper">
          <span className="search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input type="text" className="search-input" placeholder="Search anything..." />
          <span className="search-shortcut">⌘K</span>
        </div>
      </div>

      <div className="top-bar-actions">
        <div className="action-icon" title="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </div>
        <div
          className="avatar"
          title={`Organization: ${orgName}`}
          style={{ cursor: "pointer" }}
        >
          {avatarInitial}
        </div>
      </div>
    </header>
  );
}
