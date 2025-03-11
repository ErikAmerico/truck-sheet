import * as React from "react";
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from "@mui/x-charts/Gauge";

function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) {
    // No value to display
    return null;
  }

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="red" />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke="red"
        strokeWidth={3}
      />
    </g>
  );
}

function convertToPercentage(value: number): number {
  return (value / 8) * 100;
}

export default function FuelGauge({ value }: { value: number }) {
  const percentageValue = convertToPercentage(value);

  return (
    <GaugeContainer
      width={52.2}
      height={52.2}
      startAngle={-110}
      endAngle={110}
      value={percentageValue}
    >
      <GaugeReferenceArc
        style={{ stroke: "red", fill: "rgba(84, 190, 255, 0.31)" }}
      />
      <GaugeValueArc
        style={{
          stroke: "rgba(9, 159, 255, 0.5)",
          fill: "rgba(9, 161, 255, 0.91)",
        }}
      />
      <GaugePointer />
    </GaugeContainer>
  );
}
