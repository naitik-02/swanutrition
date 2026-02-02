"use client";
import HomeHero from "../HomeHero";
import VideoSection from "../VideoSection";
import CategorySection from "../CategorySection";
import ProductsSection from "../ProductsSection";
import BlogSection from "../BlogSection";
import PromotionalBanner from "../PromotionalBanner";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/loading";

const Home = () => {
  const [homedata, setHomeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newLaunchProducts, setNewLaunchProducts] = useState([]);
  const [superSaverProducts, setSuperSaverProducts] = useState([]);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [blogs, setBlogs] = useState([]);

  const FetchHomePageData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/User/home");
      setHomeData(res.data.data);
      console.log(res.data);

      setNewLaunchProducts(res.data.data.newlaunches);
      setSuperSaverProducts(res.data.data.supersaver);
      setBestSellerProducts(res.data.data.bestseller);
      setVideos(res.data.data.videos);
      setBlogs(res.data.data.blogs);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchHomePageData();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <div className="max-w-7xl  m-auto">
        {homedata?.hero?.length > 0 && <HomeHero data={homedata.hero} />}
        {homedata?.videos?.length > 0 && <VideoSection data={videos} />}
        <h1 className="text-center mb-10 font-medium mt-10 text-3xl">
          Shop For
        </h1>
        {homedata?.categories?.length > 0 && (
          <CategorySection data={homedata.categories} />
        )}

        <ProductsSection
          newLaunchProducts={newLaunchProducts}
          bestSellerProducts={bestSellerProducts}
          superSaverProducts={superSaverProducts}
        />

        {blogs && <BlogSection data={blogs} />}
        <PromotionalBanner />
      </div>
    </>
  );
};

export default Home;
