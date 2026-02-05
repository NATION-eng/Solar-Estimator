import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type ResultProps = {
  data: {
    totalLoadWatts: number;
    dailyEnergyWh: number;
    recommendedInverterW: number;
    batteryCapacityWh: number;
    estimatedPriceNaira?: number;
    maxSurgeWatts?: number;
    panelQuantity?: number;
    panelWattage?: number;
    paybackYears?: number;
    systemVoltage?: number;
    batteryAh?: number;
    chargeControllerAmps?: number;
    location?: {
      address: string;
      psh: number;
    };
  };
};

export default function AppResult({ data }: ResultProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleDownloadPDF = () => {
    try {
      console.log("Starting exquisite PDF generation...");
      
      // Resilient constructor for jsPDF across various build environments
      const jsPDFConstructor = (jsPDF as any).default || jsPDF;
      const doc = new jsPDFConstructor();
      
      // Header overlay
      doc.setFillColor(5, 5, 5); 
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(0, 240, 255); 
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text("MasterviewCEL", 14, 20);
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text("Professional Solar Quotation", 14, 28);
      
      doc.setFontSize(10);
      doc.text(`Reference Date: ${new Date().toLocaleDateString()}`, 160, 25);

      // Section Title
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Technical Configuration", 14, 55);

      const tableData = [
        ['System Voltage', `${data.systemVoltage || '24'}V DC`],
        ['Inverter Rating', `${((data.recommendedInverterW || 0) / 1000).toFixed(1)} kVA Pure Sine`],
        ['Peak Surge Support', `${(data.maxSurgeWatts || 0).toLocaleString()} Watts`],
        ['Battery Bank', `${data.batteryAh || '--'} Ah @ ${data.systemVoltage || '24'}V`],
        ['Solar Array', `${data.panelQuantity || '--'} x 450W Monocrystalline`],
        ['Daily Energy Yield', `${((data.dailyEnergyWh || 0) / 1000).toFixed(1)} kWh/day`],
        ['Charge Controller', `${data.chargeControllerAmps || '--'}A MPPT Sized`]
      ];

      // Robust autoTable call
      const autoTableFunc = (autoTable as any).default || autoTable;
      if (typeof autoTableFunc === 'function') {
        autoTableFunc(doc, {
          startY: 60,
          head: [['Requirement', 'Engineering Specification']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [5, 5, 5], textColor: [0, 240, 255] },
          styles: { fontSize: 10, cellPadding: 5 }
        });
      }

      // Check final Y position
      const lastTable = (doc as any).lastAutoTable;
      const finalY = (lastTable && lastTable.finalY) ? lastTable.finalY : 150;
      
      // Pricing Highlight
      doc.setFillColor(245, 250, 255);
      doc.setDrawColor(0, 240, 255);
      doc.rect(14, finalY + 10, 182, 30, 'FD');
      
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text("Estimated System Investment (NGN)", 20, finalY + 20);
      
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0); 
      doc.setFont('helvetica', 'bold');
      
      const priceText = data.estimatedPriceNaira ? formatCurrency(data.estimatedPriceNaira) : "Consulting Required";
      doc.text(priceText, 20, finalY + 32);

      // Disclaimer & Footer
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text("Disclaimer: This is a high-fidelity estimate based on provided load profiles and geo-solar data. Final hardware selection may vary.", 14, 275);
      doc.text("Visit: www.masterviewcel.com | © 2026 MasterviewCEL Energy Solutions", 14, 282);

      doc.save('Solar_Quotation_Masterview.pdf');
      console.log("PDF successfully generated and saved.");
    } catch (err: any) {
      console.error("PDF Component Failure:", err);
      alert(`Export Error: ${err.message || "Contact Support"}`);
    }
  };

  return (
    <section className="animate-float" style={{ animationDuration: '8s' }}>
      <div className="glass-panel p-responsive" style={{ 
        marginTop: '60px', 
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-primary-glow)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            marginBottom: '10px' 
          }}>
            <span className="text-gradient">Your Solar Blueprint</span>
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Based on your unique energy profile, here is our recommended configuration.
          </p>
        </div>

        <div className="grid-responsive" style={{ marginBottom: '40px' }}>
          {/* Inverter Card */}
          <div style={{ 
            background: 'rgba(59, 130, 246, 0.1)', 
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
            }}>System Core</p>
            <h3 className="result-card-title" style={{ fontSize: '1.8rem', fontWeight: 700 }}>
              {data.systemVoltage}V / {(data.recommendedInverterW / 1000).toFixed(1)} kVA
            </h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '4px' }}>
              Pure Sine Wave Inverter
            </p>
          </div>

          {/* Battery Card */}
          <div style={{ 
            background: 'rgba(16, 185, 129, 0.1)', 
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
            <h3 className="result-card-title" style={{ fontSize: '1.8rem', fontWeight: 700 }}>
              {data.batteryAh} Ah
            </h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '4px' }}>
              @ {data.systemVoltage}V (Lithium Recommended)
            </p>
          </div>

          {/* Solar Card */}
           <div style={{ 
            background: 'rgba(245, 158, 11, 0.1)', 
            padding: '24px', 
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid var(--color-accent)'
          }}>
            <p style={{ 
              textTransform: 'uppercase', 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              letterSpacing: '0.1em',
              color: 'var(--color-accent)',
              marginBottom: '8px'
            }}>Energy Source</p>
            <h3 className="result-card-title" style={{ fontSize: '1.8rem', fontWeight: 700 }}>
              {data.panelQuantity} Panels
            </h3>
             <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '4px' }}>
               {data.chargeControllerAmps}A MPPT Controller
            </p>
          </div>
        </div>

        {/* Technical Blueprint Section (Dope Add-on) */}
        <div style={{ 
          background: 'rgba(0,0,0,0.4)', 
          padding: '24px', 
          borderRadius: 'var(--radius-md)',
          marginBottom: '40px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <h4 style={{ color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>Technical Specifications</h4>
          <div className="grid-responsive-narrow" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Peak Surge Load</span>
              <span style={{ fontWeight: 600 }}>{data.maxSurgeWatts?.toLocaleString()} W</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Daily Energy Usage</span>
              <span style={{ fontWeight: 600 }}>{(data.dailyEnergyWh / 1000).toFixed(1)} kWh</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Solar Yield (Local)</span>
              <span style={{ fontWeight: 600 }}>{data.location?.psh.toFixed(2)} Hrs/Day</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Inverter Efficiency</span>
              <span style={{ fontWeight: 600 }}>92% Pure Sine</span>
            </div>
          </div>
        </div>

        {/* Cost & ROI */}
        <div className="flex-responsive" style={{ 
          display: 'flex',
          gap: '20px',
          marginBottom: '40px'
        }}>
            <div style={{ 
              flex: 1.5,
              textAlign: 'left', 
              padding: '30px', 
              background: 'var(--color-bg-deep)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,150,0,0.2)'
            }}>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>Estimated System Cost</p>
              <div style={{ 
                fontSize: '2.2rem', 
                fontWeight: 800, 
                color: 'var(--color-accent)',
                lineHeight: 1.2
              }}>
                {formatCurrency(data.estimatedPriceNaira || 0)}
              </div>
            </div>

            <div style={{ 
              flex: 1,
              textAlign: 'center', 
              padding: '30px', 
              background: 'rgba(255,255,255,0.03)', 
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>Estimated Payback</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                {data.paybackYears ? `${data.paybackYears.toFixed(1)} Years` : 'N/A'}
              </div>
              <p style={{ fontSize: '0.7rem', opacity: 0.5 }}>vs Grid Tariff</p>
            </div>
        </div>

        {data.location?.address && (
          <div style={{ 
            marginBottom: '40px', 
            padding: '12px', 
            background: 'rgba(0,0,0,0.3)', 
            borderRadius: '10px',
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
             <span>📍</span>
             <span>Optimized for: <strong>{data.location.address}</strong></span>
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={handleDownloadPDF}
            className="btn-primary" 
            style={{
              background: 'var(--color-text-main)',
              color: 'var(--color-bg-deep)',
              padding: '16px 32px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '1rem',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Download Quotation PDF
          </button>
        </div>
      </div>
    </section>
  );
}
