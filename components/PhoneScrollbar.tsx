"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { useSettings } from "@/lib/settings";

interface DragState {
  pointerId: number;
  startY: number;
  startScrollTop: number;
  thumbHeight: number;
  trackHeight: number;
  scrollable: number;
}

/**
 * A site-styled overlay scrollbar for the phone screen. The native scrollbar
 * stays hidden so the screen keeps its exact phone width; this rail floats
 * inside the frame, follows the scroll position, and can be dragged.
 */
export function PhoneScrollbar({
  targetRef,
  resetKey,
}: {
  targetRef: RefObject<HTMLElement | null>;
  resetKey?: string;
}) {
  const { t } = useSettings();
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const dragRef = useRef<DragState | null>(null);

  const measure = useCallback(() => {
    const target = targetRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!target || !track || !thumb) return;

    const trackHeight = track.clientHeight;
    const scrollable = target.scrollHeight - target.clientHeight;
    if (scrollable <= 1 || trackHeight <= 0) {
      track.dataset.visible = "false";
      track.tabIndex = -1;
      track.setAttribute("aria-hidden", "true");
      if (document.activeElement === track) track.blur();
      return;
    }

    const thumbHeight = Math.min(
      trackHeight,
      Math.max(36, (target.clientHeight / target.scrollHeight) * trackHeight),
    );
    const maxTop = Math.max(0, trackHeight - thumbHeight);
    const top = (target.scrollTop / scrollable) * maxTop;

    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translate3d(-50%, ${top}px, 0)`;
    track.dataset.visible = "true";
    track.tabIndex = 0;
    track.setAttribute("aria-hidden", "false");
    track.setAttribute(
      "aria-valuenow",
      String(Math.round((target.scrollTop / scrollable) * 100)),
    );
  }, [targetRef]);

  const scheduleMeasure = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      measure();
    });
  }, [measure]);

  useEffect(() => {
    const target = targetRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!target || !track || !thumb) return;

    target.addEventListener("scroll", scheduleMeasure, { passive: true });
    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(target);
    resizeObserver.observe(track);
    const mutationObserver = new MutationObserver(scheduleMeasure);
    mutationObserver.observe(target, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    window.addEventListener("resize", scheduleMeasure);
    scheduleMeasure();
    void document.fonts?.ready.then(scheduleMeasure);

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const scrollable = target.scrollHeight - target.clientHeight;
      const trackHeight = track.clientHeight;
      const thumbHeight = thumb.getBoundingClientRect().height;
      if (scrollable <= 1 || trackHeight <= 0) return;

      event.preventDefault();
      dragRef.current = {
        pointerId: event.pointerId,
        startY: event.clientY,
        startScrollTop: target.scrollTop,
        thumbHeight,
        trackHeight,
        scrollable,
      };
      thumb.setPointerCapture(event.pointerId);
      track.classList.add("is-dragging");
    };

    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const maxTop = Math.max(1, drag.trackHeight - drag.thumbHeight);
      const delta = event.clientY - drag.startY;
      target.scrollTop = drag.startScrollTop + (delta / maxTop) * drag.scrollable;
    };

    const endDrag = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      dragRef.current = null;
      if (thumb.hasPointerCapture(event.pointerId)) {
        thumb.releasePointerCapture(event.pointerId);
      }
      track.classList.remove("is-dragging");
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const scrollable = target.scrollHeight - target.clientHeight;
      if (scrollable <= 1) return;
      const page = Math.max(48, target.clientHeight * 0.9);
      let next: number;
      switch (event.key) {
        case "ArrowDown":
          next = target.scrollTop + 48;
          break;
        case "ArrowUp":
          next = target.scrollTop - 48;
          break;
        case "PageDown":
          next = target.scrollTop + page;
          break;
        case "PageUp":
          next = target.scrollTop - page;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = scrollable;
          break;
        default:
          return;
      }
      event.preventDefault();
      target.scrollTop = next;
    };

    thumb.addEventListener("pointerdown", onPointerDown);
    thumb.addEventListener("pointermove", onPointerMove);
    thumb.addEventListener("pointerup", endDrag);
    thumb.addEventListener("pointercancel", endDrag);
    track.addEventListener("keydown", onKeyDown);

    return () => {
      target.removeEventListener("scroll", scheduleMeasure);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      thumb.removeEventListener("pointerdown", onPointerDown);
      thumb.removeEventListener("pointermove", onPointerMove);
      thumb.removeEventListener("pointerup", endDrag);
      thumb.removeEventListener("pointercancel", endDrag);
      track.removeEventListener("keydown", onKeyDown);
    };
  }, [targetRef, scheduleMeasure]);

  useEffect(() => {
    scheduleMeasure();
  }, [resetKey, scheduleMeasure]);

  // React may re-render this component (for example on a language change) and
  // reset the ARIA attributes we manage imperatively; restore them after render.
  useEffect(() => {
    measure();
  });

  return (
    <div
      ref={trackRef}
      className="phone-scrollbar"
      role="scrollbar"
      aria-label={t("scrollBar")}
      aria-controls="phone-screen"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <div ref={thumbRef} className="phone-scrollbar__thumb">
        <span className="phone-scrollbar__grip" aria-hidden="true" />
      </div>
    </div>
  );
}
