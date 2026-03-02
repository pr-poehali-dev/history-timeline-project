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
    <button onClick={() => setOpen(!open)} className="person-card transition-all duration-200" style={{ borderLeft: `3px solid ${color}` }}>
      <span style={{ fontSize: "11px", color, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {person.role}
      </span>
      <span style={{ fontSize: "14px", fontWeight: 700, color: "#f0f0f0", lineHeight: 1.3, marginTop: "3px", display: "block" }}>
        {person.name}
      </span>
      <span style={{ fontSize: "11px", color: "#555", marginTop: "2px", display: "block" }}>
        {person.yearBorn}
      </span>
      {open && (
        <p style={{ fontSize: "13px", color: "#aaa", lineHeight: 1.6, marginTop: "8px", textAlign: "left" }}>
          {person.description}
        </p>
      )}
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
  const era = eras.find(e => event.year >= e.yearStart && event.year < e.yearEnd);
  const eraColor = era?.color || "#c9a227";

  return (
    <button onClick={() => setOpen(!open)} className="event-card transition-all duration-200">
      <span style={{ fontSize: "12px", fontWeight: 700, color: eraColor, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {event.year}
      </span>
      <p style={{ fontSize: "16px", fontWeight: 700, color: "#f0f0f0", lineHeight: 1.3, margin: "4px 0 0" }}>
        {event.title}
      </p>
      <span style={{ fontSize: "11px", color: "#666", marginTop: "2px", display: "block" }}>
        {eraName}
      </span>
      {open && (
        <p style={{ fontSize: "14px", color: "#aaa", lineHeight: 1.6, marginTop: "8px", textAlign: "left" }}>
          {event.description}
        </p>
      )}
    </button>
  );
}

// ─── Карточка правителя ───────────────────────────────────────
function RulerCell({ ruler }: { ruler: ReturnType<typeof getRulerAtYear> }) {
  if (!ruler) return <div style={{ width: "130px", flexShrink: 0 }} />;
  const eraColor = eras.find(e => ruler.yearStart >= e.yearStart && ruler.yearStart < e.yearEnd)?.color || "#c9a227";

  return (
    <div style={{ width: "130px", height: "100%", flexShrink: 0 }}>
      <div className="ruler-card" style={{ borderLeft: `3px solid ${eraColor}40` }}>
        <span style={{ fontSize: "13px", fontWeight: 700, color: "#f0f0f0", lineHeight: 1.3 }}>
          {ruler.name}
        </span>
        <span style={{ fontSize: "10px", color: "#666", marginTop: "3px", display: "block", lineHeight: 1.4 }}>
          {ruler.yearStart}–{ruler.yearEnd}
        </span>
        <span style={{ fontSize: "10px", color: "#555", display: "block", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getEraName = (year: number) =>
    eras.find(e => year >= e.yearStart && year < e.yearEnd)?.name || "";

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, []);

  return (
    <div className="history-root">
      <header className="history-header">
        <h1 className="history-title">Краткая история России</h1>

      </header>

      <div className="timeline-scroll" ref={scrollRef}>
        <div style={{ padding: "12px 12px 60px", display: "flex", justifyContent: "center" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto auto auto", gap: "6px", width: "100%" }}>
          {(() => {
            const seenNames = new Set<string>();
            return groupEventsByRuler(sortedEvents).map((group, gi) => {
            const span = group.events.length;
            return (
              <>
                {/* Карточка правителя — растягивается на span строк */}
                <div
                  key={`ruler-${gi}`}
                  ref={el => { eventRefs.current[gi] = el; }}
                  style={{
                    gridRow: `span ${span}`,
                  }}
                >
                  <RulerCell ruler={group.ruler} />
                </div>

                {/* По одной строке на каждое событие */}
                {group.events.map((event, ei) => {
                  const evPersons = getPersonsNearYear(event.year).filter(p => {
                    if (seenNames.has(p.name)) return false;
                    seenNames.add(p.name);
                    return true;
                  });
                  return (
                    <>
                      {/* Событие */}
                      <div key={`ev-${gi}-${ei}`}>
                        <EventCard event={event} eraName={getEraName(event.year)} />
                      </div>

                      {/* Персоны в строку */}
                      <div key={`persons-${gi}-${ei}`} style={{ display: "flex", flexDirection: "row", gap: "6px", alignItems: "stretch" }}>
                        {evPersons.length > 0 ? evPersons.map((person, pi) => (
                          <PersonCard key={pi} person={person} />
                        )) : null}
                      </div>
                    </>
                  );
                })}
              </>
            );
          });
          })()}
          </div>
        </div>
      </div>

      <footer className="history-footer">
        862 — наши дни
      </footer>
    </div>
  );
}