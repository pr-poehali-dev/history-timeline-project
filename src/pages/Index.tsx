import { useState, useRef, useEffect, useMemo } from "react";
import {
  rulers, events, eras, famousPersons,
  type Ruler, type HistoryEvent, type FamousPerson
} from "@/data/historyData";

// ─── Константы ───────────────────────────────────────────────
const START_YEAR = 2026;
const END_YEAR = 862;
const MIN_ROW_PX = 28;       // минимальная высота строки (мало событий)
const MAX_ROW_PX = 110;      // максимальная высота строки (много событий)
const EVENTS_PER_YEAR = 1;   // сколько событий в году = "насыщенность"

const categoryColors: Record<string, string> = {
  war: "#8B1A1A",
  culture: "#2D5A27",
  politics: "#1A2E5A",
  church: "#4A2060",
  expansion: "#5A3A00",
  reform: "#1A4A4A",
};

const personColors: Record<string, string> = {
  science: "#1A4A4A",
  literature: "#4A2A00",
  art: "#3A1A4A",
  religion: "#2A2A60",
};

const personIcons: Record<string, string> = {
  science: "⚗",
  literature: "✒",
  art: "🎨",
  religion: "✝",
};

// ─── Динамическая шкала ──────────────────────────────────────
// Считаем: для каждого года — сколько событий "активны" в этот год
// (событие активно в год его наступления)
// Высота строки пропорциональна насыщенности

function buildYearLayout(evts: HistoryEvent[]): Map<number, { height: number; top: number }> {
  // Считаем количество событий на год
  const countByYear = new Map<number, number>();
  for (const e of evts) {
    countByYear.set(e.year, (countByYear.get(e.year) || 0) + 1);
  }

  // Также учитываем правителей и людей как "насыщенность"
  const maxCount = Math.max(1, ...countByYear.values());

  const layout = new Map<number, { height: number; top: number }>();
  let cursor = 0;

  for (let y = START_YEAR; y >= END_YEAR; y--) {
    const count = countByYear.get(y) || 0;
    // Нелинейное масштабирование: даже без событий — минимальная высота
    const ratio = count === 0 ? 0 : Math.sqrt(count / maxCount);
    const height = count === 0
      ? MIN_ROW_PX
      : MIN_ROW_PX + Math.round((MAX_ROW_PX - MIN_ROW_PX) * ratio);

    layout.set(y, { height, top: cursor });
    cursor += height;
  }

  return layout;
}

function yearMidpoint(layout: Map<number, { height: number; top: number }>, year: number): number {
  const row = layout.get(year);
  if (!row) return 0;
  return row.top + row.height / 2;
}

// ─── Компоненты ──────────────────────────────────────────────

function EventRow({ event, layout }: { event: HistoryEvent; layout: Map<number, { height: number; top: number }> }) {
  const [open, setOpen] = useState(false);
  const row = layout.get(event.year);
  if (!row) return null;
  const color = categoryColors[event.category];

  return (
    <div
      className="absolute"
      style={{ top: `${row.top}px`, left: 0, right: "50%", paddingRight: "32px" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left"
        style={{ paddingLeft: "16px" }}
      >
        <div
          className="parchment-card transition-all duration-200 hover:shadow-lg"
          style={{
            borderLeft: `3px solid ${color}`,
            borderTop: "1px solid rgba(139,90,43,0.2)",
            borderBottom: "1px solid rgba(139,90,43,0.2)",
            borderRight: "1px solid rgba(139,90,43,0.15)",
          }}
        >
          <span style={{ fontFamily: "Oswald, sans-serif", fontSize: "11px", color: "#8B4513", display: "block", lineHeight: 1 }}>
            {event.year} г.
          </span>
          <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "17px", fontWeight: 700, color: "#2C1A0E", lineHeight: 1.2, margin: "2px 0 0" }}>
            {event.title}
          </p>
          {open && (
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "13px", color: "#4A3320", fontStyle: "italic", lineHeight: 1.4, marginTop: "4px" }}>
              {event.description}
            </p>
          )}
        </div>
      </button>
    </div>
  );
}

function RulerBar({ ruler, layout }: { ruler: Ruler; layout: Map<number, { height: number; top: number }> }) {
  const [hover, setHover] = useState(false);
  const topRow = layout.get(Math.min(ruler.yearStart, START_YEAR));
  const botRow = layout.get(Math.max(ruler.yearEnd, END_YEAR));
  if (!topRow || !botRow) return null;

  const top = topRow.top;
  const bottom = botRow.top + botRow.height;
  const height = bottom - top;

  const eraColor = eras.find(e => ruler.yearStart >= e.yearStart && ruler.yearStart < e.yearEnd)?.color || "#8B4513";

  return (
    <div
      className="absolute"
      style={{ top: `${top}px`, height: `${height}px`, left: "calc(50% + 8px)", width: "120px", zIndex: 10 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className="relative h-full flex flex-col justify-center px-2 transition-all duration-200 cursor-default"
        style={{
          background: hover ? eraColor : `${eraColor}18`,
          borderLeft: `2px solid ${eraColor}`,
          borderRadius: "0 2px 2px 0",
        }}
      >
        <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "12px", fontWeight: 700, color: hover ? "#F5E6C8" : "#2C1A0E", lineHeight: 1.2, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {ruler.name}
        </span>
        {height > 40 && (
          <span style={{ fontFamily: "Oswald, sans-serif", fontSize: "9px", color: hover ? "#F5E6C8" : eraColor, opacity: 0.8, letterSpacing: "0.04em" }}>
            {ruler.yearStart}–{ruler.yearEnd}
          </span>
        )}

        {hover && (
          <div className="absolute left-full ml-2 top-0 animate-fade-in" style={{ zIndex: 50, minWidth: "200px" }}>
            <div className="parchment-tooltip" style={{ borderLeft: `3px solid ${eraColor}` }}>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "16px", fontWeight: 700, color: "#2C1A0E" }}>{ruler.name}</p>
              <p style={{ fontFamily: "Oswald, sans-serif", fontSize: "9px", color: eraColor, textTransform: "uppercase", letterSpacing: "0.08em", margin: "2px 0 6px" }}>{ruler.title} · {ruler.yearStart}–{ruler.yearEnd}</p>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "13px", fontStyle: "italic", color: "#4A3320", lineHeight: 1.5 }}>{ruler.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PersonBar({ person, layout, offsetX }: { person: FamousPerson; layout: Map<number, { height: number; top: number }>; offsetX: number }) {
  const [hover, setHover] = useState(false);
  const born = Math.max(person.yearBorn, END_YEAR);
  const died = Math.min(person.yearDied, START_YEAR);
  const topRow = layout.get(Math.min(born, START_YEAR));
  const botRow = layout.get(Math.max(died, END_YEAR));
  if (!topRow || !botRow) return null;

  const top = topRow.top;
  const bottom = botRow.top + botRow.height;
  const height = bottom - top;
  if (height < 8) return null;

  const color = personColors[person.type];
  const icon = personIcons[person.type];

  return (
    <div
      className="absolute"
      style={{ top: `${top}px`, height: `${height}px`, left: `calc(50% + ${offsetX}px)`, width: "110px", zIndex: 9 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className="relative h-full flex flex-col justify-center px-2 transition-all duration-200 cursor-default"
        style={{
          background: hover ? color : `${color}15`,
          borderLeft: `2px solid ${color}60`,
          borderRadius: "0 2px 2px 0",
        }}
      >
        <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "11px", fontWeight: 700, color: hover ? "#F5E6C8" : "#2C1A0E", lineHeight: 1.2 }}>
          {icon} {person.name}
        </span>
        {height > 36 && (
          <span style={{ fontFamily: "Oswald, sans-serif", fontSize: "8px", color: hover ? "#F5E6C8" : color, opacity: 0.8 }}>
            {person.yearBorn}–{person.yearDied}
          </span>
        )}

        {hover && (
          <div className="absolute left-full ml-2 top-0 animate-fade-in" style={{ zIndex: 50, minWidth: "190px" }}>
            <div className="parchment-tooltip" style={{ borderLeft: `3px solid ${color}` }}>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "15px", fontWeight: 700, color: "#2C1A0E" }}>{person.name}</p>
              <p style={{ fontFamily: "Oswald, sans-serif", fontSize: "9px", color, textTransform: "uppercase", letterSpacing: "0.08em", margin: "2px 0 6px" }}>{person.role} · {person.yearBorn}–{person.yearDied}</p>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "13px", fontStyle: "italic", color: "#4A3320", lineHeight: 1.5 }}>{person.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Расставляем персон по колонкам чтобы не перекрывались
function assignPersonColumns(persons: FamousPerson[]): { person: FamousPerson; col: number }[] {
  const sorted = [...persons].sort((a, b) => b.yearBorn - a.yearBorn);
  const colEnd: number[] = []; // конец последнего элемента в каждой колонке (в годах, убывание)
  const result: { person: FamousPerson; col: number }[] = [];

  for (const p of sorted) {
    let col = 0;
    while (colEnd[col] !== undefined && p.yearBorn > colEnd[col] - 5) {
      col++;
    }
    colEnd[col] = p.yearDied;
    result.push({ person: p, col });
  }
  return result;
}

// Линейка на оси — засечки с переменной длиной
function RulerTicks({ layout }: { layout: Map<number, { height: number; top: number }> }) {
  const ticks: JSX.Element[] = [];

  for (let y = START_YEAR; y >= END_YEAR; y--) {
    const row = layout.get(y);
    if (!row) continue;
    const midY = row.top + row.height / 2;

    const isCentury = y % 100 === 0;
    const isDecade = y % 10 === 0 && !isCentury;
    const isFive = y % 5 === 0 && !isDecade && !isCentury;

    const tickLen = isCentury ? 28 : isDecade ? 16 : isFive ? 9 : 4;
    const opacity = isCentury ? 0.9 : isDecade ? 0.6 : isFive ? 0.35 : 0.18;
    const thickness = isCentury ? 2 : 1;

    ticks.push(
      <div key={y} className="absolute" style={{ top: `${midY}px`, left: "50%", transform: "translateX(-50%)", width: 0, pointerEvents: "none", zIndex: 4 }}>
        <div style={{ position: "absolute", right: "2px", top: 0, width: `${tickLen}px`, height: `${thickness}px`, background: `rgba(139,90,43,${opacity})`, transform: "translateY(-50%)" }} />
        <div style={{ position: "absolute", left: "2px", top: 0, width: `${tickLen}px`, height: `${thickness}px`, background: `rgba(139,90,43,${opacity})`, transform: "translateY(-50%)" }} />
        {(isCentury || isDecade) && (
          <span style={{
            position: "absolute",
            right: `${tickLen + 5}px`,
            top: 0,
            transform: "translateY(-50%)",
            fontFamily: "Oswald, sans-serif",
            fontSize: isCentury ? "14px" : "10px",
            color: isCentury ? "rgba(139,90,43,0.85)" : "rgba(139,90,43,0.5)",
            fontWeight: isCentury ? 500 : 300,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}>
            {y}
          </span>
        )}
      </div>
    );
  }

  return <>{ticks}</>;
}

// ─── Главная страница ─────────────────────────────────────────

export default function Index() {
  const [activeEra, setActiveEra] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const layout = useMemo(() => buildYearLayout(events), []);

  const totalHeight = useMemo(() => {
    let max = 0;
    layout.forEach(row => { if (row.top + row.height > max) max = row.top + row.height; });
    return max + 100;
  }, [layout]);

  const personColumns = useMemo(() => assignPersonColumns(famousPersons), []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
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
                  const row = layout.get(era.yearEnd);
                  if (row) scrollRef.current.scrollTop = Math.max(0, row.top - 80);
                }
              }}
            >
              {era.name}
            </button>
          ))}
        </div>
        <div className="legend-persons">
          <span style={{ color: personColors.literature }}>✒ Литература</span>
          <span style={{ color: personColors.science }}>⚗ Наука</span>
          <span style={{ color: personColors.art }}>🎨 Искусство</span>
          <span style={{ color: personColors.religion }}>✝ Религия</span>
        </div>
      </header>

      <div className="timeline-scroll" ref={scrollRef}>
        <div className="timeline-container" style={{ height: `${totalHeight}px` }}>

          {/* Ось */}
          <div className="timeline-axis" style={{ height: `${totalHeight}px` }} />

          {/* Фоны эпох */}
          {eras.map((era) => {
            const topRow = layout.get(Math.min(era.yearEnd, START_YEAR));
            const botRow = layout.get(Math.max(era.yearStart, END_YEAR));
            if (!topRow || !botRow) return null;
            const top = topRow.top;
            const height = (botRow.top + botRow.height) - top;
            return (
              <div
                key={era.name}
                className="absolute"
                style={{
                  top: `${top}px`, height: `${height}px`,
                  left: 0, right: 0,
                  background: `${era.color}06`,
                  borderTop: `1px solid ${era.color}20`,
                  zIndex: 0,
                  opacity: activeEra === null || activeEra === era.name ? 1 : 0.25,
                  transition: "opacity 0.3s",
                  pointerEvents: "none",
                }}
              />
            );
          })}

          {/* Линейка */}
          <RulerTicks layout={layout} />

          {/* События слева */}
          {events.map((event, i) => (
            <EventRow key={i} event={event} layout={layout} />
          ))}

          {/* Правители справа */}
          {rulers.map((ruler) => (
            <RulerBar key={ruler.name + ruler.yearStart} ruler={ruler} layout={layout} />
          ))}

          {/* Известные люди справа в колонках */}
          {personColumns.map(({ person, col }) => (
            <PersonBar
              key={person.name}
              person={person}
              layout={layout}
              offsetX={136 + col * 118}
            />
          ))}
        </div>
      </div>

      <footer className="history-footer">
        <span>⚜</span>
        <span style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "13px" }}>
          Слева — события · По центру — линейка лет · Справа — правители и великие люди
        </span>
        <span>⚜</span>
      </footer>
    </div>
  );
}
