import React from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal = ({ isOpen, onClose }: TermsModalProps) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000,
      backdropFilter: 'blur(5px)', padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a', border: '1px solid #333',
        borderRadius: '12px', width: '100%', maxWidth: '600px',
        maxHeight: '80vh', overflowY: 'auto', position: 'relative',
        boxShadow: '0 0 30px rgba(153, 0, 0, 0.2)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px', borderBottom: '1px solid #333',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, backgroundColor: '#1a1a1a'
        }}>
          <h2 style={{ color: 'var(--color-primary)', margin: 0, fontFamily: 'Orbitron, sans-serif' }}>TERMS & PRIVACY</h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#888',
            fontSize: '24px', cursor: 'pointer'
          }}>&times;</button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', color: '#ccc', lineHeight: '1.6', fontSize: '0.95rem' }}>
          <h3 style={{ color: '#fff' }}>1. ข้อกำหนดและเงื่อนไข</h3>
          <p>ยินดีต้อนรับสู่ Nexus Gear ข้อมูลที่คุณให้จะถูกนำไปใช้เพื่อการซื้อขายอุปกรณ์เกมมิ่งเท่านั้น...</p>
          
          <h3 style={{ color: '#fff' }}>2. นโยบายความเป็นส่วนตัว</h3>
          <p>เราให้ความสำคัญกับการเก็บรักษาข้อมูลส่วนบุคคลของคุณตามมาตรฐานความปลอดภัยสูงสุด...</p>
          
          <p style={{ marginTop: '40px', fontSize: '0.8rem', color: '#666' }}>อัปเดตล่าสุด: 3 มีนาคม 2026</p>
        </div>

        {/* Footer */}
        <div style={{ padding: '15px 20px', borderTop: '1px solid #333', textAlign: 'right' }}>
          <button 
            onClick={onClose}
            className="btn-primary"
            style={{ padding: '8px 25px', fontSize: '0.9rem' }}
          >
            รับทราบ
          </button>
        </div>
      </div>
    </div>
  );
};