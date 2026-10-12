import { Suspense } from "react";
import Home from "./components/Home/Home";
import Loader from "./components/Loader/Loader";

export default function HomePage() {
  return (
    <Suspense fallback={<Loader />}>
      <Home />
    </Suspense>
  );
}
