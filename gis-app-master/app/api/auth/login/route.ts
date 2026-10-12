import { LOGIN_API } from "@/app/APIs";
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const backendRes = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API}${LOGIN_API}`,
      {
        username,
        password,
      }
    );

    // Check if the backend response was successful (e.g., 200 OK)
    if (backendRes.status !== 200) {
      return NextResponse.json(
        backendRes.data || { error: "Backend login failed" },
        {
          status: backendRes.status,
        }
      );
    }

    const { token, expiration, userData, userProfile, role, rights } =
      backendRes.data.data;

    // 2. Prepare cookies to be set in the browser
    const response = NextResponse.json(
      {
        message: "Login successfull",
        user: userData,
      },
      {
        status: 200,
      }
    );

    const tokenCookie = serialize("token", `Bearer ${token}`, {
      httpOnly: true, // THIS IS THE KEY!
      secure: process.env.NODE_ENV === "production", // Use secure in production (HTTPS)
      path: "/", // Make it available across the whole site
      expires: new Date(expiration),
      sameSite: "lax", // Recommended for security: 'lax' or 'strict'
    });

    response.headers.append("Set-Cookie", tokenCookie);

    // Set other cookies that you need client-side (NOT HttpOnly)
    // These will be accessible by client-side JavaScript, as you intended for your previous setup
    if (userData) {
      const userNameCookie = serialize("userName", userData.userName, {
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(expiration),
        sameSite: "lax",
      });
      response.headers.append("Set-Cookie", userNameCookie);

      const userIdCookie = serialize("userId", userData.id.toString(), {
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(expiration),
        sameSite: "lax",
      });
      response.headers.append("Set-Cookie", userIdCookie);

      const emailCookie = serialize("email", userData.email, {
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(expiration),
        sameSite: "lax",
      });
      response.headers.append("Set-Cookie", emailCookie);
    }

    if (userProfile?.department_Id !== undefined) {
      // Check if departmentId exists
      const departmentIdCookie = serialize(
        "departmentId",
        userProfile.department_Id.toString(),
        {
          secure: process.env.NODE_ENV === "production",
          path: "/",
          expires: new Date(expiration),
          sameSite: "lax",
        }
      );
      response.headers.append("Set-Cookie", departmentIdCookie);
    }

    if (role && role.length > 0) {
      const roleCookie = serialize("role", role[0], {
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(expiration),
        sameSite: "lax",
      });
      response.headers.append("Set-Cookie", roleCookie);
    }

    if (rights && rights.length > 0) {
      const rightsCookie = serialize(
        "rights",
        JSON.stringify(rights.map((r: { rightName: string }) => r.rightName)),
        {
          secure: process.env.NODE_ENV === "production",
          path: "/",
          expires: new Date(expiration),
          sameSite: "lax",
        }
      );
      response.headers.append("Set-Cookie", rightsCookie);
    }

    return response; // Return the NextResponse with cookies
  } catch (err) {
    console.error("Login API route error:", err);

    // Handle Axios errors (from backend API call)
    if (axios.isAxiosError(err)) {
      const status = err.response?.status || 500;
      const errorMessage =
        err.response?.data?.responseMessage ||
        err.message ||
        "Login failed due to backend error.";
      return NextResponse.json({ error: errorMessage }, { status });
    }

    // Handle other types of errors
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
