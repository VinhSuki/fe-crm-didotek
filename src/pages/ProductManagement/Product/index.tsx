import ProductTable from "@/components/common/Table/ProductTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { productData } from "@/models/data";
import { IProduct } from "@/models/interfaces";
import { Plus } from "lucide-react";
import { useState } from "react";


export default function Index() {
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  const handleFilterChange = (key: keyof IProduct, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredProducts = productData.filter((product) =>
    Object.entries(filters).every(([key, value]) =>
      product[key as keyof IProduct]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      {/* Product Table */}
      <Card>
        <CardHeader className="flex-row justify-end items-center border-b">
          <Button className="bg-primary hover:bg-secondary text-white">
            <Plus />
            <span>Thêm mới</span>
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          <ProductTable products={productData} filters={filters} onFilterChange={handleFilterChange}/>
        </CardContent>
      </Card>
    </div>
  );
}
