import { Trash2, Minus, Plus, Square, CheckSquare } from 'lucide-react';
import type { CartItem as CartItemType } from '../types/cart.types'; // ดึง Type มาใช้

interface CartItemProps {
  item: CartItemType;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
  onUpdateQty: (id: number, delta: number) => void;
  onDelete: (type: 'single', id: number) => void;
}

export default function CartItem({ item, isSelected, onToggleSelect, onUpdateQty, onDelete }: CartItemProps) {
  return (
    <article className={`bg-[#000000]/60 border ${isSelected ? 'border-[#FF0000]/60 bg-[#2E0505]/20' : 'border-[#990000]/20'} backdrop-blur-xl rounded-2xl p-5 transition-all duration-300 relative overflow-hidden flex items-start gap-4`}>
      
      {/* ปุ่ม Checkbox */}
      <div className="pt-4">
        <button onClick={() => onToggleSelect(item.id)} className="text-[#FF0000] hover:scale-110 transition-transform">
          {isSelected ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6 text-[#F2F4F6]/20" />}
        </button>
      </div>
      
      {/* รายละเอียดสินค้า */}
      <div className="flex-1 flex gap-5">
        <figure className="m-0">
          <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl border border-[#990000]/30 bg-[#1a1a1a]" />
        </figure>
        
        <div className="flex-1 min-w-0 flex flex-col justify-between h-24">
          <header className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-['Orbitron'] text-[#990000] tracking-widest uppercase mb-1">{item.category}</p>
              <h3 className="font-bold text-lg text-[#F2F4F6] line-clamp-1">{item.name}</h3>
            </div>
            <button onClick={() => onDelete('single', item.id)} className="text-[#F2F4F6]/20 hover:text-[#FF0000] transition p-1 hover:bg-[#2E0505] rounded">
              <Trash2 className="w-5 h-5" />
            </button>
          </header>

          <footer className="flex items-end justify-between mt-auto">
            <div className="flex flex-col">
              {item.originalPrice !== item.price && (<span className="text-xs text-[#F2F4F6]/30 line-through font-['Kanit']">฿{item.originalPrice.toLocaleString('th-TH')}</span>)}
              <span className="text-xl font-['Orbitron'] font-bold text-[#FF0000] drop-shadow-[0_0_5px_rgba(255,0,0,0.3)]">฿{item.price.toLocaleString('th-TH')}</span>
            </div>
            
            {/* ปุ่มเพิ่ม/ลดจำนวน */}
            <div className="flex items-center bg-[#000000] border border-[#990000]/30 rounded-lg overflow-hidden">
              <button onClick={() => onUpdateQty(item.id, -1)} disabled={item.quantity <= 1} className="w-8 h-8 flex items-center justify-center text-[#F2F4F6]/60 hover:bg-[#2E0505] hover:text-[#FF0000] disabled:opacity-30 transition border-r border-[#990000]/20">
                <Minus className="w-3 h-3" />
              </button>
              <div className="w-10 h-8 flex items-center justify-center font-['Orbitron'] font-bold text-[#F2F4F6] text-sm">
                {item.quantity}
              </div>
              <button onClick={() => onUpdateQty(item.id, 1)} disabled={item.quantity >= item.maxQty} className="w-8 h-8 flex items-center justify-center text-[#F2F4F6]/60 hover:bg-[#2E0505] hover:text-[#FF0000] disabled:opacity-30 transition border-l border-[#990000]/20">
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
}