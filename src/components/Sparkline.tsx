import React from "react";
import { PricePoint } from "../types";

interface SparklineProps {
  data: PricePoint[];
  width?: number;
  height?: number;
  isPositiveChange?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 240,
  height = 42,
  isPositiveChange = false,
}) => {
  if (!data || data.length < 2) {
    return <div style={{ height, color: "var(--text-dim)", fontSize: "0.75rem" }}>No history</div>;
  }

  const prices = data.map((d) => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const points = data.map((d, index) => {
    const x = (index / (data.length - 1)) * (width - 16) + 8;
    const y = height - 10 - ((d.price - min) / range) * (height - 20);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;

  // Colors: If price went up (inflation), show warm red. If price fell or is steady, show fresh emerald green.
  const strokeColor = isPositiveChange ? "#ef4444" : "#10b981";
  const gradientId = `grad_${Math.random().toString(36).substring(2, 9)}`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
        </linearGradient>
      </defs>
      
      {/* Area fill */}
      <path
        d={`${pathD} L ${width - 8},${height} L 8,${height} Z`}
        fill={`url(#${gradientId})`}
      />

      {/* Main Sparkline stroke */}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Latest price endpoint dot */}
      {points.length > 0 && (
        <circle
          cx={points[points.length - 1].split(",")[0]}
          cy={points[points.length - 1].split(",")[1]}
          r="3.5"
          fill="#ffffff"
          stroke={strokeColor}
          strokeWidth="2"
        />
      )}
    </svg>
  );
};
