import { useState, useRef, useEffect } from 'react';
import { 
  Tv, 
  Utensils, 
  Wind, 
  Laptop, 
  Search, 
  Plus, 
  Layers, 
  Sparkles,
  Zap,
  Clock,
  Plug,
  Info
} from 'lucide-react';
import { APPLIANCE_DATABASE, CATEGORIES, searchAppliances, type ApplianceSpec } from '../data/applianceDatabase';
import type { Appliance } from '../types';

interface ApplianceSelectorProps {
  onAdd: (appliance: Appliance) => void;
}

export default function ApplianceSelector({ onAdd }: ApplianceSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const filteredAppliances = selectedCategory
    ? APPLIANCE_DATABASE.filter(app => app.category === selectedCategory)
    : searchQuery.length >= 2
    ? searchAppliances(searchQuery)
    : [];
  
  const handleSelect = (spec: ApplianceSpec) => {
    onAdd({
      name: spec.name,
      watt: spec.wattage,
      quantity: 1,
      hours: spec.typicalHours,
      surgeFactor: spec.surgeFactor,
      category: spec.category,
    });
    
    setSearchQuery('');
    setShowSuggestions(false);
    setSelectedCategory(null);
    setHighlightedIndex(0);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || filteredAppliances.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => 
        prev < filteredAppliances.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => 
        prev > 0 ? prev - 1 : filteredAppliances.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredAppliances[highlightedIndex]) {
        handleSelect(filteredAppliances[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        {/* Room Presets Quick-Add Row */}
        <div style={{ 
          marginBottom: '16px', 
          background: 'var(--color-bg-surface)', 
          padding: '12px 14px', 
          borderRadius: 'var(--radius-md)', 
          border: 'var(--border-subtle)' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ 
              fontSize: '0.74rem', 
              fontWeight: 600, 
              color: 'var(--color-primary)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.06em', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px' 
            }}>
              <Sparkles size={13} color="var(--color-primary)" />
              <span>1-Tap Room Load Templates</span>
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>Select template to populate appliances</span>
          </div>

          <div className="scroll-touch-x" style={{ gap: '8px' }}>
            {[
              {
                label: 'Living Room Suite',
                IconComponent: Tv,
                items: [
                  { name: 'LED TV (43")', watt: 65, quantity: 1, hours: 6, category: 'entertainment' },
                  { name: 'Standing Fan 16"', watt: 55, quantity: 2, hours: 8, category: 'cooling' },
                  { name: 'LED Bulb (9W)', watt: 9, quantity: 4, hours: 6, category: 'lighting' },
                  { name: 'Decoder / Soundbar', watt: 30, quantity: 1, hours: 6, category: 'entertainment' },
                ]
              },
              {
                label: 'Kitchen Core',
                IconComponent: Utensils,
                items: [
                  { name: 'Small Refrigerator (Inverter)', watt: 120, quantity: 1, hours: 24, category: 'kitchen' },
                  { name: 'Microwave Oven (800W)', watt: 800, quantity: 1, hours: 0.5, category: 'kitchen' },
                  { name: 'Blender', watt: 350, quantity: 1, hours: 0.2, category: 'kitchen' },
                ]
              },
              {
                label: 'Bedroom & HVAC',
                IconComponent: Wind,
                items: [
                  { name: 'AC 1HP Inverter', watt: 746, quantity: 1, hours: 6, category: 'cooling' },
                  { name: 'Ceiling Fan (Standard)', watt: 75, quantity: 1, hours: 8, category: 'cooling' },
                  { name: 'Phone / Tablet Charger', watt: 18, quantity: 2, hours: 4, category: 'computing' },
                ]
              },
              {
                label: 'Office & Workstation',
                IconComponent: Laptop,
                items: [
                  { name: 'Laptop Computer', watt: 65, quantity: 2, hours: 8, category: 'computing' },
                  { name: 'WiFi Router', watt: 15, quantity: 1, hours: 24, category: 'computing' },
                  { name: 'Desk Lamp LED', watt: 10, quantity: 1, hours: 5, category: 'lighting' },
                ]
              }
            ].map((room) => {
              const Icon = room.IconComponent;
              return (
                <button
                  key={room.label}
                  type="button"
                  onClick={() => {
                    room.items.forEach(item => onAdd(item));
                  }}
                  style={{
                    padding: '7px 12px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.15s ease'
                  }}
                  title={`Add ${room.items.length} appliances at once`}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary-border)';
                    e.currentTarget.style.background = 'var(--color-primary-subtle)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  }}
                >
                  <Icon size={14} color="var(--color-primary)" />
                  <span>{room.label}</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-dim)' }}>+{room.items.length}</span>
                </button>
              );
            })}
          </div>
        </div>

        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: 600,
          fontSize: '0.85rem',
          color: 'var(--color-text-body)',
        }}>
          Search Appliance Catalog
        </label>
        
        {/* Category Pills */}
        <div 
          className="scroll-touch-x"
          style={{
            marginBottom: '12px',
          }}
        >
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setSelectedCategory(selectedCategory === key ? null : key);
                setSearchQuery('');
                setShowSuggestions(true);
              }}
              style={{
                padding: '6px 12px',
                background: selectedCategory === key 
                  ? 'var(--color-primary-subtle)' 
                  : 'rgba(255,255,255,0.03)',
                border: selectedCategory === key
                  ? '1.5px solid var(--color-primary)'
                  : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--radius-sm)',
                color: selectedCategory === key ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: selectedCategory === key ? 600 : 500,
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
        
        {/* Search Input */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'absolute', left: '14px', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
            <Search size={16} color="var(--color-text-muted)" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search appliances... (e.g. 'LED', 'fridge', 'laptop')"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(e.target.value.length >= 2);
              setHighlightedIndex(0);
              setSelectedCategory(null);
            }}
            onFocus={() => {
              if (searchQuery.length >= 2 || selectedCategory) {
                setShowSuggestions(true);
              }
            }}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '12px 16px 12px 40px',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.2s',
              boxSizing: 'border-box'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          />
          
          {/* Suggestions Dropdown */}
          {showSuggestions && filteredAppliances.length > 0 && (
            <div
              ref={suggestionsRef}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '4px',
                background: 'rgba(15, 23, 42, 0.98)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                maxHeight: '320px',
                overflowY: 'auto',
                zIndex: 1000,
                backdropFilter: 'blur(16px)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
            >
              {filteredAppliances.slice(0, 20).map((spec, index) => {
                const catColor = CATEGORIES[spec.category as keyof typeof CATEGORIES]?.color || '#fff';
                
                return (
                  <div
                    key={spec.id}
                    onClick={() => handleSelect(spec)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      background: index === highlightedIndex 
                        ? 'rgba(251, 191, 36, 0.1)' 
                        : 'transparent',
                      borderBottom: index < filteredAppliances.length - 1 
                        ? '1px solid rgba(255,255,255,0.05)' 
                        : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      setHighlightedIndex(index);
                      e.currentTarget.style.background = 'rgba(251, 191, 36, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      if (index !== highlightedIndex) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          marginBottom: '4px',
                        }}>
                          <Plug size={15} color="var(--color-primary)" />
                          <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                            {spec.name}
                          </span>
                        </div>
                        
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: '12px', 
                          fontSize: '0.75rem',
                          color: 'var(--color-text-muted)',
                        }}>
                          <span style={{ color: catColor, fontWeight: 500 }}>
                            {CATEGORIES[spec.category as keyof typeof CATEGORIES]?.label}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Zap size={11} /> {spec.wattage}W
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={11} /> {spec.typicalHours}h/day
                          </span>
                        </div>
                        
                        {spec.description && (
                          <div style={{ 
                            fontSize: '0.7rem', 
                            color: 'var(--color-text-muted)',
                            marginTop: '4px',
                            fontStyle: 'italic',
                          }}>
                            {spec.description}
                          </div>
                        )}
                      </div>
                      
                      <div style={{
                        padding: '4px 8px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        color: 'var(--color-success)',
                        fontWeight: 600,
                      }}>
                        + ADD
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredAppliances.length > 20 && (
                <div style={{
                  padding: '8px 16px',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                  fontStyle: 'italic',
                }}>
                  Showing top 20 results. Refine your search for more.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Helper Text */}
      <div style={{
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <Info size={14} color="var(--color-primary)" />
        <span>
          Browse by category or search by name. Can't find an appliance? Add it manually below.
        </span>
      </div>
    </div>
  );
}
