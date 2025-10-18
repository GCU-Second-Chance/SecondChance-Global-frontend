"use client";

/**
 * Google Analytics Script Component
 * Injects GA4 tracking scripts into the page
 */

import Script from "next/script";
import { GA_MEASUREMENT_ID, isGAEnabled } from "./gtag";

export function GoogleAnalytics() {
  // Don't render if GA is not enabled
  if (!isGAEnabled()) {
    return null;
  }

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
