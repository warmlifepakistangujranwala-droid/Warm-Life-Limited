"use client";

import { useRouter } from "next/navigation";
import {
  useState,
  useTransition,
} from "react";

import { deleteHomepageWhyChooseUsCard } from "@/lib/actions/homepage-why-choose-us";

type DeleteCardButtonProps = {
  cardId: string;
  cardTitle: string;
};

export default function DeleteCardButton({
  cardId,
  cardTitle,
}: DeleteCardButtonProps) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const [error, setError] =
    useState("");

  function handleDelete(): void {
    const confirmed =
      window.confirm(
        `Delete "${cardTitle}"?\n\nThis action cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    setError("");

    startTransition(async () => {
      const result =
        await deleteHomepageWhyChooseUsCard(
          cardId,
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
        className="inline-flex w-full items-center justify-center rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
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