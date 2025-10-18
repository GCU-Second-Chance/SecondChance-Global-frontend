import React from "react";
import Link from "next/link";
import Container from "./Container";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">SecondChance</span>
            </Link>
          </div>

          <nav className="flex items-center gap-1">
            <button className="rounded-full p-2 text-gray-600 hover:bg-gray-100">🌐</button>
          </nav>
        </div>
      </Container>
    </header>
  );
};

export default Header;
