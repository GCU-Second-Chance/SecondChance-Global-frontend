import React from "react";
import Link from "next/link";
import Container from "./Container";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">🐾</span>
              <span className="hidden font-bold sm:inline-block">SecondChance Global</span>
            </Link>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/dogs"
              className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
            >
              Dogs
            </Link>
            <Link
              href="/challenge"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Start Challenge
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
};

export default Header;
