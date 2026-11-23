import { useI18n } from '../i18n/I18nContext.jsx';
import { formatDate } from './risk.js';
import styles from './DateSlider.module.css';

/**
 * Play button + date slider with a small per-day strip
 * (red bar = # districts at High risk, blue tick = flooding observed that day).
 * Props: dates[], index, onChange(i), playing, onTogglePlay, highCounts[], floodCounts[], ticks[] (ISO dates to label)
 */
export default function DateSlider({ dates, index, onChange, playing, onTogglePlay, highCounts, floodCounts, ticks }) {
  const { t, lang } = useI18n();
  const maxHigh = Math.max(1, ...highCounts);
  const last = dates.length - 1;

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.play} onClick={onTogglePlay} aria-label={playing ? t('replay.pause') : t('replay.play')}>
        <span aria-hidden>{playing ? '❚❚' : '▶'}</span>
        <span>{playing ? t('replay.pause') : t('replay.play')}</span>
      </button>

      <div className={styles.track}>
        <div className={styles.strip} aria-hidden>
          {dates.map((d, i) => (
            <button
              key={d}
              type="button"
              tabIndex={-1}
              className={`${styles.col} ${i === index ? styles.current : ''}`}
              onClick={() => onChange(i)}
              title={formatDate(d, lang)}
            >
              <span className={styles.bar} style={{ height: `${(highCounts[i] / maxHigh) * 100}%` }} />
              <span className={floodCounts[i] ? styles.flood : styles.noFlood} />
            </button>
          ))}
        </div>

        <input
          type="range"
          className={styles.range}
          min={0}
          max={last}
          step={1}
          value={index}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={t('replay.dateLabel')}
          aria-valuetext={formatDate(dates[index], lang)}
        />

        <div className={styles.ticks}>
          {ticks.map((d) => {
            const i = dates.indexOf(d);
            if (i < 0) return null;
            return (
              <span key={d} style={{ left: `${(i / last) * 100}%` }}>
                {formatDate(d, lang, { day: 'numeric', month: 'short' })}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
