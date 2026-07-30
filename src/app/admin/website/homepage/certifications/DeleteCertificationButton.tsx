"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteHomepageCertification } from "@/lib/actions/homepage-certification";

type DeleteCertificationButtonProps = {
  certificationId: string;
  certificationName: string;
};

export default function DeleteCertificationButton({
  certificationId,
  certificationName,
}: DeleteCertificationButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleDelete(): void {
    const confirmed = window.confirm(
      `Delete "${certificationName}"? This will also remove its uploaded logo.`,
    );

    if (!confirmed) {
      return;
    }

    setError("");

    startTransition(async () => {
      const result =
        await deleteHomepageCertification(certificationId);

      if (!result.success) {
        setError(result.errors.join(", "));
        return;
      }

      router.refresh();
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-xl border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Deleting..." : "Delete"}
      </button>

      {error ? (
        <p className="mt-2 text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
