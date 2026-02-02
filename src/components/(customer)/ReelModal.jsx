"use client";
import { useState } from "react";
import { X, Heart, Share2, Eye } from "lucide-react";
import Link from "next/link";

const ReelModal = ({ product, onClose }) => {
  const [localLikes, setLocalLikes] = useState(product?.likes || 0);
  const [localViews, setLocalViews] = useState(product?.views || 0);
  const [localShares, setLocalShares] = useState(product?.shares || 0);

  const [liking, setLiking] = useState(false);
  const [sharing, setSharing] = useState(false);

  if (!product) return null;

  const videoId = product?._id; 

  const handleLike = async () => {
    if (!videoId || liking) return;

    try {
      setLiking(true);

      setLocalLikes((prev) => prev + 1);

      const res = await fetch(`/api/User/video/like/${videoId}`, {
        method: "PATCH",
      });

      if (!res.ok) {
        // rollback if failed
        setLocalLikes((prev) => prev - 1);
      }
    } catch (error) {
      setLocalLikes((prev) => prev - 1);
      console.log("LIKE ERROR:", error);
    } finally {
      setLiking(false);
    }
  };

  const handleShare = async () => {
    if (!videoId || sharing) return;

    try {
      setSharing(true);

      // ✅ Optimistic UI update
      setLocalShares((prev) => prev + 1);

      const res = await fetch(`/api/User/video/share/${videoId}`, {
        method: "PATCH",
      });

      if (!res.ok) {
        setLocalShares((prev) => prev - 1);
      }

      // ✅ Share UI (mobile)
      const shareUrl = window.location.href;

      if (navigator.share) {
        await navigator.share({
          title: product?.product?.title || "Product Video",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied!");
      }
    } catch (error) {
      console.log("SHARE ERROR:", error);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div className="relative w-[360px] h-[500px] bg-black rounded-2xl overflow-hidden z-10">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 bg-black/60 text-white rounded-full p-1"
        >
          <X size={18} />
        </button>

        <video
          src={product.video}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />

        <div className="absolute right-3 bottom-24 flex flex-col gap-4 text-white text-xs">
          {/* ✅ Like */}
          <button
            onClick={handleLike}
            disabled={liking}
            className="flex flex-col items-center disabled:opacity-60"
          >
            <Heart size={18} />
            {localLikes}
          </button>

          {/* ✅ Views (display only) */}
          <div className="flex flex-col items-center">
            <Eye size={18} />
            {localViews}
          </div>

          {/* ✅ Share */}
          <button
            onClick={handleShare}
            disabled={sharing}
            className="flex flex-col items-center disabled:opacity-60"
          >
            <Share2 size={18} />
            {localShares}
          </button>
        </div>

        <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
          <p className="text-sm font-medium">{product?.product?.title}</p>

         <Link href={`/details/${product.product.slug}/`}>
          <button  className="mt-2 w-full bg-white text-black py-2 rounded-lg font-semibold">
            Buy Now
          </button>
         </Link>
        </div>
      </div>
    </div>
  );
};

export default ReelModal;
