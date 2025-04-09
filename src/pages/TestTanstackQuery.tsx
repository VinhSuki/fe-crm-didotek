import importWarehouseApi from "@/apis/modules/importWarehouse.api";
import { IImportWarehouse } from "@/models/interfaces";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const fetchPageData = async (
  page: number
): Promise<{
  data: IImportWarehouse[];
  total_page?: number;
}> => {
  const res = await importWarehouseApi.list({ page, limit: 10 });

  return (
    res.data ?? {
      data: [], // Trả về mảng rỗng nếu không có dữ liệu
      total_page: 1,
    }
  );
};

export default function PaginatedList() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery<{
    data: IImportWarehouse[];
    total_page?: number;
  }>({
    queryKey: ["items", page],
    queryFn: () => fetchPageData(page),
    staleTime: 1000 * 60 * 5, // Dữ liệu không bị coi là cũ trong 5 phút
    gcTime: 1000 * 60 * 10, // Cache tồn tại trong 10 phút
    refetchOnWindowFocus: false, // Không gọi lại API khi focus tab
    placeholderData: (previousData) => previousData, // Giữ dữ liệu cũ khi chuyển trang
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data.</p>;

  return (
    <div>
      <ul>
        {data?.data &&
          data.data.map((item: IImportWarehouse) => (
            <li key={item.ID}>{item.ma_hoa_don}</li>
          ))}
      </ul>
      <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
        Previous
      </button>
      <button
        disabled={page === data?.total_page}
        onClick={() => {
          console.log(page);
          setPage((p) => p + 1);
        }}
      >
        Next
      </button>
    </div>
  );
}
