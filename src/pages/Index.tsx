import { useState, useRef, useEffect } from "react";
import {
  events, eras, rulers, famousPersons,
  type HistoryEvent, type FamousPerson
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
};

const personTypeLabel: Record<string, string> = {
  science: "Наука",
  literature: "Литература",
  art: "Искусство",
};

// Подбираем людей, чей период жизни пересекается с годом события (±30 лет от рождения)
function getPersonsNearYear(year: number): FamousPerson[] {
  return famousPersons.filter(p => Math.abs(p.yearBorn - year) <= 40);
}

// ─── Карточка великого человека ──────────────────────────────
function PersonCard({ person }: { person: FamousPerson }) {
  const [open, setOpen] = useState(false);
  const color = personColors[person.type];
  return (
    <button onClick={() => setOpen(!open)} className="transition-all duration-200" style={{ width: "100%", textAlign: "left" }}>
      <div style={{
        background: `${color}10`,
        border: `1px solid ${color}40`,
        borderLeft: `3px solid ${color}`,
        borderRadius: "2px",
        padding: "5px 10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        height: "100%",
      }}>
        <span style={{ fontFamily: "Oswald, sans-serif", fontSize: "10px", color: `${color}90`, textTransform: "uppercase", letterSpacing: "0.07em" }}>
          {personTypeLabel[person.type]}
        </span>
        <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "22px", fontWeight: 700, color, lineHeight: 1.2, marginTop: "2px" }}>
          {person.name}
        </span>
        <span style={{ fontFamily: "Oswald, sans-serif", fontSize: "11px", color: `${color}70`, marginTop: "2px" }}>
          {person.yearBorn}–{person.yearDied} · {person.role}
        </span>
        {open && (
          <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "20px", color: "#4A3320", fontStyle: "italic", lineHeight: 1.5, marginTop: "6px" }}>
            {person.description}
          </p>
        )}
      </div>
    </button>
  );
}

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
      className="transition-all duration-200"
      style={{ width: "100%" }}
    >
      <div
        className="parchment-card hover:shadow-lg transition-all duration-200"
        style={{
          borderLeft: `4px solid ${color}`,
          borderTop: "1px solid rgba(139,90,43,0.18)",
          borderBottom: "1px solid rgba(139,90,43,0.18)",
          borderRight: "1px solid rgba(139,90,43,0.12)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <span style={{ fontFamily: "Oswald, sans-serif", fontSize: "26px", color: eraColor, fontWeight: 500, lineHeight: 1.1 }}>
          {event.year} г.
        </span>
        <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "38px", fontWeight: 700, color: "#2C1A0E", lineHeight: 1.2, marginTop: "2px" }}>
          {event.title}
        </p>
        <span style={{ fontFamily: "Oswald, sans-serif", fontSize: "12px", color: `${eraColor}80`, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "4px" }}>
          {eraName}
        </span>
        {open && (
          <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "26px", color: "#4A3320", fontStyle: "italic", lineHeight: 1.5, marginTop: "8px" }}>
            {event.description}
          </p>
        )}
      </div>
    </button>
  );
}

// ─── Карточка правителя ───────────────────────────────────────
function RulerCell({ ruler }: { ruler: ReturnType<typeof getRulerAtYear> }) {
  if (!ruler) return <div style={{ width: "190px", flexShrink: 0 }} />;
  const eraColor = eras.find(e => ruler.yearStart >= e.yearStart && ruler.yearStart < e.yearEnd)?.color || "#8B4513";

  return (
    <div style={{
      width: "190px",
      flexShrink: 0,
      paddingRight: "14px",
      alignSelf: "stretch",
    }}>
      <div style={{
        height: "100%",
        background: `${eraColor}14`,
        border: `1px solid ${eraColor}35`,
        borderRadius: "2px",
        padding: "6px 10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>
        <span style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "22px",
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
          letterSpacing: "0.03em",
          marginTop: "2px",
          display: "block",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {ruler.yearStart}–{ruler.yearEnd} · {ruler.title}
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
        <div style={{ padding: "16px 0 60px 0", display: "flex", justifyContent: "center" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto auto auto" }}>
          {groupEventsByRuler(sortedEvents).map((group, gi) => {
            const era = eras.find(e => group.events[0].year >= e.yearStart && group.events[0].year < e.yearEnd);
            const filtered = activeEra && era?.name !== activeEra;
            const persons = group.events.flatMap(ev => getPersonsNearYear(ev.year))
              .filter((p, i, arr) => arr.findIndex(x => x.name === p.name) === i);
            return (
              <>
                {/* Карточка правителя */}
                <div
                  key={`ruler-${gi}`}
                  style={{ display: "flex", alignItems: "stretch", opacity: filtered ? 0.25 : 1, transition: "opacity 0.3s", marginBottom: "3px" }}
                  ref={el => { eventRefs.current[gi] = el; }}
                >
                  <RulerCell ruler={group.ruler} />
                </div>

                {/* Стопка событий */}
                <div
                  key={`events-${gi}`}
                  style={{ display: "flex", flexDirection: "column", gap: "3px", marginBottom: "3px", opacity: filtered ? 0.25 : 1, transition: "opacity 0.3s" }}
                >
                  {group.events.map((event, ei) => (
                    <EventCard key={ei} event={event} eraName={getEraName(event.year)} />
                  ))}
                </div>

                {/* Великие люди эпохи */}
                <div
                  key={`persons-${gi}`}
                  style={{ display: "flex", flexDirection: "column", gap: "3px", marginBottom: "3px", paddingLeft: "14px", opacity: filtered ? 0.25 : 1, transition: "opacity 0.3s" }}
                >
                  {persons.length > 0 ? persons.map((person, pi) => (
                    <PersonCard key={pi} person={person} />
                  )) : <div style={{ minHeight: "4px" }} />}
                </div>
              </>
            );
          })}
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