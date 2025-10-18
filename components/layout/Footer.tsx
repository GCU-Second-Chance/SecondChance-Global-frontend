import React from "react";
import Link from "next/link";
import Container from "./Container";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50">
      <Container>
        <div className="grid gap-8 py-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🐾</span>
              <span className="font-bold">SecondChance Global</span>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Giving second chances to rescue dogs worldwide through global sharing and community
              support.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dogs" className="text-gray-600 hover:text-foreground">
                  Find Dogs
                </Link>
              </li>
              <li>
                <Link href="/challenge" className="text-gray-600 hover:text-foreground">
                  Challenge
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/GCU-Second-Chance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-foreground"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 py-6 text-center text-sm text-gray-600">
          <p>© {currentYear} Team Gi-hoe. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
