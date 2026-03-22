import React from 'react';
import { Shield, Eye, Database, Globe, UserCheck, AlertTriangle, Scale } from 'lucide-react';

/* ─── Props ─── */
interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ─── Section Helper ─── */
const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: '1.5rem' }}>
    <h3 style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', marginBottom: '0.5rem' }}>
      <Icon size={18} style={{ color: 'var(--color-primary, #dc2626)', flexShrink: 0 }} />
      {title}
    </h3>
    <div style={{ color: '#bbb', lineHeight: '1.7', fontSize: '0.9rem', paddingLeft: '1.75rem' }}>
      {children}
    </div>
  </div>
);

/* ─── Main Component ─── */
export const TermsModal = ({ isOpen, onClose }: TermsModalProps) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#111', border: '1px solid rgba(220,38,38,0.3)',
        borderRadius: '16px', width: '100%', maxWidth: '650px',
        maxHeight: '85vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 0 60px rgba(220,38,38,0.12)',
        animation: 'modal-in 0.25s ease-out'
      }}>
        <style>{`@keyframes modal-in { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>

        {/* ── Header ── */}
        <div style={{
          padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(220,38,38,0.2)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0
        }}>
          <h2 style={{ color: '#fff', margin: 0, fontFamily: "'Orbitron', sans-serif", fontSize: '0.9rem', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Shield size={20} style={{ color: 'var(--color-primary, #dc2626)' }} />
            TERMS & PRIVACY POLICY
          </h2>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#888', width: 32, height: 32, borderRadius: '8px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#888'; }}
          >✕</button>
        </div>

        {/* ── Scrollable Content ── */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>

          <Section icon={Scale} title="1. ข้อกำหนดและเงื่อนไขการใช้งาน">
            <p>โดยการสร้างบัญชีผู้ใช้หรือใช้งานเว็บไซต์ Nexus Gear ท่านตกลงยอมรับข้อกำหนดเหล่านี้ทั้งหมด:</p>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.2rem' }}>
              <li>ผู้ใช้ต้องมีอายุ 13 ปีขึ้นไปในการสร้างบัญชี</li>
              <li>ข้อมูลที่ให้ต้องเป็นข้อมูลจริงและถูกต้อง</li>
              <li>ห้ามใช้บัญชีเพื่อกิจกรรมที่ผิดกฎหมาย</li>
              <li>เราสงวนสิทธิ์ในการระงับบัญชีหากมีการละเมิดข้อกำหนด</li>
              <li>สินค้าทุกรายการอยู่ภายใต้นโยบายการคืนสินค้า 7 วัน</li>
            </ul>
          </Section>

          <Section icon={Database} title="2. การเก็บรวบรวมข้อมูลส่วนบุคคล">
            <p>เราเก็บรวบรวมข้อมูลต่อไปนี้เพื่อการให้บริการ:</p>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.2rem' }}>
              <li><strong>ข้อมูลตัวตน:</strong> ชื่อ, นามสกุล, อีเมล, หมายเลขโทรศัพท์</li>
              <li><strong>ข้อมูลที่อยู่:</strong> ที่อยู่จัดส่งสำหรับการสั่งซื้อ</li>
              <li><strong>ข้อมูลการสั่งซื้อ:</strong> ประวัติคำสั่งซื้อ, สลิปการชำระเงิน</li>
              <li><strong>ข้อมูลการเข้าใช้:</strong> IP address, ประเภทเบราว์เซอร์, เวลาเข้าใช้</li>
            </ul>
          </Section>

          <Section icon={Globe} title="3. การเข้าสู่ระบบด้วย Google (Google OAuth)">
            <p>เมื่อท่านเลือกเข้าสู่ระบบหรือสมัครสมาชิกด้วยบัญชี Google ระบบจะขออนุญาตเข้าถึงข้อมูลดังนี้:</p>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.2rem' }}>
              <li><strong>อีเมล Google:</strong> เพื่อใช้เป็นตัวระบุบัญชีผู้ใช้</li>
              <li><strong>ชื่อโปรไฟล์:</strong> เพื่อแสดงผลในระบบ</li>
              <li><strong>รูปโปรไฟล์:</strong> เพื่อแสดงเป็น Avatar ในเว็บไซต์</li>
            </ul>
            <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '8px', padding: '0.75rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
              <strong style={{ color: '#f87171' }}> สิ่งที่เราไม่ได้เข้าถึง:</strong>
              <ul style={{ margin: '0.3rem 0 0', paddingLeft: '1.2rem' }}>
                <li>รหัสผ่าน Google ของท่าน</li>
                <li>รายชื่อผู้ติดต่อ, Google Drive, Gmail</li>
                <li>ข้อมูลอื่นๆ นอกเหนือจากที่ระบุข้างต้น</li>
              </ul>
            </div>
          </Section>

          <Section icon={Eye} title="4. การใช้และเปิดเผยข้อมูล">
            <p>ข้อมูลของท่านจะถูกใช้เพื่อ:</p>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.2rem' }}>
              <li>ดำเนินการสั่งซื้อและจัดส่งสินค้า</li>
              <li>ติดต่อสื่อสารเกี่ยวกับคำสั่งซื้อ</li>
              <li>ส่งอีเมลรีเซ็ตรหัสผ่านเมื่อท่านร้องขอ</li>
              <li>ปรับปรุงประสบการณ์การใช้งานเว็บไซต์</li>
            </ul>
            <p style={{ marginTop: '0.5rem' }}>เราจะ <strong style={{ color: '#f87171' }}>ไม่ขาย</strong> หรือเปิดเผยข้อมูลส่วนบุคคลของท่านแก่บุคคลภายนอก ยกเว้นกรณีที่กฎหมายกำหนด</p>
          </Section>

          <Section icon={UserCheck} title="5. สิทธิ์ของผู้ใช้">
            <p>ท่านมีสิทธิ์ดังนี้:</p>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.2rem' }}>
              <li>เข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลได้ตลอดเวลา</li>
              <li>ยกเลิกการเชื่อมบัญชี Google กับระบบได้</li>
              <li>ขอให้ลบบัญชีผู้ใช้และข้อมูลทั้งหมดออกจากระบบ</li>
              <li>ปฏิเสธการรับอีเมลโปรโมชั่น</li>
            </ul>
          </Section>

          <Section icon={AlertTriangle} title="6. ความปลอดภัยของข้อมูล">
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.2rem' }}>
              <li>รหัสผ่านถูกเข้ารหัสด้วย <strong>bcrypt</strong> — เราไม่สามารถเห็นรหัสผ่านจริงของท่าน</li>
              <li>การสื่อสารระหว่างเบราว์เซอร์กับเซิร์ฟเวอร์ใช้ <strong>JWT Token</strong> ที่มีอายุจำกัด</li>
              <li>ลิงก์รีเซ็ตรหัสผ่านมีอายุ 15 นาที หลังจากนั้นจะหมดอายุอัตโนมัติ</li>
            </ul>
          </Section>

          <p style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: '#555', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
            อัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })} ·
            ข้อกำหนดนี้อาจมีการเปลี่ยนแปลงโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
          </p>
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '1rem 1.5rem', borderTop: '1px solid rgba(220,38,38,0.2)',
          display: 'flex', justifyContent: 'flex-end', flexShrink: 0
        }}>
          <button
            onClick={onClose}
            style={{
              fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '0.72rem',
              letterSpacing: '0.1em', padding: '10px 28px',
              background: 'var(--color-primary, #dc2626)', color: '#fff',
              border: 'none', borderRadius: '6px', cursor: 'pointer',
              boxShadow: '0 0 16px rgba(220,38,38,0.35)', transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(220,38,38,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 16px rgba(220,38,38,0.35)'; }}
          >
            รับทราบและยอมรับ
          </button>
        </div>
      </div>
    </div>
  );
};
