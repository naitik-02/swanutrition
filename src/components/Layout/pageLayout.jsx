import MainContainer from "./MainContainer";
import { notFound } from "next/navigation";

export default async function PageLayout({ slug }) {
  try {
    const res = await fetch(`${process.env.SERVER}/api/Admin/pages/${slug}`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (res.status === 404) {
      return notFound();
    }

    if (!res.ok) {
      console.error("Failed to fetch page:", res.statusText);
      throw new Error("Failed to load page");
    }

    const pageData = await res.json();

    if (!pageData?.data) {
      return notFound();
    }

    return <MainContainer pageData={pageData.data} />;
  } catch (error) {
    console.error("Page load error:", error);
    return notFound();
  }
}
