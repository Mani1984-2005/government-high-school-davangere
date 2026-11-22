import React, { useState } from 'react';
import {
  Clock,
  BookOpen,
  Calendar,
  FileText,
  Award,
  FlaskConical,
  Download,
  Printer,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  BELL_SCHEDULE,
  SSLC_STUDY_MATERIALS,
  ACADEMIC_CALENDAR,
  SCHOOL_INFO,
} from '../data/schoolData';
import { SCHOOL_MEDIA } from '../assets/media';
import { StudyMaterial } from '../types';
import {
  Alert,
  Badge,
  Button,
  Card,
  Modal,
  SafeImage,
  SectionHeading,
  Tabs,
  TabItem,
} from './ui';

type AcademicTabId = 'schedule' | 'curriculum' | 'calendar' | 'resources';

export const AcademicsSection: React.FC = () => {
  const { lang, t, pick } = useApp();
  const [activeTab, setActiveTab] = useState<AcademicTabId>('schedule');
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);

  const tabs: TabItem<AcademicTabId>[] = [
    { id: 'schedule', label: t.academics_tab_schedule },
    { id: 'curriculum', label: t.academics_tab_curriculum },
    { id: 'calendar', label: t.academics_tab_calendar },
    { id: 'resources', label: t.academics_tab_resources },
  ];

  const subjects = [
    { kn: 'ಪ್ರಥಮ ಭಾಷೆ (ಕನ್ನಡ / ಇಂಗ್ಲಿಷ್)', en: 'First Language (Kannada / English)' },
    { kn: 'ದ್ವಿತೀಯ ಭಾಷೆ (ಇಂಗ್ಲಿಷ್ / ಕನ್ನಡ)', en: 'Second Language (English / Kannada)' },
    { kn: 'ತೃತೀಯ ಭಾಷೆ (ಹಿಂದಿ)', en: 'Third Language (Hindi)' },
    { kn: 'ಗಣಿತ ಶಾಸ್ತ್ರ', en: 'Mathematics' },
    { kn: 'ಸಾಮಾನ್ಯ ವಿಜ್ಞಾನ (ಭೌತ / ರಸಾಯನ / ಜೀವಶಾಸ್ತ್ರ)', en: 'General Science (Physics / Chemistry / Biology)' },
    { kn: 'ಸಮಾಜ ವಿಜ್ಞಾನ (ಇತಿಹಾಸ & ಭೂಗೋಳ)', en: 'Social Science (History & Geography)' },
    { kn: 'ದೈಹಿಕ ಶಿಕ್ಷಣ, ಕ್ರೀಡೆ, ಯೋಗ & ಸ್ಕೌಟ್ಸ್-ಗೈಡ್ಸ್', en: 'Physical Education, Sports, Yoga & Scouts' },
    { kn: 'ಕಂಪ್ಯೂಟರ್ & ಸ್ಮಾರ್ಟ್ ಕ್ಲಾಸ್ (ICT)', en: 'ICT & Computer Education' },
  ];

  const handleDownloadMaterialSpec = (mat: StudyMaterial) => {
    const content = [
      pick(SCHOOL_INFO.nameKn, SCHOOL_INFO.nameEn),
      `${pick(SCHOOL_INFO.deptKn, SCHOOL_INFO.deptEn)} | UDISE: ${SCHOOL_INFO.udise}`,
      '------------------------------------------------------------',
      `SSLC Study Capsule (${mat.year})`,
      `Title: ${pick(mat.titleKn, mat.titleEn)}`,
      `Subject: ${pick(mat.subjectKn, mat.subjectEn)}`,
      `Medium: ${pick(mat.mediumKn, mat.mediumEn)}`,
      `Planned File Size: ${mat.fileSize}`,
      '',
      pick(
        'ಸೂಚನೆ: ಇದು ಶಾಲಾ ಪೋರ್ಟಲ್ ಕರಡು ಅಧ್ಯಯನ ಮಾಹಿತಿ ಪ್ರತಿಯಾಗಿದೆ. ಸಂಪೂರ್ಣ ಮುದ್ರಿತ ಕೈಪಿಡಿಗಾಗಿ ಶಾಲೆಯ ವಿಷಯ ಶಿಕ್ಷಕರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
        'Note: This is a structured study capsule summary from the school portal. Please contact subject faculty at school for the full printed KSEAB revision booklet.'
      ),
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sslc-study-guide-${mat.year}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="academics"
      aria-labelledby="academics-section-heading"
      className="py-12 bg-slate-50 border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <SectionHeading
          headingId="academics-section-heading"
          kickerEn="KSEAB CURRICULUM · SSLC EXCELLENCE"
          kickerKn="ಪಠ್ಯಕ್ರಮ & ಪರೀಕ್ಷಾ ವಿಭಾಗ"
          title={t.academics_heading}
          subtitle={t.academics_sub}
          action={
            <Badge tone="success" icon={<Award className="w-3.5 h-3.5" />}>
              {t.pass_rate_badge}
            </Badge>
          }
        />

        {/* Section Sub-Navigation Tabs */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 space-y-6 shadow-2xs">
          <Tabs
            items={tabs}
            activeId={activeTab}
            onChange={setActiveTab}
            ariaLabel={t.academics_heading}
            idPrefix="academics"
            variant="underline"
          />

          {/* TAB 1: DAILY BELL SCHEDULE */}
          {activeTab === 'schedule' && (
            <div
              id="academics-panel-schedule"
              role="tabpanel"
              aria-labelledby="academics-tab-schedule"
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
                  <h3 className="text-base font-bold text-[#13325e] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" aria-hidden="true" />
                    <span>{t.bell_title}</span>
                  </h3>
                  <span className="text-xs font-mono font-semibold text-slate-600 tabular-nums">
                    09:45 AM – 04:30 PM
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {BELL_SCHEDULE.map((slot, index) => {
                    const bgClass =
                      slot.type === 'lunch'
                        ? 'bg-amber-50/80 border-amber-200 font-semibold'
                        : slot.type === 'prayer'
                        ? 'bg-blue-50/60 border-blue-200'
                        : slot.type === 'activity'
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-slate-50 border-slate-200';

                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-md border flex flex-col sm:flex-row sm:items-center justify-between gap-1 ${bgClass}`}
                      >
                        <span className="font-bold text-slate-900">
                          {pick(slot.slotKn, slot.slotEn)}
                        </span>
                        <div className="flex items-center gap-2 shrink-0 text-slate-600">
                          <span className="font-mono font-bold text-[#13325e] tabular-nums">
                            {slot.time}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            ({pick(slot.durationKn, slot.durationEn)})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="relative rounded-lg overflow-hidden border border-slate-200">
                  <SafeImage
                    src={SCHOOL_MEDIA.scienceLab}
                    alt={pick(
                      'ವಿಜ್ಞಾನ ಮತ್ತು ಗಣಿತ ಪ್ರಯೋಗಾಲಯ',
                      'High School Science and Mathematics Laboratory'
                    )}
                    className="w-full h-52 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent flex items-end p-4">
                    <div className="text-white space-y-1">
                      <p className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                        <FlaskConical className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{lang === 'kn' ? 'ಪ್ರಾಯೋಗಿಕ ಕಲಿಕೆ' : 'Hands-on Science'}</span>
                      </p>
                      <h4 className="text-sm font-bold">
                        {pick(
                          'ವಿಜ್ಞಾನ ಮತ್ತು ಗಣಿತ ಪ್ರಯೋಗಾಲಯ (DSERT ಮಾನ್ಯತೆ)',
                          'Fully Equipped Science & Mathematics Laboratory'
                        )}
                      </h4>
                    </div>
                  </div>
                </div>

                <Card surface="muted" padding="md" className="space-y-2">
                  <h4 className="text-sm font-bold text-[#13325e]">{t.sslc_desk_title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{t.sslc_desk_desc}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('resources')}
                    leftIcon={<FileText className="w-3.5 h-3.5" />}
                  >
                    {t.btn_download_mat}
                  </Button>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 2: CLASSES, SUBJECTS & EXAMS */}
          {activeTab === 'curriculum' && (
            <div
              id="academics-panel-curriculum"
              role="tabpanel"
              aria-labelledby="academics-tab-curriculum"
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-base font-bold text-[#13325e] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-600" aria-hidden="true" />
                  <span>{t.academics_classes_title}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pick(SCHOOL_INFO.gradesKn, SCHOOL_INFO.gradesEn)} ·{' '}
                  {pick(SCHOOL_INFO.mediumKn, SCHOOL_INFO.mediumEn)}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {subjects.map((sub, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-md border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800"
                    >
                      {pick(sub.kn, sub.en)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <Card surface="tinted" padding="md" className="space-y-3">
                  <h3 className="text-base font-bold text-[#13325e]">
                    {t.academics_exam_title}
                  </h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <li>• {t.academics_exam_rule_1}</li>
                    <li>• {t.academics_exam_rule_2}</li>
                    <li>• {t.academics_exam_rule_3}</li>
                  </ul>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 3: ACADEMIC CALENDAR */}
          {activeTab === 'calendar' && (
            <div
              id="academics-panel-calendar"
              role="tabpanel"
              aria-labelledby="academics-tab-calendar"
              className="space-y-5"
            >
              <Alert tone="warning">{t.academics_calendar_note}</Alert>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ACADEMIC_CALENDAR.map((item) => (
                  <Card key={item.id} surface="muted" padding="md" className="space-y-2">
                    <p className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{pick(item.periodKn, item.periodEn)}</span>
                    </p>
                    <h3 className="text-sm sm:text-base font-bold text-[#13325e]">
                      {pick(item.titleKn, item.titleEn)}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {pick(item.descKn, item.descEn)}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SSLC STUDY RESOURCES */}
          {activeTab === 'resources' && (
            <div
              id="academics-panel-resources"
              role="tabpanel"
              aria-labelledby="academics-tab-resources"
              className="space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-bold text-[#13325e]">{t.sslc_desk_title}</h3>
                <span className="text-xs font-medium text-slate-600">{t.sslc_desk_desc}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SSLC_STUDY_MATERIALS.map((mat, i) => (
                  <Card
                    key={i}
                    surface="muted"
                    padding="md"
                    interactive
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0 space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-[#13325e] leading-snug">
                        {pick(mat.titleKn, mat.titleEn)}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {pick(mat.subjectKn, mat.subjectEn)} · {pick(mat.mediumKn, mat.mediumEn)} ·{' '}
                        <span className="font-mono">{mat.fileSize}</span>
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedMaterial(mat)}
                    >
                      {lang === 'kn' ? 'ವೀಕ್ಷಿಸಿ' : 'View'}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Co-Curricular Clubs Strip */}
        <Card surface="white" padding="md">
          <h3 className="text-base font-bold text-[#13325e] mb-4">{t.clubs_title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-700">
            <Card surface="muted" padding="sm">
              <strong className="block font-bold text-emerald-900 mb-1">
                {lang === 'kn' ? 'ಭಾರತ್ ಸ್ಕೌಟ್ಸ್ ಮತ್ತು ಗೈಡ್ಸ್' : 'Bharat Scouts & Guides'}
              </strong>
              <p className="leading-relaxed">{t.club_1}</p>
            </Card>
            <Card surface="muted" padding="sm">
              <strong className="block font-bold text-emerald-900 mb-1">
                {lang === 'kn' ? 'ಇಕೋ ಕ್ಲಬ್ (Eco Club)' : 'Eco Club'}
              </strong>
              <p className="leading-relaxed">{t.club_2}</p>
            </Card>
            <Card surface="muted" padding="sm">
              <strong className="block font-bold text-emerald-900 mb-1">
                {lang === 'kn' ? 'ವಿಜ್ಞಾನ ಸಂಘ & ಗಣಿತ ವೇದಿಕೆ' : 'Science & Math Forum'}
              </strong>
              <p className="leading-relaxed">{t.club_3}</p>
            </Card>
            <Card surface="muted" padding="sm">
              <strong className="block font-bold text-emerald-900 mb-1">
                {lang === 'kn' ? 'ಪ್ರತಿಭಾ ಕಾರಂಜಿ' : 'Prathibha Karanji'}
              </strong>
              <p className="leading-relaxed">{t.club_4}</p>
            </Card>
          </div>
        </Card>
      </div>

      {/* Accessible Study Material Preview Modal */}
      <Modal
        isOpen={Boolean(selectedMaterial)}
        onClose={() => setSelectedMaterial(null)}
        titleId="study-material-modal-title"
        subtitle={selectedMaterial ? `SSLC STUDY CAPSULE · ${selectedMaterial.year}` : undefined}
        title={
          selectedMaterial ? pick(selectedMaterial.titleKn, selectedMaterial.titleEn) : ''
        }
        closeLabel={t.a11y_close_dialog}
        maxWidth="lg"
        printable
        footer={
          selectedMaterial && (
            <div className="flex flex-wrap items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadMaterialSpec(selectedMaterial)}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                {t.btn_download_specimen}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => window.print()}
                leftIcon={<Printer className="w-3.5 h-3.5" />}
              >
                {lang === 'kn' ? 'ಮುದ್ರಿಸಿ / PDF ಉಳಿಸಿ' : 'Print / Save PDF'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedMaterial(null)}
              >
                {t.close}
              </Button>
            </div>
          )
        }
      >
        {selectedMaterial && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <dl className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-2">
              <div className="flex justify-between gap-4">
                <dt className="font-semibold text-slate-600">
                  {lang === 'kn' ? 'ವಿಷಯ:' : 'Subject:'}
                </dt>
                <dd className="font-bold text-slate-900">
                  {pick(selectedMaterial.subjectKn, selectedMaterial.subjectEn)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-semibold text-slate-600">
                  {lang === 'kn' ? 'ಮಾಧ್ಯಮ:' : 'Medium:'}
                </dt>
                <dd className="font-bold text-slate-900">
                  {pick(selectedMaterial.mediumKn, selectedMaterial.mediumEn)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-semibold text-slate-600">
                  {lang === 'kn' ? 'ಕಡತದ ಗಾತ್ರ:' : 'File Size:'}
                </dt>
                <dd className="font-mono font-semibold text-slate-900">
                  {selectedMaterial.fileSize}
                </dd>
              </div>
            </dl>

            <p className="leading-relaxed text-slate-600">
              {lang === 'kn'
                ? 'ಈ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಯನ್ನು ಕರ್ನಾಟಕ ಶಾಲಾ ಪರೀಕ್ಷೆ ಮತ್ತು ಮೌಲ್ಯನಿರ್ಣಯ ಮಂಡಳಿಯ (KSEAB) ನೂತನ ಮಾದರಿ ಪ್ರಶ್ನೆಪತ್ರಿಕೆ ಮತ್ತು ನೀಲನಕ್ಷೆಯ ಆಧಾರದ ಮೇಲೆ ನಮ್ಮ ನುರಿತ ಶಿಕ್ಷಕರು ರೂಪಿಸಿದ್ದಾರೆ. ಪೂರ್ಣ ಮುದ್ರಿತ ಕೈಪಿಡಿ ಶಾಲಾ ಗ್ರಂಥಾಲಯ ಮತ್ತು ವಿಷಯ ಶಿಕ್ಷಕರಿಂದ ಲಭ್ಯವಿರುತ್ತದೆ.'
                : 'Structured according to the official KSEAB exam blueprint and question bank by senior faculty of GHS Davangere. Complete printed revision booklets are distributed through subject faculty.'}
            </p>
          </div>
        )}
      </Modal>
    </section>
  );
};
