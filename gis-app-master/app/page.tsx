import { Suspense } from "react";
import Home from "@/shared/components/Home/Home";
import Loader from "@/shared/components/Loader/Loader";

export default function HomePage() {
  return (
    <Suspense fallback={<Loader />}>
      <Home />
    </Suspense>
  );
}
