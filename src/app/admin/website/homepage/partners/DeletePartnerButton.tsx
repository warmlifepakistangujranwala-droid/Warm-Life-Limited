"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteHomepagePartner } from "@/lib/actions/homepage-partner";

type DeletePartnerButtonProps = {
  partnerId: string;
  partnerName: string;
};

export default function DeletePartnerButton({
  partnerId,
  partnerName,
}: DeletePartnerButtonProps) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const [error, setError] =
    useState("");

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${partnerName}"?\n\nThis will permanently remove the partner and its uploaded logo.`,
    );

    if (!confirmed) return;

    setError("");

    startTransition(async () => {
      const result =
        await deleteHomepagePartner(
          partnerId,
        );

      if (!result.success) {
        setError(
          result.errors.join(", "),
        );
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-xl border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending
          ? "Deleting..."
          : "Delete"}
      </button>

      {error ? (
        <p className="mt-2 text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}