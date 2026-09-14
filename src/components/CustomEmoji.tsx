import React from 'react';
import {
  Sun,
  Zap,
  Plug,
  Home,
  Building2,
  Factory,
  Hospital,
  Wheat,
  Store,
  Fuel,
  Church,
  GraduationCap,
  Rocket,
  MapPin,
  BatteryCharging,
  FileText,
  MessageCircle,
  Globe2,
  Wind,
  Trees,
  Pickaxe,
  Lightbulb,
  Fan,
  Flame,
  UtensilsCrossed,
  Tv,
  Laptop,
  Wrench,
  ClipboardList,
  Stethoscope,
  BarChart3,
  Clock,
  Snowflake,
  Refrigerator,
  Search,
  Check,
  Sparkles,
  Layers,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  AlertTriangle,
  Smartphone,
  Coins,
  ShieldCheck,
  Activity,
  Cable,
  Ruler,
  Cpu
} from 'lucide-react';

export type EmojiName =
  | 'sun'
  | 'bolt'
  | 'plug'
  | 'home'
  | 'office'
  | 'factory'
  | 'hospital'
  | 'farm'
  | 'store'
  | 'fuel'
  | 'church'
  | 'school'
  | 'rocket'
  | 'pin'
  | 'battery'
  | 'document'
  | 'whatsapp'
  | 'globe'
  | 'wind'
  | 'tree'
  | 'coal'
  | 'lightbulb'
  | 'fan'
  | 'flame'
  | 'utensils'
  | 'tv'
  | 'laptop'
  | 'wrench'
  | 'clipboard'
  | 'medical'
  | 'chart'
  | 'clock'
  | 'snowflake'
  | 'fridge'
  | 'search'
  | 'check'
  | 'sparkles'
  | 'layers'
  | 'arrow-right'
  | 'arrow-left'
  | 'close'
  | 'plus'
  | string;

interface CustomEmojiProps {
  name: EmojiName;
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Map common unicode emojis and names to custom vector icons
const EMOJI_MAP: Record<string, { icon: React.ComponentType<any>; defaultColor?: string }> = {
  // Sun / Solar
  '☀️': { icon: Sun, defaultColor: 'var(--color-primary)' },
  'sun': { icon: Sun, defaultColor: 'var(--color-primary)' },
  'solar': { icon: Sun, defaultColor: 'var(--color-primary)' },

  // Electricity / Bolt
  '⚡': { icon: Zap, defaultColor: 'var(--color-primary)' },
  'bolt': { icon: Zap, defaultColor: 'var(--color-primary)' },
  'zap': { icon: Zap, defaultColor: 'var(--color-primary)' },

  // Plug / Appliance
  '🔌': { icon: Plug, defaultColor: 'var(--color-accent)' },
  'plug': { icon: Plug, defaultColor: 'var(--color-accent)' },

  // Properties / Sites
  '🏠': { icon: Home, defaultColor: '#fbbf24' },
  'home': { icon: Home, defaultColor: '#fbbf24' },
  'residential': { icon: Home, defaultColor: '#fbbf24' },

  '🏢': { icon: Building2, defaultColor: '#38bdf8' },
  'office': { icon: Building2, defaultColor: '#38bdf8' },
  'corporate': { icon: Building2, defaultColor: '#38bdf8' },

  '🏭': { icon: Factory, defaultColor: '#f97316' },
  'factory': { icon: Factory, defaultColor: '#f97316' },
  'industrial': { icon: Factory, defaultColor: '#f97316' },

  '🏥': { icon: Hospital, defaultColor: '#ef4444' },
  'hospital': { icon: Hospital, defaultColor: '#ef4444' },
  'medical': { icon: Hospital, defaultColor: '#ef4444' },

  '🌾': { icon: Wheat, defaultColor: '#10b981' },
  'farm': { icon: Wheat, defaultColor: '#10b981' },
  'agriculture': { icon: Wheat, defaultColor: '#10b981' },

  '🏪': { icon: Store, defaultColor: '#a855f7' },
  'store': { icon: Store, defaultColor: '#a855f7' },
  'commercial': { icon: Store, defaultColor: '#a855f7' },

  '⛽': { icon: Fuel, defaultColor: '#f43f5e' },
  'fuel': { icon: Fuel, defaultColor: '#f43f5e' },
  'petrol': { icon: Fuel, defaultColor: '#f43f5e' },

  '⛪': { icon: Church, defaultColor: '#8b5cf6' },
  'church': { icon: Church, defaultColor: '#8b5cf6' },
  'worship': { icon: Church, defaultColor: '#8b5cf6' },

  '🏫': { icon: GraduationCap, defaultColor: '#06b6d4' },
  'school': { icon: GraduationCap, defaultColor: '#06b6d4' },
  'education': { icon: GraduationCap, defaultColor: '#06b6d4' },

  // Rocket / CTA
  '🚀': { icon: Rocket, defaultColor: 'var(--color-primary)' },
  'rocket': { icon: Rocket, defaultColor: 'var(--color-primary)' },

  // Pin / Location
  '📍': { icon: MapPin, defaultColor: '#ef4444' },
  'pin': { icon: MapPin, defaultColor: '#ef4444' },
  'location': { icon: MapPin, defaultColor: '#ef4444' },

  // Battery / Storage
  '🔋': { icon: BatteryCharging, defaultColor: 'var(--color-success)' },
  'battery': { icon: BatteryCharging, defaultColor: 'var(--color-success)' },

  // Document / PDF
  '📄': { icon: FileText, defaultColor: '#fbbf24' },
  'document': { icon: FileText, defaultColor: '#fbbf24' },
  'pdf': { icon: FileText, defaultColor: '#fbbf24' },

  // WhatsApp / Chat
  '💬': { icon: MessageCircle, defaultColor: '#25D366' },
  'chat': { icon: MessageCircle, defaultColor: '#25D366' },
  'whatsapp': { icon: MessageCircle, defaultColor: '#25D366' },

  // Environmental Impact
  '🌍': { icon: Globe2, defaultColor: 'var(--color-success)' },
  'globe': { icon: Globe2, defaultColor: 'var(--color-success)' },
  'earth': { icon: Globe2, defaultColor: 'var(--color-success)' },

  '💨': { icon: Wind, defaultColor: '#38bdf8' },
  'wind': { icon: Wind, defaultColor: '#38bdf8' },
  'co2': { icon: Wind, defaultColor: '#38bdf8' },

  '🌳': { icon: Trees, defaultColor: '#10b981' },
  'tree': { icon: Trees, defaultColor: '#10b981' },
  'trees': { icon: Trees, defaultColor: '#10b981' },

  '⛏️': { icon: Pickaxe, defaultColor: '#fbbf24' },
  'coal': { icon: Pickaxe, defaultColor: '#fbbf24' },
  'pickaxe': { icon: Pickaxe, defaultColor: '#fbbf24' },

  // Categories / Appliances
  '💡': { icon: Lightbulb, defaultColor: '#fbbf24' },
  'lightbulb': { icon: Lightbulb, defaultColor: '#fbbf24' },
  'lighting': { icon: Lightbulb, defaultColor: '#fbbf24' },

  '🌀': { icon: Fan, defaultColor: '#38bdf8' },
  '🌪️': { icon: Fan, defaultColor: '#38bdf8' },
  'fan': { icon: Fan, defaultColor: '#38bdf8' },
  'cooling': { icon: Fan, defaultColor: '#38bdf8' },

  '🔥': { icon: Flame, defaultColor: '#f97316' },
  'flame': { icon: Flame, defaultColor: '#f97316' },
  'heating': { icon: Flame, defaultColor: '#f97316' },

  '🍳': { icon: UtensilsCrossed, defaultColor: '#10b981' },
  'utensils': { icon: UtensilsCrossed, defaultColor: '#10b981' },
  'kitchen': { icon: UtensilsCrossed, defaultColor: '#10b981' },

  '📺': { icon: Tv, defaultColor: '#a855f7' },
  'tv': { icon: Tv, defaultColor: '#a855f7' },
  'entertainment': { icon: Tv, defaultColor: '#a855f7' },

  '💻': { icon: Laptop, defaultColor: '#06b6d4' },
  'laptop': { icon: Laptop, defaultColor: '#06b6d4' },
  'computing': { icon: Laptop, defaultColor: '#06b6d4' },

  '🔧': { icon: Wrench, defaultColor: '#f59e0b' },
  'wrench': { icon: Wrench, defaultColor: '#f59e0b' },
  'tools': { icon: Wrench, defaultColor: '#f59e0b' },

  '📋': { icon: ClipboardList, defaultColor: '#6366f1' },
  'clipboard': { icon: ClipboardList, defaultColor: '#6366f1' },

  '⚕️': { icon: Stethoscope, defaultColor: '#ef4444' },
  'stethoscope': { icon: Stethoscope, defaultColor: '#ef4444' },

  '📊': { icon: BarChart3, defaultColor: 'var(--color-primary)' },
  'chart': { icon: BarChart3, defaultColor: 'var(--color-primary)' },
  'blueprint': { icon: BarChart3, defaultColor: 'var(--color-primary)' },

  '⏱️': { icon: Clock, defaultColor: 'var(--color-primary)' },
  'clock': { icon: Clock, defaultColor: 'var(--color-primary)' },
  'hours': { icon: Clock, defaultColor: 'var(--color-primary)' },

  '❄️': { icon: Snowflake, defaultColor: '#38bdf8' },
  'snowflake': { icon: Snowflake, defaultColor: '#38bdf8' },

  '🧊': { icon: Refrigerator, defaultColor: '#38bdf8' },
  'fridge': { icon: Refrigerator, defaultColor: '#38bdf8' },

  '🔍': { icon: Search, defaultColor: 'var(--color-text-muted)' },
  'search': { icon: Search, defaultColor: 'var(--color-text-muted)' },

  '✓': { icon: Check, defaultColor: 'var(--color-success)' },
  'check': { icon: Check, defaultColor: 'var(--color-success)' },

  '✨': { icon: Sparkles, defaultColor: 'var(--color-primary)' },
  'sparkles': { icon: Sparkles, defaultColor: 'var(--color-primary)' },

  '⚠️': { icon: AlertTriangle, defaultColor: '#f59e0b' },
  'warning': { icon: AlertTriangle, defaultColor: '#f59e0b' },
  'alert': { icon: AlertTriangle, defaultColor: '#ef4444' },

  '📲': { icon: Smartphone, defaultColor: 'var(--color-primary)' },
  'phone': { icon: Smartphone, defaultColor: 'var(--color-primary)' },
  'smartphone': { icon: Smartphone, defaultColor: 'var(--color-primary)' },

  '💰': { icon: Coins, defaultColor: '#fbbf24' },
  'money': { icon: Coins, defaultColor: '#fbbf24' },
  'coins': { icon: Coins, defaultColor: '#fbbf24' },

  'layers': { icon: Layers, defaultColor: 'var(--color-accent)' },
  'arrow-right': { icon: ArrowRight, defaultColor: 'currentColor' },
  'arrow-left': { icon: ArrowLeft, defaultColor: 'currentColor' },
  'close': { icon: X, defaultColor: 'currentColor' },
  'plus': { icon: Plus, defaultColor: 'currentColor' },
  'shield': { icon: ShieldCheck, defaultColor: 'var(--color-success)' },
  'safety': { icon: ShieldCheck, defaultColor: 'var(--color-success)' },
  'activity': { icon: Activity, defaultColor: 'var(--color-primary)' },
  'cable': { icon: Cable, defaultColor: 'var(--color-accent)' },
  'ruler': { icon: Ruler, defaultColor: 'var(--color-primary)' },
  'cpu': { icon: Cpu, defaultColor: 'var(--color-accent)' },
};

export default function CustomEmoji({
  name,
  size = 18,
  color,
  className,
  style,
}: CustomEmojiProps) {
  const match = EMOJI_MAP[name] || EMOJI_MAP[name?.toLowerCase?.()] || { icon: Sparkles, defaultColor: 'currentColor' };
  const IconComponent = match.icon;
  const strokeColor = color || match.defaultColor || 'currentColor';

  return (
    <span
      className={`custom-emoji-wrapper ${className || ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        lineHeight: 1,
        flexShrink: 0,
        ...style,
      }}
    >
      <IconComponent
        size={size}
        color={strokeColor}
        strokeWidth={2.2}
      />
    </span>
  );
}
