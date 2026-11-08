"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ProtectedProse({ children }: { children: ReactNode }) {
  const prose = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function preventBodyCopy(event: ClipboardEvent) {
      const body = prose.current;
      const selection = document.getSelection();
      if (!body || !selection || selection.isCollapsed) return;

      for (let index = 0; index < selection.rangeCount; index++) {
        if (selection.getRangeAt(index).intersectsNode(body)) {
          event.preventDefault();
          return;
        }
      }
    }

    document.addEventListener("copy", preventBodyCopy);
    document.addEventListener("cut", preventBodyCopy);
    return () => {
      document.removeEventListener("copy", preventBodyCopy);
      document.removeEventListener("cut", preventBodyCopy);
    };
  }, []);

  return <div className="prose protected-prose" ref={prose}>{children}</div>;
}
