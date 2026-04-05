import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const goal = searchParams.get("goal") || "Graduation";
  const goalDate = searchParams.get("goal_date") || "2026-05-09";
  const startDate = searchParams.get("start_date") || "2024-01-01";
  const width = parseInt(searchParams.get("width") || "1320");
  const height = parseInt(searchParams.get("height") || "2868");
  const cols = parseInt(searchParams.get("cols") || "11");

  const start = new Date(startDate + "T00:00:00Z");
  const end = new Date(goalDate + "T00:00:00Z");
  const now = new Date();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;

  const totalWeeks = Math.ceil((end - start) / msPerWeek);
  const elapsed = Math.min(Math.max(Math.floor((now - start) / msPerWeek), 0), totalWeeks);
  const remaining = totalWeeks - elapsed;
  const pct = Math.round((elapsed / totalWeeks) * 100);

  const rowCount = Math.ceil(totalWeeks / cols);
  const dotSize = Math.round(width * 0.032);
  const gap = Math.round(dotSize * 0.6);

  // Build rows of dots
  const rows = [];
  for (let r = 0; r < rowCount; r++) {
    const rowDots = [];
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      if (i >= totalWeeks) {
        // Empty spacer to maintain grid alignment
        rowDots.push(
          <div
            key={`${r}-${c}`}
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              backgroundColor: "transparent",
            }}
          />
        );
        continue;
      }

      let color;
      if (i < elapsed) color = "#FFFFFF";
      else if (i === elapsed) color = "#E8633B";
      else color = "rgba(255,255,255,0.18)";

      rowDots.push(
        <div
          key={`${r}-${c}`}
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
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

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Goal label */}
        <div
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: Math.round(width * 0.038),
            fontWeight: 500,
            marginBottom: Math.round(height * 0.025),
          }}
        >
          {goal}
        </div>

        {/* Dot grid */}
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

        {/* Stats */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginTop: Math.round(height * 0.028),
          }}
        >
          <span
            style={{
              color: "#E8633B",
              fontSize: Math.round(width * 0.033),
              fontWeight: 600,
            }}
          >
            {remaining}w left
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: Math.round(width * 0.033),
            }}
          >
            ·
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: Math.round(width * 0.033),
              fontWeight: 500,
            }}
          >
            {pct}%
          </span>
        </div>
      </div>
    ),
    { width, height }
  );
}
