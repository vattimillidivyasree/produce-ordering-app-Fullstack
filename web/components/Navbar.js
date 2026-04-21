"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("govigi_token");
    localStorage.removeItem("govigi_user");
    document.cookie = "govigi_token=; path=/; max-age=0; samesite=lax";
    router.push("/login");
    router.refresh();
  };

  const links = [
    { href: "/products", label: "Products" },
    { href: "/place-order", label: "Place Order" },
    { href: "/orders", label: "My Orders" },
  ];

  return (
    <div className="navbar">
      <div>
        <h2 style={{ margin: 0 }}>GoVigi Retailer Portal</h2>
        <p className="subtitle">Order fresh produce in bulk, quickly.</p>
      </div>

      <div className="navlinks">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="navlink"
            style={{
              borderColor: pathname === link.href ? "#1f8f55" : "#dfe7e2",
              color: pathname === link.href ? "#1f8f55" : "#1c2b22",
            }}
          >
            {link.label}
          </Link>
        ))}
        <button className="button secondary" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
