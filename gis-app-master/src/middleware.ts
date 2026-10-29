import { NextResponse, type NextRequest } from "next/server";

const LOGIN_PATH = "/login";
const NOT_AUTHORIZED_PATH = "/not-authorized";
const isDev = process.env.NODE_ENV === "development";

const redirectTo = (path: string, request: NextRequest) =>
  NextResponse.redirect(new URL(path, request.url));

/**
 * Reads the "rights" cookie (a JSON array of right names).
 * Returns null if it is not a valid array, so the user is sent back to login.
 * Empty names are dropped: with startsWith matching, "" would allow every page.
 */
const parseRights = (value: string | undefined): string[] | null => {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (right): right is string => typeof right === "string" && right !== "",
    );
  } catch {
    return null;
  }
};

// Page protection only: the cookies can be edited in the browser,
// so the backend must still check the token and rights on every API call.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!request.cookies.has("token")) return redirectTo(LOGIN_PATH, request);

  const rights = parseRights(request.cookies.get("rights")?.value);
  if (!rights) return redirectTo(LOGIN_PATH, request);

  // A right also allows every page whose path starts with it ("projects" → "/projects-live-view").
  const requiredRight = pathname.slice(1);
  if (rights.some((right) => requiredRight.startsWith(right))) {
    return NextResponse.next();
  }

  const fallbackPath = rights.length ? `/${rights[0]}` : NOT_AUTHORIZED_PATH;
  // Never redirect a page to itself.
  if (pathname === fallbackPath) return NextResponse.next();

  if (isDev) {
    console.warn(`[middleware] no right for ${pathname}, sent to ${fallbackPath}`);
  }
  return redirectTo(fallbackPath, request);
}

export const config = {
  matcher: [
    "/dashboard",
    "/department-dashboard-summary",
    "/vehicle-tracking",
    "/staff-tracking",
    "/sectors",
    "/projects",
    "/super-group",
    "/attribute-groups",
    "/attributes",
    "/users",
    "/roles",
    "/rights",
    "/vehicles",
    "/drivers",
    "/visits",
    "/user-projects",
    "/visits-scheduled",
    "/visit-plans",
    "/visits-new",
    "/dashboard-director",
    "/dashboard-deputy-director",
    "/dashboard-dg",
    "/dashboard-officer",
    "/dashboard-it",
    "/dashboard-to",
    "/project-details-dashboard",
    "/project-details-dashboard/:path*",
    "/feedback",
    "/dashboard-attendance",
    "/dashboard-attendance/:path*",
    "/report-history",
    "/departments",
    "/report-analysis/:path*",
    "/new-visit-plan",
    "/process",
    "/projects-live-view/:path*",
    "/pc-iv-report-history",
    "/project-document-names/:path*",
    "/document-categories/:path*",
    "/pc-iv-review/:path*",
    "/pc-iv-attached-review/:path*",
    "/pc-iv-referback-review/:path*",
  ],
};
