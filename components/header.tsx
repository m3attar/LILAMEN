"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "./cart-provider";
export function Header() {
  const { items } = useCart();
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <>
      <div className="announcement">
        SMALL IN FORM. PERSONAL IN FEELING.{" "}
        <span>Meet the LILAMEN collection →</span>
      </div>
      <header className="header">
        <Link href="/" className="wordmark" aria-label="LILAMEN home">
          LILAMEN<span>SCENT, SIMPLY.</span>
        </Link>
        <nav
          id="mobile-menu"
          aria-label="Main navigation"
          className={open ? "nav nav-open" : "nav"}
        >
          {[
            ["/shop/", "Shop all"],
            ["/our-story/", "Our story"],
            ["/contact/", "Contact"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link href="/cart/" className="bag-link">
            <svg
              width="19"
              height="21"
              viewBox="0 0 24 26"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 8h16l1 16H3L4 8Z M8 8V5a4 4 0 0 1 8 0v3"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>{" "}
            Bag <span>{items.reduce((n, i) => n + i.quantity, 0)}</span>
          </Link>
          <button
            className="menu-button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>
      </header>
    </>
  );
}
