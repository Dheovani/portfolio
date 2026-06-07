import en from '../messages/en.json';
import pt from '../messages/pt.json';

export const defaultLang = 'pt';

export const messages = {
	pt,
	en,
};

export type Language = keyof typeof messages;
export type MessageKey = keyof typeof pt;

export const navItems = [
	{ href: '#inicio', key: 'nav.home' },
	{ href: '#sobre', key: 'nav.about' },
	{ href: '#projetos', key: 'nav.projects' },
	{ href: '#experiencia', key: 'nav.experience' },
	{ href: '#contato', key: 'nav.contact' },
] as const;

export const sections = [
	{ id: 'projetos', key: 'projects' },
	{ id: 'experiencia', key: 'experience' },
	{ id: 'contato', key: 'contact' },
] as const;

export const t = (key: MessageKey, lang: Language = defaultLang) => messages[lang][key];
