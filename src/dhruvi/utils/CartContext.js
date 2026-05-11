import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { storage } from './storage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const [orders, setOrders] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [offerCode, setOfferCode] = useState(null);

  const normalizeOfferCode = useCallback((code) => {
    if (!code) return null;
    const normalized = String(code).trim().toUpperCase();
    if (!normalized) return null;

    if (normalized === 'B1G1' || normalized === 'BUY1GET1' || normalized === 'BOGO') return 'B1G1';
    if (normalized === 'FREEDEL' || normalized === 'FREESHIP' || normalized === 'FREEDELIVERY') return 'FREESHIP';

    // Flat discount like BK50, BK100, etc.
    if (/^BK\d{1,4}$/.test(normalized)) return normalized;

    // Percentage discount like OFF10, OFF25, etc.
    if (/^OFF\d{1,2}$/.test(normalized)) return normalized;

    return null;
  }, []);

  const isBogoEligibleItem = useCallback((item) => {
    const badge = item?.badge ? String(item.badge).trim().toUpperCase() : '';
    const name = item?.name ? String(item.name).toLowerCase() : '';
    return badge === 'BOGO' || name.includes('buy 1 get 1');
  }, []);

  const calculateAutoDiscount = useCallback((items) => {
    // Product-specific offers baked into the catalog (e.g., badge: 'BOGO').
    return (items || []).reduce((sum, item) => {
      if (!isBogoEligibleItem(item)) return sum;
      const qty = item.qty || 0;
      const price = item.price || 0;
      return sum + price * Math.floor(qty / 2);
    }, 0);
  }, [isBogoEligibleItem]);

  const calculateOfferBenefits = useCallback((code, items) => {
    if (!code) return { discount: 0, freeDelivery: false };
    const normalized = normalizeOfferCode(code);
    if (!normalized) return { discount: 0, freeDelivery: false };

    const rawSubtotal = (items || []).reduce(
      (sum, item) => sum + (item.price || 0) * (item.qty || 1),
      0
    );

    // Apply promo codes on the payable subtotal (after auto product offers like BOGO).
    const cartSubtotal = Math.max(0, rawSubtotal - calculateAutoDiscount(items));

    if (cartSubtotal <= 0) return { discount: 0, freeDelivery: normalized === 'FREESHIP' };

    if (normalized === 'FREESHIP') {
      return { discount: 0, freeDelivery: true };
    }

    if (/^BK(\d{1,4})$/.test(normalized)) {
      const amount = Number(normalized.replace('BK', ''));
      const discount = Number.isFinite(amount) ? Math.min(Math.max(0, amount), cartSubtotal) : 0;
      return { discount, freeDelivery: false };
    }

    if (/^OFF(\d{1,2})$/.test(normalized)) {
      const percent = Number(normalized.replace('OFF', ''));
      const clamped = Number.isFinite(percent) ? Math.min(Math.max(0, percent), 90) : 0;
      const discount = Math.round(cartSubtotal * (clamped / 100));
      return { discount: Math.min(discount, cartSubtotal), freeDelivery: false };
    }

    // Note: B1G1/BOGO is handled as an *automatic product offer* based on item.badge/name.
    // Keeping the code as a no-op keeps UX consistent if user tries entering it.
    if (normalized === 'B1G1') {
      return { discount: 0, freeDelivery: false };
    }

    return { discount: 0, freeDelivery: false };
  }, [calculateAutoDiscount, normalizeOfferCode]);

  useEffect(() => {
    storage.getItem('@bk_payment_method').then((saved) => {
      if (saved === 'upi' || saved === 'cash') {
        setPaymentMethod(saved);
      }
    });
  }, []);

  const updatePaymentMethod = useCallback((method) => {
    if (method !== 'upi' && method !== 'cash') return;
    setPaymentMethod(method);
    storage.setItem('@bk_payment_method', method);
  }, []);

  const applyOffer = useCallback((code, items) => {
    const normalized = normalizeOfferCode(code);
    if (!normalized) return false;

    // Product-specific offers apply automatically; allow the code but don't require it.
    // For other promo codes, ensure it's meaningful on current cart.
    const currentItems = items || Object.values(cart);
    const benefits = calculateOfferBenefits(normalized, currentItems);
    const isMeaningful = benefits.freeDelivery || benefits.discount > 0 || /^BK\d{1,4}$/.test(normalized) || /^OFF\d{1,2}$/.test(normalized) || normalized === 'B1G1';
    if (!isMeaningful) return false;

    setOfferCode(normalized);
    return true;
  }, [calculateOfferBenefits, cart, normalizeOfferCode]);

  const clearOffer = useCallback(() => {
    setOfferCode(null);
  }, []);

  const addToCart = useCallback((item) => {
    setCart(prev => ({
      ...prev,
      [item.id]: prev[item.id]
        ? { ...prev[item.id], qty: prev[item.id].qty + 1 }
        : { ...item, qty: 1 }
    }));
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  }, []);

  const decreaseQty = useCallback((id) => {
    setCart(prev => {
      const updated = { ...prev };

      if (!updated[id]) return prev;

      if (updated[id].qty === 1) {
        delete updated[id];
      } else {
        updated[id] = { ...updated[id], qty: updated[id].qty - 1 };
      }

      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart({});
  }, []);

  const increaseQty = useCallback((item) => {
    setCart(prev => {
      if (!prev[item.id]) return prev;

      return {
        ...prev,
        [item.id]: {
          ...prev[item.id],
          qty: prev[item.id].qty + 1
        }
      };
    });
  }, []);

  const placeOrder = useCallback((details) => {
    const orderItems = Object.values(cart);

    if (orderItems.length === 0) return;

    const method = details?.paymentMethod || paymentMethod;
    const normalizedOfferCode = normalizeOfferCode(details?.offerCode ?? offerCode);
    const benefits = calculateOfferBenefits(normalizedOfferCode, orderItems);
    const computedOfferDiscount = benefits.discount;
    const computedAutoDiscount = calculateAutoDiscount(orderItems);

    setOrders(prev => [
      ...prev,
      {
        id: Date.now(),
        items: orderItems,
        details: {
          ...details,
          paymentMethod: method,
          offerCode: normalizedOfferCode,
          offerDiscount: details?.offerDiscount ?? computedOfferDiscount,
          offerFreeDelivery: details?.offerFreeDelivery ?? benefits.freeDelivery,
          autoDiscount: details?.autoDiscount ?? computedAutoDiscount,
        }
      }
    ]);

    setCart({});
  }, [calculateAutoDiscount, calculateOfferBenefits, cart, normalizeOfferCode, offerCode, paymentMethod]);

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.qty, 0), [cartItems]);
  const cartTotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.qty, 0), [cartItems]);
  const cartAutoDiscount = useMemo(() => calculateAutoDiscount(cartItems), [calculateAutoDiscount, cartItems]);
  const cartPayableSubTotal = useMemo(() => Math.max(0, cartTotal - cartAutoDiscount), [cartAutoDiscount, cartTotal]);
  const offerBenefits = useMemo(() => calculateOfferBenefits(offerCode, cartItems), [calculateOfferBenefits, cartItems, offerCode]);
  const offerDiscount = offerBenefits.discount;
  const offerFreeDelivery = offerBenefits.freeDelivery;

  const value = useMemo(() => ({
    cart,
    cartItems,
    cartCount,
    cartTotal,
    cartAutoDiscount,
    cartPayableSubTotal,
    orders,
    paymentMethod,
    offerCode,
    offerDiscount,
    offerFreeDelivery,
    addToCart,
    updatePaymentMethod,
    applyOffer,
    clearOffer,
    increaseQty,
    removeFromCart,
    decreaseQty,
    clearCart,
    placeOrder
  }), [addToCart, applyOffer, cart, cartAutoDiscount, cartCount, cartItems, cartPayableSubTotal, cartTotal, clearCart, clearOffer, decreaseQty, increaseQty, offerCode, offerDiscount, offerFreeDelivery, orders, paymentMethod, placeOrder, removeFromCart, updatePaymentMethod]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
