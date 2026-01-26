import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type ResultProps = {
  data: {
    totalLoadWatts: number;
    dailyEnergyWh: number;
    recommendedInverterW: number;
    batteryCapacityWh: number;
    estimatedPriceNaira?: number;
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
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(5, 5, 5); // Deep Black
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(0, 240, 255); // Cyan
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text("MasterviewCEL", 14, 20);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    // @ts-ignore
    doc.text("Solar System Quotation", 14, 28);
    
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 25);

    // Summary Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("System Configuration", 14, 55);

    const tableData = [
      ['Recommended Inverter', `${(data.recommendedInverterW / 1000).toFixed(1)} kVA Pure Sine Wave`],
      ['Battery Bank', `${(data.batteryCapacityWh / 1000).toFixed(1)} kWh Lithium-ion`],
      ['Total Load', `${data.totalLoadWatts.toLocaleString()} Watts`],
      ['Daily Energy Need', `${(data.dailyEnergyWh / 1000).toFixed(1)} kWh/day`]
    ];

    autoTable(doc, {
      startY: 60,
      head: [['Component', 'Specification']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [5, 5, 5], textColor: [0, 240, 255] },
      styles: { fontSize: 11, cellPadding: 6 }
    });

    // Cost Section
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY + 20;
    
    // @ts-ignore
    doc.setFillColor(245, 250, 255);
    doc.setDrawColor(0, 240, 255);
    doc.rect(14, finalY, 182, 30, 'FD');
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("Estimated Total Cost", 20, finalY + 12);
    
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0); // Black for contrast in PDF
    doc.setFont('helvetica', 'bold');
    
    if (data.estimatedPriceNaira) {
       doc.text(formatCurrency(data.estimatedPriceNaira), 20, finalY + 22);
    } else {
       doc.text("Contact for Price", 20, finalY + 22);
    }

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Note: This is an automated estimate. Final price may vary based on site inspection.", 14, finalY + 45);
    doc.text("© 2026 MasterviewCEL Energy Solutions", 14, 290);

    doc.save('masterview-solar-quote.pdf');
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
            }}>Recommended Inverter</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700 }}>
              {(data.recommendedInverterW / 1000).toFixed(1)} kVA
            </h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '4px' }}>
              Pure Sine Wave Hybrid
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
            }}>Battery Bank</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700 }}>
              {(data.batteryCapacityWh / 1000).toFixed(1)} kWh
            </h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '4px' }}>
              Lithium-ion (LiFePO4)
            </p>
          </div>

          {/* Load Card */}
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
            }}>Total Load</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700 }}>
              {data.totalLoadWatts.toLocaleString()} W
            </h3>
             <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '4px' }}>
              Peak Usage
            </p>
          </div>
        </div>

        {/* Cost Estimate Section */}
        {data.estimatedPriceNaira && (data.estimatedPriceNaira > 0) && (
          <div style={{ 
            textAlign: 'center', 
            padding: '30px', 
            background: 'var(--color-bg-deep)', 
            borderRadius: 'var(--radius-md)',
            marginBottom: '40px'
          }}>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>Estimated System Cost</p>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: 800, 
              color: 'var(--color-accent)',
              textShadow: '0 0 20px rgba(245, 158, 11, 0.3)',
              wordWrap: 'break-word',
              lineHeight: 1.2
            }}>
              {formatCurrency(data.estimatedPriceNaira)}
            </div>
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
