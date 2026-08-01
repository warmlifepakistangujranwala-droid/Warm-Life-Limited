import { notFound } from "next/navigation";

import { getHomepageReviewsData } from "@/lib/actions/homepage-reviews";

import EditReviewForm from "../../EditReviewForm";

export const dynamic = "force-dynamic";

type EditReviewPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditReviewPage({
  params,
}: EditReviewPageProps) {
  const { id } = await params;

  const data =
    await getHomepageReviewsData();

  const review =
    data.reviews.find(
      (item) => item.id === id,
    ) ?? null;

  if (!review) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-950">
          Edit Customer Review
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Update customer details, review content, image,
          rating, display order and visibility.
        </p>
      </header>

      <EditReviewForm
        review={review}
      />
    </main>
  );
}