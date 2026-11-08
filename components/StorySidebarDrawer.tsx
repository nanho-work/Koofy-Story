"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

export function StorySidebarDrawer({ label, trigger, closeLabel, children }: {
  label: string;
  trigger: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 48rem)");
    function closeOnDesktop() {
      if (desktop.matches) dialog.current?.close();
    }
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return <div className="mobile-sidebar">
    <button type="button" className="sidebar-trigger" aria-haspopup="dialog" aria-controls={id} aria-label={label}
      onClick={() => dialog.current?.showModal()}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
        <path d="M10 18.5h4" strokeLinecap="round" />
      </svg>
      <span>{trigger}</span>
    </button>
    <dialog className="sidebar-dialog" id={id} ref={dialog} aria-label={label} onClick={(event) => {
      if (event.target === event.currentTarget) event.currentTarget.close();
    }}>
      <div className="sidebar-dialog-inner">
        <button type="button" className="sidebar-close" aria-label={closeLabel} autoFocus
          onClick={() => dialog.current?.close()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
        {children}
      </div>
    </dialog>
  </div>;
}
