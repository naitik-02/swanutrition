import ProductDetails from "@/components/(customer)/pages/ProductDetails";

export default async function Page(props) {
  const params = await props.params;  
  const slug = params?.slug;

  if (!slug) {
    return <div>Product not found</div>;
  }

  return <ProductDetails slug={slug} />;
}
