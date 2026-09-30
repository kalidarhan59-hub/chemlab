import React from 'react';

interface SvgProps {
  className?: string;
}

export const ArticleSvgCover: React.FC<{ svgKey: string; className?: string }> = ({ svgKey, className = '' }) => {
  switch (svgKey) {
    case 'baking_soda':
      return (
        <svg viewBox="0 0 400 220" className={`w-full h-auto rounded-2xl ${className}`} fill="none">
          <rect width="400" height="220" rx="16" fill="url(#bg_soda)" />
          <path d="M120 170 L280 170 L250 110 L150 110 Z" fill="#14B8A6" fillOpacity="0.2" stroke="#14B8A6" strokeWidth="3" />
          <circle cx="200" cy="110" r="28" fill="#F59E0B" fillOpacity="0.3" stroke="#F59E0B" strokeWidth="3" />
          <circle cx="180" cy="80" r="10" fill="#2DD4BF" fillOpacity="0.6" />
          <circle cx="215" cy="70" r="7" fill="#38BDF8" fillOpacity="0.7" />
          <circle cx="195" cy="50" r="12" fill="#A78BFA" fillOpacity="0.5" />
          <text x="200" y="195" textAnchor="middle" fill="currentColor" className="text-xs font-mono font-bold">NaHCO₃ + H⁺ → Na⁺ + H₂O + CO₂↑</text>
          <defs>
            <linearGradient id="bg_soda" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0F172A" stopOpacity="0.8" />
              <stop offset="1" stopColor="#1E293B" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'iron_rust':
      return (
        <svg viewBox="0 0 400 220" className={`w-full h-auto rounded-2xl ${className}`} fill="none">
          <rect width="400" height="220" rx="16" fill="url(#bg_rust)" />
          <rect x="80" y="80" width="240" height="40" rx="8" fill="#94A3B8" stroke="#E2E8F0" strokeWidth="2" />
          <path d="M180 80 L320 80 L320 120 L220 120 Z" fill="#EA580C" fillOpacity="0.7" />
          <path d="M240 70 C260 50, 300 50, 320 70" stroke="#38BDF8" strokeWidth="3" strokeDasharray="4 4" />
          <text x="200" y="185" textAnchor="middle" fill="currentColor" className="text-xs font-mono font-bold">4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃</text>
          <defs>
            <linearGradient id="bg_rust" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1C1917" />
              <stop offset="1" stopColor="#292524" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'toothpaste':
      return (
        <svg viewBox="0 0 400 220" className={`w-full h-auto rounded-2xl ${className}`} fill="none">
          <rect width="400" height="220" rx="16" fill="url(#bg_tooth)" />
          <path d="M150 140 C150 90, 180 70, 200 70 C220 70, 250 90, 250 140 C230 160, 170 160, 150 140 Z" fill="#FFFFFF" fillOpacity="0.8" stroke="#38BDF8" strokeWidth="3" />
          <path d="M120 100 C160 80, 240 120, 280 90" stroke="#2DD4BF" strokeWidth="12" strokeLinecap="round" />
          <text x="200" y="195" textAnchor="middle" fill="currentColor" className="text-xs font-mono font-bold">Ca₅(PO₄)₃OH + F⁻ → Ca₅(PO₄)₃F + OH⁻</text>
          <defs>
            <linearGradient id="bg_tooth" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0284C7" stopOpacity="0.3" />
              <stop offset="1" stopColor="#0F172A" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'soap_surfactants':
      return (
        <svg viewBox="0 0 400 220" className={`w-full h-auto rounded-2xl ${className}`} fill="none">
          <rect width="400" height="220" rx="16" fill="url(#bg_soap)" />
          <circle cx="200" cy="110" r="55" fill="#38BDF8" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="2" strokeDasharray="6 4" />
          <circle cx="200" cy="110" r="22" fill="#7C3AED" fillOpacity="0.5" />
          {/* Hydrophilic heads */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 200 + Math.cos(rad) * 22;
            const y1 = 110 + Math.sin(rad) * 22;
            const x2 = 200 + Math.cos(rad) * 55;
            const y2 = 110 + Math.sin(rad) * 55;
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2DD4BF" strokeWidth="3" />
                <circle cx={x2} cy={y2} r="6" fill="#F59E0B" />
              </g>
            );
          })}
          <text x="200" y="195" textAnchor="middle" fill="currentColor" className="text-xs font-mono font-bold">R-COO⁻Na⁺ (Micelle Structure)</text>
          <defs>
            <linearGradient id="bg_soap" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E1B4B" />
              <stop offset="1" stopColor="#0F172A" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'carbonated_water':
      return (
        <svg viewBox="0 0 400 220" className={`w-full h-auto rounded-2xl ${className}`} fill="none">
          <rect width="400" height="220" rx="16" fill="url(#bg_soda_water)" />
          <rect x="150" y="40" width="100" height="140" rx="12" fill="#38BDF8" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="3" />
          <circle cx="180" cy="150" r="6" fill="#FFFFFF" fillOpacity="0.8" />
          <circle cx="210" cy="130" r="10" fill="#FFFFFF" fillOpacity="0.8" />
          <circle cx="190" cy="90" r="14" fill="#2DD4BF" fillOpacity="0.9" />
          <circle cx="220" cy="60" r="8" fill="#FFFFFF" fillOpacity="0.8" />
          <text x="200" y="200" textAnchor="middle" fill="currentColor" className="text-xs font-mono font-bold">H₂CO₃ ⇌ H₂O + CO₂↑</text>
          <defs>
            <linearGradient id="bg_soda_water" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0284C7" stopOpacity="0.4" />
              <stop offset="1" stopColor="#0F172A" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'photosynthesis':
      return (
        <svg viewBox="0 0 400 220" className={`w-full h-auto rounded-2xl ${className}`} fill="none">
          <rect width="400" height="220" rx="16" fill="url(#bg_photo)" />
          <circle cx="80" cy="60" r="28" fill="#F59E0B" fillOpacity="0.9" />
          <path d="M180 150 C180 90, 260 90, 280 150 C220 170, 200 170, 180 150 Z" fill="#22C55E" fillOpacity="0.8" stroke="#4ADE80" strokeWidth="3" />
          <path d="M230 150 L230 110" stroke="#16A34A" strokeWidth="3" />
          <text x="200" y="195" textAnchor="middle" fill="currentColor" className="text-xs font-mono font-bold">6CO₂ + 6H₂O + hν → C₆H₁₂O₆ + 6O₂↑</text>
          <defs>
            <linearGradient id="bg_photo" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
              <stop stopColor="#064E3B" />
              <stop offset="1" stopColor="#0F172A" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'fire_extinguisher':
      return (
        <svg viewBox="0 0 400 220" className={`w-full h-auto rounded-2xl ${className}`} fill="none">
          <rect width="400" height="220" rx="16" fill="url(#bg_fire)" />
          <path d="M100 150 Q130 80 150 150 Q170 90 190 150 Z" fill="#EF4444" fillOpacity="0.8" />
          <rect x="250" y="70" width="50" height="90" rx="10" fill="#DC2626" stroke="#F87171" strokeWidth="3" />
          <text x="200" y="195" textAnchor="middle" fill="currentColor" className="text-xs font-mono font-bold">Fuel + O₂ → CO₂ + H₂O + Heat</text>
          <defs>
            <linearGradient id="bg_fire" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
              <stop stopColor="#450A0A" />
              <stop offset="1" stopColor="#0F172A" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'acid_rain':
      return (
        <svg viewBox="0 0 400 220" className={`w-full h-auto rounded-2xl ${className}`} fill="none">
          <rect width="400" height="220" rx="16" fill="url(#bg_acid)" />
          <path d="M120 70 Q160 50 200 70 Q240 50 280 70 Q300 90 260 100 Q200 110 120 100 Z" fill="#64748B" fillOpacity="0.8" />
          <line x1="160" y1="120" x2="150" y2="150" stroke="#EF4444" strokeWidth="3" strokeDasharray="4 4" />
          <line x1="200" y1="120" x2="190" y2="150" stroke="#F59E0B" strokeWidth="3" strokeDasharray="4 4" />
          <line x1="240" y1="120" x2="230" y2="150" stroke="#EF4444" strokeWidth="3" strokeDasharray="4 4" />
          <text x="200" y="195" textAnchor="middle" fill="currentColor" className="text-xs font-mono font-bold">SO₃ + H₂O → H₂SO₄ | 2NO₂ + H₂O → HNO₂ + HNO₃</text>
          <defs>
            <linearGradient id="bg_acid" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E293B" />
              <stop offset="1" stopColor="#0F172A" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'batteries':
      return (
        <svg viewBox="0 0 400 220" className={`w-full h-auto rounded-2xl ${className}`} fill="none">
          <rect width="400" height="220" rx="16" fill="url(#bg_batt)" />
          <rect x="120" y="70" width="160" height="80" rx="12" stroke="#38BDF8" strokeWidth="3" fill="#1E293B" />
          <rect x="280" y="95" width="12" height="30" rx="3" fill="#38BDF8" />
          <text x="160" y="120" fill="#EF4444" className="font-extrabold text-2xl">-</text>
          <text x="230" y="120" fill="#22C55E" className="font-extrabold text-2xl">+</text>
          <path d="M175 110 L220 110" stroke="#F59E0B" strokeWidth="4" markerEnd="url(#arrow)" />
          <text x="200" y="195" textAnchor="middle" fill="currentColor" className="text-xs font-mono font-bold">Zn + Cu²⁺ → Zn²⁺ + Cu (E° = 1.10 V)</text>
          <defs>
            <linearGradient id="bg_batt" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0F172A" />
              <stop offset="1" stopColor="#172554" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'food_additives_e':
      return (
        <svg viewBox="0 0 400 220" className={`w-full h-auto rounded-2xl ${className}`} fill="none">
          <rect width="400" height="220" rx="16" fill="url(#bg_e_num)" />
          <circle cx="200" cy="100" r="45" fill="#7C3AED" fillOpacity="0.3" stroke="#A78BFA" strokeWidth="3" />
          <text x="200" y="112" textAnchor="middle" fill="#FFFFFF" className="font-black text-3xl tracking-wider">E300</text>
          <text x="200" y="190" textAnchor="middle" fill="currentColor" className="text-xs font-mono font-bold">C₆H₈O₆ (L-Ascorbic Acid / Vitamin C)</text>
          <defs>
            <linearGradient id="bg_e_num" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2E1065" />
              <stop offset="1" stopColor="#0F172A" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'precious_metals':
      return (
        <svg viewBox="0 0 400 220" className={`w-full h-auto rounded-2xl ${className}`} fill="none">
          <rect width="400" height="220" rx="16" fill="url(#bg_gold)" />
          <polygon points="120,130 150,80 210,80 240,130" fill="#F59E0B" stroke="#FBBF24" strokeWidth="3" />
          <polygon points="200,130 225,90 275,90 300,130" fill="#94A3B8" stroke="#E2E8F0" strokeWidth="3" />
          <text x="200" y="195" textAnchor="middle" fill="currentColor" className="text-xs font-mono font-bold">Au (79) | Ag (47) | Pt (78)</text>
          <defs>
            <linearGradient id="bg_gold" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
              <stop stopColor="#451A03" />
              <stop offset="1" stopColor="#0F172A" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'salt_aral':
      return (
        <svg viewBox="0 0 400 220" className={`w-full h-auto rounded-2xl ${className}`} fill="none">
          <rect width="400" height="220" rx="16" fill="url(#bg_salt)" />
          <path d="M80 150 Q160 100 240 130 Q320 160 360 120" stroke="#38BDF8" strokeWidth="4" />
          <rect x="170" y="80" width="60" height="60" fill="#FFFFFF" fillOpacity="0.8" stroke="#E2E8F0" strokeWidth="3" transform="rotate(15 200 110)" />
          <text x="200" y="195" textAnchor="middle" fill="currentColor" className="text-xs font-mono font-bold">NaCl (Halite / Aral Sea Salt)</text>
          <defs>
            <linearGradient id="bg_salt" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0C4A6E" />
              <stop offset="1" stopColor="#0F172A" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'oil_gas_kz':
      return (
        <svg viewBox="0 0 400 220" className={`w-full h-auto rounded-2xl ${className}`} fill="none">
          <rect width="400" height="220" rx="16" fill="url(#bg_oil)" />
          <path d="M180 160 L200 60 L220 160 Z" stroke="#14B8A6" strokeWidth="3" fill="#1E293B" />
          <line x1="160" y1="160" x2="240" y2="160" stroke="#14B8A6" strokeWidth="4" />
          <circle cx="200" cy="50" r="8" fill="#F59E0B" />
          <text x="200" y="195" textAnchor="middle" fill="currentColor" className="text-xs font-mono font-bold">{"C_n H_{2n+2} (Alkanes / Tengiz & Kashagan Crude)"}</text>
          <defs>
            <linearGradient id="bg_oil" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
              <stop stopColor="#042F2E" />
              <stop offset="1" stopColor="#0F172A" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'water_hardness_filters':
    default:
      return (
        <svg viewBox="0 0 400 220" className={`w-full h-auto rounded-2xl ${className}`} fill="none">
          <rect width="400" height="220" rx="16" fill="url(#bg_water_filter)" />
          <circle cx="200" cy="110" r="45" stroke="#38BDF8" strokeWidth="3" fill="#0284C7" fillOpacity="0.2" />
          <path d="M180 110 L220 110 M200 90 L200 130" stroke="#38BDF8" strokeWidth="3" />
          <text x="200" y="195" textAnchor="middle" fill="currentColor" className="text-xs font-mono font-bold">Ca²⁺ + CO₃²⁻ ⇌ CaCO₃↓ (Limescale)</text>
          <defs>
            <linearGradient id="bg_water_filter" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0F172A" />
              <stop offset="1" stopColor="#0369A1" />
            </linearGradient>
          </defs>
        </svg>
      );
  }
};
