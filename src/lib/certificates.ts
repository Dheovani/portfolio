import architectureCertificate from '../assets/certificates/Pós-graduação Lato Sensu em Arquitetura de Software.pdf';
import architecturePreview from '../assets/previews/Pós-graduação Lato Sensu em Arquitetura de Software.jpg';
import bachelorCertificate from '../assets/certificates/Diploma Bacharel em Engenharia de Software.pdf';
import bachelorPreview from '../assets/previews/Diploma Bacharel em Engenharia de Software-1_page-0001.jpg';
import dataCertificate from '../assets/certificates/Pós-graduação Lato Sensu em Inteligência Artificial e Análise de Dados.pdf';
import dataPreview from '../assets/previews/Pós-graduação Lato Sensu em Inteligência Artificial e Análise de Dados.jpg';
import microsoftCertificate from '../assets/certificates/Microsoft Learn Student Ambassador Certificate.pdf';
import microsoftPreview from '../assets/previews/Microsoft Learn Student Ambassador Certificate-1.png';

export const certificates = [
	{
		titleKey: 'experience.architecture.title',
		descriptionKey: 'experience.architecture.description',
		metaKey: 'experience.architecture.meta',
		pdf: architectureCertificate,
		preview: architecturePreview,
	},
	{
		titleKey: 'experience.data.title',
		descriptionKey: 'experience.data.description',
		metaKey: 'experience.data.meta',
		pdf: dataCertificate,
		preview: dataPreview,
	},
	{
		titleKey: 'experience.bachelor.title',
		descriptionKey: 'experience.bachelor.description',
		metaKey: 'experience.bachelor.meta',
		pdf: bachelorCertificate,
		preview: bachelorPreview,
	},
	{
		titleKey: 'experience.microsoft.title',
		descriptionKey: 'experience.microsoft.description',
		metaKey: 'experience.microsoft.meta',
		pdf: microsoftCertificate,
		preview: microsoftPreview,
	},
] as const;

export const educationTimeline = [
	{
		periodKey: 'experience.timeline.bachelor.period',
		titleKey: 'experience.bachelor.title',
		descriptionKey: 'experience.timeline.bachelor.description',
	},
	{
		periodKey: 'experience.timeline.microsoft.period',
		titleKey: 'experience.microsoft.title',
		descriptionKey: 'experience.timeline.microsoft.description',
	},
	{
		periodKey: 'experience.timeline.architecture.period',
		titleKey: 'experience.architecture.title',
		descriptionKey: 'experience.timeline.architecture.description',
	},
	{
		periodKey: 'experience.timeline.data.period',
		titleKey: 'experience.data.title',
		descriptionKey: 'experience.timeline.data.description',
	},
] as const;
