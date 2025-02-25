import ProductTypeTable from "@/components/common/Table/ProductTypeTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { productTypesData } from "@/models/data";
import { IProductType } from "@/models/interfaces";
import Add from "@/pages/ProductManagement/ProductType/Add";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Index() {
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  const handleFilterChange = (key: keyof IProductType, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredProducts = productTypesData.filter((product) =>
    Object.entries(filters).every(([key, value]) =>
      product[key as keyof IProductType]
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
          <Add />
        </CardHeader>
        <CardContent className="p-4">
          <ProductTypeTable
            productTypes={productTypesData}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
