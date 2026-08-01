"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { deleteHomepageReview } from "@/lib/actions/homepage-reviews";

type DeleteReviewButtonProps = {
  reviewId: string;
  customerName: string;
};

export default function DeleteReviewButton({
  reviewId,
  customerName,
}: DeleteReviewButtonProps) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${customerName}" review?`,
    );

    if (!confirmed) return;

    startTransition(async () => {
      const result =
        await deleteHomepageReview(
          reviewId,
        );

      if (!result.success) {
        alert(
          result.errors.join("\n"),
        );

        return;
      }

      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Trash2 size={16} />

      {isPending
        ? "Deleting..."
        : "Delete"}
    </button>
  );
}