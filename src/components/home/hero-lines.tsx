import { useId } from "react";

import { cn } from "@/lib/utils";

/**
 * Линии hero главной: перенос `docs/pages/home-assets/hero-desktop.svg` (`xl`+) и `hero-mobile.svg` (ниже `xl`)
 * без изменения чисел, только имена атрибутов в camelCase. Цвета зашиты в SVG как в эталоне.
 * Идентификаторы с префиксом из `useId()`: на странице два экземпляра (десктоп и телефон).
 * Отличия от спецификации: SVG в натуральную ширину (1440 / 390) по центру, а не `w-full`, иначе
 * `slice` растягивает его шире холста и вершина V уезжает от поля поиска (1920, планшет);
 * у бегущих точек телефона `opacity="0"` до старта анимации (в файле его нет, и точка с `begin="4s"`
 * первые секунды стоит в углу).
 * Бегущие точки (`hero-flow`) скрываются при `prefers-reduced-motion` (`globals.css`).
 */
export function HeroLines({ variant, className }: { variant: "desktop" | "mobile"; className?: string }) {
  const p = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  if (variant === "mobile") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 390 340"
        preserveAspectRatio="xMidYMin slice"
        className={cn("pointer-events-none absolute top-0 left-1/2 h-[340px] w-[390px] -translate-x-1/2", className)}
      >
        <defs><path id={`${p}mp`} d="M-10 150 H80 L195 250 L310 150 H400"/>
        <linearGradient id={`${p}mfade`} x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#EDF2F0" stopOpacity="1"/><stop offset=".08" stopColor="#EDF2F0" stopOpacity="0"/><stop offset=".92" stopColor="#EDF2F0" stopOpacity="0"/><stop offset="1" stopColor="#EDF2F0" stopOpacity="1"/></linearGradient></defs>
        <path d="M-10 150 H80 L195 250 L310 150 H400" transform="translate(0 -8)" fill="none" stroke="#A9B8B1" strokeWidth="1.2" strokeOpacity="1" strokeLinejoin="round"/><path d="M-10 150 H80 L195 250 L310 150 H400" transform="translate(0 -4)" fill="none" stroke="#6F8A7E" strokeWidth="1.2" strokeOpacity="0.8" strokeLinejoin="round"/><path d="M-10 150 H80 L195 250 L310 150 H400" transform="translate(0 0)" fill="none" stroke="#0B5C47" strokeWidth="2.5" strokeOpacity="1" strokeLinejoin="round"/><path d="M-10 150 H80 L195 250 L310 150 H400" transform="translate(0 4)" fill="none" stroke="#6F8A7E" strokeWidth="1.2" strokeOpacity="0.8" strokeLinejoin="round" strokeDasharray="3 4"/><path d="M-10 150 H80 L195 250 L310 150 H400" transform="translate(0 8)" fill="none" stroke="#A9B8B1" strokeWidth="1.2" strokeOpacity="1" strokeLinejoin="round"/>
        <rect x="0" y="130" width="390" height="140" fill={`url(#${p}mfade)`}/>
        <path d="M195 250 V296" stroke="#0B5C47" strokeWidth="2"/>
        <circle cx="195" cy="250" r="15" fill="none" stroke="#0B5C47" strokeOpacity=".25"/>
        <circle cx="195" cy="250" r="5" fill="#0B5C47"/>
        <circle className="hero-flow" r="3.2" fill="#fff" opacity="0" stroke="#0B5C47" strokeWidth="1.4"><animateMotion dur="9s" repeatCount="indefinite" rotate="0"><mpath href={`#${p}mp`}/></animateMotion><animate attributeName="opacity" values="0;1;1;0" dur="9s" repeatCount="indefinite"/></circle>
        <circle className="hero-flow" r="3.2" fill="#fff" opacity="0" stroke="#6F8A7E" strokeWidth="1.4"><animateMotion dur="12s" begin="4s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear"><mpath href={`#${p}mp`}/></animateMotion><animate attributeName="opacity" values="0;1;1;0" dur="12s" begin="4s" repeatCount="indefinite"/></circle>
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 560"
      preserveAspectRatio="xMidYMin slice"
      className={cn("pointer-events-none absolute top-0 left-1/2 h-full w-[1440px] -translate-x-1/2", className)}
    >
      <defs>
      <linearGradient id={`${p}g0`} gradientUnits="userSpaceOnUse" x1="470" y1="0" x2="1010" y2="0"><stop offset="0" stopColor="#A9B8B1" stopOpacity="0"/><stop offset="0.3" stopColor="#A9B8B1" stopOpacity="1"/><stop offset="0.70" stopColor="#A9B8B1" stopOpacity="1"/><stop offset="1" stopColor="#A9B8B1" stopOpacity="0"/></linearGradient><linearGradient id={`${p}g1`} gradientUnits="userSpaceOnUse" x1="380" y1="0" x2="1110" y2="0"><stop offset="0" stopColor="#6F8A7E" stopOpacity="0"/><stop offset="0.22" stopColor="#6F8A7E" stopOpacity="1"/><stop offset="0.80" stopColor="#6F8A7E" stopOpacity="1"/><stop offset="1" stopColor="#6F8A7E" stopOpacity="0"/></linearGradient><linearGradient id={`${p}g2`} gradientUnits="userSpaceOnUse" x1="300" y1="0" x2="1200" y2="0"><stop offset="0" stopColor="#A9B8B1" stopOpacity="0"/><stop offset="0.3" stopColor="#A9B8B1" stopOpacity="1"/><stop offset="0.78" stopColor="#A9B8B1" stopOpacity="1"/><stop offset="1" stopColor="#A9B8B1" stopOpacity="0"/></linearGradient><linearGradient id={`${p}g3`} gradientUnits="userSpaceOnUse" x1="150" y1="0" x2="1300" y2="0"><stop offset="0" stopColor="#0B5C47" stopOpacity="0"/><stop offset="0.16" stopColor="#0B5C47" stopOpacity="1"/><stop offset="0.84" stopColor="#0B5C47" stopOpacity="1"/><stop offset="1" stopColor="#0B5C47" stopOpacity="0"/></linearGradient><linearGradient id={`${p}g4`} gradientUnits="userSpaceOnUse" x1="230" y1="0" x2="1260" y2="0"><stop offset="0" stopColor="#0B5C47" stopOpacity="0"/><stop offset="0.22" stopColor="#0B5C47" stopOpacity="1"/><stop offset="0.74" stopColor="#0B5C47" stopOpacity="1"/><stop offset="1" stopColor="#0B5C47" stopOpacity="0"/></linearGradient><linearGradient id={`${p}g5`} gradientUnits="userSpaceOnUse" x1="340" y1="0" x2="1140" y2="0"><stop offset="0" stopColor="#6F8A7E" stopOpacity="0"/><stop offset="0.28" stopColor="#6F8A7E" stopOpacity="1"/><stop offset="0.84" stopColor="#6F8A7E" stopOpacity="1"/><stop offset="1" stopColor="#6F8A7E" stopOpacity="0"/></linearGradient><linearGradient id={`${p}g6`} gradientUnits="userSpaceOnUse" x1="440" y1="0" x2="1060" y2="0"><stop offset="0" stopColor="#A9B8B1" stopOpacity="0"/><stop offset="0.2" stopColor="#A9B8B1" stopOpacity="1"/><stop offset="0.70" stopColor="#A9B8B1" stopOpacity="1"/><stop offset="1" stopColor="#A9B8B1" stopOpacity="0"/></linearGradient>
      <pattern id={`${p}dots`} width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="translate(0 0)">
      <circle cx="10" cy="10" r="0.9" fill="#1B2B26" fillOpacity="0.2"/>
      </pattern>
      <radialGradient id={`${p}vg`} gradientUnits="userSpaceOnUse" cx="720" cy="300" r="800" gradientTransform="translate(720 300) scale(1 0.58) translate(-720 -300)">
      <stop offset="0" stopColor="#fff" stopOpacity="1"/>
      <stop offset="0.5" stopColor="#fff" stopOpacity="0.85"/>
      <stop offset="1" stopColor="#fff" stopOpacity="0"/>
      </radialGradient>
      <mask id={`${p}vm`} maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height="560"><rect width="1440" height="560" fill={`url(#${p}vg)`}/></mask>
      </defs>
      <g mask={`url(#${p}vm)`}>
      <rect width="1440" height="560" fill={`url(#${p}dots)`}/>
      <g stroke="#1B2B26" strokeOpacity="0.12" strokeWidth="1" fill="none"><path d="M80 0 V560"/><path d="M240 0 V560"/><path d="M400 0 V560"/><path d="M560 0 V560"/><path d="M720 0 V560"/><path d="M880 0 V560"/><path d="M1040 0 V560"/><path d="M1200 0 V560"/><path d="M1360 0 V560"/><path d="M0 140 H1440"/><path d="M0 300 H1440"/><path d="M0 460 H1440"/></g>
      <g stroke="#1B2B26" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 5" fill="none"><path d="M0 0 V560"/><path d="M160 0 V560"/><path d="M320 0 V560"/><path d="M480 0 V560"/><path d="M640 0 V560"/><path d="M800 0 V560"/><path d="M960 0 V560"/><path d="M1120 0 V560"/><path d="M1280 0 V560"/><path d="M1440 0 V560"/><path d="M0 60 H1440"/><path d="M0 220 H1440"/><path d="M0 380 H1440"/><path d="M0 540 H1440"/></g>
      <rect x="76" y="296" width="8" height="8" fill="#C2CCC7"/><rect x="1356" y="296" width="8" height="8" fill="#C2CCC7"/><rect x="76" y="136" width="8" height="8" fill="#C2CCC7"/><rect x="1356" y="136" width="8" height="8" fill="#C2CCC7"/><rect x="236" y="456" width="8" height="8" fill="#C2CCC7"/><rect x="1196" y="456" width="8" height="8" fill="#C2CCC7"/>
      </g>
      {/* ось через вершину V */}
      <path d="M600 300 H1000" stroke="#1B2B26" strokeOpacity="0.28" strokeWidth="1" strokeDasharray="14 4 2 4" fill="none"/>
      <path d="M560 300 H680" stroke="#6F8A7E" strokeOpacity="0.6" strokeWidth="2" fill="none"/>
      <path d="M770 300 H878" stroke="#6F8A7E" strokeOpacity="0.75" strokeWidth="2.4" fill="none"/>
      <circle cx="878" cy="300" r="5" fill="#4C6A5C"/>
      <path d="M720 0 V300" stroke="#1B2B26" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="3 4" fill="none"/>
      <g fill="none" stroke="#8A9A6A" strokeOpacity="0.5" strokeWidth="0.9">
      <circle cx="720" cy="300" r="24"/><circle cx="720" cy="300" r="38"/><circle cx="720" cy="300" r="52"/>
      <path d="M720 236 V364 M656 300 H784"/>
      </g>
      <path id={`${p}hl0`} d="M470 166.0 L577.6 166.0 L720.0 341.2 L862.4 166.0 L1010 166.0" fill="none" stroke={`url(#${p}g0)`} strokeWidth="1.0" strokeLinejoin="miter"/><path id={`${p}hl1`} d="M380 157.0 L581.9 157.0 L720.0 327.0 L858.1 157.0 L1110 157.0" fill="none" stroke={`url(#${p}g1)`} strokeWidth="1.2" strokeLinejoin="miter" strokeDasharray="5 3"/><path id={`${p}hl2`} d="M300 149.0 L585.7 149.0 L720.0 314.3 L854.3 149.0 L1200 149.0" fill="none" stroke={`url(#${p}g2)`} strokeWidth="1.0" strokeLinejoin="miter"/><path id={`${p}hl3`} d="M150 140.0 L590.0 140.0 L720.0 300.0 L850.0 140.0 L1300 140.0" fill="none" stroke={`url(#${p}g3)`} strokeWidth="2.4" strokeLinejoin="miter"/><path id={`${p}hl4`} d="M230 133.0 L593.3 133.0 L720.0 288.9 L846.7 133.0 L1260 133.0" fill="none" stroke={`url(#${p}g4)`} strokeWidth="2.0" strokeLinejoin="miter"/><path id={`${p}hl5`} d="M340 125.0 L597.1 125.0 L720.0 276.2 L842.9 125.0 L1140 125.0" fill="none" stroke={`url(#${p}g5)`} strokeWidth="1.0" strokeLinejoin="miter" strokeDasharray="1.5 3"/><path id={`${p}hl6`} d="M440 116.0 L601.4 116.0 L720.0 261.9 L838.6 116.0 L1060 116.0" fill="none" stroke={`url(#${p}g6)`} strokeWidth="1.0" strokeLinejoin="miter"/>
      <path d="M1018.0 162.0 V170.0M1021.5 162.0 V170.0M1025.0 162.0 V170.0M1028.5 162.0 V170.0M1032.0 162.0 V170.0M1035.5 162.0 V170.0M1039.0 162.0 V170.0" stroke="#A9B8B1" strokeOpacity="0.55" strokeWidth="1" fill="none"/><circle cx="632" cy="166.0" r="2.8" fill="#EDF2F0" stroke="#A9B8B1" strokeWidth="1.4"/><circle cx="848" cy="166.0" r="2.8" fill="#EDF2F0" stroke="#A9B8B1" strokeWidth="1.4"/><path d="M372.0 153.0 V161.0M368.5 153.0 V161.0M365.0 153.0 V161.0M361.5 153.0 V161.0M358.0 153.0 V161.0M354.5 153.0 V161.0M351.0 153.0 V161.0" stroke="#6F8A7E" strokeOpacity="0.55" strokeWidth="1" fill="none"/><circle cx="541" cy="157.0" r="2.8" fill="#EDF2F0" stroke="#6F8A7E" strokeWidth="1.4"/><circle cx="964" cy="157.0" r="2.8" fill="#EDF2F0" stroke="#6F8A7E" strokeWidth="1.4"/><path d="M142.0 136.0 V144.0M138.5 136.0 V144.0M135.0 136.0 V144.0M131.5 136.0 V144.0M128.0 136.0 V144.0M124.5 136.0 V144.0M121.0 136.0 V144.0" stroke="#0B5C47" strokeOpacity="0.55" strokeWidth="1" fill="none"/><path d="M1308.0 136.0 V144.0M1311.5 136.0 V144.0M1315.0 136.0 V144.0M1318.5 136.0 V144.0M1322.0 136.0 V144.0M1325.5 136.0 V144.0M1329.0 136.0 V144.0" stroke="#0B5C47" strokeOpacity="0.55" strokeWidth="1" fill="none"/><path d="M1148.0 121.0 V129.0M1151.5 121.0 V129.0M1155.0 121.0 V129.0M1158.5 121.0 V129.0M1162.0 121.0 V129.0M1165.5 121.0 V129.0M1169.0 121.0 V129.0" stroke="#6F8A7E" strokeOpacity="0.55" strokeWidth="1" fill="none"/><circle cx="564" cy="125.0" r="2.8" fill="#EDF2F0" stroke="#6F8A7E" strokeWidth="1.4"/><circle cx="1012" cy="125.0" r="2.8" fill="#EDF2F0" stroke="#6F8A7E" strokeWidth="1.4"/><path d="M432.0 112.0 V120.0M428.5 112.0 V120.0M425.0 112.0 V120.0M421.5 112.0 V120.0M418.0 112.0 V120.0M414.5 112.0 V120.0M411.0 112.0 V120.0" stroke="#A9B8B1" strokeOpacity="0.55" strokeWidth="1" fill="none"/><circle cx="564" cy="116.0" r="2.8" fill="#EDF2F0" stroke="#A9B8B1" strokeWidth="1.4"/><circle cx="874" cy="116.0" r="2.8" fill="#EDF2F0" stroke="#A9B8B1" strokeWidth="1.4"/><path d="M250 157 h22 M280 157 h4 M290 157 h4" stroke="#6F8A7E" strokeOpacity="0.6" strokeWidth="1" fill="none"/><path d="M360 166 h22 M390 166 h4 M400 166 h4" stroke="#A9B8B1" strokeOpacity="0.6" strokeWidth="1" fill="none"/><path d="M1180 125 h22 M1210 125 h4 M1220 125 h4" stroke="#6F8A7E" strokeOpacity="0.6" strokeWidth="1" fill="none"/><path d="M1130 116 h22 M1160 116 h4 M1170 116 h4" stroke="#A9B8B1" strokeOpacity="0.6" strokeWidth="1" fill="none"/><path d="M1262 149 h22 M1292 149 h4 M1302 149 h4" stroke="#A9B8B1" strokeOpacity="0.6" strokeWidth="1" fill="none"/>
      <circle className="hero-flow" r="3.2" fill="#EDF2F0" stroke="#0B5C47" strokeWidth="1.5" opacity="0"><animateMotion dur="11s" begin="0s" repeatCount="indefinite"><mpath href={`#${p}hl3`}/></animateMotion><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="11s" begin="0s" repeatCount="indefinite"/></circle><circle className="hero-flow" r="3.2" fill="#EDF2F0" stroke="#0B5C47" strokeWidth="1.5" opacity="0"><animateMotion dur="11s" begin="5.5s" repeatCount="indefinite"><mpath href={`#${p}hl3`}/></animateMotion><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="11s" begin="5.5s" repeatCount="indefinite"/></circle><circle className="hero-flow" r="3.2" fill="#EDF2F0" stroke="#0B5C47" strokeWidth="1.5" opacity="0"><animateMotion dur="13s" begin="2s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear"><mpath href={`#${p}hl4`}/></animateMotion><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="13s" begin="2s" repeatCount="indefinite"/></circle><circle className="hero-flow" r="3.2" fill="#EDF2F0" stroke="#6F8A7E" strokeWidth="1.5" opacity="0"><animateMotion dur="15s" begin="1s" repeatCount="indefinite"><mpath href={`#${p}hl1`}/></animateMotion><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="15s" begin="1s" repeatCount="indefinite"/></circle><circle className="hero-flow" r="3.2" fill="#EDF2F0" stroke="#6F8A7E" strokeWidth="1.5" opacity="0"><animateMotion dur="16s" begin="7s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear"><mpath href={`#${p}hl5`}/></animateMotion><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="16s" begin="7s" repeatCount="indefinite"/></circle><circle className="hero-flow" r="3.2" fill="#EDF2F0" stroke="#A9B8B1" strokeWidth="1.5" opacity="0"><animateMotion dur="14s" begin="3s" repeatCount="indefinite"><mpath href={`#${p}hl0`}/></animateMotion><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="14s" begin="3s" repeatCount="indefinite"/></circle><circle className="hero-flow" r="3.2" fill="#EDF2F0" stroke="#A9B8B1" strokeWidth="1.5" opacity="0"><animateMotion dur="12s" begin="9s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear"><mpath href={`#${p}hl2`}/></animateMotion><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="12s" begin="9s" repeatCount="indefinite"/></circle><circle className="hero-flow" r="3.2" fill="#EDF2F0" stroke="#A9B8B1" strokeWidth="1.5" opacity="0"><animateMotion dur="17s" begin="4s" repeatCount="indefinite"><mpath href={`#${p}hl6`}/></animateMotion><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="17s" begin="4s" repeatCount="indefinite"/></circle>
      <path d="M720 342 V380" fill="none" stroke="#0B5C47" strokeOpacity="0.55" strokeWidth="1.6"/>
      <circle cx="720" cy="300" r="7" fill="#3C5A4B"/>
    </svg>
  );
}
