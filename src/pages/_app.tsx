import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Register Service Worker for PWA optimization (REQ-F-002)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("PWA Service Worker registered"))
        .catch((err) => console.log("SW registration failed", err));
    }
  }, []);

  return (
    <>
      <Head>
        <title>Aura Cosmetics — Pure Ingredients, Radiant Results</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="High-performance, clean beauty products for the modern minimalist." />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F9A8B6" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
