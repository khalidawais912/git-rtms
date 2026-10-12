import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Extract the path from the request URL
  const url = new URL(request.url);
  const pathname = url.pathname; // Full path of the request
  const requiredRight = pathname.startsWith("/") ? pathname.slice(1) : pathname;

  // Get cookies from the request
  const rightsCookie = request.cookies.get("rights");
  const tokenCookie = request.cookies.get("token");

  // Redirect to login if token is missing
  if (!tokenCookie) {
    console.log("Token missing. Redirecting to /login.");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let rights: string[] = [];
  try {
    // Parse the "rights" cookie if it exists
    rights = rightsCookie ? JSON.parse(rightsCookie.value || "[]") : [];
  } catch (error) {
    console.error("Failed to parse rights cookie:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log("User rights:", rights);
  console.log("Required right:", requiredRight);
  console.log("Current pathname:", pathname);

  const hasRequiredRight = rights.some((right) =>
    requiredRight.startsWith(right),
  );

  if (!hasRequiredRight) {
    const redirectPath =
      rights.length > 0 ? `/${rights[0]}` : "/not-authorized";

    // Avoid infinite redirection
    if (pathname === redirectPath) {
      console.warn("Redirection loop detected. Allowing request.");
      return NextResponse.next();
    }

    console.log(`User lacks required right. Redirecting to ${redirectPath}`);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Log success and allow access
  console.log(`Access granted for ${pathname}`);
  return NextResponse.next();
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
    "/pc-iv-review/:path*",
    "/pc-iv-attached-review/:path*",
    "/pc-iv-referback-review/:path*",
  ],
};
