// features/orders/components/OrderItemList.tsx

import { useState } from "react";
import { Package, Star, ChevronDown } from "lucide-react";

interface OrderItem {
  id: number;
  quantity: number;
  price_at_purchase: string;
  product: { name: string; image_url: string };
  rating?: number;
  review?: string;
}

interface Props {
  items: OrderItem[];
  status: string;
  isRated?: boolean;
  defaultExpanded?: boolean;
  ratings: Record<number, number>;
  reviews: Record<number, string>;
  onStarClick: (itemId: number, star: number) => void;
  onReviewChange: (itemId: number, text: string) => void;
}

const OrderItemList = ({
  items,
  status,
  isRated,
  defaultExpanded = false,
  ratings,
  reviews,
  onStarClick,
  onReviewChange,
}: Props) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <section>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <div className="flex items-center gap-2 text-red-500">
          <Package size={16} />
          <h3 className="font-bold text-sm">
            รายการสินค้า ({items?.length || 0})
          </h3>
        </div>
        <ChevronDown
          size={16}
          className={`text-zinc-500 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="space-y-3">
          {items?.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-[#121212] border border-zinc-800/80 p-4 rounded-xl"
            >
              <div className="flex items-start gap-4">
                {/* thumbnail */}
                <div className="w-12 h-12 bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center border border-zinc-800 shrink-0">
                  {item.product?.image_url ? (
                    <img
                      src={item.product.image_url}
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package size={18} className="text-zinc-700" />
                  )}
                </div>

                <div>
                  <p className="text-white font-medium text-sm line-clamp-2">
                    {item.product?.name || "สินค้า"}
                  </p>
                  <p className="text-zinc-500 text-xs mt-1">
                    จำนวน {item.quantity} ชิ้น
                  </p>

                  {/* star rating — เฉพาะ completed */}
                  {status === "completed" && (
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const cur = isRated
                            ? item.rating || 5
                            : ratings[item.id] || 0;
                          return (
                            <Star
                              key={star}
                              size={18}
                              className={`transition-transform ${!isRated ? "cursor-pointer hover:scale-110" : ""} ${star <= cur ? "text-yellow-500 fill-yellow-500" : "text-zinc-700"}`}
                              onClick={() => onStarClick(item.id, star)}
                            />
                          );
                        })}
                      </div>
                      {!isRated && (
                        <textarea
                          rows={2}
                          placeholder="เขียนรีวิวสินค้า (ไม่บังคับ)..."
                          value={reviews[item.id] || ""}
                          onChange={(e) =>
                            onReviewChange(item.id, e.target.value)
                          }
                          className="w-full bg-zinc-900 border border-zinc-700 focus:border-zinc-500 text-zinc-200 text-xs rounded-lg px-3 py-2 resize-none outline-none placeholder-zinc-600 transition-colors"
                        />
                      )}
                      {isRated && item.review && (
                        <p className="text-xs text-zinc-500 italic">
                          "{item.review}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-red-500 font-bold text-base whitespace-nowrap ml-4">
                ฿{Number(item.price_at_purchase).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default OrderItemList;
