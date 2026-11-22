import React from 'react';
import {
  BookOpen,
  FileText,
  Users,
  Bell,
  Image as ImageIcon,
  Building2,
  Award,
  PhoneCall,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePortal } from '../context/AuthContext';
import { Card, SectionHeading } from './ui';

interface QuickAccessSectionProps {
  onOpenServiceModal: () => void;
}

export const QuickAccessSection: React.FC<QuickAccessSectionProps> = ({
  onOpenServiceModal,
}) => {
  const { t, pick } = useApp();
  const { navigateToHomeSection } = usePortal();

  const items = [
    {
      id: 'qa-academics',
      titleKn: 'ತರಗತಿ & ಪಠ್ಯಕ್ರಮ',
      titleEn: 'Academics',
      descKn: 'ದೈನಂದಿನ ವೇಳಾಪಟ್ಟಿ, KSEAB ವಿಷಯಗಳು & SSLC ಸಾಮಗ್ರಿ',
      descEn: 'Daily schedule, KSEAB subjects & SSLC study resources',
      icon: <BookOpen className="w-5 h-5 text-[#13325e]" aria-hidden="true" />,
      action: () => navigateToHomeSection('academics'),
    },
    {
      id: 'qa-services',
      titleKn: 'ವಿದ್ಯಾರ್ಥಿ ಸೇವೆಗಳು',
      titleEn: 'Student Services',
      descKn: 'ದಾಖಲಾತಿ, TC, ವ್ಯಾಸಂಗ ಪ್ರಮಾಣಪತ್ರ & ಕಚೇರಿ ಮಾರ್ಗದರ್ಶಿ',
      descEn: 'Admissions, TC, Study Certificate & office checklist',
      icon: <FileText className="w-5 h-5 text-[#13325e]" aria-hidden="true" />,
      action: onOpenServiceModal,
    },
    {
      id: 'qa-faculty',
      titleKn: 'ಶಿಕ್ಷಕ ವೃಂದ',
      titleEn: 'Faculty',
      descKn: 'ಮುಖ್ಯ ಶಿಕ್ಷಕರು ಮತ್ತು ವಿಷಯ ಬೋಧಕ ಸಿಬ್ಬಂದಿ ವಿವರ',
      descEn: 'Headmaster and subject teaching staff directory',
      icon: <Users className="w-5 h-5 text-[#13325e]" aria-hidden="true" />,
      action: () => navigateToHomeSection('faculty'),
    },
    {
      id: 'qa-notices',
      titleKn: 'ಸೂಚನಾ ಫಲಕ',
      titleEn: 'Notice Board',
      descKn: 'ಅಧಿಕೃತ ಸುತ್ತೋಲೆಗಳು, ಪರೀಕ್ಷೆ & ವಿದ್ಯಾರ್ಥಿವೇತನ ಆದೇಶ',
      descEn: 'Official circulars, exam timetables & scholarship notices',
      icon: <Bell className="w-5 h-5 text-[#13325e]" aria-hidden="true" />,
      action: () => navigateToHomeSection('notices'),
    },
    {
      id: 'qa-gallery',
      titleKn: 'ಭಾವಚಿತ್ರಗಳು',
      titleEn: 'Gallery',
      descKn: 'ಶಾಲಾ ಆವರಣ, ಪ್ರಯೋಗಾಲಯ, ಬಿಸಿಯೂಟ & ಕ್ರೀಡಾ ಕ್ಷಣಗಳು',
      descEn: 'Campus courtyard, science lab, meals & sports photos',
      icon: <ImageIcon className="w-5 h-5 text-[#13325e]" aria-hidden="true" />,
      action: () => navigateToHomeSection('gallery'),
    },
    {
      id: 'qa-about',
      titleKn: 'ಶಾಲೆಯ ಬಗ್ಗೆ',
      titleEn: 'About the School',
      descKn: '1968 ರ ಪರಂಪರೆ, ದೂರದೃಷ್ಟಿ, ಧ್ಯೇಯ & ಮೂಲಸೌಕರ್ಯ',
      descEn: 'Established 1968 heritage, vision, mission & facilities',
      icon: <Building2 className="w-5 h-5 text-[#13325e]" aria-hidden="true" />,
      action: () => navigateToHomeSection('about'),
    },
    {
      id: 'qa-schemes',
      titleKn: 'ಸರ್ಕಾರಿ ಸವಲತ್ತುಗಳು',
      titleEn: 'Government Schemes',
      descKn: 'ಅಕ್ಷರ ದಾಸೋಹ, SSP ವಿದ್ಯಾರ್ಥಿವೇತನ, NMMS & RBSK ಆರೋಗ್ಯ',
      descEn: 'Mid-day meals, SSP scholarships, NMMS & RBSK health',
      icon: <Award className="w-5 h-5 text-[#13325e]" aria-hidden="true" />,
      action: () => navigateToHomeSection('schemes'),
    },
    {
      id: 'qa-contact',
      titleKn: 'ಸಂಪರ್ಕಿಸಿ',
      titleEn: 'Contact',
      descKn: 'ಶಾಲಾ ವಿಳಾಸ, ಬಸ್ ಮಾರ್ಗ, ಸಹಾಯವಾಣಿ & ಕಚೇರಿ ಇಮೇಲ್',
      descEn: 'Postal address, transit guide, helplines & office email',
      icon: <PhoneCall className="w-5 h-5 text-[#13325e]" aria-hidden="true" />,
      action: () => navigateToHomeSection('contact'),
    },
  ];

  return (
    <section
      id="quick-access"
      aria-labelledby="quick-access-heading"
      className="py-10 bg-slate-50 border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          headingId="quick-access-heading"
          kickerEn={t.quick_kicker_en}
          kickerKn={t.quick_kicker_kn}
          title={t.quick_heading}
          subtitle={t.quick_sub}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              className="text-left group cursor-pointer focus:outline-none rounded-lg"
            >
              <Card
                surface="white"
                padding="md"
                interactive
                className="h-full flex flex-col justify-between gap-3 group-hover:border-[#13325e] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 group-hover:bg-amber-50 group-hover:border-amber-300 transition-colors">
                    {item.icon}
                  </div>
                  <ArrowUpRight
                    className="w-4 h-4 text-slate-400 group-hover:text-[#13325e] transition-colors shrink-0"
                    aria-hidden="true"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-[#13325e] leading-snug">
                    {pick(item.titleKn, item.titleEn)}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pick(item.descKn, item.descEn)}
                  </p>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
