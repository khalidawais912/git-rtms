// Next.js 13.5 crashes ("Cannot read properties of null (reading '1')") when Google Fonts
// returns a font file URL without a file extension, which happens on some CI machines.
// Fall back to woff2 instead of crashing. Runs automatically after `npm install` / `npm ci`.
const fs = require("fs");
const path = require("path");

const loaderPath = path.join(
  __dirname,
  "..",
  "node_modules/next/dist/compiled/@next/font/dist/google/loader.js"
);
const original = "/\\.(woff|woff2|eot|ttf|otf)$/.exec(googleFontFileUrl)[1]";
const patched =
  "(/\\.(woff|woff2|eot|ttf|otf)$/.exec(googleFontFileUrl) || [null, \"woff2\"])[1]";

if (!fs.existsSync(loaderPath)) {
  console.log("patch-next-font: next/font loader not found, skipping.");
  process.exit(0);
}

const source = fs.readFileSync(loaderPath, "utf8");
if (source.includes(patched)) {
  console.log("patch-next-font: already patched.");
} else if (source.includes(original)) {
  fs.writeFileSync(loaderPath, source.replace(original, patched));
  console.log("patch-next-font: patched next/font Google loader.");
} else {
  console.log("patch-next-font: pattern not found (Next.js version changed?), skipping.");
}
