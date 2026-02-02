"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { useUser } from "./user";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    totalAmount: 0,
    discountAmount: 0,
    finalAmount: 0,
    appliedCoupon: null,
  });
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuth } = useUser();

  // ✅ FIX 1: Prevent multiple fetches on mount
  const hasFetchedRef = useRef(false);
  const isAuthRef = useRef(isAuth);

  // ✅ Helpers
  const normalizeAction = (a) => {
    if (a === "increment") return "increase";
    if (a === "decrement") return "decrease";
    return a;
  };

  const getId = (p) => {
    if (!p) return p;
    if (typeof p === "string") return p;
    if (typeof p === "object") return p._id || p.id || p;
    return p;
  };

  const recalcTotals = (items = []) =>
    items.reduce(
      (acc, it) => {
        acc.totalItems += it.quantity;
        acc.totalAmount += it.finalPrice * it.quantity;
        return acc;
      },
      { totalItems: 0, totalAmount: 0 }
    );

  // ✅ FIX 2: Complete cart state preservation
  const normalizeCart = (cartData) => ({
    items: cartData?.items || [],
    totalItems: cartData?.totalItems || 0,
    totalAmount: cartData?.totalAmount || 0,
    discountAmount: cartData?.discountAmount || 0,
    finalAmount: cartData?.finalAmount || cartData?.totalAmount || 0,
    appliedCoupon: cartData?.appliedCoupon || null,
  });

  // ✅ Get Cart
  const getCart = async () => {
    try {
      setCartLoading(true);
      setLoading(true);
      setError(null);

      if (isAuth) {
        const res = await axios.get("/api/User/cart/get/", {
          withCredentials: true,
        });

        let dbCart = normalizeCart(res.data.cart);

        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || {
          items: [],
          totalItems: 0,
          totalAmount: 0,
        };

        if (guestCart.items.length > 0) {
          const mergeRes = await axios.post(
            "/api/User/cart/merge",
            { cart: guestCart.items },
            { withCredentials: true }
          );

          localStorage.removeItem("guestCart");

          // ✅ FIX 3: Preserve all cart data after merge
          setCart(normalizeCart(mergeRes.data.cart));
        } else {
          setCart(dbCart);
        }
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || {
          items: [],
          totalItems: 0,
          totalAmount: 0,
        };
        setCart(normalizeCart(guestCart));
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch cart");

      setCart(normalizeCart(null));
    } finally {
      setLoading(false);
      setCartLoading(false);
    }
  };

  // ✅ Add
  const addToCart = async ({ product, unit }) => {
    try {
      setLoading(true);

      if (isAuth) {
        await axios.post(
          "/api/User/cart/add",
          {
            productId: product._id,
            unit,
            image: product.images?.[0] || product.image,
            title: product.title,
          },
          { withCredentials: true }
        );

        await getCart();
      } else {
        let cartLS = JSON.parse(localStorage.getItem("guestCart")) || {
          items: [],
          totalItems: 0,
          totalAmount: 0,
        };

        const unitDetails = product.units.find((u) => u.unit === unit);
        const price = unitDetails.price;
        const finalPrice = unitDetails.finalPrice;

        const index = cartLS.items.findIndex(
          (item) => item.productId === product._id && item.unit === unit
        );

        if (index > -1) {
          cartLS.items[index].quantity += 1;
        } else {
          cartLS.items.push({
            productId: product._id,
            title: product.title,
            image: product.images?.[0] || product.image || null,
            unit,
            price,
            finalPrice,
            quantity: 1,
          });
        }

        // ✅ FIX 4: Immutable update
        const { totalItems, totalAmount } = recalcTotals(cartLS.items);
        const updatedCart = {
          ...cartLS,
          items: cartLS.items,
          totalItems,
          totalAmount,
        };

        localStorage.setItem("guestCart", JSON.stringify(updatedCart));
        setCart(normalizeCart(updatedCart));
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      setError(error.response?.data?.message || "Failed to add item to cart");
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, unit, action) => {
    try {
      setLoading(true);
      const pid = getId(productId);
      const act = normalizeAction(action);

      if (isAuth) {
        await axios.put(
          "/api/User/cart/update",
          { productId: pid, unit, action: act },
          { withCredentials: true }
        );

        await getCart();
      } else {
        let cartLS = JSON.parse(localStorage.getItem("guestCart")) || {
          items: [],
          totalItems: 0,
          totalAmount: 0,
        };

        const idx = cartLS.items.findIndex(
          (it) => getId(it.productId) === pid && it.unit === unit
        );

        if (idx === -1) return;

        // ✅ FIX 5: Create new array to avoid mutation issues
        const newItems = [...cartLS.items];
        const item = { ...newItems[idx] };

        if (act === "increase") {
          item.quantity += 1;
          newItems[idx] = item;
        } else if (act === "decrease") {
          item.quantity -= 1;
          if (item.quantity <= 0) {
            newItems.splice(idx, 1);
          } else {
            newItems[idx] = item;
          }
        }

        const { totalItems, totalAmount } = recalcTotals(newItems);
        const updatedCart = {
          items: newItems,
          totalItems,
          totalAmount,
        };

        localStorage.setItem("guestCart", JSON.stringify(updatedCart));
        setCart(normalizeCart(updatedCart));
      }
    } catch (error) {
      console.error("Update cart error:", error);
      setError(error.response?.data?.message || "Failed to update cart item");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId, unit) => {
    try {
      setLoading(true);

      if (isAuth) {
        await axios.delete("/api/User/cart/remove", {
          withCredentials: true,
          data: { productId, unit },
        });

        await getCart();
      } else {
        let cartLS = JSON.parse(localStorage.getItem("guestCart")) || {
          items: [],
          totalItems: 0,
          totalAmount: 0,
        };

        const index = cartLS.items.findIndex(
          (item) => item.productId === productId && item.unit === unit
        );

        if (index > -1) {
          // ✅ FIX 6: Immutable deletion
          const newItems = cartLS.items.filter((_, i) => i !== index);

          const { totalItems, totalAmount } = recalcTotals(newItems);
          const updatedCart = {
            items: newItems,
            totalItems,
            totalAmount,
          };

          localStorage.setItem("guestCart", JSON.stringify(updatedCart));
          setCart(normalizeCart(updatedCart));
        }
      }
    } catch (error) {
      console.error("Remove from cart error:", error);
      setError(error.response?.data?.message || "Failed to remove item from cart");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX 7: Prevent double fetch on mount and auth change
  useEffect(() => {
    // Track if auth status actually changed (not just component mount)
    const authChanged = isAuthRef.current !== isAuth;
    isAuthRef.current = isAuth;

    // Only fetch if:
    // 1. First mount (hasFetchedRef is false)
    // 2. Auth status actually changed (login/logout)
    if (!hasFetchedRef.current || authChanged) {
      hasFetchedRef.current = true;
      getCart();
    }
  }, [isAuth]);

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems: cart?.totalItems || 0,
        totalAmount: cart?.totalAmount || 0,
        loading,
        error,
        getCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        cartLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};