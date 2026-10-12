import "bootstrap/dist/css/bootstrap.min.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import BgChanger from "./components/BgChanger";
import BootstrapClient from "./components/BootstrapClient";
import FooterToggle from "./components/FooterToggle";
import Loader from "./components/Loader/Loader";
import NavbarToggle from "./components/NavbarToggle";
import ReduxProvider from "./components/ReduxProvider";
import ToastContainers from "./components/ToastContainers";
import "./globals.css";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800"],
// });

// const plusJakartaSans = Plus_Jakarta_Sans({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800"],
// });

const plusJakartaSans = localFont({
  src: "../public/fonts/PlusJakartaSans-VariableFont_wght.ttf",
  variable: "--font-plus-jakarta-sans",
  weight: "100 900", // full variable weight range
  style: "normal",
});

export const metadata: Metadata = {
  title: "RTMES",
  description: "Created by DGME",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={plusJakartaSans.className}>
        <ReduxProvider>
          <Suspense fallback={<Loader />}>
            <BgChanger />
            <NavbarToggle />
          </Suspense>
          <main className="p-2">{children}</main>
          <Suspense fallback={<Loader />}>
            <FooterToggle />
          </Suspense>
        </ReduxProvider>
        <BootstrapClient />
        <ToastContainers />
      </body>
    </html>
  );
}
