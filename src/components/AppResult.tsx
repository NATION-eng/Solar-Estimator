import { useState, useEffect } from 'react';
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
  Sparkles,
  Wrench,
  Download
} from 'lucide-react';
import type { EstimationResult } from '../types';
import LoadProfileChart from './LoadProfileChart';
import SavingsCalculator from './SavingsCalculator';
import EnvironmentalImpactCard from './EnvironmentalImpactCard';
import DayNightRuntimeMatrix from './DayNightRuntimeMatrix';
import EngineerOverrideDrawer, { type HardwareOverrides } from './EngineerOverrideDrawer';
import { calculateEnvironmentalImpact } from '../utils/helpers';

type ResultProps = {
  data: EstimationResult;
  userMode?: 'client' | 'engineer';
};

export default function AppResult({ data, userMode = 'client' }: ResultProps) {
  const [activeData, setActiveData] = useState<EstimationResult>(data);
  const [isOverrideOpen, setIsOverrideOpen] = useState<boolean>(false);

  useEffect(() => {
    setActiveData(data);
  }, [data]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const environmentalImpact = activeData.environmental || calculateEnvironmentalImpact(activeData.dailyEnergyWh);

  const handleApplyOverrides = (overrides: HardwareOverrides) => {
    const panelWatt = overrides.panelWattage || activeData.panelWattage || 450;
    const sysVolt = overrides.systemVoltage || activeData.systemVoltage || 48;
    const battType = overrides.batteryType || activeData.batteryType || 'lithium';
    const invBrand = overrides.inverterBrand || activeData.inverterBrand || 'Deye Hybrid';
    const cableDist = overrides.cableDistanceMeters || activeData.cableDistanceMeters || 20;

    // Recalculate panel quantity
    const psh = activeData.location?.psh || 4.8;
    const reqPanelWatts = (activeData.dailyEnergyWh || 12000) / (psh * 0.82);
    let panelQty = Math.max(2, Math.ceil(reqPanelWatts / panelWatt));
    if (panelQty > 2 && panelQty % 2 !== 0) panelQty += 1;

    // Recalculate battery Ah
    const dod = battType === 'lithium' ? 0.85 : 0.50;
    const battWh = Math.round(((activeData.dailyEnergyWh || 12000) * 0.65) / dod / 0.90);
    const battAh = Math.ceil(battWh / sysVolt);

    // Recalculate price
    const batteryCapacityKwh = (battAh * sysVolt) / 1000;
    const batteryCost = battType === 'lithium' ? Math.round(batteryCapacityKwh * 290000) : Math.round(batteryCapacityKwh * 145000);
    const panelsCost = panelQty * (panelWatt >= 550 ? 175000 : 140000);
    const inverterCost = activeData.recommendedInverterW ? Math.round(activeData.recommendedInverterW * 250) : 800000;
    const newPrice = Math.round(batteryCost + panelsCost + inverterCost + 350000);

    setActiveData(prev => ({
      ...prev,
      panelWattage: panelWatt,
      panelQuantity: panelQty,
      systemVoltage: sysVolt,
      batteryType: battType,
      batteryCapacityWh: battWh,
      batteryAh: battAh,
      inverterBrand: invBrand,
      cableDistanceMeters: cableDist,
      estimatedPriceNaira: newPrice,
      overrides
    }));
  };

  const handleDownloadPDF = (targetMode: 'client' | 'engineer' = userMode) => {
    try {
      const jsPDFConstructor = (jsPDF as any).default || jsPDF;
      const doc = new jsPDFConstructor();
      const autoTableFunc = (autoTable as any).default || autoTable;

      if (targetMode === 'client') {
        // CLIENT INVESTMENT PROPOSAL
        doc.setFillColor(10, 14, 23); 
        doc.rect(0, 0, 210, 42, 'F');
        
        doc.setTextColor(245, 158, 11); 
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text("MasterviewCEL Energy Solutions", 14, 18);
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text("Turnkey Solar Investment Proposal & Runtime Guarantee", 14, 28);
        
        doc.setFontSize(9);
        doc.setTextColor(180, 180, 180);
        doc.text(`Date: ${new Date().toLocaleDateString()} | Installation Site: ${activeData.location?.address || 'Nigeria'}`, 14, 36);

        // Section Title
        doc.setTextColor(20, 20, 20);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text("Recommended System & Performance Guarantees", 14, 52);

        const clientTableData = [
          ['Inverter Continuous Capacity', `${((activeData.recommendedInverterW || 0) / 1000).toFixed(1)} kVA Pure Sine Wave (Powers AC, fridge & electronics)`],
          ['Battery Storage Reserve', `${((activeData.batteryCapacityWh || 0) / 1000).toFixed(1)} kWh LiFePO4 Lithium (10+ Year Lifespan)`],
          ['Night-time Runtime', '12+ Hours continuous power for lighting, fans, fridge & TV'],
          ['Solar PV Generator Array', `${activeData.panelQuantity || '--'} x ${activeData.panelWattage || 450}W High-Yield Monocrystalline Panels`],
          ['Daytime Energy Cost', '₦0 / day (100% Free Solar Generation)'],
          ['Local Daily Irradiance', `${activeData.location?.psh ? activeData.location.psh.toFixed(1) : '4.8'} Peak Sun Hours`],
          ['Protection & Wiring', 'Included (Fire-retardant DC cabling, Surge Arrestors, DC Breakers)']
        ];

        if (typeof autoTableFunc === 'function') {
          autoTableFunc(doc, {
            startY: 56,
            head: [['System Feature', 'Homeowner Guarantee']],
            body: clientTableData,
            theme: 'grid',
            headStyles: { fillColor: [15, 23, 42], textColor: [245, 158, 11] },
            styles: { fontSize: 9, cellPadding: 4 }
          });
        }

        const lastTable = (doc as any).lastAutoTable;
        const finalY = (lastTable && lastTable.finalY) ? lastTable.finalY : 145;
        
        // Turnkey Investment Box
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(245, 158, 11);
        doc.rect(14, finalY + 8, 182, 36, 'FD');
        
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text("Total Turnkey System Investment (Hardware, Cabling & Certified Installation)", 20, finalY + 18);
        
        doc.setFontSize(20);
        doc.setTextColor(15, 23, 42); 
        doc.setFont('helvetica', 'bold');
        
        const priceText = activeData.estimatedPriceNaira ? formatCurrency(activeData.estimatedPriceNaira) : "Consultation Required";
        doc.text(priceText, 20, finalY + 32);

        // Warranty & ROI Highlights
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        doc.text("Commercial Warranty & Assurances:", 14, finalY + 54);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.text("• Inverter Unit: 5-Year Replacement Warranty\n• Lithium Storage: 10-Year Operational Life Guarantee (6,000 Cycles @ 80% DoD)\n• Solar PV Panels: 25-Year Linear Power Output Guarantee\n• Payback Period: Estimated ~3.5 Years against grid inflation & generator diesel expenses", 14, finalY + 62);

        // Environmental
        doc.setFontSize(8.5);
        doc.setTextColor(16, 185, 129);
        doc.text(`Environmental Benefit: Offsets ${environmentalImpact.co2SavedAnnually.toLocaleString()} kg CO2 annually (~${environmentalImpact.treesEquivalent} Trees Equivalent).`, 14, finalY + 86);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text("MasterviewCEL Energy Solutions | www.masterviewcel.com | support@masterviewcel.com", 14, 282);
        doc.save(`Solar_Proposal_${activeData.id || 'Client'}.pdf`);

      } else {
        // ENGINEER TECHNICAL WORK ORDER & BOM
        doc.setFillColor(15, 23, 42); 
        doc.rect(0, 0, 210, 42, 'F');
        
        doc.setTextColor(56, 189, 248); 
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text("MasterviewCEL Field Engineering", 14, 18);
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text("Technical Work Order & Bill of Materials (BOM)", 14, 28);
        
        doc.setFontSize(9);
        doc.setTextColor(180, 180, 180);
        doc.text(`Ref Date: ${new Date().toLocaleDateString()} | Site: ${activeData.location?.address || 'Nigeria'} | Bus: ${activeData.systemVoltage || 48}V DC`, 14, 36);

        // Section Title: Hardware BOM
        doc.setTextColor(20, 20, 20);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text("1. Core Hardware Specifications & Electrical Sizing", 14, 50);

        const engHardwareTable = [
          ['Inverter Unit', `${activeData.inverterBrand || 'Deye Hybrid'} ${((activeData.recommendedInverterW || 0) / 1000).toFixed(1)} kVA (${activeData.systemVoltage}V Pure Sine, Surge: ${(activeData.maxSurgeWatts || 0).toLocaleString()}W)`],
          ['Battery Bank', `${activeData.batteryAh} Ah @ ${activeData.systemVoltage}V (${((activeData.batteryCapacityWh || 0) / 1000).toFixed(1)} kWh ${activeData.batteryType?.toUpperCase()})`],
          ['PV Array Generator', `${activeData.panelQuantity} x ${activeData.panelWattage || 450}W (${((activeData.panelQuantity * (activeData.panelWattage || 450)) / 1000).toFixed(2)} kWp)`],
          ['MPPT Charge Controller', `${activeData.chargeControllerAmps || 60}A MPPT Controller`],
          ['Daily Design Yield', `${((activeData.dailyEnergyWh || 0) / 1000).toFixed(1)} kWh / day @ ${activeData.location?.psh || 4.8} PSH`]
        ];

        if (typeof autoTableFunc === 'function') {
          autoTableFunc(doc, {
            startY: 54,
            head: [['Sub-System', 'Engineering Rating & Model']],
            body: engHardwareTable,
            theme: 'grid',
            headStyles: { fillColor: [15, 23, 42], textColor: [56, 189, 248] },
            styles: { fontSize: 8.5, cellPadding: 3.5 }
          });
        }

        const table1 = (doc as any).lastAutoTable;
        const y2 = (table1 && table1.finalY) ? table1.finalY + 8 : 110;

        // Section Title: Protection & Cabling Cut-List
        doc.setFontSize(12);
        doc.setTextColor(20, 20, 20);
        doc.text("2. Electrical Protection, Switchgear & Cabling Cut-List", 14, y2);

        const engCableTable = [
          ['DC Solar PV Cable', `${activeData.cableGaugeMm2 || 6} mm² Double-Insulated Solar PV Cable (${activeData.cableDistanceMeters || 20}m run, ${activeData.voltageDropPct || 1.8}% drop)`],
          ['Battery Interconnect Cable', '35 mm² / 50 mm² Ultra-Flexible Copper Cable with heavy-duty crimped eyelet lugs'],
          ['DC Circuit Protection', '63A 2-Pole 1000V DC Breaker + Type II DC SPD (Surge Protection Device)'],
          ['AC Distribution & Bypass', '32A 2-Pole AC Breaker + 63A Rotary Manual Bypass Changeover Switch'],
          ['Earthing & Lightning Rod', '16 mm² Bare Copper Earthing Conductor bonded to 5ft Solid Copper Earth Rod (< 5Ω)']
        ];

        if (typeof autoTableFunc === 'function') {
          autoTableFunc(doc, {
            startY: y2 + 4,
            head: [['Component', 'Installation Specification & Cut Schedule']],
            body: engCableTable,
            theme: 'grid',
            headStyles: { fillColor: [15, 23, 42], textColor: [56, 189, 248] },
            styles: { fontSize: 8.5, cellPadding: 3.5 }
          });
        }

        const table2 = (doc as any).lastAutoTable;
        const y3 = (table2 && table2.finalY) ? table2.finalY + 8 : 190;

        // Pre-Commissioning Checklist
        doc.setFontSize(11);
        doc.setTextColor(20, 20, 20);
        doc.text("3. Field Pre-Commissioning & QA Checklist", 14, y3);

        doc.setFontSize(8);
        doc.setTextColor(80, 80, 80);
        doc.text("[  ] PV String Open-Circuit Voltage (Voc) verified under irradiance within inverter MPPT window\n[  ] Correct polarity verified (+ to +, - to -) prior to closing DC isolator\n[  ] Battery terminal torque verified to manufacturer specification (8 - 10 Nm)\n[  ] AC phase-neutral-earth bonding & loop impedance confirmed < 5 Ohms\n[  ] High-voltage surge protection arrestor (SPD) operational indicator green", 14, y3 + 6);

        // Signatures
        doc.setFontSize(9);
        doc.setTextColor(20, 20, 20);
        doc.text("Commissioning Lead Signature: _______________________      Date: ______________", 14, y3 + 32);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text("MasterviewCEL Field Engineering Division | support@masterviewcel.com", 14, 282);
        doc.save(`Solar_WorkOrder_BOM_${activeData.id || 'Field'}.pdf`);
      }
    } catch (err: any) {
      console.error("PDF Component Failure:", err);
      alert(`Export Error: ${err.message || "Contact Support"}`);
    }
  };

  const handleShareWhatsApp = () => {
    const summary = [
      `*MasterviewCEL Solar Blueprint - ${userMode === 'client' ? 'Guaranteed Quotation' : 'Technical Specification'}*`,
      `Location: ${activeData.location?.address || 'Nigeria'}`,
      `Daily Energy: ${((activeData.dailyEnergyWh || 0) / 1000).toFixed(1)} kWh/day`,
      `Inverter: ${((activeData.recommendedInverterW || 0) / 1000).toFixed(1)} kVA (${activeData.systemVoltage || 48}V Pure Sine - ${activeData.inverterBrand || 'Deye'})`,
      `Battery: ${((activeData.batteryCapacityWh || 0) / 1000).toFixed(1)} kWh (${activeData.batteryAh || 0} Ah @ ${activeData.systemVoltage || 48}V ${activeData.batteryType === 'lithium' ? 'Lithium LiFePO4' : 'Deep Cycle'})`,
      `Solar Array: ${activeData.panelQuantity || 0} Panels (${((activeData.panelQuantity * (activeData.panelWattage || 450)) / 1000).toFixed(1)} kWp)`,
      `DC Cable: ${activeData.cableGaugeMm2 || 6}mm² PV Cable (${activeData.cableDistanceMeters || 20}m run, ${activeData.voltageDropPct || 1.8}% drop)`,
      `Investment: ${formatCurrency(activeData.estimatedPriceNaira || 0)}`,
      `Payback: ${activeData.paybackYears ? `${activeData.paybackYears.toFixed(1)} Years` : '3.5 Years'}`,
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
            ? `Calibrated for ${activeData.location?.address || 'Nigeria'} to power your home seamlessly and eliminate generator fueling costs.`
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
          {userMode === 'client' ? (
            <>
              <button 
                onClick={() => handleDownloadPDF('client')}
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
                <span>Download Proposal PDF</span>
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
                <span>Share Blueprint</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => handleDownloadPDF('engineer')}
                style={{
                  background: 'var(--color-accent)',
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
                  transition: 'all 0.15s ease',
                  minHeight: '42px'
                }}
              >
                <FileText size={16} />
                <span>Download Technical BOM PDF</span>
              </button>

              <button 
                onClick={() => setIsOverrideOpen(true)}
                style={{
                  background: 'rgba(56, 189, 248, 0.12)',
                  color: 'var(--color-accent)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease',
                  minHeight: '42px'
                }}
              >
                <Wrench size={16} />
                <span>Hardware & Stock Override</span>
              </button>

              <button 
                onClick={() => handleDownloadPDF('client')}
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
                <Download size={16} />
                <span>Client Proposal</span>
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
                <span>Share Spec</span>
              </button>
            </>
          )}
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
              {((activeData.recommendedInverterW || 0) / 1000).toFixed(1)} kVA
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '8px', lineHeight: 1.4 }}>
            {userMode === 'client'
              ? `Pure Sine Wave &bull; Effortlessly starts ACs, fridge compressors & domestic surges without flickering.`
              : `${activeData.systemVoltage}V Pure Sine Wave &bull; Surge: ${(activeData.maxSurgeWatts || 0).toLocaleString()}W &bull; PF: 0.85`}
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
                ? `${((activeData.batteryCapacityWh || 0) / 1000).toFixed(1)} kWh`
                : `${activeData.batteryAh} Ah @ ${activeData.systemVoltage}V`}
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '8px', lineHeight: 1.4 }}>
            {userMode === 'client'
              ? `${activeData.batteryType === 'lithium' ? '10+ Year LiFePO4 Lithium (Zero Maintenance)' : 'Deep Cycle Tubular Bank'} &bull; Sustains full night loads.`
              : `${((activeData.batteryCapacityWh || 0) / 1000).toFixed(1)} kWh Reserve &bull; DoD: ${activeData.batteryType === 'lithium' ? '80%' : '50%'} &bull; ${activeData.batteryType === 'lithium' ? 'LiFePO4' : 'Lead-Acid'}`}
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
              {activeData.panelQuantity} Panels
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '8px', lineHeight: 1.4 }}>
            {userMode === 'client'
              ? `${((activeData.panelQuantity * (activeData.panelWattage || 450)) / 1000).toFixed(2)} kW High-Yield Monocrystalline &bull; Powers heavy appliances in direct sun.`
              : `${((activeData.panelQuantity * (activeData.panelWattage || 450)) / 1000).toFixed(2)} kWp (${activeData.panelQuantity}x${activeData.panelWattage || 450}W) &bull; ${activeData.chargeControllerAmps}A MPPT`}
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
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{(activeData.maxSurgeWatts || 0).toLocaleString()} W</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Daily Energy Usage</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{((activeData.dailyEnergyWh || 0) / 1000).toFixed(1)} kWh</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{userMode === 'client' ? 'Local Sunlight Hours' : 'Peak Sun Hours (PSH)'}</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{activeData.location?.psh ? `${activeData.location.psh.toFixed(2)} hrs/day` : '4.80 hrs/day'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>System Architecture</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{activeData.systemVoltage}V DC Pure Sine</span>
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
        {activeData.appliances && activeData.appliances.length > 0 && (
          <DayNightRuntimeMatrix
            appliances={activeData.appliances}
            batteryCapacityWh={activeData.batteryCapacityWh || 0}
            batteryType={activeData.batteryType || 'lithium'}
            systemVoltage={activeData.systemVoltage || 48}
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
              background: activeData.pvArchitecture === 'high-voltage' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              color: activeData.pvArchitecture === 'high-voltage' ? 'var(--color-success)' : 'var(--color-primary)',
              border: '1px solid currentColor',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              {activeData.pvArchitecture === 'high-voltage' ? <ShieldCheck size={13} /> : <AlertCircle size={13} />}
              <span>{activeData.pvArchitecture === 'high-voltage' ? 'High Voltage Array (Optimal Efficiency)' : 'Low Voltage Array'}</span>
            </span>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
            {userMode === 'client'
              ? `Your system includes fire-retardant DC cabling, lightning surge arrestors (SPD), and high-efficiency circuit breakers to safeguard your appliances and roof installation.`
              : activeData.pvArchitecture === 'high-voltage'
                ? `High-voltage series configuration keeps current low, preventing cables from heating up over your ${activeData.cableDistanceMeters || 20}m run and reducing electrical resistance.`
                : `Low-voltage parallel arrays generate heavy current. Heavy-duty copper cables are specified below to prevent thermal cable warming.`}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-hairline)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Solar DC Cable</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                {activeData.cableGaugeMm2 || 6} mm²
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                {activeData.bosBreakdown?.solarCableMeters || 45}m total length
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-hairline)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Voltage Drop</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: (activeData.voltageDropPct || 1.8) <= 2.5 ? 'var(--color-success)' : 'var(--color-primary)' }}>
                {activeData.voltageDropPct || 1.8}%
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Industry target &le; 3.0%
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-hairline)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Battery Interconnect</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>
                {activeData.bosBreakdown?.batteryCableGauge || '35 mm² Flexible'}
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
        {activeData.appliances && activeData.appliances.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <LoadProfileChart 
              appliances={activeData.appliances} 
              hours={activeData.dailyHours || 6} 
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
              {formatCurrency(activeData.estimatedPriceNaira || 0)}
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
              {activeData.paybackYears ? `${activeData.paybackYears.toFixed(1)} Years` : '3.5 Years'}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '6px', lineHeight: 1.35 }}>
              Based on Nigerian grid tariff parity & generator diesel replacement
            </p>
          </div>
        </div>

        {/* Interactive Savings & Tariff Sensitivity Calculator */}
        <div style={{ marginBottom: '32px' }}>
          <SavingsCalculator 
            systemCost={activeData.estimatedPriceNaira || 0} 
            dailyEnergyWh={activeData.dailyEnergyWh} 
            paybackYears={activeData.paybackYears || 3.5} 
          />
        </div>

        {/* Environmental Impact Card */}
        <div style={{ marginBottom: '36px' }}>
          <EnvironmentalImpactCard impact={environmentalImpact} />
        </div>

        {activeData.location?.address && (
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
            <span>Tailored installation region: <strong style={{ color: 'var(--color-text-main)' }}>{activeData.location.address}</strong></span>
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
            onClick={() => handleDownloadPDF(userMode)}
            style={{
              background: userMode === 'client' ? 'var(--color-primary)' : 'var(--color-accent)',
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
            <span>{userMode === 'client' ? 'Download Proposal PDF' : 'Download Technical BOM PDF'}</span>
          </button>

          {userMode === 'engineer' && (
            <button 
              onClick={() => setIsOverrideOpen(true)}
              style={{
                background: 'rgba(56, 189, 248, 0.12)',
                color: 'var(--color-accent)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                padding: '14px 24px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                flex: '1 1 220px',
                minHeight: '48px'
              }}
            >
              <Wrench size={18} />
              <span>Hardware & Stock Override</span>
            </button>
          )}

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
            <span>Share {userMode === 'client' ? 'Blueprint' : 'Specification'}</span>
          </button>
        </div>

      {/* Engineer Hardware & Stock Override Drawer */}
      <EngineerOverrideDrawer
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        currentResult={activeData || data}
        onApplyOverrides={handleApplyOverrides}
      />
    </div>
  );
}
