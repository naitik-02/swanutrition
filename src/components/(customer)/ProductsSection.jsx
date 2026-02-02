import React from "react";
import ProductsSlider from "./ProductsSlider";
import products from "../utils/Products.js";

const ProductsSection = ({
  newLaunchProducts,
  bestSellerProducts,
  superSaverProducts,
}) => {
  // const bestSellerProducts = products.filter((product) => product.isBestSeller);
  // const newLaunchProducts = products.filter((product) => product.isNewLaunch);
  // const superSaverProducts = products.filter((product) => product.isSuperSaver);

  return (
    <div className="px-4 md:px-20 flex flex-col gap-10 mb-10 ">
      {bestSellerProducts?.length > 0 && (
        <>
          <h1 className="text-center font-medium mt-10 text-3xl">
            Best Seller
          </h1>
          <ProductsSlider products={bestSellerProducts} />
        </>
      )}

      {newLaunchProducts?.length > 0 && (
        <div className=" ">
          <h1 className="text-center font-medium pb-10 text-3xl">
            New Launches
          </h1>
          <ProductsSlider products={newLaunchProducts} />
        </div>
      )}

      {superSaverProducts?.length > 0 && (
        <>
          <h1 className="text-center font-medium  text-3xl">Super Saver</h1>
          <ProductsSlider products={superSaverProducts} />
        </>
      )}
    </div>
  );
};

export default ProductsSection;
