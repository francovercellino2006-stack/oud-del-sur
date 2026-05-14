"use client";

import { useState, useEffect } from "react";

export interface CartItem {
  slug: string;
  name: string;
  brand: string;
  price: string;
  image: string;
}

const KEY = "oud_cart";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  const save = (next: CartItem[]) => {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const add = (item: CartItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.slug === item.slug)) return prev;
      const next = [...prev, item];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  const remove = (slug: string) => save(items.filter((i) => i.slug !== slug));

  const clear = () => save([]);

  const inCart = (slug: string) => items.some((i) => i.slug === slug);

  const waMessage = () => {
    if (items.length === 0) return "";
    const lines = items.map((i) => `• ${i.name} (${i.brand}) - ${i.price}`).join("\n");
    return encodeURIComponent(`Hola! Quiero consultar por los siguientes perfumes:\n\n${lines}\n\n¿Tienen todo en stock?`);
  };

  return { items, add, remove, clear, inCart, waMessage };
}
