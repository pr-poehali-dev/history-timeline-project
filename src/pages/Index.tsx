import { useState, useRef, useEffect, useMemo } from "react";
import { rulers, events, eras, type Ruler, type HistoryEvent } from "@/data/historyData";

const YEAR_HEIGHT = 14;
const START_YEAR = 2026;
const END_YEAR = 862;
const TOTAL_YEARS = START_YEAR - END_YEAR;
const CARD_HEIGHT = 56; // минимальная высота карточки в px
const CARD_WIDTH = 260; // базовая ширина карточки
const DEPTH_STEP = 220; // шаг отступа для каждого уровня вложенности

function yearToOffset(year: number): number {
  return (START_YEAR - year) * YEAR_HEIGHT;
}

// Вычисляет depth (уровень вложенности) для каждого события на одной стороне
// чтобы карточки не перекрывали друг друга — как дерево каталогов
function computeDepths(sideEvents: (HistoryEvent & { index: number })[]): Map<number, number> {
  const sorted = [...sideEvents].sort((a, b) => b.year - a.year); // сверху вниз
  const depthMap = new Map<number, number>();
  // columns[depth] = нижняя граница последней карточки на этом уровне
  const columnBottom: number[] = [];

  for (const ev of sorted) {
    const top = yearToOffset(ev.year);
    let depth = 0;
    while (columnBottom[depth] !== undefined && top < columnBottom[depth] + 4) {
      depth++;
    }
    columnBottom[depth] = top + CARD_HEIGHT;
    depthMap.set(ev.index, depth);
  }
  return depthMap;
}

const categoryColors: Record<string, string> = {
  war: "#8B1A1A",
  culture: "#2D5A27",
  politics: "#1A2E5A",
  church: "#4A2060",
  expansion: "#5A3A00",
  reform: "#1A4A4A",
};

const categoryLabels: Record<string, string> = {
  war: "Война",
  culture: "Культура",
  politics: "Политика",
  church: "Церковь",
  expansion: "Расширение",
  reform: "Реформа",
};

function EventCard({ event, depth }: { event: HistoryEvent; depth: number }) {
  const [open, setOpen] = useState(false);
  const top = yearToOffset(event.year);
  const isLeft = event.side === "left";
  const color = categoryColors[event.category];

  // Чем глубже уровень — тем дальше от оси
  const offsetFromAxis = 24 + depth * DEPTH_STEP;
  const cardWidth = CARD_WIDTH;

  // Горизонтальный коннектор от оси к карточке
  const connectorWidth = offsetFromAxis - 12;

  return (
    <div
      className="absolute"
      style={{
        top: `${top}px`,
        left: isLeft ? `calc(50% - ${offsetFromAxis + cardWidth}px)` : `calc(50% + ${offsetFromAxis}px)`,
        width: `${cardWidth}px`,
        zIndex: 5,
      }}
    >
      {/* Горизонтальная линия-коннектор к оси */}
      {depth > 0 && (
        <div
          className="absolute"
          style={{
            top: "14px",
            [isLeft ? "right" : "left"]: `${-connectorWidth}px`,
            width: `${connectorWidth}px`,
            height: "1px",
            background: `${color}60`,
            pointerEvents: "none",
          }}
        />
      )}
      <div className={`flex ${isLeft ? "flex-row-reverse" : "flex-row"} items-start gap-1.5`}>
        <div
          className="flex-shrink-0 w-2 h-2 rounded-full mt-3"
          style={{
            background: color,
            boxShadow: `0 0 5px ${color}80`,
            minWidth: "8px",
          }}
        />
        <button onClick={() => setOpen(!open)} className="text-left w-full cursor-pointer">
          <div
            className="parchment-card transition-all duration-200 hover:shadow-xl"
            style={{
              borderLeft: isLeft ? `3px solid ${color}` : `1px solid rgba(139,90,43,0.2)`,
              borderRight: !isLeft ? `3px solid ${color}` : `1px solid rgba(139,90,43,0.2)`,
              borderTop: `1px solid rgba(139,90,43,0.2)`,
              borderBottom: `1px solid rgba(139,90,43,0.2)`,
            }}
          >
            <span
              style={{
                fontFamily: "Oswald, sans-serif",
                color: "#8B4513",
                fontSize: "13px",
                display: "block",
                lineHeight: 1.2,
              }}
            >
              {event.year} г.
            </span>
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "22px",
                color: "#2C1A0E",
                fontWeight: 700,
                lineHeight: 1.2,
                margin: "2px 0",
              }}
            >
              {event.title}
            </p>
            {open && (
              <p
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "13px",
                  color: "#4A3320",
                  fontStyle: "italic",
                  lineHeight: 1.45,
                  marginTop: "4px",
                  opacity: 0.9,
                }}
              >
                {event.description}
              </p>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}

function RulerBadge({ ruler }: { ruler: Ruler }) {
  const top = yearToOffset(ruler.yearStart);
  const height = (ruler.yearStart - ruler.yearEnd) * YEAR_HEIGHT;
  const [hover, setHover] = useState(false);

  const eraColor =
    eras.find((e) => ruler.yearStart >= e.yearStart && ruler.yearStart < e.yearEnd)?.color ||
    "#8B4513";

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2"
      style={{
        top: `${top}px`,
        height: `${Math.max(height, 28)}px`,
        zIndex: 10,
        width: "116px",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative w-full flex flex-col items-center" style={{ height: "100%" }}>
        <div
          className="ruler-badge transition-all duration-200"
          style={{
            background: hover ? eraColor : "rgba(245,230,200,0.97)",
            border: `1px solid ${eraColor}`,
            color: hover ? "#F5E6C8" : "#2C1A0E",
            boxShadow: hover ? `0 4px 20px ${eraColor}60` : "0 1px 6px rgba(0,0,0,0.12)",
          }}
        >
          <span
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "22px",
              fontWeight: 700,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "108px",
              display: "block",
              textAlign: "center",
            }}
          >
            {ruler.name}
          </span>
          {height > 50 && (
            <span
              style={{
                fontFamily: "Oswald, sans-serif",
                fontSize: "16px",
                opacity: 0.65,
                display: "block",
                textAlign: "center",
                letterSpacing: "0.04em",
              }}
            >
              {ruler.yearStart}–{ruler.yearEnd}
            </span>
          )}
        </div>

        {hover && (
          <div
            className="absolute left-full ml-3 top-0"
            style={{ zIndex: 50, minWidth: "220px" }}
          >
            <div
              className="parchment-tooltip"
              style={{ borderLeft: `3px solid ${eraColor}` }}
            >
              <p
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#2C1A0E",
                  lineHeight: 1.2,
                }}
              >
                {ruler.name}
              </p>
              <p
                style={{
                  fontFamily: "Oswald, sans-serif",
                  fontSize: "9px",
                  color: eraColor,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "6px",
                  marginTop: "2px",
                }}
              >
                {ruler.title} · {ruler.yearStart}–{ruler.yearEnd}
              </p>
              <p
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "13px",
                  fontStyle: "italic",
                  color: "#4A3320",
                  lineHeight: 1.5,
                }}
              >
                {ruler.description}
              </p>
              <p
                style={{
                  fontFamily: "Oswald, sans-serif",
                  fontSize: "9px",
                  color: eraColor,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginTop: "6px",
                  opacity: 0.7,
                }}
              >
                {ruler.era}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const CENTURY_YEARS = Array.from(
  { length: Math.ceil(TOTAL_YEARS / 100) + 1 },
  (_, i) => START_YEAR - i * 100
).filter((y) => y >= END_YEAR && y <= START_YEAR);

const DECADE_TICKS = Array.from(
  { length: Math.ceil(TOTAL_YEARS / 10) + 1 },
  (_, i) => START_YEAR - i * 10
).filter((y) => y >= END_YEAR && y <= START_YEAR && y % 100 !== 0);

export default function Index() {
  const totalHeight = TOTAL_YEARS * YEAR_HEIGHT + 200;
  const [activeEra, setActiveEra] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  // Вычисляем глубину (depth) для каждого события отдельно по левой и правой стороне
  const depthMap = useMemo(() => {
    const leftEvents = events
      .filter((e) => e.side === "left")
      .map((e, i) => ({ ...e, index: events.indexOf(e) }));
    const rightEvents = events
      .filter((e) => e.side === "right")
      .map((e, i) => ({ ...e, index: events.indexOf(e) }));
    const leftDepths = computeDepths(leftEvents);
    const rightDepths = computeDepths(rightEvents);
    return new Map([...leftDepths, ...rightDepths]);
  }, []);

  return (
    <div className="history-root">
      <header className="history-header">
        <div className="header-ornament">⚜</div>
        <h1 className="history-title">История России</h1>
        <p className="history-subtitle">Летопись от призвания Рюрика до наших дней</p>
        <div className="header-ornament" style={{ transform: "rotate(180deg)" }}>⚜</div>
        <div className="era-legend">
          {eras.map((era) => (
            <button
              key={era.name}
              className="era-pill transition-all duration-200"
              style={{
                background: activeEra === era.name ? era.color : "transparent",
                color: activeEra === era.name ? "#F5E6C8" : era.color,
                borderColor: era.color,
              }}
              onClick={() => {
                const newActive = activeEra === era.name ? null : era.name;
                setActiveEra(newActive);
                if (newActive && scrollRef.current) {
                  const offset = yearToOffset(era.yearEnd) - 100;
                  scrollRef.current.scrollTop = Math.max(0, offset);
                }
              }}
            >
              {era.name}
            </button>
          ))}
        </div>
        <div className="legend-categories">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <span key={key} className="category-dot">
              <span
                className="inline-block w-2 h-2 rounded-full mr-1"
                style={{ background: categoryColors[key], verticalAlign: "middle" }}
              />
              {label}
            </span>
          ))}
        </div>
      </header>

      <div className="timeline-scroll" ref={scrollRef}>
        <div className="timeline-container" style={{ height: `${totalHeight}px` }}>
          <div className="timeline-axis" style={{ height: `${totalHeight}px` }} />

          {CENTURY_YEARS.map((year) => (
            <div
              key={`century-${year}`}
              className="absolute left-1/2"
              style={{
                top: `${yearToOffset(year)}px`,
                transform: "translateX(-50%)",
                width: "320px",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(139,90,43,0.5) 20%, rgba(139,90,43,0.5) 80%, transparent 100%)",
                zIndex: 1,
              }}
            />
          ))}

          {CENTURY_YEARS.map((year) => (
            <div
              key={`label-${year}`}
              className="absolute"
              style={{
                top: `${yearToOffset(year) - 8}px`,
                left: "50%",
                transform: "translateX(calc(-50% - 185px))",
                zIndex: 3,
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  fontFamily: "Oswald, sans-serif",
                  fontSize: "22px",
                  color: "rgba(139,90,43,0.75)",
                  letterSpacing: "0.06em",
                  fontWeight: 400,
                }}
              >
                {year} г.
              </span>
            </div>
          ))}

          {DECADE_TICKS.map((year) => (
            <div
              key={`decade-${year}`}
              className="absolute left-1/2"
              style={{
                top: `${yearToOffset(year)}px`,
                transform: "translateX(-50%)",
                width: "80px",
                height: "1px",
                background: "rgba(139,90,43,0.2)",
                zIndex: 1,
              }}
            />
          ))}

          {eras.map((era) => {
            const eraTop = yearToOffset(era.yearEnd);
            const eraHeight = (era.yearEnd - era.yearStart) * YEAR_HEIGHT;
            return (
              <div
                key={`era-bg-${era.name}`}
                className="absolute"
                style={{
                  top: `${eraTop}px`,
                  height: `${eraHeight}px`,
                  left: 0,
                  right: 0,
                  background: `${era.color}06`,
                  borderTop: `1px solid ${era.color}20`,
                  zIndex: 0,
                  opacity: activeEra === null || activeEra === era.name ? 1 : 0.3,
                  transition: "opacity 0.3s",
                  pointerEvents: "none",
                }}
              />
            );
          })}

          {rulers.map((ruler) => (
            <RulerBadge key={`${ruler.name}-${ruler.yearStart}`} ruler={ruler} />
          ))}

          {events.map((event, i) => (
            <EventCard key={`${event.title}-${event.year}`} event={event} depth={depthMap.get(i) ?? 0} />
          ))}
        </div>
      </div>

      <footer className="history-footer">
        <span>⚜</span>
        <span style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "13px" }}>
          Наведите на правителя, чтобы узнать подробности · Нажмите на событие, чтобы раскрыть описание
        </span>
        <span>⚜</span>
      </footer>
    </div>
  );
}