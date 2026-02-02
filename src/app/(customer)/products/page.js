import Loading from "@/components/loading";
import Products from "../../../components/(customer)/pages/Products";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense
      fallback={<Loading/>}
    >
      <Products />
    </Suspense>
  );
};

export default page;
