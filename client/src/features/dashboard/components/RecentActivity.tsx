import { Clock, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../../shared/context/LanguageContext';

// สร้าง Interface เพื่อบอก TypeScript ว่ากล่อง orders มีหน้าตาแบบนี้นะ
export interface RecentOrder {
  id: number;
  order_number: string;
  shipping_name: string;
  total: string | number;
  payment_method: string;
}

// กำหนดว่า Component นี้รับ Props ชื่อ orders
interface RecentActivityProps {
  orders?: RecentOrder[];
}

export default function RecentActivity({ orders = [] }: RecentActivityProps) {
  const { t } = useLanguage();
  return (
    <section className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col h-full">
      <header className="flex items-center justify-between mb-6 border-b border-[#990000]/20 pb-4 shrink-0">
        <h3 className="text-lg font-['Kanit'] font-bold flex items-center gap-3 text-[#F2F4F6]">
          <span aria-hidden="true" className="w-1.5 h-6 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]"></span> {t('recentOrders')}
        </h3>
      </header>
      
      <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {/*  3. เช็คว่ามีข้อมูลไหม ถ้าไม่มีให้ขึ้นข้อความว่างๆ */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#F2F4F6]/40">
            <Clock className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm font-['Kanit']">{t('noRecentOrders')}</p>
          </div>
        ) : (
          /*  4. วนลูปเอาข้อมูลบิลจาก Database มาแสดงผล */
          orders.map((order, i) => (
            <article key={order.id} className="flex gap-4 relative">
              {/* เส้นเชื่อม Timeline */}
              {i !== orders.length - 1 && <div aria-hidden="true" className="absolute left-4 top-8 w-[1px] h-full bg-[#990000]/20"></div>}
              
              <div className="relative z-10 w-8 h-8 rounded-full bg-[#2E0505] border border-[#990000]/40 flex items-center justify-center shrink-0">
                <ShoppingBag aria-hidden="true" className="w-3 h-3 text-[#FF0000]" />
              </div>
              
              <div className="flex-1 pt-1">
                <p className="text-sm font-['Kanit'] text-[#F2F4F6] font-semibold">
                  {t('orderId')}: <span className="text-[#FF0000] tracking-wider">{order.order_number}</span>
                </p>
                {/* เปลี่ยนจากเวลาหลอกๆ เป็นชื่อลูกค้าและยอดเงิน */}
                <p className="text-xs text-[#F2F4F6]/50 font-['Kanit'] mt-1 flex justify-between">
                  <span>{t('by')}: {order.shipping_name}</span>
                  <span className="text-green-400 font-medium">฿{Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </p>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
