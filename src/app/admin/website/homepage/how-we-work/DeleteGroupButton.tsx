"use client";

import { useRouter } from "next/navigation";
import {
  useState,
  useTransition,
} from "react";

import { deleteHomepageHowWeWorkGroup } from "@/lib/actions/homepage-how-we-work";

type DeleteGroupButtonProps = {
  groupId: string;
  groupTitle: string;
};

export default function DeleteGroupButton({
  groupId,
  groupTitle,
}: DeleteGroupButtonProps) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const [error, setError] =
    useState("");

  function handleDelete(): void {
    const confirmed =
      window.confirm(
        `Delete "${groupTitle}"?\n\nAll steps inside this group will also be deleted. This action cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    setError("");

    startTransition(async () => {
      const result =
        await deleteHomepageHowWeWorkGroup(
          groupId,
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
        className="inline-flex w-full items-center justify-center rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending
          ? "Deleting..."
          : "Delete Group"}
      </button>

      {error ? (
        <p className="mt-2 text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}