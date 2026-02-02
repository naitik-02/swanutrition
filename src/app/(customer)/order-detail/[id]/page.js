import OrderDetails from "@/components/(customer)/OrderDetails";
import React from "react";

const page = async ({ params }) => {
  const { id } = await params;
  return <OrderDetails id={id} />;
};

export default page;
