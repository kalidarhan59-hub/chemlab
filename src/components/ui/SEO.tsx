import React, { useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image = '/icons/icon-512.svg',
  path = '',
}) => {
  const { language } = useLanguage();

  useEffect(() => {
    const defaultTitles: Record<string, string> = {
      kk: 'ChemLab - Көптілді химия білім беру порталы',
      ru: 'ChemLab - Интерактивная многоязычная платформа по химии',
      en: 'ChemLab - Interactive Multilingual Chemistry Platform',
    };

    const defaultDescriptions: Record<string, string> = {
      kk: 'Заманауи, интерактивті және көптілді химия порталы. Периодтық кесте, реакциялар теңдестіруші, 3D молекулалар және ҰБТ-ға дайындық.',
      ru: 'Современная интерактивная химическая лаборатория. Таблица Менделеева, балансировщик уравнений, 3D молекулы и подготовка к экзаменам.',
      en: 'Modern interactive chemistry platform: periodic table, equation balancer, 3D molecules, and curriculum quizzes.',
    };

    const finalTitle = title
      ? `${title} | ChemLab`
      : defaultTitles[language] || defaultTitles.kk;
    const finalDesc = description || defaultDescriptions[language] || defaultDescriptions.kk;

    // Document Title
    document.title = finalTitle;

    // HTML Lang
    document.documentElement.lang = language;

    // Meta helpers
    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [k, v] = selector.replace(/[\[\]"]/g, '').split('=');
        if (k && v) el.setAttribute(k, v);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', finalDesc);
    setMeta('meta[property="og:title"]', 'content', finalTitle);
    setMeta('meta[property="og:description"]', 'content', finalDesc);
    setMeta('meta[property="og:image"]', 'content', image);
    setMeta('meta[name="twitter:title"]', 'content', finalTitle);
    setMeta('meta[name="twitter:description"]', 'content', finalDesc);

    // Hreflang alternates
    const languages = ['kk', 'ru', 'en'];
    languages.forEach((lang) => {
      let link = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = lang;
        document.head.appendChild(link);
      }
      link.href = `${window.location.origin}/${lang}${path ? `/${path.replace(/^\//, '')}` : ''}`;
    });

    // Default hreflang
    let xDefault = document.querySelector('link[rel="alternate"][hreflang="x-default"]') as HTMLLinkElement;
    if (!xDefault) {
      xDefault = document.createElement('link');
      xDefault.rel = 'alternate';
      xDefault.hreflang = 'x-default';
      document.head.appendChild(xDefault);
    }
    xDefault.href = `${window.location.origin}/kk${path ? `/${path.replace(/^\//, '')}` : ''}`;
  }, [title, description, image, path, language]);

  return null;
};
