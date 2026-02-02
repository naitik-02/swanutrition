"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MiniCheckout from "@/components/(customer)/MiniCheckout";
import { useCart } from "@/context/cart";
import TopHeader from "@/components/(customer)/TopHeader";
import Navbar from "@/components/(customer)/Navbar";
import Footer from "@/components/(customer)/Footer";

export default function CustomerClientWrapper({ children }) {
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

  const { cart, updateCartItem, removeFromCart } = useCart();
  const router = useRouter();

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-white">
        <TopHeader />
        <Navbar onCartClick={() => setIsMiniCartOpen(true)} />
      </div>
      <main className="pt-[120px]">{children}</main>

      <MiniCheckout
        isOpen={isMiniCartOpen}
        onClose={() => setIsMiniCartOpen(false)}
        cart={cart}
        updateCartItem={updateCartItem}
        removeFromCart={removeFromCart}
        onProceedToCheckout={() => router.push("/checkout")}
        onProceedToLogin={() => router.push("/auth/login")}
      />

      <Footer />
    </>
  );
}
