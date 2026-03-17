import { Check } from 'lucide-react';
import { useLanguage } from '../../../shared/context/LanguageContext';
import type { Address } from '../types/payment.types';

interface AddressSelectProps {
  addresses: Address[];
  selectedAddr: number | null;
  onSelect: (id: number) => void;
}

export default function AddressSelect({ addresses, selectedAddr, onSelect }: AddressSelectProps) {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      {addresses.map((addr) => {
        const active = selectedAddr === addr.id;
        return (
          <article 
            key={addr.id} 
            onClick={() => onSelect(addr.id)} 
            className={`w-full text-left bg-[#0a0a0a] border rounded-xl p-5 transition-all group relative overflow-hidden cursor-pointer ${active ? 'border-[#FF0000] shadow-[0_0_15px_rgba(255,0,0,0.15)] bg-[#2E0505]/20' : 'border-[#990000]/20 hover:border-[#990000]/50 hover:bg-[#2E0505]/10'}`}
          >
            {active && <div aria-hidden="true" className="absolute top-0 left-0 w-1 h-full bg-[#FF0000] shadow-[0_0_10px_#FF0000]"></div>}
            
            <div className="flex items-start justify-between pl-3">
              <div>
                <header className="flex items-center gap-3 mb-2">
                  <span className={`font-bold text-lg ${active ? 'text-[#FF0000]' : 'text-[#F2F4F6]'}`}>{addr.label}</span>
                  {addr.isDefault && <span className="bg-[#FF0000]/15 text-[#FF0000] text-[9px] px-2 py-0.5 rounded border border-[#FF0000]/30 font-['Kanit'] tracking-wider">{t('defaultLabel')}</span>}
                </header>
                <p className="text-sm text-[#F2F4F6]/80 mb-1 font-bold">{addr.name}</p>
                <p className="text-sm text-[#F2F4F6]/60 leading-relaxed">{addr.detail}</p>
                <footer className="text-xs text-[#F2F4F6]/40 mt-2 flex items-center gap-1">
                   <span className="text-[#990000]">{t('phoneNumberLabel')}</span> {addr.phone}
                </footer>
              </div>
              
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'border-[#FF0000] bg-[#990000]' : 'border-[#990000]/30'}`}>
                {active && <Check aria-hidden="true" className="w-3 h-3 text-white" />}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
