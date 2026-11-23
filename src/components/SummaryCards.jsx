/**
 * Row of headline numbers.
 * Props: cards [{ label, value, sub?, tone? ('high' | undefined) }]
 */
export default function SummaryCards({ cards }) {
  return (
    <div className="summary-cards">
      {cards.map((c) => (
        <div key={c.label} className={`summary-card${c.tone ? ` summary-card--${c.tone}` : ''}`}>
          <div className="summary-card__label">{c.label}</div>
          <div className="summary-card__value">{c.value}</div>
          {c.sub && <div className="summary-card__sub">{c.sub}</div>}
        </div>
      ))}
    </div>
  );
}
