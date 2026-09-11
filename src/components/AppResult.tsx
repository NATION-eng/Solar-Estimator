import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { EstimationResult } from '../types';
import LoadProfileChart from './LoadProfileChart';
import SavingsCalculator from './SavingsCalculator';
import EnvironmentalImpactCard from './EnvironmentalImpactCard';
import { calculateEnvironmentalImpact } from '../utils/helpers';

type ResultProps = {
  data: EstimationResult;
};

export default function AppResult({ data }: ResultProps) {
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
      `*🌞 MasterviewCEL Solar Blueprint*`,
      `📍 Location: ${data.location?.address || 'Nigeria'}`,
      `⚡ Daily Energy: ${((data.dailyEnergyWh || 0) / 1000).toFixed(1)} kWh/day`,
      `🔌 Inverter: ${((data.recommendedInverterW || 0) / 1000).toFixed(1)} kVA Pure Sine`,
      `🔋 Battery: ${data.batteryAh || 0} Ah @ ${data.systemVoltage || 24}V (${data.batteryType || 'Lithium'})`,
      `☀️ Solar Array: ${data.panelQuantity || 0} x 450W Panels`,
      `💰 Investment: ${formatCurrency(data.estimatedPriceNaira || 0)}`,
      `⏳ Payback: ${data.paybackYears ? `${data.paybackYears.toFixed(1)} Years` : '3.5 Years'}`,
      `🌱 Annual CO2 Saved: ${environmentalImpact.co2SavedAnnually.toLocaleString()} kg`
    ].join('\n');

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(summary)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div style={{ marginTop: '12px' }}>
      {/* Blueprint Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span style={{
          color: 'var(--color-primary)',
          fontWeight: 700,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          padding: '4px 14px',
          borderRadius: '100px',
          background: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          display: 'inline-block',
          marginBottom: '10px'
        }}>
          TECHNICAL SIZING COMPLETE
        </span>
        <h2 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', fontWeight: 800, marginBottom: '6px' }}>
          <span className="text-gradient">Your Solar Blueprint</span>
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '560px', margin: '0 auto 16px' }}>
          Engineered specifically for your power consumption profile and local solar irradiation levels.
        </p>

        {/* Quick Action Buttons (Top Access for Mobile) */}
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '24px'
        }}>
          <button 
            onClick={handleDownloadPDF}
            style={{
              background: 'var(--color-primary)',
              color: '#000',
              padding: '12px 20px',
              borderRadius: '100px',
              fontWeight: 800,
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 15px var(--color-primary-glow)',
              minHeight: '44px'
            }}
          >
            <span>📄</span>
            <span>Download PDF Quote</span>
          </button>

          <button 
            onClick={handleShareWhatsApp}
            style={{
              background: '#25D366',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '100px',
              fontWeight: 700,
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              minHeight: '44px'
            }}
          >
            <span>💬</span>
            <span>Share via WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Core Hardware Cards */}
      <div className="grid-responsive" style={{ marginBottom: '28px' }}>
        {/* Inverter Card */}
        <div style={{ 
          background: 'rgba(56, 189, 248, 0.08)', 
          padding: '20px', 
          borderRadius: 'var(--radius-md)',
          borderLeft: '4px solid var(--color-accent)',
          border: '1px solid rgba(56, 189, 248, 0.2)'
        }}>
            <p style={{ 
              textTransform: 'uppercase', 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              letterSpacing: '0.1em',
              color: 'var(--color-accent)',
              marginBottom: '8px'
            }}>System Core</p>
            <h3 className="result-card-title" style={{ fontSize: '1.9rem', fontWeight: 800 }}>
              {data.systemVoltage}V / {((data.recommendedInverterW || 0) / 1000).toFixed(1)} kVA
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Pure Sine Wave Inverter (Surge: {(data.maxSurgeWatts || 0).toLocaleString()}W)
            </p>
          </div>

          {/* Battery Card */}
          <div style={{ 
            background: 'rgba(16, 185, 129, 0.08)', 
            padding: '24px', 
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid var(--color-success)'
          }}>
            <p style={{ 
              textTransform: 'uppercase', 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              letterSpacing: '0.1em',
              color: 'var(--color-success)',
              marginBottom: '8px'
            }}>Storage Bank</p>
            <h3 className="result-card-title" style={{ fontSize: '1.9rem', fontWeight: 800 }}>
              {data.batteryAh} Ah
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              @ {data.systemVoltage}V ({((data.batteryCapacityWh || 0) / 1000).toFixed(1)} kWh {data.batteryType === 'lithium' ? 'Lithium LiFePO4' : 'Deep Cycle'})
            </p>
          </div>

          {/* Solar Card */}
          <div style={{ 
            background: 'rgba(251, 191, 36, 0.08)', 
            padding: '24px', 
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid var(--color-primary)'
          }}>
            <p style={{ 
              textTransform: 'uppercase', 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              letterSpacing: '0.1em',
              color: 'var(--color-primary)',
              marginBottom: '8px'
            }}>Energy Harvester</p>
            <h3 className="result-card-title" style={{ fontSize: '1.9rem', fontWeight: 800 }}>
              {data.panelQuantity} Panels
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              450W Mono PV + {data.chargeControllerAmps}A MPPT Controller
            </p>
          </div>
        </div>

        {/* Technical Blueprint Table */}
        <div style={{ 
          background: 'rgba(0,0,0,0.3)', 
          padding: '24px', 
          borderRadius: 'var(--radius-md)',
          marginBottom: '32px',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          <h4 style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>
            Technical Engineering Specifications
          </h4>
          <div className="grid-responsive-narrow" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Peak Surge Load</span>
              <span style={{ fontWeight: 600 }}>{(data.maxSurgeWatts || 0).toLocaleString()} W</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Daily Energy Usage</span>
              <span style={{ fontWeight: 600 }}>{((data.dailyEnergyWh || 0) / 1000).toFixed(1)} kWh</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Solar Irradiance (Local)</span>
              <span style={{ fontWeight: 600 }}>{data.location?.psh ? `${data.location.psh.toFixed(2)} PSH` : '4.80 PSH'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Architecture</span>
              <span style={{ fontWeight: 600 }}>{data.systemVoltage}V DC Pure Sine</span>
            </div>
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
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{ 
            flex: 1.4,
            textAlign: 'left', 
            padding: '28px', 
            background: 'var(--color-bg-deep)', 
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(251, 191, 36, 0.3)'
          }}>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>Estimated System Investment</p>
            <div style={{ 
              fontSize: '2.4rem', 
              fontWeight: 800, 
              color: 'var(--color-primary)',
              lineHeight: 1.1
            }}>
              {formatCurrency(data.estimatedPriceNaira || 0)}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
              Includes solar PV modules, pure sine inverter, storage bank, MPPT controller, cabling & installation.
            </p>
          </div>

          <div style={{ 
            flex: 1,
            textAlign: 'center', 
            padding: '28px', 
            background: 'rgba(255,255,255,0.03)', 
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '6px' }}>Estimated Payback</p>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-success)' }}>
              {data.paybackYears ? `${data.paybackYears.toFixed(1)} Years` : '3.5 Years'}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
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
            padding: '14px', 
            background: 'rgba(0,0,0,0.3)', 
            borderRadius: '12px',
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>📍</span>
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
            className="btn-primary" 
            style={{
              background: 'var(--color-primary)',
              color: '#000',
              padding: '16px 28px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flex: '1 1 260px',
              minHeight: '52px'
            }}
          >
            <span>📄</span>
            <span>Download Quotation PDF</span>
          </button>

          <button 
            onClick={handleShareWhatsApp}
            style={{
              background: '#25D366',
              color: '#fff',
              padding: '16px 28px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              flex: '1 1 220px',
              minHeight: '52px'
            }}
          >
            <span>💬</span>
            <span>Share via WhatsApp</span>
          </button>
        </div>
    </div>
  );
}
