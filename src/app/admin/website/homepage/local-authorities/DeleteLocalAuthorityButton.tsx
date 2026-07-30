"use client";

import { useTransition } from "react";

import { deleteHomepageLocalAuthority } from "@/lib/actions/homepage-local-authority";

type DeleteLocalAuthorityButtonProps = {
  authorityId: string;
  authorityName: string;
};

export default function DeleteLocalAuthorityButton({
  authorityId,
  authorityName,
}: DeleteLocalAuthorityButtonProps) {
  const [isPending, startTransition] =
    useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${authorityName}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result =
        await deleteHomepageLocalAuthority(
          authorityId,
        );

      if (!result.success) {
        alert(result.errors.join("\n"));
        return;
      }

      window.location.reload();
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="flex-1 rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending
        ? "Deleting..."
        : "Delete"}
    </button>
  );
}