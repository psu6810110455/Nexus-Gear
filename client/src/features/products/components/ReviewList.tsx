// ============================================================
// src/components/ReviewList.tsx
// ============================================================

import { useEffect, useState } from "react";
import api from "../../../shared/services/api";

interface Review {
  id: number;
  rating: number;
  review: string | null;
  user: { name: string };
}

interface Props {
  productId: number | string;
}

function renderStars(rating: number) {
  return [...Array(5)].map((_, i) => (
    <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-600"}>
      ★
    </span>
  ));
}

function ReviewList({ productId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    api
      .get(`/products/${productId}/reviews`)
      .then((r) => setReviews(r.data))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading)
    return (
      <div className="mb-16 animate-pulse">
        <div className="h-6 w-48 bg-zinc-800 rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-[#18181b] p-6 rounded-xl border border-white/5 flex gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-800 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-zinc-800 rounded" />
                <div className="h-3 w-full bg-zinc-800/50 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  if (reviews.length === 0)
    return (
      <div className="mb-16">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-gray-600 rounded-full block" />
          รีวิวจากลูกค้า (Customer Reviews)
        </h3>
        <p className="text-gray-500 text-sm italic">
          ยังไม่มีรีวิวสำหรับสินค้านี้
        </p>
      </div>
    );

  const avg = (
    reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="mb-16">
      <h3 className="text-xl font-bold mb-2 flex items-center gap-3">
        <span className="w-1.5 h-8 bg-[var(--clr-primary,#e11d48)] rounded-full block" />
        รีวิวจากลูกค้า
        <span className="text-base text-yellow-400 font-black">★ {avg}</span>
        <span className="text-sm text-gray-500 font-normal">
          ({reviews.length} รีวิว)
        </span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-[#18181b] p-5 rounded-xl border border-white/5 flex gap-4 hover:border-white/10 transition"
          >
            <div className="w-11 h-11 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-zinc-400 shrink-0 text-sm">
              {review.user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm text-white truncate">
                  {review.user?.name ?? "ลูกค้า"}
                </span>
                <div className="flex text-[11px] shrink-0">
                  {renderStars(review.rating)}
                </div>
              </div>
              {review.review && (
                <p className="text-sm text-gray-400 italic line-clamp-3">
                  "{review.review}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewList;
