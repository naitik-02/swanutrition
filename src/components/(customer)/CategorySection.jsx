"use client";

import Link from "next/link";
import CategoryCard from "./CategoryCard";
import { useCategoryContext } from "../.././context/category";

const CategorySection = ({ data }) => {
  return (
    <div className="">
  <div className="mx-auto grid w-fit grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
  {data.map((cat) => (
    <Link href="/products" key={cat._id} className="flex justify-center">
      <CategoryCard cat={cat} />
    </Link>
  ))}
</div>

    </div>
  );
};

export default CategorySection;
