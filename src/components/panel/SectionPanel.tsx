import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useEffect, useId, useRef, type ComponentType, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { spriteUrl } from '../../game/assets/urls';
import { furnitureById, interactableFor, type SectionId } from '../../game/world/layout';
import { useAppStore } from '../../state/useAppStore';
import { lastInputWasKeyboard } from './inputModality';
import { AboutPanel } from './sections/AboutPanel';
import { ContactPanel } from './sections/ContactPanel';
import { EducationPanel } from './sections/EducationPanel';
import { ExperiencePanel } from './sections/ExperiencePanel';
import { ProjectsPanel } from './sections/ProjectsPanel';
import styles from './SectionPanel.module.css';

const BODIES: Record<SectionId, ComponentType> = {
  about: AboutPanel,
  experience: ExperiencePanel,
  education: EducationPanel,
  projects: ProjectsPanel,
  contact: ContactPanel,
};

/** Content panel opened by interacting with an object; closed during normal exploration. */
export function SectionPanel() {
  const section = useAppStore((s) => s.activeSection);
  const close = useAppStore((s) => s.closeSection);
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{section && <PanelFrame key={section} section={section} onClose={close} />}</AnimatePresence>
    </MotionConfig>
  );
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function PanelFrame({ section, onClose }: { section: SectionId; onClose: () => void }) {
  const { t } = useTranslation();
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const Body = BODIES[section];
  const icon = spriteUrl(`${furnitureById(interactableFor(section).objectId).sprite}.png`);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    // Keyboard users land on the close button; after a click or tap the dialog itself takes focus,
    // so no focus ring appears until the visitor starts using the keyboard.
    if (lastInputWasKeyboard()) closeRef.current?.focus();
    else dialogRef.current?.focus();
    return () => {
      if (previous?.isConnected) previous.focus();
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const items = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    const first = items[0];
    const last = items.at(-1);
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  };

  return (
    <motion.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, pointerEvents: 'none' }}
      transition={{ duration: 0.15 }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.section
        ref={dialogRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <header className={styles.header}>
          <img className={styles.icon} src={icon} alt="" />
          <div className={styles.heading}>
            <p className={styles.kicker}>{t(`objects.${section}`)}</p>
            <h2 id={titleId} className={styles.title}>
              {t(`sections.${section}`)}
            </h2>
          </div>
          <button ref={closeRef} type="button" className={styles.close} aria-label={t('hud.close')} onClick={onClose}>
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className={styles.body}>
          <Body />
        </div>
      </motion.section>
    </motion.div>
  );
}
