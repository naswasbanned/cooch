"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";

interface DragState {
  pointerId: number;
  startX: number;
  startScrollLeft: number;
  thumbWidth: number;
  trackWidth: number;
  scrollable: number;
}

function SideScrollbar({ targetRef }: { targetRef: RefObject<HTMLElement | null> }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const dragRef = useRef<DragState | null>(null);

  const measure = useCallback(() => {
    const target = targetRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!target || !track || !thumb) return;

    const trackWidth = track.clientWidth;
    const scrollable = target.scrollWidth - target.clientWidth;
    if (scrollable <= 1 || trackWidth <= 0) {
      track.dataset.visible = "false";
      return;
    }

    const thumbWidth = Math.min(
      trackWidth,
      Math.max(32, (target.clientWidth / target.scrollWidth) * trackWidth),
    );
    const maxLeft = Math.max(0, trackWidth - thumbWidth);
    const left = (target.scrollLeft / scrollable) * maxLeft;

    thumb.style.width = `${thumbWidth}px`;
    thumb.style.transform = `translate3d(${left}px, 0, 0)`;
    track.dataset.visible = "true";
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
      const scrollable = target.scrollWidth - target.clientWidth;
      const trackWidth = track.clientWidth;
      const thumbWidth = thumb.getBoundingClientRect().width;
      if (scrollable <= 1 || trackWidth <= 0) return;

      event.preventDefault();
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startScrollLeft: target.scrollLeft,
        thumbWidth,
        trackWidth,
        scrollable,
      };
      thumb.setPointerCapture(event.pointerId);
      track.classList.add("is-dragging");
    };

    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const maxLeft = Math.max(1, drag.trackWidth - drag.thumbWidth);
      const delta = event.clientX - drag.startX;
      target.scrollLeft = drag.startScrollLeft + (delta / maxLeft) * drag.scrollable;
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

    thumb.addEventListener("pointerdown", onPointerDown);
    thumb.addEventListener("pointermove", onPointerMove);
    thumb.addEventListener("pointerup", endDrag);
    thumb.addEventListener("pointercancel", endDrag);

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
    };
  }, [targetRef, scheduleMeasure]);

  return (
    <div ref={trackRef} className="side-scrollbar" data-visible="false" aria-hidden="true">
      <div ref={thumbRef} className="side-scrollbar__thumb" />
    </div>
  );
}

/**
 * A horizontal scroller with a site-styled rail. Native scrollbars stay hidden;
 * the rail below the row shows how much content is off-screen and follows the
 * scroll position.
 */
export function SideScroll({
  className,
  children,
  ...rest
}: {
  className: string;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  const viewportRef = useRef<HTMLDivElement>(null);

  return (
    <div className="side-scroll">
      <div
        ref={viewportRef}
        className={`side-scroll__viewport ${className}`}
        {...rest}
      >
        {children}
      </div>
      <SideScrollbar targetRef={viewportRef} />
    </div>
  );
}
