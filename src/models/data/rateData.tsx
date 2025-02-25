import { IRateListResponse } from '../interfaces/rate';

export const rateListResponseData: IRateListResponse = {
  status: 200,
  data: {
    rates: [
      {
        id: 1,
        pImage: "http://localhost:5173/src/assets/images/product/shirt.webp",
        pName: "Product 1",
        name: "John Doe",
        star: 5,
        content: "Excellent product!",
        reply: "",
        status: 1,
        createdAt: "1734974964.4281",
        updatedAt: "1734974964.4281",
      },
      {
        id: 2,
        pImage: "http://localhost:5173/src/assets/images/product/shirt.webp",
        pName: "Product 2",
        name: "Jane Smith",
        star: 4,
        content: "Good value for money.",
        reply: "We appreciate your review!",
        status: 1,
        createdAt: "1734974964.4281",
        updatedAt: "1734974964.4281",
      },
      {
        id: 3,
        pImage: "http://localhost:5173/src/assets/images/product/shirt.webp",
        pName: "Product 3",
        name: "Alice Brown",
        star: 3,
        content: "Average experience.",
        reply: "We'll work on improving!",
        status: 1,
        createdAt: "1734974964.4281",
        updatedAt: "1734974964.4281",
      },
    ],
    pagination: {
      currentPage: PAGINATION_CONFIG.DEFAULT_PAGE,
      totalPage: 1,
      totalRecords: 3,
    },
  },
  message: "Data fetched successfully."
};