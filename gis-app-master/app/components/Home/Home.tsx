"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import Loader from "@/app/components/Loader/Loader";

const Home = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentParams = searchParams.toString();

  useEffect(() => {
    const checkAndRedirect = async () => {
      const token = Cookies.get("token");
      const role = Cookies.get("role");
      const rights = JSON.parse(Cookies.get("rights") || "[]");
      let hasDashboard = false;

      if (!token) {
        router.push("/login");
        return;
      }

      if (rights.length > 0) {
        if (!hasDashboard) {
          for (let i = 0; i < rights.length; i++) {
            if (
              rights[i].toLowerCase() === "dashboard-dg" &&
              role?.toLowerCase() === "director general"
            ) {
              router.push(
                `/${rights[i]}${currentParams ? `?${currentParams}` : ""}`,
              );
              hasDashboard = true;
              break;
            }
          }
        }
        if (!hasDashboard) {
          for (let i = 0; i < rights.length; i++) {
            if (rights[i].toLowerCase() === "dashboard") {
              router.push(
                `/${rights[i]}${currentParams ? `?${currentParams}` : ""}`,
              );
              hasDashboard = true;
              break;
            } else if (
              rights[i].toLowerCase().startsWith("dashboard") &&
              rights[i].toLowerCase() !== "project-details-dashboard"
            ) {
              router.push(`/${rights[i]}`);
              hasDashboard = true;
              break;
            }
          }
        }

        if (!hasDashboard)
          router.push(
            `/${rights[0]}${currentParams ? `?${currentParams}` : ""}`,
          );
      } else {
        router.push("/not-authorized");
      }
    };

    checkAndRedirect(); // ✅ Call it, don’t return it
  }, [router]);

  return <Loader />;
};

export default Home;
