/* Stand-in for next/font/google and next/font/local in unit tests. */
const font = () => ({ className: "font", variable: "--font", style: { fontFamily: "font" } });

export const Asap = font;
export const DM_Sans = font;
export const Inter = font;
export const Lexend = font;
export const Manrope = font;
export const Montserrat = font;
export const Nunito_Sans = font;
export const Raleway = font;

export default font;
