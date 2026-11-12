"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/lib/settings";
import { Icon } from "./Icon";
import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  labelledBy?: string;
  className?: string;
}

export function Modal({ open, onClose, title, children, actions, labelledBy, className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = labelledBy ?? "modal-title";
  const { t } = useSettings();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cn("modal", className)}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
    >
      <div className="modal__inner">
        <span className="modal__handle" aria-hidden="true" />
        <div className="modal__header">
          <h2 className="modal__title" id={titleId}>
            {title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            round
            className="modal__close"
            aria-label={t("close")}
            onClick={onClose}
          >
            <Icon name="i-close" />
          </Button>
        </div>
        <div className="modal__body stack">{children}</div>
        {actions ? <div className="modal__actions">{actions}</div> : null}
      </div>
    </dialog>
  );
}
