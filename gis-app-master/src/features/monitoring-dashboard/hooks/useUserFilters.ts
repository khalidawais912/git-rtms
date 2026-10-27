"use client";
import { useEffect, useState } from "react";
import { fetchUserFilters } from "../services";
import { Filter } from "../types";

/** Filter fields (District, Year, …) and their options, from the filter settings API */
export const useUserFilters = () => {
  const [filters, setFilters] = useState<Filter[]>();

  useEffect(() => {
    fetchUserFilters(0)
      .then(setFilters)
      .catch((err) => console.error("Filter settings error:", err));
  }, []);

  return filters;
};
