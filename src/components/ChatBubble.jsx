import styles from './ChatBubble.module.css';

/**
 * One chat message: Khmer text, optional English translation underneath.
 * Props: from ('bot' | 'user'), km, en, showTranslation, time, delay (s, for the entrance animation), accent ('high'|'medium'|'low'|undefined)
 */
export default function ChatBubble({ from, km, en, showTranslation, time, delay = 0, accent }) {
  return (
    <div
      className={`${styles.bubble} ${styles[from]} ${accent ? styles[accent] : ''}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div lang="km" className={styles.km}>
        {km}
      </div>
      {showTranslation && en && (
        <div lang="en" className={styles.en}>
          {en}
        </div>
      )}
      <div className={styles.time}>
        {time}
        {from === 'user' && ' ✓✓'}
      </div>
    </div>
  );
}

/** Small centred date chip between messages */
export function ChatDate({ children }) {
  return <div className={styles.date}>{children}</div>;
}
