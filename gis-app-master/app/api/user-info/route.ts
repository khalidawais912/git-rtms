// app/api/user-info/route.ts (or app/api/me/route.ts, choose a meaningful name)
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; // For reading HttpOnly cookies in Server Components/API Routes
import axios from "axios";

// Assuming your .NET backend has an API endpoint to get user info, e.g., /api/Auth/userinfo
const USER_INFO_API = "/api/Auth/userinfo"; // Adjust this to your actual .NET endpoint

// Define the expected structure of the user info response from your .NET backend
interface UserInfoResponseData {
  id: number;
  userName: string;
  email: string;
  department_Id: number;
  role: string[]; // Or string depending on how it's sent
  rights: { rightName: string }[];
  // ... any other user-specific data your backend returns
}

interface BackendUserInfoSuccessResponse {
  responseCode: number;
  responseMessage: string;
  data: UserInfoResponseData;
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      // If token is not present (user not logged in), return 401 Unauthorized
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // 1. Call your .NET Backend User Info API using the token
    const backendRes = await axios.get<BackendUserInfoSuccessResponse>(
      `${process.env.NEXT_PUBLIC_BACKEND_API}${USER_INFO_API}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Send the HttpOnly token
          Accept: "application/json",
        },
      }
    );

    // If backend failed to provide user info (e.g., token invalid/expired)
    if (backendRes.status !== 200 || backendRes.data.responseCode !== 200) {
      return NextResponse.json(
        backendRes.data || { error: "Failed to fetch user info from backend" },
        {
          status: backendRes.status || 500,
        }
      );
    }

    // 2. Return the user info data to the frontend
    return NextResponse.json(backendRes.data.data, { status: 200 });
  } catch (err: any) {
    console.error("User Info API route error:", err);

    if (axios.isAxiosError(err)) {
      const status = err.response?.status || 500;
      const errorMessage =
        err.response?.data?.responseMessage ||
        err.message ||
        "Failed to fetch user info.";
      return NextResponse.json({ error: errorMessage }, { status });
    }

    return NextResponse.json(
      { error: "An unexpected error occurred while fetching user info." },
      { status: 500 }
    );
  }
}
