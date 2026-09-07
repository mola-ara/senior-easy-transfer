"use client";

import { useEffect, useState, type ReactNode } from "react";

const KEYBOARD_HEIGHT_THRESHOLD_PX = 150;

export function KeyboardAwareActions({ children }: { children: ReactNode }) {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const handleViewportChange = () => {
      const keyboardHeight = window.innerHeight - viewport.height;
      setIsKeyboardOpen(keyboardHeight > KEYBOARD_HEIGHT_THRESHOLD_PX);
    };

    handleViewportChange();
    viewport.addEventListener("resize", handleViewportChange);
    viewport.addEventListener("scroll", handleViewportChange);

    return () => {
      viewport.removeEventListener("resize", handleViewportChange);
      viewport.removeEventListener("scroll", handleViewportChange);
    };
  }, []);

  return (
    <div
      className={
        isKeyboardOpen ? "keyboard-actions keyboard-open" : "keyboard-actions"
      }
    >
      {children}
    </div>
  );
}
