import importWarehouseApi from "@/apis/modules/importWarehouse.api";
import { IImportWarehouse } from "@/models/interfaces";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useCallback } from "react";

const fetchPageData = async ({ pageParam = 1 }) => {
  const res = await importWarehouseApi.list({ page: pageParam, limit: 10 });

  return (
    res.data ?? {
      data: [],
      total_page: 1,
    }
  );
};

export default function InfiniteScrollList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["items"],
    queryFn: fetchPageData,
    initialPageParam: 1, // Bắt đầu từ trang đầu tiên
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.total_page && nextPage <= lastPage.total_page
        ? nextPage
        : undefined;
    },
  });

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLLIElement) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data.</p>;

  return (
    <ul>
      {data?.pages.map((page) =>
        page.data.map((item: IImportWarehouse, index) => {
          if (index === page.data.length - 1) {
            return (
              <li ref={lastItemRef} key={item.ID}>
                {item.ma_hoa_don}
              </li>
            );
          }
          return <li key={item.ID}>{item.ma_hoa_don}</li>;
        })
      )}
      {isFetchingNextPage && <p>Loading more...</p>}
    </ul>
  );
}
