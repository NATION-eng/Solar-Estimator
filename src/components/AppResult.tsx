import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  Zap, 
  BatteryCharging, 
  Sun, 
  FileText, 
  Share2, 
  ShieldCheck, 
  AlertCircle, 
  Cable, 
  MapPin, 
  Sparkles 
} from 'lucide-react';
import type { EstimationResult } from '../types';
import LoadProfileChart from './LoadProfileChart';
import SavingsCalculator from './SavingsCalculator';
import EnvironmentalImpactCard from './EnvironmentalImpactCard';
import DayNightRuntimeMatrix from './DayNightRuntimeMatrix';
import { calculateEnvironmentalImpact } from '../utils/helpers';

type ResultProps = {
  data: EstimationResult;
  userMode?: 'client' | 'engineer';
};

export default function AppResult({ data, userMode = 'client' }: ResultProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const environmentalImpact = data.environmental || calculateEnvironmentalImpact(data.dailyEnergyWh);

  const handleDownloadPDF = () => {
    try {
      const jsPDFConstructor = (jsPDF as any).default || jsPDF;
      const doc = new jsPDFConstructor();
      
      // Header overlay
      doc.setFillColor(5, 5, 5); 
      doc.rect(0, 0, 210, 42, 'F');
      
      doc.setTextColor(251, 191, 36); 
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text("MasterviewCEL Energy Solutions", 14, 18);
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text("Engineered Solar Quotation & Technical Blueprint", 14, 28);
      
      doc.setFontSize(9);
      doc.setTextColor(180, 180, 180);
      doc.text(`Ref Date: ${new Date().toLocaleDateString()} | Location: ${data.location?.address || 'Nigeria'}`, 14, 36);

      // Section Title
      doc.setTextColor(20, 20, 20);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text("Technical Sizing & Hardware Configuration", 14, 52);

      const tableData = [
        ['System Voltage', `${data.systemVoltage || '24'}V DC Architecture`],
        ['Recommended Inverter', `${((data.recommendedInverterW || 0) / 1000).toFixed(1)} kVA Pure Sine Wave`],
        ['Peak Surge Capacity', `${(data.maxSurgeWatts || 0).toLocaleString()} Watts`],
        ['Battery Storage Bank', `${data.batteryAh || '--'} Ah @ ${data.systemVoltage || '24'}V (${data.batteryType || 'Lithium'})`],
        ['Battery Storage Energy', `${((data.batteryCapacityWh || 0) / 1000).toFixed(1)} kWh Reserve`],
        ['Solar PV Array', `${data.panelQuantity || '--'} x 450W Monocrystalline Panels`],
        ['Estimated Daily Yield', `${((data.dailyEnergyWh || 0) / 1000).toFixed(1)} kWh / day`],
        ['Charge Controller', `${data.chargeControllerAmps || '--'}A MPPT Controller`]
      ];

      const autoTableFunc = (autoTable as any).default || autoTable;
      if (typeof autoTableFunc === 'function') {
        autoTableFunc(doc, {
          startY: 56,
          head: [['Engineering Parameter', 'Recommended Specification']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [15, 23, 42], textColor: [251, 191, 36] },
          styles: { fontSize: 9, cellPadding: 4 }
        });
      }

      const lastTable = (doc as any).lastAutoTable;
      const finalY = (lastTable && lastTable.finalY) ? lastTable.finalY : 145;
      
      // Pricing Highlight
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(251, 191, 36);
      doc.rect(14, finalY + 8, 182, 34, 'FD');
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("Turnkey System Investment (Inclusive of Hardware & Installation)", 20, finalY + 18);
      
      doc.setFontSize(20);
      doc.setTextColor(15, 23, 42); 
      doc.setFont('helvetica', 'bold');
      
      const priceText = data.estimatedPriceNaira ? formatCurrency(data.estimatedPriceNaira) : "Consultation Required";
      doc.text(priceText, 20, finalY + 31);

      // Environmental metrics
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
      doc.text(`Estimated Annual CO2 Avoided: ${environmentalImpact.co2SavedAnnually.toLocaleString()} kg (~${environmentalImpact.treesEquivalent} Trees Equivalent)`, 14, finalY + 52);

      // Disclaimer & Footer
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text("Disclaimer: Sizing based on provided load and geo-irradiance metrics. Final quote subject to physical site inspection.", 14, 275);
      doc.text("MasterviewCEL Energy Solutions | www.masterviewcel.com | support@masterviewcel.com", 14, 282);

      doc.save(`Solar_Quotation_${data.id || 'Masterview'}.pdf`);
    } catch (err: any) {
      console.error("PDF Component Failure:", err);
      alert(`Export Error: ${err.message || "Contact Support"}`);
    }
  };

  const handleShareWhatsApp = () => {
    const summary = [
      `*MasterviewCEL Solar Blueprint - Technical Specification*`,
      `Location: ${data.location?.address || 'Nigeria'}`,
      `Daily Energy: ${((data.dailyEnergyWh || 0) / 1000).toFixed(1)} kWh/day`,
      `Inverter: ${((data.recommendedInverterW || 0) / 1000).toFixed(1)} kVA (${data.systemVoltage || 48}V Pure Sine)`,
      `Battery: ${((data.batteryCapacityWh || 0) / 1000).toFixed(1)} kWh (${data.batteryAh || 0} Ah @ ${data.systemVoltage || 48}V ${data.batteryType === 'lithium' ? 'Lithium' : 'Deep Cycle'})`,
      `Solar Array: ${data.panelQuantity || 0} Panels (${((data.panelQuantity * (data.panelWattage || 450)) / 1000).toFixed(1)} kW)`,
      `DC Cable: ${data.cableGaugeMm2 || 6}mm² PV Cable (${data.cableDistanceMeters || 20}m run, ${data.voltageDropPct || 1.8}% drop)`,
      `Investment: ${formatCurrency(data.estimatedPriceNaira || 0)}`,
      `Payback: ${data.paybackYears ? `${data.paybackYears.toFixed(1)} Years` : '3.5 Years'}`,
      `Annual CO2 Avoided: ${environmentalImpact.co2SavedAnnually.toLocaleString()} kg`
    ].join('\n');

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(summary)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div style={{ marginTop: '12px', paddingBottom: '36px' }}>
      {/* Blueprint Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          color: 'var(--color-primary)',
          fontWeight: 700,
          fontSize: '0.72rem',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          padding: '5px 14px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '12px'
        }}>
          <ShieldCheck size={14} />
          <span>{userMode === 'client' ? 'Guaranteed Turnkey Solar System' : 'Technical Sizing Specification & Telemetry'}</span>
        </div>
        <h2 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>
          {userMode === 'client' ? 'Your Solar Power Blueprint' : 'Engineered System Rack & Telemetry'}
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '580px', margin: '0 auto 20px', lineHeight: 1.5 }}>
          {userMode === 'client'
            ? `Calibrated for ${data.location?.address || 'Nigeria'} to power your home seamlessly and eliminate generator fueling costs.`
            : `Engineered DC bus architecture matching peak surge kW, MPPT charge ampacity, and thermal safety tolerances.`}
        </p>

        {/* Quick Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '28px'
        }}>
          <button 
            onClick={handleDownloadPDF}
            style={{
              background: 'var(--color-primary)',
              color: '#0a0e17',
              padding: '10px 18px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background 0.15s ease',
              minHeight: '42px'
            }}
          >
            <FileText size={16} />
            <span>Download Engineering PDF</span>
          </button>

          <button 
            onClick={handleShareWhatsApp}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              color: 'var(--color-text-main)',
              border: '1px solid var(--border-hairline)',
              padding: '10px 18px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s ease',
              minHeight: '42px'
            }}
          >
            <Share2 size={16} />
            <span>Share Specification</span>
          </button>
        </div>
      </div>

      {/* Core Hardware Cards - Unified Institutional Card Design */}
      <div className="grid-responsive" style={{ marginBottom: '28px' }}>
        {/* Inverter Card */}
        <div style={{ 
          background: 'var(--color-bg-surface)', 
          padding: 'clamp(16px, 3.5vw, 24px)', 
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-hairline)',
          borderTop: '2px solid var(--color-accent)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ 
              textTransform: 'uppercase', 
              fontSize: '0.72rem', 
              fontWeight: 700, 
              letterSpacing: '0.1em',
              color: 'var(--color-accent)',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Zap size={14} />
              <span>{userMode === 'client' ? 'Inverter Capacity' : 'Inverter Continuous Rating'}</span>
            </div>
            <h3 className="result-card-title" style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2rem)', fontWeight: 800, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {((data.recommendedInverterW || 0) / 1000).toFixed(1)} kVA
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '8px', lineHeight: 1.4 }}>
            {userMode === 'client'
              ? `Pure Sine Wave &bull; Effortlessly starts ACs, fridge compressors & domestic surges without flickering.`
              : `${data.systemVoltage}V Pure Sine Wave &bull; Surge: ${(data.maxSurgeWatts || 0).toLocaleString()}W &bull; PF: 0.85`}
          </p>
        </div>

        {/* Battery Card */}
        <div style={{ 
          background: 'var(--color-bg-surface)', 
          padding: 'clamp(16px, 3.5vw, 24px)', 
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-hairline)',
          borderTop: '2px solid var(--color-success)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ 
              textTransform: 'uppercase', 
              fontSize: '0.72rem', 
              fontWeight: 700, 
              letterSpacing: '0.1em',
              color: 'var(--color-success)',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <BatteryCharging size={14} />
              <span>{userMode === 'client' ? 'Energy Storage Bank' : 'DC Battery Bank'}</span>
            </div>
            <h3 className="result-card-title" style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2rem)', fontWeight: 800, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {userMode === 'client' 
                ? `${((data.batteryCapacityWh || 0) / 1000).toFixed(1)} kWh`
                : `${data.batteryAh} Ah @ ${data.systemVoltage}V`}
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '8px', lineHeight: 1.4 }}>
            {userMode === 'client'
              ? `${data.batteryType === 'lithium' ? '10+ Year LiFePO4 Lithium (Zero Maintenance)' : 'Deep Cycle Tubular Bank'} &bull; Sustains full night loads.`
              : `${((data.batteryCapacityWh || 0) / 1000).toFixed(1)} kWh Reserve &bull; DoD: ${data.batteryType === 'lithium' ? '80%' : '50%'} &bull; ${data.batteryType === 'lithium' ? 'LiFePO4' : 'Lead-Acid'}`}
          </p>
        </div>

        {/* Solar Card */}
        <div style={{ 
          background: 'var(--color-bg-surface)', 
          padding: 'clamp(16px, 3.5vw, 24px)', 
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-hairline)',
          borderTop: '2px solid var(--color-primary)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ 
              textTransform: 'uppercase', 
              fontSize: '0.72rem', 
              fontWeight: 700, 
              letterSpacing: '0.1em',
              color: 'var(--color-primary)',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Sun size={14} />
              <span>{userMode === 'client' ? 'Solar Array Generation' : 'PV Generator Array'}</span>
            </div>
            <h3 className="result-card-title" style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2rem)', fontWeight: 800, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {data.panelQuantity} Panels
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '8px', lineHeight: 1.4 }}>
            {userMode === 'client'
              ? `${((data.panelQuantity * (data.panelWattage || 450)) / 1000).toFixed(2)} kW High-Yield Monocrystalline &bull; Powers heavy appliances in direct sun.`
              : `${((data.panelQuantity * (data.panelWattage || 450)) / 1000).toFixed(2)} kWp (${data.panelQuantity}x${data.panelWattage || 450}W) &bull; ${data.chargeControllerAmps}A MPPT`}
          </p>
        </div>
      </div>

        {/* Technical Blueprint Table */}
        <div style={{ 
          background: 'rgba(0,0,0,0.3)', 
          padding: 'clamp(16px, 4vw, 24px)', 
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          <h4 style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>
            {userMode === 'client' ? 'System Performance & Capacity Summary' : 'Technical Engineering Specifications'}
          </h4>
          <div className="grid-responsive-narrow" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{userMode === 'client' ? 'Simultaneous Peak Load' : 'Peak Surge Load'}</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{(data.maxSurgeWatts || 0).toLocaleString()} W</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Daily Energy Usage</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{((data.dailyEnergyWh || 0) / 1000).toFixed(1)} kWh</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{userMode === 'client' ? 'Local Sunlight Hours' : 'Peak Sun Hours (PSH)'}</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{data.location?.psh ? `${data.location.psh.toFixed(2)} hrs/day` : '4.80 hrs/day'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>System Architecture</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{data.systemVoltage}V DC Pure Sine</span>
            </div>
          </div>
        </div>

        {/* Client-Friendly Smart Optimization Banner */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.04)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ flexShrink: 0, color: 'var(--color-primary)' }}>
            <Sparkles size={18} />
          </div>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            <strong style={{ color: '#fff' }}>24/7 Power Assurance:</strong> Sizing automatically factors in compressor duty cycles (for air conditioners and refrigerators) and nighttime battery autonomy, ensuring your home or facility stays uninterrupted without overpaying for oversized hardware.
          </p>
        </div>

        {/* Day vs Night Runtime Simulation Matrix */}
        {data.appliances && data.appliances.length > 0 && (
          <DayNightRuntimeMatrix
            appliances={data.appliances}
            batteryCapacityWh={data.batteryCapacityWh || 0}
            batteryType={data.batteryType || 'lithium'}
            systemVoltage={data.systemVoltage || 48}
            userMode={userMode}
          />
        )}

        {/* Cable Sizing & Field Safety Card */}
        <div style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--border-hairline)',
          borderTop: '2px solid var(--color-accent)',
          borderRadius: 'var(--radius-md)',
          padding: 'clamp(16px, 4vw, 24px)',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cable size={18} color="var(--color-accent)" />
              <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {userMode === 'client' ? 'Safety, Fire Protection & Certified Wiring' : 'DC Cable Sizing & Thermal Safety'}
              </h4>
            </div>

            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              background: data.pvArchitecture === 'high-voltage' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              color: data.pvArchitecture === 'high-voltage' ? 'var(--color-success)' : 'var(--color-primary)',
              border: '1px solid currentColor',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              {data.pvArchitecture === 'high-voltage' ? <ShieldCheck size={13} /> : <AlertCircle size={13} />}
              <span>{data.pvArchitecture === 'high-voltage' ? 'High Voltage Array (Optimal Efficiency)' : 'Low Voltage Array'}</span>
            </span>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
            {userMode === 'client'
              ? `Your system includes fire-retardant DC cabling, lightning surge arrestors (SPD), and high-efficiency circuit breakers to safeguard your appliances and roof installation.`
              : data.pvArchitecture === 'high-voltage'
                ? `High-voltage series configuration keeps current low, preventing cables from heating up over your ${data.cableDistanceMeters || 20}m run and reducing electrical resistance.`
                : `Low-voltage parallel arrays generate heavy current. Heavy-duty copper cables are specified below to prevent thermal cable warming.`}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-hairline)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Solar DC Cable</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                {data.cableGaugeMm2 || 6} mm²
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                {data.bosBreakdown?.solarCableMeters || 45}m total length
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-hairline)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Voltage Drop</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: (data.voltageDropPct || 1.8) <= 2.5 ? 'var(--color-success)' : 'var(--color-primary)' }}>
                {data.voltageDropPct || 1.8}%
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Industry target &le; 3.0%
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-hairline)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Battery Interconnect</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>
                {data.bosBreakdown?.batteryCableGauge || '35 mm² Flexible'}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Heavy current link
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-hairline)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Surge & DC Protection</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                SPD + DC Isolator
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Lightning & arc arrestor
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '0.74rem',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0,0,0,0.2)',
            padding: '8px 12px',
            borderRadius: '6px'
          }}>
            <MapPin size={13} color="var(--color-primary)" />
            <span><strong>Site Survey Note:</strong> Final conduit pathways, roof clamp types, and breaker sizes will be confirmed during the physical site survey.</span>
          </div>
        </div>

        {/* 24-Hour Load Profile Chart */}
        {data.appliances && data.appliances.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <LoadProfileChart 
              appliances={data.appliances} 
              hours={data.dailyHours || 6} 
            />
          </div>
        )}

        {/* Cost & ROI */}
        <div className="flex-responsive" style={{ 
          display: 'flex', 
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div style={{ 
            flex: 1.4,
            textAlign: 'left', 
            padding: 'clamp(16px, 4vw, 24px)', 
            background: 'var(--color-bg-surface)', 
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-hairline)',
            borderTop: '2px solid var(--color-primary)'
          }}>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '8px', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Turnkey System Investment</p>
            <div style={{ 
              fontSize: 'clamp(1.6rem, 5.5vw, 2.4rem)', 
              fontWeight: 800, 
              color: 'var(--color-primary)',
              lineHeight: 1.1,
              fontVariantNumeric: 'tabular-nums',
              wordBreak: 'break-word'
            }}>
              {formatCurrency(data.estimatedPriceNaira || 0)}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '8px', lineHeight: 1.4 }}>
              Includes solar PV modules, pure sine inverter, storage bank, MPPT controller, cabling & installation.
            </p>
          </div>

          <div style={{ 
            flex: 1,
            textAlign: 'left', 
            padding: 'clamp(16px, 4vw, 24px)', 
            background: 'var(--color-bg-surface)', 
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-hairline)',
            borderTop: '2px solid var(--color-success)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Estimated Payback</p>
            <div style={{ fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', fontWeight: 800, color: 'var(--color-success)', fontVariantNumeric: 'tabular-nums' }}>
              {data.paybackYears ? `${data.paybackYears.toFixed(1)} Years` : '3.5 Years'}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '6px', lineHeight: 1.35 }}>
              Based on Nigerian grid tariff parity & generator diesel replacement
            </p>
          </div>
        </div>

        {/* Interactive Savings & Tariff Sensitivity Calculator */}
        <div style={{ marginBottom: '32px' }}>
          <SavingsCalculator 
            systemCost={data.estimatedPriceNaira || 0} 
            dailyEnergyWh={data.dailyEnergyWh} 
            paybackYears={data.paybackYears || 3.5} 
          />
        </div>

        {/* Environmental Impact Card */}
        <div style={{ marginBottom: '36px' }}>
          <EnvironmentalImpactCard impact={environmentalImpact} />
        </div>

        {data.location?.address && (
          <div style={{ 
            marginBottom: '32px', 
            padding: '12px 16px', 
            background: 'var(--color-bg-surface)', 
            border: '1px solid var(--border-hairline)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <MapPin size={16} color="var(--color-primary)" />
            <span>Tailored installation region: <strong style={{ color: 'var(--color-text-main)' }}>{data.location.address}</strong></span>
          </div>
        )}

        {/* Call to Actions */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          gap: '12px',
          paddingTop: '16px'
        }}>
          <button 
            onClick={handleDownloadPDF}
            style={{
              background: 'var(--color-primary)',
              color: '#0a0e17',
              padding: '14px 28px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              flex: '1 1 240px',
              minHeight: '48px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <FileText size={18} />
            <span>Download Quotation PDF</span>
          </button>

          <button 
            onClick={handleShareWhatsApp}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              color: 'var(--color-text-main)',
              border: '1px solid var(--border-hairline)',
              padding: '14px 28px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              flex: '1 1 220px',
              minHeight: '48px'
            }}
          >
            <Share2 size={18} />
            <span>Share Specification</span>
          </button>
        </div>
    </div>
  );
}
