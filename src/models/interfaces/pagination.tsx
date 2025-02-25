export interface IPagination {
  currentPage: number // Trang hiện tại
  totalPage: number // Tổng số trang
  totalRecords?: number // Tổng số bản ghi
  onPageChange?: (page: number) => void // Hàm gọi khi chuyển trang
  siblingCount?: number // Số lượng trang liền kề hiển thị (mặc định 1)
  className?: string // Lớp CSS tùy chỉnh
  activeColor?:string
}
