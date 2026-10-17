import {
  Asap,
  DM_Sans,
  Inter,
  Lexend,
  Manrope,
  Montserrat,
  Nunito_Sans,
  Raleway,
} from "next/font/google";

export const raleway = Raleway({ subsets: ["latin"] });

export const lexend = Lexend({ subsets: ["latin"] });

export const inter = Inter({ subsets: ["latin"] });

export const dmSans = DM_Sans({ subsets: ["latin"], preload: false });

export const asap = Asap({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  preload: false,
  weight: ["400", "500", "600", "700", "800"],
});

export const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});
