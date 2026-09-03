"use client";

import { useEffect, useState, type ReactNode } from "react";

function isFieldElement(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)
  );
}

export function KeyboardAwareActions({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleFocusIn = (event: FocusEvent) => {
      if (isFieldElement(event.target)) setOpen(true);
    };
    const handleFocusOut = (event: FocusEvent) => {
      if (isFieldElement(event.target)) setOpen(false);
    };
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  return (
    <div
      className={open ? "keyboard-actions keyboard-open" : "keyboard-actions"}
    >
      {children}
    </div>
  );
}
