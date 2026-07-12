import React, { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

// ---------------------------------------------------------------
// Embedded dataset (aggregated from a synthetic 2-year sales ledger,
// 15,254 orders across 5 regions, 5 categories, 4 channels)
// ---------------------------------------------------------------
const DATA = {
  kpis: { total_revenue: 2436209.77, total_profit: 913256.86, total_orders: 15254, avg_order_value: 159.71, margin_pct: 37.49, yoy_growth: 10.88 },
  monthly_trend: [
    { month: "2024-01", revenue: 73702.89, profit: 27852.08, orders: 481 },
    { month: "2024-02", revenue: 81376.97, profit: 30702.91, orders: 501 },
    { month: "2024-03", revenue: 92744.03, profit: 34696.66, orders: 587 },
    { month: "2024-04", revenue: 88524.73, profit: 33503.32, orders: 556 },
    { month: "2024-05", revenue: 94251.42, profit: 35326.18, orders: 589 },
    { month: "2024-06", revenue: 87118.81, profit: 32731.28, orders: 538 },
    { month: "2024-07", revenue: 81542.61, profit: 30600.79, orders: 492 },
    { month: "2024-08", revenue: 90286.94, profit: 33660.46, orders: 572 },
    { month: "2024-09", revenue: 92131.47, profit: 34376.73, orders: 589 },
    { month: "2024-10", revenue: 91272.49, profit: 34238.87, orders: 555 },
    { month: "2024-11", revenue: 134160.86, profit: 50046.48, orders: 857 },
    { month: "2024-12", revenue: 148171.69, profit: 55038.98, orders: 919 },
    { month: "2025-01", revenue: 89991.42, profit: 33874.30, orders: 582 },
    { month: "2025-02", revenue: 86496.27, profit: 32441.07, orders: 542 },
    { month: "2025-03", revenue: 101349.46, profit: 37910.60, orders: 652 },
    { month: "2025-04", revenue: 100010.54, profit: 37460.37, orders: 624 },
    { month: "2025-05", revenue: 108487.11, profit: 40551.94, orders: 653 },
    { month: "2025-06", revenue: 95714.53, profit: 36073.17, orders: 574 },
    { month: "2025-07", revenue: 86678.22, profit: 32158.49, orders: 540 },
    { month: "2025-08", revenue: 105487.47, profit: 39463.74, orders: 675 },
    { month: "2025-09", revenue: 99378.21, profit: 37354.31, orders: 630 },
    { month: "2025-10", revenue: 98247.97, profit: 36789.75, orders: 609 },
    { month: "2025-11", revenue: 157340.90, profit: 59455.03, orders: 961 },
    { month: "2025-12", revenue: 151742.76, profit: 56949.35, orders: 976 },
  ],
  category_data: [
    { category: "Electronics", revenue: 618991.40, profit: 231825.27, orders: 3114 },
    { category: "Home & Kitchen", revenue: 519687.71, profit: 195114.85, orders: 3045 },
    { category: "Apparel", revenue: 475186.66, profit: 178672.55, orders: 2987 },
    { category: "Office", revenue: 427005.37, profit: 159384.46, orders: 3071 },
    { category: "Beauty", revenue: 395338.63, profit: 148259.73, orders: 3037 },
  ],
  region_data: [
    { region: "North", revenue: 538494.46, profit: 202568.89, orders: 3353 },
    { region: "West", revenue: 528645.09, profit: 197697.88, orders: 3291 },
    { region: "South", revenue: 481907.46, profit: 180870.71, orders: 3087 },
    { region: "East", revenue: 464383.85, profit: 173333.33, orders: 2892 },
    { region: "Central", revenue: 422778.91, profit: 158786.05, orders: 2631 },
  ],
  channel_data: [
    { channel: "Online", revenue: 1025257.91, orders: 6388 },
    { channel: "Retail Store", revenue: 675162.43, orders: 4226 },
    { channel: "Marketplace", revenue: 540900.32, orders: 3407 },
    { channel: "Wholesale", revenue: 194889.11, orders: 1233 },
  ],
  top_products: [
    { product: "Smart Watch", category: "Electronics", revenue: 196192.81, profit: 73430.56, units: 847 },
    { product: "Denim Jacket", category: "Apparel", revenue: 190783.33, profit: 72030.67, units: 813 },
    { product: "Blender", category: "Home & Kitchen", revenue: 174421.58, profit: 65775.28, units: 826 },
    { product: "Yoga Pants", category: "Apparel", revenue: 169281.33, profit: 63267.86, units: 828 },
    { product: "Bluetooth Speaker", category: "Electronics", revenue: 164569.16, profit: 61530.04, units: 907 },
    { product: "Vacuum Cleaner", category: "Home & Kitchen", revenue: 144268.13, profit: 54151.60, units: 822 },
    { product: "Cookware Set", category: "Home & Kitchen", revenue: 137806.76, profit: 51441.37, units: 917 },
    { product: "Ergo Chair", category: "Office", revenue: 129968.85, profit: 48506.73, units: 846 },
    { product: "Laptop Stand", category: "Electronics", revenue: 126022.14, profit: 47146.11, units: 836 },
    { product: "Makeup Kit", category: "Beauty", revenue: 112605.48, profit: 42416.78, units: 842 },
  ],
  segment_data: [
    { segment: "Consumer", revenue: 1351764.03, orders: 8505 },
    { segment: "Small Business", revenue: 701644.99, orders: 4417 },
    { segment: "Enterprise", revenue: 382800.75, orders: 2332 },
  ],
  weekday_data: [
    { weekday: "Mon", revenue: 335338.42 },
    { weekday: "Tue", revenue: 333210.54 },
    { weekday: "Wed", revenue: 337325.84 },
    { weekday: "Thu", revenue: 322201.70 },
    { weekday: "Fri", revenue: 335938.08 },
    { weekday: "Sat", revenue: 379399.24 },
    { weekday: "Sun", revenue: 392795.95 },
  ],
  heatmap: {
    regions: ["Central", "East", "North", "South", "West"],
    categories: ["Apparel", "Beauty", "Electronics", "Home & Kitchen", "Office"],
    matrix: [
      [73862, 67506, 109287, 94437, 77686],
      [90850, 74533, 124463, 96761, 77777],
      [102155, 85740, 140628, 113615, 96357],
      [94772, 79010, 114288, 106572, 87264],
      [113547, 88550, 130325, 108302, 87921],
    ],
  },
};

const PALETTE = {
  bg: "#101B18",
  panel: "#16231F",
  panelBorder: "#2B3B34",
  gold: "#C89B4A",
  mint: "#6FA895",
  rose: "#B4614C",
  steel: "#7C93B0",
  violet: "#A98BC4",
  text: "#EDE7D8",
  muted: "#8FA39B",
};

const CAT_COLORS = {
  "Electronics": PALETTE.gold,
  "Home & Kitchen": PALETTE.mint,
  "Apparel": PALETTE.rose,
  "Office": PALETTE.steel,
  "Beauty": PALETTE.violet,
};

const fmtMoney = (v, compact = true) => {
  if (compact) {
    if (Math.abs(v) >= 1_000_000) return "$" + (v / 1_000_000).toFixed(2) + "M";
    if (Math.abs(v) >= 1_000) return "$" + (v / 1_000).toFixed(1) + "K";
  }
  return "$" + v.toLocaleString(undefined, { maximumFractionDigits: 0 });
};

const monthLabel = (m) => {
  const [y, mo] = m.split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return names[parseInt(mo, 10) - 1] + " '" + y.slice(2);
};

function EyebrowLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 11,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: PALETTE.muted,
      marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

function Panel({ children, style }) {
  return (
    <div style={{
      background: PALETTE.panel,
      border: `1px solid ${PALETTE.panelBorder}`,
      borderRadius: 4,
      padding: "22px 24px",
      ...style,
    }}>
      {children}
    </div>
  );
}

function CustomTooltip({ active, payload, label, moneyKeys = [] }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: "#0C1512",
      border: `1px solid ${PALETTE.panelBorder}`,
      borderRadius: 3,
      padding: "10px 14px",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 12,
      color: PALETTE.text,
    }}>
      <div style={{ color: PALETTE.muted, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginTop: 2 }}>
          {p.name}: {moneyKeys.includes(p.dataKey) ? fmtMoney(p.value, false) : p.value.toLocaleString()}
        </div>
      ))}
    </div>
  );
}

export default function SalesDashboard() {
  const [metric, setMetric] = useState("revenue"); // revenue | profit
  const [hoveredCat, setHoveredCat] = useState(null);

  const kpis = DATA.kpis;

  const kpiList = [
    { label: "Total Revenue", value: fmtMoney(kpis.total_revenue), sub: "FY24–FY25" },
    { label: "Total Profit", value: fmtMoney(kpis.total_profit), sub: kpis.margin_pct.toFixed(1) + "% margin" },
    { label: "Orders", value: kpis.total_orders.toLocaleString(), sub: "fulfilled" },
    { label: "Avg Order Value", value: "$" + kpis.avg_order_value.toFixed(2), sub: "per order" },
    { label: "YoY Growth", value: (kpis.yoy_growth >= 0 ? "+" : "") + kpis.yoy_growth.toFixed(1) + "%", sub: "2025 vs 2024", accent: kpis.yoy_growth >= 0 ? PALETTE.mint : PALETTE.rose },
  ];

  const maxCategoryRevenue = Math.max(...DATA.category_data.map(d => d[metric]));
  const maxRegionRevenue = Math.max(...DATA.region_data.map(d => d[metric]));
  const maxChannelRevenue = Math.max(...DATA.channel_data.map(d => d.revenue));
  const maxSegmentRevenue = Math.max(...DATA.segment_data.map(d => d.revenue));

  const heatmapFlat = DATA.heatmap.matrix.flat();
  const heatMax = Math.max(...heatmapFlat);
  const heatMin = Math.min(...heatmapFlat);

  return (
    <div style={{
      background: PALETTE.bg,
      minHeight: "100vh",
      color: PALETTE.text,
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: "36px 28px 60px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .ledger-row:hover { background: rgba(200,155,74,0.06); }
        .toggle-btn { transition: all 0.15s ease; }
      `}</style>

      {/* ---- Header ---- */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        borderBottom: `1px solid ${PALETTE.panelBorder}`, paddingBottom: 20, marginBottom: 28,
        flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.18em",
            color: PALETTE.gold, textTransform: "uppercase", marginBottom: 6,
          }}>
            Sales Ledger · FY24 – FY25
          </div>
          <h1 style={{
            fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 34, margin: 0,
            letterSpacing: "-0.01em",
          }}>
            Retail Performance Dashboard
          </h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["revenue", "profit"].map(m => (
            <button
              key={m}
              className="toggle-btn"
              onClick={() => setMetric(m)}
              style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.05em",
                textTransform: "uppercase", padding: "8px 16px", borderRadius: 3, cursor: "pointer",
                border: `1px solid ${metric === m ? PALETTE.gold : PALETTE.panelBorder}`,
                background: metric === m ? "rgba(200,155,74,0.12)" : "transparent",
                color: metric === m ? PALETTE.gold : PALETTE.muted,
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* ---- KPI ledger strip ---- */}
      <div style={{
        display: "flex", flexWrap: "wrap", marginBottom: 28,
        border: `1px solid ${PALETTE.panelBorder}`, borderRadius: 4, background: PALETTE.panel,
      }}>
        {kpiList.map((k, i) => (
          <div key={i} style={{
            flex: "1 1 160px", padding: "18px 22px",
            borderRight: i < kpiList.length - 1 ? `1px solid ${PALETTE.panelBorder}` : "none",
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: "0.1em",
              textTransform: "uppercase", color: PALETTE.muted, marginBottom: 8,
            }}>
              {k.label}
            </div>
            <div style={{
              fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 600,
              color: k.accent || PALETTE.text,
            }}>
              {k.value}
            </div>
            <div style={{ fontSize: 11.5, color: PALETTE.muted, marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ---- Row 1: trend + category ---- */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        <Panel>
          <EyebrowLabel>Monthly {metric} trend</EyebrowLabel>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={DATA.monthly_trend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PALETTE.gold} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={PALETTE.gold} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={PALETTE.panelBorder} vertical={false} />
              <XAxis
                dataKey="month" tickFormatter={monthLabel} interval={1}
                tick={{ fill: PALETTE.muted, fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace" }}
                axisLine={{ stroke: PALETTE.panelBorder }} tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => fmtMoney(v)}
                tick={{ fill: PALETTE.muted, fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace" }}
                axisLine={false} tickLine={false} width={54}
              />
              <Tooltip content={<CustomTooltip moneyKeys={[metric]} />} labelFormatter={monthLabel} />
              <Area type="monotone" dataKey={metric} stroke={PALETTE.gold} strokeWidth={2} fill="url(#areaFill)" name={metric === "revenue" ? "Revenue" : "Profit"} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel>
          <EyebrowLabel>{metric} by category</EyebrowLabel>
          <div>
            {DATA.category_data
              .slice()
              .sort((a, b) => b[metric] - a[metric])
              .map((c) => (
                <div
                  key={c.category}
                  onMouseEnter={() => setHoveredCat(c.category)}
                  onMouseLeave={() => setHoveredCat(null)}
                  style={{ marginBottom: 14, cursor: "default" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
                    <span style={{ color: hoveredCat === c.category ? PALETTE.text : PALETTE.muted }}>{c.category}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: PALETTE.text }}>{fmtMoney(c[metric])}</span>
                  </div>
                  <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
                    <div style={{
                      height: "100%", width: (c[metric] / maxCategoryRevenue * 100) + "%",
                      background: CAT_COLORS[c.category], borderRadius: 2,
                      opacity: hoveredCat && hoveredCat !== c.category ? 0.4 : 1,
                      transition: "opacity 0.15s ease, width 0.3s ease",
                    }} />
                  </div>
                </div>
              ))}
          </div>
        </Panel>
      </div>

      {/* ---- Row 2: region + channel + segment ---- */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
        <Panel>
          <EyebrowLabel>{metric} by region</EyebrowLabel>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={DATA.region_data.slice().sort((a,b) => b[metric]-a[metric])} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid stroke={PALETTE.panelBorder} horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => fmtMoney(v)} tick={{ fill: PALETTE.muted, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="region" type="category" tick={{ fill: PALETTE.text, fontSize: 12 }} axisLine={false} tickLine={false} width={62} />
              <Tooltip content={<CustomTooltip moneyKeys={[metric]} />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey={metric} fill={PALETTE.mint} radius={[0, 3, 3, 0]} name={metric === "revenue" ? "Revenue" : "Profit"} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel>
          <EyebrowLabel>Revenue by channel</EyebrowLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 6 }}>
            {DATA.channel_data.map((c, i) => (
              <div key={c.channel}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: PALETTE.muted }}>{c.channel}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmtMoney(c.revenue)}</span>
                </div>
                <div style={{ height: 7, background: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
                  <div style={{
                    height: "100%", width: (c.revenue / maxChannelRevenue * 100) + "%",
                    background: [PALETTE.gold, PALETTE.mint, PALETTE.steel, PALETTE.rose][i],
                    borderRadius: 2,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <EyebrowLabel>Revenue by segment</EyebrowLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 6 }}>
            {DATA.segment_data.map((s, i) => (
              <div key={s.segment}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: PALETTE.muted }}>{s.segment}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmtMoney(s.revenue)}</span>
                </div>
                <div style={{ height: 7, background: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
                  <div style={{
                    height: "100%", width: (s.revenue / maxSegmentRevenue * 100) + "%",
                    background: [PALETTE.violet, PALETTE.steel, PALETTE.gold][i],
                    borderRadius: 2,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* ---- Row 3: top products table + weekday pattern ---- */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 20 }}>
        <Panel>
          <EyebrowLabel>Top 10 products by revenue</EyebrowLabel>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${PALETTE.panelBorder}` }}>
                {["#", "Product", "Category", "Revenue", "Profit", "Units"].map((h, i) => (
                  <th key={h} style={{
                    textAlign: i >= 3 ? "right" : "left", padding: "6px 8px",
                    color: PALETTE.muted, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DATA.top_products.map((p, i) => (
                <tr key={p.product} className="ledger-row" style={{ borderBottom: `1px solid ${PALETTE.panelBorder}` }}>
                  <td style={{ padding: "8px", color: PALETTE.muted, fontFamily: "'JetBrains Mono', monospace" }}>{i + 1}</td>
                  <td style={{ padding: "8px" }}>{p.product}</td>
                  <td style={{ padding: "8px" }}>
                    <span style={{
                      fontSize: 10.5, padding: "2px 8px", borderRadius: 10,
                      background: CAT_COLORS[p.category] + "22", color: CAT_COLORS[p.category],
                    }}>{p.category}</span>
                  </td>
                  <td style={{ padding: "8px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmtMoney(p.revenue)}</td>
                  <td style={{ padding: "8px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: PALETTE.mint }}>{fmtMoney(p.profit)}</td>
                  <td style={{ padding: "8px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: PALETTE.muted }}>{p.units.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel>
          <EyebrowLabel>Revenue by weekday</EyebrowLabel>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={DATA.weekday_data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid stroke={PALETTE.panelBorder} vertical={false} />
              <XAxis dataKey="weekday" tick={{ fill: PALETTE.muted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.panelBorder }} tickLine={false} />
              <YAxis tickFormatter={(v) => fmtMoney(v)} tick={{ fill: PALETTE.muted, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} width={50} />
              <Tooltip content={<CustomTooltip moneyKeys={["revenue"]} />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="revenue" radius={[3, 3, 0, 0]} name="Revenue">
                {DATA.weekday_data.map((d, i) => (
                  <Cell key={i} fill={i >= 5 ? PALETTE.gold : PALETTE.steel} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 11, color: PALETTE.muted, marginTop: 8 }}>
            Weekends (gold) outsell weekdays by ~15% on average.
          </div>
        </Panel>
      </div>

      {/* ---- Row 4: heatmap ---- */}
      <Panel>
        <EyebrowLabel>Revenue heatmap — region × category</EyebrowLabel>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 560 }}>
            <thead>
              <tr>
                <th style={{ padding: "6px 10px" }}></th>
                {DATA.heatmap.categories.map(cat => (
                  <th key={cat} style={{
                    padding: "6px 10px", fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
                    color: PALETTE.muted, textTransform: "uppercase", letterSpacing: "0.04em",
                  }}>{cat}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DATA.heatmap.regions.map((region, ri) => (
                <tr key={region}>
                  <td style={{
                    padding: "6px 10px", fontSize: 12.5, color: PALETTE.text,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>{region}</td>
                  {DATA.heatmap.categories.map((cat, ci) => {
                    const val = DATA.heatmap.matrix[ri][ci];
                    const t = (val - heatMin) / (heatMax - heatMin);
                    const alpha = 0.12 + t * 0.75;
                    return (
                      <td key={cat} style={{ padding: 4 }}>
                        <div style={{
                          background: `rgba(200,155,74,${alpha})`,
                          borderRadius: 3, padding: "10px 6px", textAlign: "center",
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5,
                          color: t > 0.55 ? "#101B18" : PALETTE.text,
                          fontWeight: t > 0.55 ? 600 : 400,
                        }}>
                          {fmtMoney(val)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div style={{ textAlign: "center", fontSize: 11, color: PALETTE.muted, marginTop: 28, fontFamily: "'JetBrains Mono', monospace" }}>
        Synthetic dataset · 15,254 orders · Jan 2024 – Dec 2025 · Generated for demonstration
      </div>
    </div>
  );
}
