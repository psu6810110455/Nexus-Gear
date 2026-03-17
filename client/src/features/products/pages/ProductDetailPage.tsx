// ============================================================
// src/features/products/pages/ProductDetailPage.tsx
// ============================================================

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  getProducts,
  addToCart,
  getServerUrl,
} from "../../../shared/services/api";
import type { Product } from "../../../shared/types";
import { useLanguage } from "../../../shared/context/LanguageContext";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReviewList from "../components/ReviewList";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "decrease" && quantity > 1) setQuantity(quantity - 1);
    else if (type === "increase" && product && quantity < (product.stock ?? 0))
      setQuantity(quantity + 1);
  };

  const renderStars = (rating: number = 5) =>
    [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-600"}
      >
        ★
      </span>
    ));

  // ✅ ฟังก์ชันใส่ตะกร้า
  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      toast.success(language === 'TH' ? `✅ เพิ่ม "${product.name}" ลงตะกร้าแล้ว!` : `✅ Added "${product.name}" to cart!`);
    } catch (err) {
      console.error(err);
      toast.error(language === 'TH' ? "❌ เกิดข้อผิดพลาด กรุณาลองใหม่" : "❌ Error, please try again");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      navigate("/cart");
    } catch (err) {
      console.error(err);
      toast.error(language === 'TH' ? "❌ เกิดข้อผิดพลาด กรุณาลองใหม่" : "❌ Error, please try again");
      setAddingToCart(false);
    }
  };

  const imagesList = product?.images && product.images.length > 0 
    ? product.images.map(img => getServerUrl(img.imageUrl))
    : [(product?.imageUrl || product?.image_url || "https://dummyimage.com/600x400/000/fff?text=No+Image")];

  const handleNextImage = () => {
    if (!activeImage || imagesList.length <= 1) return;
    const currentIndex = imagesList.indexOf(activeImage);
    const nextIndex = (currentIndex + 1) % imagesList.length;
    setActiveImage(imagesList[nextIndex]);
  };

  const handlePrevImage = () => {
    if (!activeImage || imagesList.length <= 1) return;
    const currentIndex = imagesList.indexOf(activeImage);
    const prevIndex = currentIndex === 0 ? imagesList.length - 1 : currentIndex - 1;
    setActiveImage(imagesList[prevIndex]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentProduct = await getProductById(id!);
        setProduct(currentProduct);
        const allProducts = await getProducts();
        const related = allProducts
          .filter(
            (p: Product) =>
              (p.category as any)?.name ===
                (currentProduct.category as any)?.name &&
              p.id !== currentProduct.id,
          )
          .slice(0, 4);
        setRelatedProducts(related);
        setQuantity(1);
        
        // กำหนดรูปหลัก เริ่มต้นจาก imageUrl หรือรูปแรกใน images array
        const firstImg = currentProduct.images && currentProduct.images.length > 0 
          ? getServerUrl(currentProduct.images[0].imageUrl)
          : (currentProduct.imageUrl || currentProduct.image_url);
        setActiveImage(firstImg || null);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center text-white">
        {t('loading')}
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center text-white">
        {t('notFound')}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white font-sans pb-20">
      <div className="container mx-auto px-4 mt-6 max-w-6xl">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-white flex items-center gap-2 text-sm font-bold transition group"
          >
            <span className="group-hover:-translate-x-1 transition">←</span>{" "}
            {t('backToProducts')}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-12 mb-16">
          <div className="w-full md:w-3/5 bg-[#18181b] rounded-xl overflow-hidden p-8 flex flex-col items-center justify-center relative shadow-[0_0_30px_rgba(255,255,255,0.05)] min-h-[400px] border border-white/5 group/mainimg">
            <div className="relative w-full flex items-center justify-center mb-6 h-[300px]">
              <img
                src={
                  activeImage ||
                  "https://dummyimage.com/600x400/000/fff?text=No+Image"
                }
                alt={product.name}
                className="max-h-full w-auto object-contain hover:scale-105 transition duration-500 drop-shadow-[0_0_15px_rgba(255,0,0,0.15)]"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://dummyimage.com/600x400/000/fff?text=Nexus+Gear";
                }}
              />
              
              {imagesList.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover/mainimg:opacity-100 transition z-20 hover:scale-110 shadow-lg"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover/mainimg:opacity-100 transition z-20 hover:scale-110 shadow-lg"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Slider */}
            {product.images && product.images.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2 w-full justify-center">
                {product.images.map((img) => {
                  const fullUrl = getServerUrl(img.imageUrl);
                  const isSelected = activeImage === fullUrl;
                  return (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(fullUrl)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${isSelected ? "border-red-600" : "border-white/10 hover:border-white/30"} flex-shrink-0 bg-white`}
                    >
                      <img
                        src={fullUrl}
                        alt="Thumbnail"
                        className={`w-full h-full object-contain mix-blend-multiply ${isSelected ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
                        onError={(e) => {
                          e.currentTarget.src = "https://dummyimage.com/100x100/000/fff";
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-2 w-full justify-center">
                <button className="w-16 h-16 rounded-lg overflow-hidden border-2 border-red-600 flex-shrink-0 bg-white">
                  <img
                    src={product.imageUrl || product.image_url || "https://dummyimage.com/100x100/000/fff"}
                    alt="Thumbnail"
                    className="w-full h-full object-contain mix-blend-multiply opacity-100"
                  />
                </button>
              </div>
            )}

            <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider shadow-lg">
              {t('newArrival')}
            </span>
          </div>

          <div className="w-full md:w-2/5 flex flex-col">
            <div className="mb-2">
              <span className="text-red-500 text-xs font-bold tracking-widest uppercase border border-red-500/30 px-2 py-1 rounded">
                {(product.category as any)?.name || "GAMING GEAR"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 text-sm mb-6 pb-6 border-b border-white/10">
              <div className="flex text-yellow-500 text-lg">
                {renderStars(Math.floor((product.id % 2) + 4))}
              </div>
              <span className="text-gray-400">
                ({((product.id % 2) + 4).toFixed(1)} {language === 'TH' ? 'รีวิว' : 'Reviews'})
              </span>
              <span className="text-gray-600">|</span>
              <span className="text-green-400">
                {t('sold')} {((product.id % 15) * 123 + 45).toLocaleString()} {t('piece')}
              </span>
            </div>
            <div className="mb-8">
              <p className="text-gray-400 text-sm mb-1">{t('specialPrice')}</p>
              <div className="flex items-end gap-3">
                <p className="text-4xl font-bold text-red-500">
                  ฿{Number(product.price).toLocaleString()}
                </p>
                <p className="text-gray-500 line-through mb-1 text-lg">
                  ฿{Number(Number(product.price) * 1.2).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mb-8 bg-[#18181b] p-4 rounded-xl border border-white/5">
              <p className="text-sm text-gray-400 mb-3 flex justify-between">
                <span>{t('quantity')}</span>
                <span className="text-xs text-gray-500">
                  {t('inStock')} {product.stock} {t('piece')}
                </span>
              </p>
              <div className="flex items-center bg-black border border-white/20 rounded-lg w-fit">
                <button
                  onClick={() => handleQuantityChange("decrease")}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition text-xl rounded-l-lg"
                >
                  −
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-12 text-center bg-transparent text-white font-bold outline-none"
                />
                <button
                  onClick={() => handleQuantityChange("increase")}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition text-xl rounded-r-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* ✅ ปุ่มเชื่อม API แล้ว */}
            <div className="flex gap-4 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="flex-1 bg-[#18181b] border border-white/20 hover:bg-white hover:text-black text-white py-3.5 rounded-lg font-bold transition flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="group-hover:scale-110 transition">🛒</span>
                {addingToCart ? t('adding') : t('addToCart')}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={addingToCart || product.stock === 0}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-lg font-bold shadow-lg shadow-red-900/40 transition transform active:scale-95"
              >
                {product.stock === 0 ? t('outOfStock') : t('buyNow')}
              </button>
            </div>

            {/* Package details removed as requested */}
          </div>
        </div>

        {/* Product Description */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-red-600 rounded-full block"></span>{" "}
            {t('productDetail')}
          </h3>
          <div className="bg-[#18181b] p-8 rounded-2xl border border-white/5 text-gray-300 leading-relaxed shadow-lg">
            <p className="text-xl font-semibold text-white mb-6">
              {product.name}
            </p>
            <p className="mb-0 text-gray-400">
              {product.description ||
                (language === 'TH' 
                  ? "สัมผัสประสบการณ์การเล่นเกมที่เหนือกว่าด้วยอุปกรณ์ Gaming Gear ระดับโปร..."
                  : "Experience superior gaming with professional-level Gaming Gear...")}
            </p>
          </div>
        </div>

        {/* Reviews */}
        <ReviewList productId={product.id} />

        {/* Related Products */}
        <div className="border-t border-white/10 pt-10">
          <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-2">
            {t('relatedProducts')}
            <span className="text-red-600 text-sm font-normal cursor-pointer hover:underline" onClick={() => navigate('/shop')}>
               {t('viewAll')} →
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigate(`/products/${rel.id}`)}
                  className="cursor-pointer group bg-[#18181b] border border-white/5 rounded-xl overflow-hidden hover:border-red-600/50 transition-all shadow-lg hover:shadow-red-900/10"
                >
                  <div className="h-48 bg-white p-6 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      -15%
                    </div>
                    <img
                      src={
                        rel.imageUrl ||
                        rel.image_url ||
                        "https://dummyimage.com/400x400/000/fff"
                      }
                      className="max-h-full object-contain group-hover:scale-110 transition duration-500 mix-blend-multiply"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://dummyimage.com/400x400/000/fff?text=NEXUS";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-red-500 transition">
                      {rel.name}
                    </h4>
                    <p className="text-gray-500 text-xs mt-1 mb-2">
                      {typeof rel.category === "object"
                        ? (rel.category as any)?.name
                        : rel.category}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-red-500 font-bold">
                        ฿{Number(rel.price).toLocaleString()}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(rel.id, 1).catch(console.error);
                        }}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 text-white transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-4 text-center py-10">
                {language === 'TH' ? 'ไม่มีสินค้าแนะนำในหมวดนี้' : 'No related products found'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
