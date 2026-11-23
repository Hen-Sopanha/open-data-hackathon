import { useEffect, useRef } from 'react';
import styles from './PhoneMock.module.css';

const SCROLL_AFTER_MS = 2300; // after the last message has animated in

/**
 * Generic phone frame with a chat header. Deliberately NOT styled after any real messenger app.
 * Props: title, subtitle, avatar (short text), footerPlaceholder, children (chat content)
 */
export default function PhoneMock({ title, subtitle, avatar, footerPlaceholder, children }) {
  const chatRef = useRef(null);

  // Like a real chat: once all messages are in, scroll smoothly to the newest one
  useEffect(() => {
    const id = setTimeout(() => {
      const el = chatRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, SCROLL_AFTER_MS);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className={styles.phone}>
      <div className={styles.screen}>
        <div className={styles.status} aria-hidden>
          <span>07:12</span>
          <span className={styles.notch} />
          <span>▂▄▆ ▮</span>
        </div>
        <div className={styles.header}>
          <span className={styles.back} aria-hidden>‹</span>
          <span className={styles.avatar} aria-hidden>{avatar}</span>
          <div>
            <div className={styles.title}>{title}</div>
            <div className={styles.subtitle}>{subtitle}</div>
          </div>
        </div>
        <div ref={chatRef} className={styles.chat}>
          {children}
        </div>
        <div className={styles.footer} aria-hidden>
          <span className={styles.input}>{footerPlaceholder}</span>
          <span className={styles.send}>➤</span>
        </div>
      </div>
    </div>
  );
}
