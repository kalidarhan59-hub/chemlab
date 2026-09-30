import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldAlert,
  Glasses,
  Hand,
  Wind,
  Ban,
  Flame,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Modal } from '../ui/Modal';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptPledge: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({
  isOpen,
  onClose,
  onAcceptPledge,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'kk') as 'kk' | 'ru' | 'en';

  const rules = [
    {
      icon: <Glasses className="w-5 h-5 text-teal-400" />,
      title: {
        kk: 'Қорғаныш көзілдірігі',
        ru: 'Защитные очки',
        en: 'Safety Goggles',
      },
      desc: {
        kk: 'Көзді химиялық заттардың кездейсоқ шашырауынан қорғау үшін зертханада көзілдірік міндетті.',
        ru: 'Всегда надевайте защитные очки при работе с реактивами для защиты глаз от брызг.',
        en: 'Always wear eye protection to prevent accidental chemical splashes.',
      },
    },
    {
      icon: <Hand className="w-5 h-5 text-purple-400" />,
      title: {
        kk: 'Қорғаныш қолғаптары',
        ru: 'Лабораторные перчатки',
        en: 'Protective Gloves',
      },
      desc: {
        kk: 'Күйдіргіш қышқылдармен (HCl, H2SO4) және сілтілермен (NaOH) жұмыс істегенде қолғап киіңіз.',
        ru: 'Защищайте кожу рук перчатками при контакте с едкими кислотами и щелочами.',
        en: 'Wear suitable gloves when handling caustic acids and alkalis.',
      },
    },
    {
      icon: <Wind className="w-5 h-5 text-sky-400" />,
      title: {
        kk: 'Тартпа шкаф (Вытяжка)',
        ru: 'Вытяжной шкаф',
        en: 'Fume Hood',
      },
      desc: {
        kk: 'Улы және өткір иісті газдар бөлінетін реакцияларды (NO2, аммиак) тек тартпа шкафта жүргізіңіз.',
        ru: 'Опыты с выделением токсичных газов (NO2, NH3) проводите исключительно под тягой.',
        en: 'Conduct experiments involving volatile or toxic gases inside a certified fume hood.',
      },
    },
    {
      icon: <Ban className="w-5 h-5 text-rose-400" />,
      title: {
        kk: 'Дәмін татуға және тікелей иіскеуге қатаң тыйым салынады',
        ru: 'Не пробовать на вкус и не нюхать напрямую',
        en: 'Never Taste or Inhale Directly',
      },
      desc: {
        kk: 'Иісті сезу үшін ыдыстың аузынан ауаны алақанмен өзіңізге қарай абайлап желпиді.',
        ru: 'Определяйте запах осторожным движением ладони от горлышка сосуда к носу.',
        en: 'Waft vapors gently toward your face with your hand rather than smelling directly.',
      },
    },
    {
      icon: <Flame className="w-5 h-5 text-amber-400" />,
      title: {
        kk: 'Сынауықты көлбеу ұстап қыздыру',
        ru: 'Нагревание под наклоном',
        en: 'Heat at an Angle',
      },
      desc: {
        kk: 'Сынауықтың аузын өзіңізге немесе қасыңыздағы адамдарға қаратпай, бұрышпен қыздырыңыз.',
        ru: 'Направляйте горлышко пробирки в сторону от себя и окружающих, плавно прогревая всё стекло.',
        en: 'Never point the opening of a heated vessel toward yourself or anyone else.',
      },
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-500 dark:text-amber-400" />
          <span className="text-slate-900 dark:text-white font-bold">
            {t('lab.safety.modalTitle', 'Зертханалық қауіпсіздік ережелері')}
          </span>
        </div>
      }
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Warning Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <span className="font-bold text-amber-800 dark:text-amber-300 block">
              {t('lab.safety.warningBadge', 'Маңызды ескерту:')}
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {t(
                'lab.safety.virtualDisclaimer',
                'Бұл платформадағы барлық тәжірибелер — виртуалды және қауіпсіз. Нақты өмірде бұл реактивтердің көбі (күкірт қышқылы, азот қышқылы, барий тұздары) өмірге қауіпті. Нақты тәжірибелерді үйде ешқашан қайталамаңыз, тек мектеп зертханасында мұғалімнің қадағалауымен жасаңыз!'
              )}
            </p>
          </div>
        </div>

        {/* Rules Grid */}
        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                {rule.icon}
              </div>
              <div className="space-y-0.5 text-xs">
                <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                  {rule.title[currentLang] || rule.title.kk}
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {rule.desc[currentLang] || rule.desc.kk}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Accept Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              onAcceptPledge();
              onClose();
            }}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white dark:text-slate-950 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('lab.safety.pledgeButton', 'Ережелермен таныстым, қабылдаймын')}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
