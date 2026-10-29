"use client";

import { authClient } from "@/lib/auth-client";
import { Menu, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "./ui/button";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/", active: true },
  { label: "Destinations", href: "/destinations", active: false },
  { label: "Add Destination", href: "/add-destination", active: false },
  { label: "My Bookings", href: "/my-bookings", active: false },
];

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <header className="border-b bg-white">
      <nav className="grid h-16 grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8">
        {/* Left: Primary Links */}
        <ul className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={
                  link.active
                    ? "font-semibold text-teal-500"
                    : "text-foreground/80 transition-colors hover:text-foreground"
                }
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Center: Brand */}
        <Link
          href="/"
          className="ml-3 text-xl font-bold text-teal-500 sm:ml-4 sm:text-2xl"
        >
          Wanderlast
        </Link>

        {/* Right: Account Links */}
        <ul className="flex items-center justify-end gap-6 text-sm">
          <li>
            <a
              href="/profile"
              className="flex items-center gap-1.5 text-foreground/80 transition-colors hover:text-foreground"
            >
              <User className="size-4" />
              <span className="hidden sm:inline">Profile</span>
            </a>
          </li>

          <li className="md:hidden">
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Open navigation menu"
                    className="text-foreground/80 hover:text-foreground"
                  />
                }
              >
                <Menu className="size-5" />
              </PopoverTrigger>

              <PopoverContent align="end" className="w-56">
                <ul className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="block rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          </li>

          {user ? (
            <li>
              <Popover>
                <PopoverTrigger
                  render={
                    <button
                      type="button"
                      aria-label="Open user menu"
                      className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                    />
                  }
                >
                  <Avatar>
                    <AvatarImage
                      referrerPolicy="no-referrer"
                      src={user.image ?? undefined}
                    />
                    <AvatarFallback>
                      {user.name?.charAt(0) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>

                <PopoverContent align="end" className="w-64">
                  <PopoverHeader>
                    <PopoverTitle>{user.name}</PopoverTitle>

                    <PopoverDescription>{user.email}</PopoverDescription>
                  </PopoverHeader>

                  <Button
                    onClick={handleSignOut}
                    variant="destructive"
                    className="mt-3 w-full"
                  >
                    Signout
                  </Button>
                </PopoverContent>
              </Popover>
            </li>
          ) : (
            <>
              <li>
                <a
                  href="/login"
                  className="text-foreground/80 transition-colors hover:text-foreground"
                >
                  Login
                </a>
              </li>

              <li>
                <a
                  href="/signup"
                  className="text-foreground/80 transition-colors hover:text-foreground"
                >
                  Sign Up
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
