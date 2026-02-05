import { useState, useRef, useEffect } from 'react';
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
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: 600,
          color: 'var(--color-text-main)',
        }}>
          Quick Add from Database
        </label>
        
        {/* Category Pills */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '12px',
        }}>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedCategory(selectedCategory === key ? null : key);
                setSearchQuery('');
                setShowSuggestions(true);
              }}
              style={{
                padding: '6px 12px',
                background: selectedCategory === key 
                  ? 'var(--color-primary)' 
                  : 'rgba(255,255,255,0.05)',
                border: selectedCategory === key
                  ? '1px solid var(--color-primary)'
                  : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px',
                color: selectedCategory === key ? '#000' : '#fff',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: selectedCategory === key ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== key) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== key) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
        
        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="🔍 Search appliances... (e.g., 'LED', 'fridge', 'laptop')"
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
              padding: '12px 16px',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.2s',
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
                          {spec.icon && <span style={{ fontSize: '1.2rem' }}>{spec.icon}</span>}
                          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                            {spec.name}
                          </span>
                        </div>
                        
                        <div style={{ 
                          display: 'flex', 
                          gap: '12px', 
                          fontSize: '0.75rem',
                          color: 'var(--color-text-muted)',
                        }}>
                          <span style={{ color: catColor, fontWeight: 500 }}>
                            {CATEGORIES[spec.category as keyof typeof CATEGORIES]?.label}
                          </span>
                          <span>⚡ {spec.wattage}W</span>
                          <span>⏱️ {spec.typicalHours}h/day</span>
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
        <span>💡</span>
        <span>
          Browse by category or search by name. Can't find an appliance? Add it manually below.
        </span>
      </div>
    </div>
  );
}
