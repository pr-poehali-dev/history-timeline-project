import { useState, useRef, useEffect, useMemo } from "react";
import {
  rulers, events, eras, famousPersons,
  type Ruler, type HistoryEvent, type FamousPerson
} from "@/data/historyData";

// ─── Цвета ───────────────────────────────────────────────────
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
  literature: "#6B3A00",
  art: "#3A1A4A",
  religion: "#2A2A60",
};

const personIcons: Record<string, string> = {
  science: "⚗",
  literature: "✒",
  art: "✦",
  religion: "✝",
};

// Сортируем события от старых к новым
const sortedEvents = [...events].sort((a, b) => a.year - b.year);

// ─── Вычисляем высоту каждого события в пикселях ─────────────
// Чтобы разместить правителей и персон — нам нужны абсолютные координаты.
// Каждая карточка события имеет фиксированную минимальную высоту.
const EVENT_ROW_H = 80; // px на событие (collapsed)

// Накапливаем top для каждого события по индексу
function buildEventTops(evts: typeof sortedEvents): number[] {
  const tops: number[] = [];
  let cursor = 0;
  for (let i = 0; i < evts.length; i++) {
    tops.push(cursor);
    cursor += EVENT_ROW_H;
  }
  return tops;
}

// Для правителей/персон — находим top по году (интерполяция между событиями)
function yearToTopApprox(year: number, evts: typeof sortedEvents, tops: number[]): number {
  if (evts.length === 0) return 0;
  if (year <= evts[0].year) return tops[0];
  if (year >= evts[evts.length - 1].year) return tops[tops.length - 1] + EVENT_ROW_H;

  for (let i = 0; i < evts.length - 1; i++) {
    if (year >= evts[i].year && year <= evts[i + 1].year) {
      const ratio = (year - evts[i].year) / (evts[i + 1].year - evts[i].year);
      return tops[i] + ratio * (tops[i + 1] - tops[i]);
    }
  }
  return tops[tops.length - 1];
}

// Расставляем персон по колонкам (без перекрытий)
function assignPersonColumns(persons: FamousPerson[]): { person: FamousPerson; col: number }[] {
  const sorted = [...persons].sort((a, b) => a.yearBorn - b.yearBorn);
  const colEnd: number[] = [];
  const result: { person: FamousPerson; col: number }[] = [];
  for (const p of sorted) {
    let col = 0;
    while (colEnd[col] !== undefined && p.yearBorn < colEnd[col] + 10) col++;
    colEnd[col] = p.yearDied;
    result.push({ person: p, col });
  }
  return result;
}

// ─── EventCard ────────────────────────────────────────────────
function EventCard({ event, eraName }: { event: HistoryEvent; eraName: string }) {
  const [open, setOpen] = useState(false);
  const color = categoryColors[event.category];
  const era = eras.find(e => event.year >= e.yearStart && event.year < e.yearEnd);
  const eraColor = era?.color || "#8B4513";

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left transition-all duration-200 group"
    >
      <div
        className="parchment-card hover:shadow-lg transition-all duration-200"
        style={{
          borderLeft: `4px solid ${color}`,
          borderTop: "1px solid rgba(139,90,43,0.18)",
          borderBottom: "1px solid rgba(139,90,43,0.18)",
          borderRight: "1px solid rgba(139,90,43,0.12)",
          marginBottom: "2px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "2px" }}>
          <span style={{ fontFamily: "Oswald, sans-serif", fontSize: "13px", color: eraColor, fontWeight: 500, flexShrink: 0 }}>
            {event.year} г.
          </span>
          <span style={{ fontFamily: "Oswald, sans-serif", fontSize: "9px", color: `${eraColor}99`, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {eraName}
          </span>
        </div>
        <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "19px", fontWeight: 700, color: "#2C1A0E", lineHeight: 1.2 }}>
          {event.title}
        </p>
        {open && (
          <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "14px", color: "#4A3320", fontStyle: "italic", lineHeight: 1.5, marginTop: "6px" }}>
            {event.description}
          </p>
        )}
      </div>
    </button>
  );
}

// ─── RulerBar ─────────────────────────────────────────────────
function RulerBar({ ruler, topPx, heightPx }: { ruler: Ruler; topPx: number; heightPx: number }) {
  const [hover, setHover] = useState(false);
  if (heightPx < 10) return null;
  const eraColor = eras.find(e => ruler.yearStart >= e.yearStart && ruler.yearStart < e.yearEnd)?.color || "#8B4513";

  return (
    <div
      className="absolute"
      style={{ top: `${topPx}px`, height: `${heightPx}px`, left: 0, right: 0, zIndex: 10 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className="h-full flex flex-col justify-center px-2 transition-all duration-200 cursor-default"
        style={{
          background: hover ? eraColor : `${eraColor}1A`,
          borderLeft: `3px solid ${eraColor}`,
          borderTop: `1px solid ${eraColor}30`,
          borderBottom: `1px solid ${eraColor}30`,
        }}
      >
        <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "12px", fontWeight: 700, color: hover ? "#F5E6C8" : "#2C1A0E", lineHeight: 1.2 }}>
          {ruler.name}
        </span>
        {heightPx > 38 && (
          <span style={{ fontFamily: "Oswald, sans-serif", fontSize: "9px", color: hover ? "#F5E6C8BB" : `${eraColor}BB`, letterSpacing: "0.04em" }}>
            {ruler.yearStart}–{ruler.yearEnd}
          </span>
        )}
        {hover && (
          <div className="absolute left-full ml-2 top-1 animate-fade-in" style={{ zIndex: 50, minWidth: "210px" }}>
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

// ─── PersonBar ────────────────────────────────────────────────
function PersonBar({ person, topPx, heightPx }: { person: FamousPerson; topPx: number; heightPx: number }) {
  const [hover, setHover] = useState(false);
  if (heightPx < 10) return null;
  const color = personColors[person.type];
  const icon = personIcons[person.type];

  return (
    <div
      className="absolute"
      style={{ top: `${topPx}px`, height: `${heightPx}px`, left: 0, right: 0, zIndex: 9 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className="h-full flex flex-col justify-center px-2 transition-all duration-200 cursor-default"
        style={{
          background: hover ? color : `${color}12`,
          borderLeft: `2px solid ${color}70`,
          borderTop: `1px solid ${color}25`,
          borderBottom: `1px solid ${color}25`,
        }}
      >
        <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "11px", fontWeight: 700, color: hover ? "#F5E6C8" : "#2C1A0E", lineHeight: 1.2 }}>
          {icon} {person.name}
        </span>
        {heightPx > 34 && (
          <span style={{ fontFamily: "Oswald, sans-serif", fontSize: "8px", color: hover ? "#F5E6C8AA" : `${color}AA` }}>
            {person.yearBorn}–{person.yearDied}
          </span>
        )}
        {hover && (
          <div className="absolute left-full ml-2 top-1 animate-fade-in" style={{ zIndex: 50, minWidth: "200px" }}>
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

// ─── Главная страница ─────────────────────────────────────────
export default function Index() {
  const [activeEra, setActiveEra] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Реальные высоты событий после рендера (с учётом раскрытых)
  const [eventTops, setEventTops] = useState<number[]>(() => buildEventTops(sortedEvents));
  const totalHeight = eventTops.length > 0 ? eventTops[eventTops.length - 1] + EVENT_ROW_H + 60 : 1000;

  // Пересчитываем tops когда меняются высоты карточек
  const recalcTops = () => {
    const tops: number[] = [];
    let cursor = 0;
    for (let i = 0; i < eventRefs.current.length; i++) {
      tops.push(cursor);
      const h = eventRefs.current[i]?.offsetHeight || EVENT_ROW_H;
      cursor += h + 2;
    }
    setEventTops(tops);
  };

  useEffect(() => {
    recalcTops();
  }, []);

  const personColumns = useMemo(() => assignPersonColumns(famousPersons), []);

  const getEraName = (year: number) =>
    eras.find(e => year >= e.yearStart && year < e.yearEnd)?.name || "";

  const scrollToEra = (eraName: string) => {
    const era = eras.find(e => e.name === eraName);
    if (!era || !scrollRef.current) return;
    const firstIdx = sortedEvents.findIndex(e => e.year >= era.yearStart);
    if (firstIdx >= 0 && eventTops[firstIdx] !== undefined) {
      scrollRef.current.scrollTop = Math.max(0, eventTops[firstIdx] - 80);
    }
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, []);

  return (
    <div className="history-root">
      <header className="history-header">
        <div className="header-ornament">⚜</div>
        <h1 className="history-title">История России</h1>
        <p className="history-subtitle">862 год — наши дни</p>
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
                if (newActive) scrollToEra(newActive);
              }}
            >
              {era.name}
            </button>
          ))}
        </div>
      </header>

      <div className="timeline-scroll" ref={scrollRef}>
        {/* Двухколоночный layout */}
        <div style={{ display: "flex", minHeight: `${totalHeight}px`, position: "relative" }}>

          {/* ── ЛЕВАЯ КОЛОНКА: события ── */}
          <div style={{ flex: "0 0 58%", padding: "16px 12px 60px 20px" }}>
            {sortedEvents.map((event, i) => {
              const era = eras.find(e => event.year >= e.yearStart && event.year < e.yearEnd);
              const filtered = activeEra && era?.name !== activeEra;
              return (
                <div
                  key={i}
                  ref={el => { eventRefs.current[i] = el; }}
                  style={{ opacity: filtered ? 0.25 : 1, transition: "opacity 0.3s" }}
                  onClick={recalcTops}
                >
                  <EventCard event={event} eraName={getEraName(event.year)} />
                </div>
              );
            })}
          </div>

          {/* Тонкий разделитель */}
          <div style={{
            position: "sticky",
            top: 0,
            width: "1px",
            background: "linear-gradient(180deg, transparent, rgba(139,90,43,0.35) 5%, rgba(139,90,43,0.35) 95%, transparent)",
            flexShrink: 0,
            alignSelf: "stretch",
          }} />

          {/* ── ПРАВАЯ КОЛОНКА: правители + люди (абсолютная позиция внутри) ── */}
          <div style={{ flex: 1, position: "relative", minHeight: `${totalHeight}px` }}>

            {/* Правители */}
            <div style={{ position: "absolute", inset: 0, left: "4px", right: 0 }}>
              <div style={{ position: "relative", height: `${totalHeight}px` }}>
                {rulers.map((ruler) => {
                  const topPx = yearToTopApprox(ruler.yearStart, sortedEvents, eventTops);
                  const botPx = yearToTopApprox(ruler.yearEnd, sortedEvents, eventTops);
                  return (
                    <RulerBar
                      key={ruler.name + ruler.yearStart}
                      ruler={ruler}
                      topPx={topPx}
                      heightPx={Math.max(0, botPx - topPx)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Известные люди по колонкам */}
            {personColumns.map(({ person, col }) => (
              <div
                key={person.name}
                style={{ position: "absolute", inset: 0, left: `${136 + col * 112}px`, right: 0, pointerEvents: "none" }}
              >
                <div style={{ position: "relative", height: `${totalHeight}px`, pointerEvents: "auto" }}>
                  {(() => {
                    const topPx = yearToTopApprox(Math.max(person.yearBorn, 862), sortedEvents, eventTops);
                    const botPx = yearToTopApprox(Math.min(person.yearDied, 2026), sortedEvents, eventTops);
                    return (
                      <PersonBar
                        person={person}
                        topPx={topPx}
                        heightPx={Math.max(0, botPx - topPx)}
                      />
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="history-footer">
        <span>⚜</span>
        <span style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "13px" }}>
          Слева — события истории · Справа — правители и великие люди эпохи
        </span>
        <span>⚜</span>
      </footer>
    </div>
  );
}
