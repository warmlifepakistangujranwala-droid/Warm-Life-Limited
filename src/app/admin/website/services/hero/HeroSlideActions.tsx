/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/services/hero/HeroSlideActions.tsx
 *
 * Purpose :
 * Provides publish/unpublish and delete controls for a
 * Services hero slide.
 *
 * Version : v1.0.0
 * ============================================================
 */

"use client";

import {
  Eye,
  EyeOff,
  Loader2,
  Trash2,
} from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  deleteServiceHeroSlide,
  updateServiceHeroSlide,
} from "@/lib/actions/services-page";

type HeroSlideActionsProps = {
  slideId: string;
  isPublished: boolean;
};

export default function HeroSlideActions({
  slideId,
  isPublished,
}: HeroSlideActionsProps) {
  const router = useRouter();

  const [busyAction, setBusyAction] =
    useState<
      "publish" | "delete" | null
    >(null);

  async function togglePublished(): Promise<void> {
    setBusyAction("publish");

    try {
      const result =
        await updateServiceHeroSlide(
          slideId,
          {
            is_published:
              !isPublished,
          },
        );

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      router.refresh();
    } finally {
      setBusyAction(null);
    }
  }

  async function deleteSlide(): Promise<void> {
    const confirmed =
      window.confirm(
        "Delete this hero slide permanently?",
      );

    if (!confirmed) {
      return;
    }

    setBusyAction("delete");

    try {
      const result =
        await deleteServiceHeroSlide(
          slideId,
        );

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      router.refresh();
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <div className="servicesHeroCardActions">
      <button
        type="button"
        onClick={togglePublished}
        disabled={busyAction !== null}
        className="isPublish"
      >
        {busyAction === "publish" ? (
          <Loader2
            className="servicesHeroCardActions__spinner"
            size={15}
          />
        ) : isPublished ? (
          <EyeOff size={15} />
        ) : (
          <Eye size={15} />
        )}

        {isPublished
          ? "Unpublish"
          : "Publish"}
      </button>

      <button
        type="button"
        onClick={deleteSlide}
        disabled={busyAction !== null}
        className="isDelete"
      >
        {busyAction === "delete" ? (
          <Loader2
            className="servicesHeroCardActions__spinner"
            size={15}
          />
        ) : (
          <Trash2 size={15} />
        )}

        Delete
      </button>
    </div>
  );
}
