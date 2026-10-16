import { useEffect, useId, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../state/useAppStore';
import styles from './hud.module.css';

/** "?" button with a small popover describing the controls. */
export function HelpButton() {
  const { t } = useTranslation();
  const open = useAppStore((s) => s.helpOpen);
  const setOpen = useAppStore((s) => s.setHelpOpen);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer);
    };
  }, [open, setOpen]);

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.chip} ${styles.icon}`}
        aria-label={t('hud.help')}
        aria-expanded={open}
        aria-controls={popoverId}
        onClick={() => setOpen(!open)}
      >
        ?
      </button>
      {open && (
        <div id={popoverId} className={styles.popover} role="region" aria-label={t('help.title')}>
          <h2>{t('help.title')}</h2>
          <p>{t('help.intro')}</p>
          <ul>
            <li>{t('help.pointer')}</li>
            <li>{t('help.arrows')}</li>
            <li>{t('help.tab')}</li>
            <li>{t('help.escape')}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
