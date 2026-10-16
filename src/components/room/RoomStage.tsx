import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WORLD_HEIGHT, WORLD_WIDTH } from '../../game/engine/dimensions';
import type { RoomEngine } from '../../game/engine/RoomEngine';
import { SECTION_IDS } from '../../game/world/layout';
import { useAppStore } from '../../state/useAppStore';
import { ObjectTag } from './ObjectTag';
import { OnboardingHint } from './OnboardingHint';
import styles from './RoomStage.module.css';
import { useRoomKeyboard } from './useRoomKeyboard';
import { useRoomScale } from './useRoomScale';

type Status = 'loading' | 'ready' | 'error';

/** Hosts the Pixi canvas and the small DOM layer that sits on top of it (labels, keyboard targets). */
export function RoomStage() {
  const { t } = useTranslation();
  const hostRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<RoomEngine | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const scale = useRoomScale();
  const hovered = useAppStore((s) => s.hoveredSection);
  const openSection = useAppStore((s) => s.openSection);
  const timeOfDay = useAppStore((s) => s.timeOfDay);
  const panelOpen = useAppStore((s) => s.activeSection !== null);
  useRoomKeyboard(engine);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let instance: RoomEngine | null = null;
    const store = useAppStore.getState();
    // Loaded on demand so the page shell renders before the renderer bundle arrives.
    import('../../game/engine/RoomEngine')
      .then(({ RoomEngine }) =>
        RoomEngine.create(
          host,
          { onHover: store.setHovered, onInteract: store.openSection, onWalk: store.markExplored },
          {
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            timeOfDay: store.timeOfDay,
          },
        ),
      )
      .then((created) => {
        if (cancelled) {
          created.destroy();
          return;
        }
        instance = created;
        setEngine(created);
        setStatus('ready');
      })
      .catch((error: unknown) => {
        console.error(error);
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
      instance?.destroy();
    };
  }, []);

  useEffect(() => {
    engine?.setTimeOfDay(timeOfDay);
  }, [engine, timeOfDay]);

  // If the room is a little wider than the screen (phones), keep it centred.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) viewport.scrollLeft = (viewport.scrollWidth - viewport.clientWidth) / 2;
  }, [scale]);

  const toView = (p: { x: number; y: number }) => ({ left: p.x * scale, top: p.y * scale });

  return (
    <div ref={viewportRef} className={styles.viewport} data-panel-open={panelOpen}>
      <div
        className={styles.stage}
        style={{ width: WORLD_WIDTH * scale, height: WORLD_HEIGHT * scale }}
        role="group"
        aria-label={t('room.label')}
      >
        <div ref={hostRef} className={styles.canvasHost} aria-hidden="true" />

        {engine && hovered && <ObjectTag section={hovered} style={toView(engine.markerPosition(hovered))} />}

        {engine &&
          SECTION_IDS.map((section) => (
            <ObjectTag
              key={section}
              as="button"
              section={section}
              style={toView(engine.markerPosition(section))}
              onActivate={() => engine.goToSection(section)}
            />
          ))}

        {status === 'loading' && <p className={styles.status}>{t('hud.loading')}</p>}
      </div>

      {status === 'error' && (
        <div className={styles.fallback}>
          <p>{t('hud.error')}</p>
          <ul>
            {SECTION_IDS.map((section) => (
              <li key={section}>
                <button type="button" onClick={() => openSection(section)}>
                  {t(`sections.${section}`)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {status === 'ready' && <OnboardingHint />}
    </div>
  );
}
