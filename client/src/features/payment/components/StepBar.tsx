import React from 'react';
import { Check, MapPin, CreditCard, FileText } from 'lucide-react';

interface StepBarProps {
  current: number;
}

export default function StepBar({ current }: StepBarProps) {
  const steps = [
    { id: 1, label: 'ที่อยู่จัดส่ง', icon: MapPin },
    { id: 2, label: 'วิธีชำระเงิน', icon: CreditCard },
    { id: 3, label: 'ยืนยันคำสั่งซื้อ', icon: FileText },
  ];

  return (
    <nav aria-label="สถานะการสั่งซื้อ" className="flex items-center justify-center gap-0 w-full max-w-lg mx-auto mb-10">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const done = current > step.id;
        const active = current === step.id;
        
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <figure className={`relative m-0 w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 
                ${done ? 'bg-[#990000] border-[#FF0000] shadow-[0_0_14px_rgba(255,0,0,0.5)]' : active ? 'bg-[#2E0505] border-[#FF0000] shadow-[0_0_14px_rgba(255,0,0,0.4)] scale-110' : 'bg-[#0a0a0a] border-[#990000]/30'}`}>
                {done ? <Check aria-hidden="true" className="w-5 h-5 text-white" /> : <Icon aria-hidden="true" className={`w-5 h-5 ${active ? 'text-[#FF0000]' : 'text-[#F2F4F6]/30'}`} />}
              </figure>
              <span className={`text-[10px] font-['Kanit'] mt-3 tracking-wider absolute translate-y-12 transition-colors duration-300 w-24 text-center ${active ? 'text-[#FF0000] font-bold' : done ? 'text-[#F2F4F6]/60' : 'text-[#F2F4F6]/20'}`}>
                {step.label}
              </span>
            </div>
            
            {/* เส้นเชื่อมระหว่าง Step */}
            {idx < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 relative min-w-[60px] max-w-[100px]" aria-hidden="true">
                  <div className="absolute inset-0 bg-[#990000]/20 rounded"></div>
                  <div className={`absolute inset-0 bg-[#FF0000] rounded transition-all duration-700 ease-out ${current > step.id ? 'w-full' : 'w-0'}`}></div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}