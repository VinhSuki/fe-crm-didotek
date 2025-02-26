/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterSearch, IApiResponse } from "@/models/interfaces";
import { useState, useEffect, useCallback } from "react";

// Hook useFilter
export function useFilter<T extends Record<string, any>>(fetchData: () => Promise<IApiResponse<T[]>>) {
  const [data, setData] = useState<T[]>([]);
  const [filters, setFilters] = useState<FilterSearch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchData();
      setData(response.data?.data ?? []); // Đúng cấu trúc của IApiResponse<T[]>
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  }, [fetchData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = (newFilters: FilterSearch[]) => {
    setFilters(newFilters);
  };

  const filteredData = data.filter((item) =>
    filters.every(({ field, value }) =>
      item[field]?.toString().toLowerCase().includes(value.toLowerCase())
    )
  );

  return { data, filters, setFilters, handleFilterChange, filteredData, isLoading, reload: loadData };
}
