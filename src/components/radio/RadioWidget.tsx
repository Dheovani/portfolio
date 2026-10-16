import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { ALBUM, TRACKS } from '../../audio/playlist';
import { radio } from '../../audio/radio';
import { useRadioStore } from '../../state/useRadioStore';
import { ICONS } from '../ui/icons';
import { PixelIcon } from '../ui/PixelIcon';
import styles from './RadioWidget.module.css';

/**
 * Lo-fi radio in the bottom-left corner: a small dock (open + play/pause) that expands into a card
 * with the track, transport, volume and credits. Playback itself lives in `radio`, outside React.
 */
export function RadioWidget() {
  const { t } = useTranslation();
  const index = useRadioStore((s) => s.index);
  const status = useRadioStore((s) => s.status);
  const volume = useRadioStore((s) => s.volume);
  const muted = useRadioStore((s) => s.muted);
  const [open, setOpen] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const cardId = useId();

  const track = TRACKS[index]!;
  const active = status === 'playing' || status === 'loading';
  const percent = Math.round(volume * 100);
  const silent = muted || volume === 0;
  const playLabel = active ? t('radio.pause') : t('radio.play');
  const statusText = {
    idle: t('radio.ready'),
    loading: t('radio.loading'),
    playing: t('radio.playing'),
    paused: t('radio.paused'),
    blocked: t('radio.blocked'),
    error: t('radio.error'),
  }[status];

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('pointerdown', onPointer);
    return () => window.removeEventListener('pointerdown', onPointer);
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className={styles.radio}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          setOpen(false);
          toggleRef.current?.focus();
        }
      }}
    >
      {open && (
        <section id={cardId} className={styles.card} aria-label={t('radio.label')}>
          <div className={styles.screen}>
            <p className={styles.status} data-status={status}>
              {statusText}
              <span className={styles.counter}>
                {index + 1}/{TRACKS.length}
              </span>
            </p>
            <p className={styles.title}>{track.title}</p>
            <p className={styles.artist}>
              {ALBUM.artist} · {ALBUM.title}
            </p>
          </div>

          <div className={styles.transport}>
            <button type="button" className={styles.button} aria-label={t('radio.previous')} onClick={() => radio.previous()}>
              <PixelIcon rows={ICONS.previous} />
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.primary}`}
              aria-label={playLabel}
              onClick={() => radio.toggle()}
            >
              <PixelIcon rows={active ? ICONS.pause : ICONS.play} size={16} />
            </button>
            <button type="button" className={styles.button} aria-label={t('radio.next')} onClick={() => radio.next()}>
              <PixelIcon rows={ICONS.next} />
            </button>
          </div>

          <div className={styles.volume}>
            <button
              type="button"
              className={styles.button}
              aria-label={t('radio.mute')}
              aria-pressed={muted}
              onClick={() => radio.setMuted(!muted)}
            >
              <PixelIcon rows={silent ? ICONS.muted : ICONS.volume} />
            </button>
            <input
              type="range"
              className={styles.slider}
              min={0}
              max={100}
              step={5}
              value={percent}
              aria-label={t('radio.volume')}
              aria-valuetext={`${percent}%`}
              style={{ '--fill': `${silent ? 0 : percent}%` } as CSSProperties}
              onChange={(e) => radio.setVolume(Number(e.target.value) / 100)}
            />
            <span className={styles.percent} aria-hidden="true">
              {silent ? '—' : `${percent}%`}
            </span>
          </div>

          <button
            type="button"
            className={styles.creditsToggle}
            aria-expanded={showCredits}
            onClick={() => setShowCredits(!showCredits)}
          >
            <PixelIcon rows={ICONS.info} size={12} />
            {t('radio.credits')}
          </button>
          {showCredits && (
            <dl className={styles.credits}>
              <div>
                <dt>{t('radio.artist')}</dt>
                <dd>{ALBUM.artist}</dd>
              </div>
              <div>
                <dt>{t('radio.album')}</dt>
                <dd>
                  <a href={ALBUM.url} target="_blank" rel="noopener noreferrer">
                    {ALBUM.title} ↗
                  </a>
                </dd>
              </div>
              <div>
                <dt>{t('radio.license')}</dt>
                <dd>
                  <a href={ALBUM.licenseUrl} target="_blank" rel="noopener noreferrer">
                    {ALBUM.license} ↗
                  </a>
                </dd>
              </div>
              <p className={styles.note}>{t('radio.unmodified')}</p>
            </dl>
          )}
        </section>
      )}

      <div className={styles.dock}>
        <button
          ref={toggleRef}
          type="button"
          className={styles.dockOpen}
          aria-expanded={open}
          aria-controls={open ? cardId : undefined}
          aria-label={open ? t('radio.close') : t('radio.open')}
          title={`${track.title} · ${ALBUM.artist}`}
          onClick={() => setOpen(!open)}
        >
          <PixelIcon rows={ICONS.radio} size={16} />
          <span className={styles.bars} data-active={status === 'playing'} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
        <button type="button" className={styles.dockPlay} aria-label={playLabel} onClick={() => radio.toggle()}>
          <PixelIcon rows={active ? ICONS.pause : ICONS.play} />
        </button>
      </div>

      <p className="sr-only" role="status">
        {status === 'blocked' || status === 'error' ? statusText : ''}
      </p>
    </div>
  );
}
