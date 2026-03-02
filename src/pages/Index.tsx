import { useState, useRef, useEffect } from "react";
import {
  events, eras, rulers,
  type HistoryEvent
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

const sortedEvents = [...events].sort((a, b) => a.year - b.year);
const EVENT_ROW_H = 80;

function getRulerAtYear(year: number) {
  return rulers.find(r => year >= r.yearStart && year <= r.yearEnd);
}

// ─── Одна карточка события ────────────────────────────────────
function EventCard({ event, eraName }: { event: HistoryEvent; eraName: string }) {
  const [open, setOpen] = useState(false);
  const color = categoryColors[event.category];
  const era = eras.find(e => event.year >= e.yearStart && event.year < e.yearEnd);
  const eraColor = era?.color || "#8B4513";

  return (
    <button
      onClick={() => setOpen(!open)}
      className="text-left transition-all duration-200 w-full"
    >
      <div
        className="parchment-card hover:shadow-lg transition-all duration-200"
        style={{
          borderLeft: `4px solid ${color}`,
          borderTop: "1px solid rgba(139,90,43,0.18)",
          borderBottom: "1px solid rgba(139,90,43,0.18)",
          borderRight: "1px solid rgba(139,90,43,0.12)",
          display: "inline-block",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "2px" }}>
          <span style={{ fontFamily: "Oswald, sans-serif", fontSize: "26px", color: eraColor, fontWeight: 500, flexShrink: 0 }}>
            {event.year} г.
          </span>
          <span style={{ fontFamily: "Oswald, sans-serif", fontSize: "16px", color: `${eraColor}99`, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
            {eraName}
          </span>
        </div>
        <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "38px", fontWeight: 700, color: "#2C1A0E", lineHeight: 1.2, whiteSpace: "nowrap" }}>
          {event.title}
        </p>
        {open && (
          <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "28px", color: "#4A3320", fontStyle: "italic", lineHeight: 1.5, marginTop: "6px", whiteSpace: "normal", maxWidth: "600px" }}>
            {event.description}
          </p>
        )}
      </div>
    </button>
  );
}

// ─── Карточка правителя ───────────────────────────────────────
function RulerCell({ ruler, rowCount }: { ruler: ReturnType<typeof getRulerAtYear>; rowCount: number }) {
  if (!ruler) return <div style={{ width: "200px", flexShrink: 0 }} />;
  const eraColor = eras.find(e => ruler.yearStart >= e.yearStart && ruler.yearStart < e.yearEnd)?.color || "#8B4513";

  return (
    <div style={{
      width: "200px",
      flexShrink: 0,
      paddingRight: "12px",
      position: "relative",
      alignSelf: "stretch",
    }}>
      {/* Вертикальная линия-ось */}
      <div style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: "2px",
        background: "rgba(139,90,43,0.22)",
      }} />
      <div style={{
        height: "100%",
        background: `${eraColor}14`,
        border: `1px solid ${eraColor}35`,
        borderRadius: "2px",
        padding: "10px 10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>
        <span style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "16px",
          fontWeight: 700,
          color: eraColor,
          lineHeight: 1.2,
          display: "block",
        }}>
          {ruler.name}
        </span>
        <span style={{
          fontFamily: "Oswald, sans-serif",
          fontSize: "11px",
          color: `${eraColor}80`,
          letterSpacing: "0.04em",
          marginTop: "3px",
          display: "block",
        }}>
          {ruler.yearStart}–{ruler.yearEnd}
        </span>
        <span style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "12px",
          color: `${eraColor}90`,
          fontStyle: "italic",
          marginTop: "2px",
          display: "block",
        }}>
          {ruler.title}
        </span>
      </div>
    </div>
  );
}

// Группируем события по правителю (последовательные одинаковые — в одну группу)
function groupEventsByRuler(evts: typeof sortedEvents) {
  const groups: { ruler: ReturnType<typeof getRulerAtYear>; events: typeof sortedEvents }[] = [];
  for (const ev of evts) {
    const ruler = getRulerAtYear(ev.year);
    const last = groups[groups.length - 1];
    if (last && last.ruler?.name === ruler?.name) {
      last.events.push(ev);
    } else {
      groups.push({ ruler, events: [ev] });
    }
  }
  return groups;
}



// ─── Главная страница ─────────────────────────────────────────
export default function Index() {
  const [activeEra, setActiveEra] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getEraName = (year: number) =>
    eras.find(e => year >= e.yearStart && year < e.yearEnd)?.name || "";

  const scrollToEra = (eraName: string) => {
    if (!scrollRef.current) return;
    const idx = sortedEvents.findIndex(e => {
      const era = eras.find(er => er.name === eraName);
      return era && e.year >= era.yearStart;
    });
    if (idx >= 0 && eventRefs.current[idx]) {
      eventRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        <div style={{ padding: "16px 0 60px 0" }}>
          {groupEventsByRuler(sortedEvents).map((group, gi) => {
            const era = eras.find(e => group.events[0].year >= e.yearStart && group.events[0].year < e.yearEnd);
            const filtered = activeEra && era?.name !== activeEra;
            return (
              <div
                key={gi}
                style={{ display: "flex", alignItems: "stretch", opacity: filtered ? 0.25 : 1, transition: "opacity 0.3s", marginBottom: "3px" }}
                ref={el => { eventRefs.current[gi] = el; }}
              >
                {/* Карточка правителя — одна на всю группу */}
                <RulerCell ruler={group.ruler} rowCount={group.events.length} />

                {/* Стопка событий */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "3px", paddingLeft: "14px" }}>
                  {group.events.map((event, ei) => (
                    <EventCard key={ei} event={event} eraName={getEraName(event.year)} />
                  ))}
                </div>
              </div>
            );
          })}
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