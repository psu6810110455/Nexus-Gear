// ============================================================
// src/components/ReviewList.tsx
// ============================================================

const MOCK_REVIEWS = [
  { id: 1, user: 'Pro_Gamer_1', rating: 5, text: 'ใช้งานดีมาก เสียงเงียบ ปุ่มนิ่ม คุ้มราคาที่สุด' },
  { id: 2, user: 'Pro_Gamer_2', rating: 5, text: 'จัดส่งไวมาก แพ็คของมาดี สินค้าตรงปกครับ' },
  { id: 3, user: 'Pro_Gamer_3', rating: 5, text: 'ใช้งานดีมาก เสียงเงียบ ปุ่มนิ่ม คุ้มราคาที่สุด' },
  { id: 4, user: 'Pro_Gamer_4', rating: 5, text: 'จัดส่งไวมาก แพ็คของมาดี สินค้าตรงปกครับ' },
];

function renderStars(rating: number) {
  return [...Array(5)].map((_, i) => (
    <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-600'}>★</span>
  ));
}

function ReviewList() {
  return (
    <div className="mb-16">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
        <span className="w-1.5 h-8 bg-gray-600 rounded-full block" />
        รีวิวจากลูกค้า (Customer Reviews)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_REVIEWS.map((review) => (
          <div
            key={review.id}
            className="bg-[#18181b] p-6 rounded-xl border border-white/5 flex gap-4 hover:border-white/10 transition"
          >
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-gray-700 to-black border border-white/10 flex items-center justify-center font-bold text-gray-500 shrink-0">
              U{review.id}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm text-white">{review.user}</span>
                <div className="flex text-[10px]">{renderStars(review.rating)}</div>
              </div>
              <p className="text-sm text-gray-400 italic">"{review.text}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewList;