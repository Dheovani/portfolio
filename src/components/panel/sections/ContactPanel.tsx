import { useTranslation } from 'react-i18next';
import { contacts } from '../../../content/contacts';
import type { ContactKind } from '../../../content/types';
import styles from './sections.module.css';

const GLYPHS: Record<ContactKind, string> = { email: '@', linkedin: 'in', github: '</>' };

export function ContactPanel() {
  const { t } = useTranslation();
  return (
    <div className={styles.stack}>
      <p className={styles.text}>{t('panel.contactIntro')}</p>
      <ul className={styles.list}>
        {contacts.map((contact) => {
          const external = contact.href.startsWith('http');
          return (
            <li key={contact.href}>
              <a
                className={styles.contactRow}
                href={contact.href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
              >
                <span className={styles.glyph} aria-hidden="true">
                  {GLYPHS[contact.kind]}
                </span>
                <span>
                  <span className={styles.contactLabel}>{contact.label}</span>
                  <span className={styles.contactValue}>{contact.value}</span>
                </span>
                <span className={styles.arrow} aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
