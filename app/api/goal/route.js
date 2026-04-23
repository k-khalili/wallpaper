import { ImageResponse } from "next/og";
import { resolveConfig } from "./config.js";

export const runtime = "edge";

// How many milliseconds are in one "unit" of progress.
const UNIT_MS = {
  day:   1000 * 60 * 60 * 24,
  week:  1000 * 60 * 60 * 24 * 7,
  month: 1000 * 60 * 60 * 24 * 30, // approximate; fine for visual grids
};

function borderRadiusFor(shape, dotSize) {
  if (shape === "square")  return 0;
  if (shape === "rounded") return Math.round(dotSize * 0.25);
  return "50%"; // circle (default)
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const cfg = resolveConfig(searchParams);

  // ---- Resolve inputs ----------------------------------------------------
  const { label, startDate, goalDate } = cfg.goal;
  const { width, height, cols, dotSizeRatio, gapRatio, shape } = cfg.layout;
  const { background, pastColor, currentColor, futureColor, labelColor,
          remainingColor, remainingSuffixColor, percentColor } = cfg.theme;
  const { fontFamily, labelSizeRatio, footerSizeRatio,
          labelWeight, numberWeight } = cfg.typography;
  const { remainingSuffix, showPercent, percentSuffix } = cfg.labels;

  // ---- Count progress in whichever unit the user picked ------------------
  const unitMs = UNIT_MS[cfg.unit] || UNIT_MS.week;
  const start = new Date(startDate + "T00:00:00Z");
  const end   = new Date(goalDate  + "T00:00:00Z");
  const now   = new Date();

  const totalUnits = Math.max(1, Math.ceil((end - start) / unitMs));
  const elapsed    = Math.min(Math.max(Math.floor((now - start) / unitMs), 0), totalUnits);
  const remaining  = totalUnits - elapsed;
  const pct        = Math.round((elapsed / totalUnits) * 100);

  // ---- Build the dot grid -----------------------------------------------
  const rowCount = Math.ceil(totalUnits / cols);
  const dotSize  = Math.round(width * dotSizeRatio);
  const gap      = Math.round(dotSize * gapRatio);
  const radius   = borderRadiusFor(shape, dotSize);

  const rows = [];
  for (let r = 0; r < rowCount; r++) {
    const rowDots = [];
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      if (i >= totalUnits) {
        rowDots.push(
          <div
            key={`${r}-${c}`}
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: radius,
              backgroundColor: "transparent",
            }}
          />
        );
        continue;
      }
      let color;
      if (i < elapsed)        color = pastColor;
      else if (i === elapsed) color = currentColor;
      else                    color = futureColor;

      rowDots.push(
        <div
          key={`${r}-${c}`}
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: radius,
            backgroundColor: color,
          }}
        />
      );
    }
    rows.push(
      <div
        key={`row-${r}`}
        style={{
          display: "flex",
          flexDirection: "row",
          gap: gap,
          justifyContent: "center",
        }}
      >
        {rowDots}
      </div>
    );
  }

  // ---- Render ------------------------------------------------------------
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: background,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fontFamily,
        }}
      >
        <div
          style={{
            color: labelColor,
            fontSize: Math.round(width * labelSizeRatio),
            fontWeight: labelWeight,
            marginBottom: Math.round(height * 0.025),
          }}
        >
          {label}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: gap,
            alignItems: "center",
          }}
        >
          {rows}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: gap,
            marginTop: Math.round(height * 0.028),
          }}
        >
          <span
            style={{
              color: remainingColor,
              fontSize: Math.round(width * footerSizeRatio),
              fontWeight: numberWeight,
            }}
          >
            {remaining}{remainingSuffix ? " " + remainingSuffix.split(" ")[0] : ""}
          </span>
          {remainingSuffix && remainingSuffix.includes(" ") && (
            <span
              style={{
                color: remainingSuffixColor,
                fontSize: Math.round(width * footerSizeRatio),
              }}
            >
              {remainingSuffix.split(" ").slice(1).join(" ")}
            </span>
          )}
          {showPercent && (
            <span
              style={{
                color: percentColor,
                fontSize: Math.round(width * footerSizeRatio),
                fontWeight: labelWeight,
              }}
            >
              {pct}{percentSuffix}
            </span>
          )}
        </div>
      </div>
    ),
    { width, height }
  );
}
