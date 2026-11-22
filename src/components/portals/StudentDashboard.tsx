import React, { useState } from 'react';
import {
  User,
  BookOpen,
  CalendarCheck,
  FileText,
  Bell,
  Award,
  Download,
  ExternalLink,
  LogOut,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { usePortal } from '../../context/AuthContext';
import {
  SCHOOL_INFO,
  NOTICES_DATA,
  WELFARE_SCHEMES,
  SSLC_STUDY_MATERIALS,
  ACADEMIC_CALENDAR,
} from '../../data/schoolData';
import { StudyMaterial } from '../../types';
import { PortalNavBar } from '../PortalNavBar';
import { Alert, Badge, Button, Card } from '../ui';

type StudentSection =
  | 'overview'
  | 'academics'
  | 'attendance'
  | 'materials'
  | 'notices'
  | 'welfare';

export const StudentDashboard: React.FC = () => {
  const { lang, t, pick } = useApp();
  const { session, goHome, logout, navigate } = usePortal();
  const [activeSection, setActiveSection] = useState<StudentSection>('overview');

  if (!session || session.role !== 'student') {
    return null;
  }

  const navItems: { id: StudentSection; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: t.student_nav_overview, icon: <User className="w-4 h-4" /> },
    { id: 'academics', label: t.student_nav_academics, icon: <BookOpen className="w-4 h-4" /> },
    {
      id: 'attendance',
      label: t.student_nav_attendance,
      icon: <CalendarCheck className="w-4 h-4" />,
    },
    { id: 'materials', label: t.student_nav_materials, icon: <FileText className="w-4 h-4" /> },
    { id: 'notices', label: t.student_nav_notices, icon: <Bell className="w-4 h-4" /> },
    { id: 'welfare', label: t.student_nav_welfare, icon: <Award className="w-4 h-4" /> },
  ];

  const handleDownloadStudySpec = (mat: StudyMaterial) => {
    const text = [
      pick(SCHOOL_INFO.nameKn, SCHOOL_INFO.nameEn),
      `Student ID: ${session.userId} | UDISE: ${SCHOOL_INFO.udise}`,
      '------------------------------------------------------------',
      `${pick(mat.titleKn, mat.titleEn)} (${mat.year})`,
      `Subject: ${pick(mat.subjectKn, mat.subjectEn)}`,
      `Medium: ${pick(mat.mediumKn, mat.mediumEn)}`,
      '',
      pick(
        'ಸೂಚನೆ: ಪೂರ್ಣ ಮುದ್ರಿತ ಅಧ್ಯಯನ ಕೈಪಿಡಿಗಾಗಿ ಶಾಲೆಯ ವಿಷಯ ಶಿಕ್ಷಕರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
        'Note: Contact subject faculty at school for the complete printed KSEAB booklet.'
      ),
    ].join('\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student-study-guide-${mat.year}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-[80vh] bg-slate-50 flex flex-col">
      <PortalNavBar
        breadcrumbs={[
          { label: t.nav_home, onClick: goHome },
          { label: t.nav_student_portal, onClick: () => navigate('/student-portal') },
          { label: pick('ವಿದ್ಯಾರ್ಥಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', 'Dashboard') },
        ]}
      />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Welcome Banner */}
        <Card surface="white" padding="md" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-[#13325e] text-amber-300 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#13325e]">
                  {t.student_dash_welcome}
                </h2>
                <Badge tone="warning">{t.auth_dev_badge}</Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                <span className="font-mono font-bold text-slate-900">{session.userId}</span>
                {' · '}
                <span>{pick(session.subtitleKn, session.subtitleEn)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                navigate('/');
              }}
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              {t.auth_logout}
            </Button>
          </div>
        </Card>

        <Alert tone="info">{t.student_dash_demo_alert}</Alert>

        {/* Responsive Workspace Layout: Sidebar + Content Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sidebar Navigation */}
          <aside
            aria-label={pick('ವಿದ್ಯಾರ್ಥಿ ವಿಭಾಗಗಳು', 'Student dashboard navigation')}
            className="lg:col-span-3"
          >
            <Card surface="white" padding="sm" className="space-y-1">
              {navItems.map((item) => {
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-md text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer text-left ${
                      active
                        ? 'bg-[#13325e] text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-[#13325e]'
                    }`}
                  >
                    <span className="shrink-0" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </Card>
          </aside>

          {/* Main Dashboard Panel */}
          <div className="lg:col-span-9 space-y-6">
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <Card surface="white" padding="lg" className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <h3 className="text-base sm:text-lg font-bold text-[#13325e]">
                      {pick('ವಿದ್ಯಾರ್ಥಿ ಪ್ರೊಫೈಲ್ ಸಾರಾಂಶ (ಮಾದರಿ ವಿನ್ಯಾಸ)', 'Student Profile Summary (Preview Layout)')}
                    </h3>
                    <span className="text-xs font-mono text-slate-500 tabular-nums">
                      UDISE: {SCHOOL_INFO.udise}
                    </span>
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <dt className="text-slate-500 text-xs">{t.student_id_label}</dt>
                      <dd className="font-mono font-bold text-[#13325e] mt-0.5">{session.userId}</dd>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <dt className="text-slate-500 text-xs">{pick('ಶಾಲೆ', 'Institution')}</dt>
                      <dd className="font-bold text-slate-900 mt-0.5">
                        {pick(SCHOOL_INFO.nameKn, SCHOOL_INFO.nameEn)}
                      </dd>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <dt className="text-slate-500 text-xs">{pick('ಪಠ್ಯಕ್ರಮ & ಮಂಡಳಿ', 'Curriculum & Board')}</dt>
                      <dd className="font-bold text-slate-900 mt-0.5">
                        {pick(SCHOOL_INFO.gradesKn, SCHOOL_INFO.gradesEn)} · KSEAB
                      </dd>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <dt className="text-slate-500 text-xs">{pick('SATS ದತ್ತಾಂಶ ಸ್ಥಿತಿ', 'SATS Data Sync Status')}</dt>
                      <dd className="font-semibold text-amber-900 mt-0.5">
                        {pick('ಸರ್ವರ್ SATS API ಸಂಪರ್ಕ ಬಾಕಿ', 'Pending Server SATS Integration')}
                      </dd>
                    </div>
                  </dl>
                </Card>

                {/* Quick Portal Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card surface="white" padding="md" className="space-y-2">
                    <span className="text-xs text-slate-500 font-medium">
                      {pick('ಪ್ರಕಟಿತ ಸುತ್ತೋಲೆಗಳು', 'Published Circulars')}
                    </span>
                    <p className="text-2xl font-bold font-mono text-[#13325e] tabular-nums">
                      {NOTICES_DATA.length}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveSection('notices')}
                      className="text-xs font-bold text-[#13325e] hover:underline cursor-pointer"
                    >
                      {pick('ಸುತ್ತೋಲೆಗಳನ್ನು ನೋಡಿ →', 'View Notices →')}
                    </button>
                  </Card>

                  <Card surface="white" padding="md" className="space-y-2">
                    <span className="text-xs text-slate-500 font-medium">
                      {pick('SSLC ಅಧ್ಯಯನ ಸಾಮಗ್ರಿ', 'SSLC Study Capsules')}
                    </span>
                    <p className="text-2xl font-bold font-mono text-[#13325e] tabular-nums">
                      {SSLC_STUDY_MATERIALS.length}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveSection('materials')}
                      className="text-xs font-bold text-[#13325e] hover:underline cursor-pointer"
                    >
                      {pick('ಸಾಮಗ್ರಿ ತೆರೆಯಿರಿ →', 'Open Materials →')}
                    </button>
                  </Card>

                  <Card surface="white" padding="md" className="space-y-2">
                    <span className="text-xs text-slate-500 font-medium">
                      {pick('ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು', 'Welfare Schemes')}
                    </span>
                    <p className="text-2xl font-bold font-mono text-[#13325e] tabular-nums">
                      {WELFARE_SCHEMES.length}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveSection('welfare')}
                      className="text-xs font-bold text-[#13325e] hover:underline cursor-pointer"
                    >
                      {pick('ಸವಲತ್ತುಗಳನ್ನು ನೋಡಿ →', 'View Schemes →')}
                    </button>
                  </Card>
                </div>
              </div>
            )}

            {activeSection === 'academics' && (
              <Card surface="white" padding="lg" className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-[#13325e]">
                    {t.academics_classes_title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">{t.academics_exam_title}</p>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-md border border-slate-200">
                  <li>• {t.academics_exam_rule_1}</li>
                  <li>• {t.academics_exam_rule_2}</li>
                  <li>• {t.academics_exam_rule_3}</li>
                </ul>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-[#13325e]">
                    {pick('ಶೈಕ್ಷಣಿಕ ವೇಳಾಪಟ್ಟಿ ಮುಖ್ಯಾಂಶಗಳು', 'Academic Calendar Highlights')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ACADEMIC_CALENDAR.map((cal) => (
                      <div key={cal.id} className="p-3.5 rounded-md border border-slate-200 bg-slate-50 space-y-1">
                        <span className="text-xs font-semibold text-emerald-900">
                          {pick(cal.periodKn, cal.periodEn)}
                        </span>
                        <h5 className="text-sm font-bold text-[#13325e]">
                          {pick(cal.titleKn, cal.titleEn)}
                        </h5>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {pick(cal.descKn, cal.descEn)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {activeSection === 'attendance' && (
              <Card surface="white" padding="lg" className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-[#13325e]">
                  {t.student_nav_attendance}
                </h3>

                <Alert tone="warning">
                  {pick(
                    'ವೈಯಕ್ತಿಕ ದೈನಂದಿನ ಹಾಜರಾತಿ ದಾಖಲೆಗಳು ಕರ್ನಾಟಕ ಸರ್ಕಾರದ SATS API ಏಕೀಕರಣದ ನಂತರ ಮಾತ್ರ ಲಭ್ಯವಾಗಲಿವೆ. ಯಾವುದೇ ಕಾಲ್ಪನಿಕ ಹಾಜರಾತಿ ಅಂಕಿಅಂಶಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿಲ್ಲ.',
                    'Individual attendance logs require live Karnataka CeG SATS backend synchronization and are intentionally omitted in static preview mode.'
                  )}
                </Alert>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-slate-500 text-xs">
                      {pick('KSEAB ವಾರ್ಷಿಕ ಪರೀಕ್ಷಾ ನಿಯಮ', 'KSEAB Annual Exam Minimum')}
                    </span>
                    <p className="text-2xl font-bold font-mono text-[#13325e] tabular-nums">75%</p>
                    <p className="text-xs text-slate-600">{t.academics_exam_rule_2}</p>
                  </div>
                  <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-slate-500 text-xs">
                      {pick('SSLC ಪೂರ್ವಸಿದ್ಧತಾ ಸುತ್ತೋಲೆ ಗುರಿ', 'SSLC Preparatory Circular Target')}
                    </span>
                    <p className="text-2xl font-bold font-mono text-emerald-800 tabular-nums">85%</p>
                    <p className="text-xs text-slate-600">
                      {pick('ದಿನನಿತ್ಯ ಶಾಲಾ ಸಮಯ: 09:45 AM – 04:30 PM', 'Regular School Hours: 09:45 AM – 04:30 PM')}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {activeSection === 'materials' && (
              <Card surface="white" padding="lg" className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-[#13325e]">
                  {t.sslc_desk_title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">{t.sslc_desk_desc}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SSLC_STUDY_MATERIALS.map((mat, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-md border border-slate-200 bg-slate-50 flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-emerald-900">
                          {pick(mat.subjectKn, mat.subjectEn)} · {mat.year}
                        </p>
                        <h4 className="text-sm font-bold text-[#13325e]">
                          {pick(mat.titleKn, mat.titleEn)}
                        </h4>
                        <p className="text-xs text-slate-600">
                          {pick(mat.mediumKn, mat.mediumEn)} · <span className="font-mono">{mat.fileSize}</span>
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadStudySpec(mat)}
                        leftIcon={<Download className="w-3.5 h-3.5" />}
                      >
                        {t.btn_download_specimen}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeSection === 'notices' && (
              <Card surface="white" padding="lg" className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-[#13325e]">
                  {t.notices_heading}
                </h3>
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-md">
                  {NOTICES_DATA.map((n) => (
                    <article key={n.id} className="p-4 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono">{n.refNo}</span>
                        <span aria-hidden="true">·</span>
                        <span>{pick(n.dateStrKn, n.dateStrEn)}</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-[#13325e]">
                        {pick(n.titleKn, n.titleEn)}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {pick(n.fullContentKn, n.fullContentEn)}
                      </p>
                    </article>
                  ))}
                </div>
              </Card>
            )}

            {activeSection === 'welfare' && (
              <Card surface="white" padding="lg" className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-[#13325e]">
                  {t.welfare_heading}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {WELFARE_SCHEMES.map((w) => (
                    <div
                      key={w.id}
                      className="p-4 rounded-md border border-slate-200 bg-slate-50 space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-emerald-900">
                          {pick(w.badgeKn, w.badgeEn)}
                        </span>
                        <h4 className="text-sm font-bold text-[#13325e]">
                          {pick(w.titleKn, w.titleEn)}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {pick(w.descKn, w.descEn)}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700">
                          {pick(w.beneficiariesKn, w.beneficiariesEn)}
                        </span>
                        {w.officialLink && (
                          <a
                            href={w.officialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-[#13325e] hover:underline inline-flex items-center gap-1"
                          >
                            <span>{w.portalName}</span>
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
