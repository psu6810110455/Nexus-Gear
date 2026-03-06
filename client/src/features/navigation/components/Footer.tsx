

const Footer = () => {
  return (
    <>
      <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(127,29,29,0.4)', flexShrink: 0 }} className="red-divider" />
      <footer style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '2rem 5vw',
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.4)',
        borderTop: '1px solid rgba(220,38,38,0.15)',
        backgroundColor: 'rgba(0,0,0,0.8)'
      }}>
        <div style={{ fontFamily: 'Kanit' }}>© 2026 NEXUSGEAR</div>
        <div style={{ fontFamily: 'Orbitron', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '0.2em', color: 'rgba(220,38,38,0.65)' }}>
          NEXUS<span style={{ color: 'rgba(255,255,255,0.18)' }}>GEAR</span>
        </div>
        <div style={{ fontFamily: 'Orbitron' }}>POWERED BY PASSION</div>
      </footer>
    </>
  );
};

export default Footer;
