import { useTranslation } from 'react-i18next';
import styles from './App.module.css';
import { HelpButton } from './components/hud/HelpButton';
import { IdentityTag } from './components/hud/IdentityTag';
import { LanguageSwitcher } from './components/hud/LanguageSwitcher';
import { ThemeSwitch } from './components/hud/ThemeSwitch';
import { SectionPanel } from './components/panel/SectionPanel';
import { RoomStage } from './components/room/RoomStage';
import { profile } from './content/profile';
import { useLocale } from './i18n';

export function App() {
  const { t } = useTranslation();
  const { pick } = useLocale();
  return (
    <main className={styles.app}>
      <h1 className="sr-only">
        {profile.name} · {pick(profile.role)}
      </h1>
      <p className="sr-only">{t('help.intro')}</p>
      <RoomStage />
      <IdentityTag />
      <div className={styles.controls}>
        <LanguageSwitcher />
        <ThemeSwitch />
        <HelpButton />
      </div>
      <SectionPanel />
    </main>
  );
}
