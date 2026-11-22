import React, { useState } from 'react';
import {
  Users,
  Clock,
  BookOpen,
  Bell,
  ClipboardCheck,
  ShieldCheck,
  LogOut,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { usePortal } from '../../context/AuthContext';
import {
  SCHOOL_INFO,
  BELL_SCHEDULE,
  NOTICES_DATA,
  SSLC_STUDY_MATERIALS,
  SCHOOL_FACILITIES,
  SCHOOL_VERIFICATION_CHECKLIST,
} from '../../data/schoolData';
import { PortalNavBar } from '../PortalNavBar';
import { Alert, Badge, Button, Card } from '../ui';

type StaffSection =
  | 'overview'
  | 'timetable'
  | 'resources'
  | 'notices'
  | 'attendance';

export const StaffDashboard: React.FC = () => {
  const { t, pick } = useApp();
  const { session, goHome, logout, navigate } = usePortal();
  const [activeSection, setActiveSection] = useState<StaffSection>('overview');
  const [selectedClass, setSelectedClass] = useState<'8' | '9' | '10'>('10');

  if (!session || session.role !== 'staff') {
    return null;
  }

  const navItems: { id: StaffSection; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: t.staff_nav_overview, icon: <Users className="w-4 h-4" /> },
    { id: 'timetable', label: t.staff_nav_timetable, icon: <Clock className="w-4 h-4" /> },
    { id: 'resources', label: t.staff_nav_resources, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'notices', label: t.staff_nav_notices, icon: <Bell className="w-4 h-4" /> },
    {
      id: 'attendance',
      label: t.staff_nav_attendance,
      icon: <ClipboardCheck className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-[80vh] bg-slate-50 flex flex-col">
      <PortalNavBar
        breadcrumbs={[
          { label: t.nav_home, onClick: goHome },
          { label: t.nav_staff_portal, onClick: () => navigate('/staff-portal') },
          { label: pick('ಸಿಬ್ಬಂದಿ ಕಾರ್ಯಕ್ಷೇತ್ರ', 'Staff Workspace') },
        ]}
      />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Welcome Header Card */}
        <Card
          surface="white"
          padding="md"
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-[#13325e] text-amber-300 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#13325e]">
                  {t.staff_dash_welcome}
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
        </Card>

        <Alert tone="info">{t.staff_dash_demo_alert}</Alert>

        {/* Responsive Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sidebar */}
          <aside
            aria-label={pick('ಸಿಬ್ಬಂದಿ ಕಾರ್ಯಕ್ಷೇತ್ರ ಮೆನು', 'Staff workspace navigation')}
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

          {/* Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <Card surface="white" padding="lg" className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <h3 className="text-base sm:text-lg font-bold text-[#13325e]">
                      {pick('ಸಿಬ್ಬಂದಿ ಪ್ರೊಫೈಲ್ & ಶಾಲಾ ಆಡಳಿತ ವಿವರ', 'Staff Profile & Institutional Context')}
                    </h3>
                    <span className="font-mono text-xs text-slate-600 tabular-nums">
                      {SCHOOL_INFO.schoolCode}
                    </span>
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <dt className="text-slate-500 text-xs">
                        {pick('ಸಿಬ್ಬಂದಿ ID / ಇಮೇಲ್', 'Staff Identifier')}
                      </dt>
                      <dd className="font-mono font-bold text-[#13325e] mt-0.5">
                        {session.userId}
                      </dd>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <dt className="text-slate-500 text-xs">
                        {pick('ಮುಖ್ಯ ಶಿಕ್ಷಕರು', 'Headmaster')}
                      </dt>
                      <dd className="font-bold text-slate-900 mt-0.5">
                        {pick(SCHOOL_INFO.headmasterKn, SCHOOL_INFO.headmasterEn)}
                      </dd>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <dt className="text-slate-500 text-xs">
                        {pick('ಶೈಕ್ಷಣಿಕ ವಲಯ', 'Educational Division')}
                      </dt>
                      <dd className="font-bold text-slate-900 mt-0.5">
                        {pick(SCHOOL_INFO.divisionKn, SCHOOL_INFO.divisionEn)}
                      </dd>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <dt className="text-slate-500 text-xs">
                        {pick('HRMS / ಸರ್ವರ್ ದೃಢೀಕರಣ', 'HRMS / Server Auth Status')}
                      </dt>
                      <dd className="font-semibold text-amber-900 mt-0.5">
                        {pick('ಸರ್ವರ್ API ನಿಯೋಜನೆ ಬಾಕಿ', 'Pending Server RBAC API')}
                      </dd>
                    </div>
                  </dl>
                </Card>

                {/* Institutional Audit Items Summary */}
                <Card surface="white" padding="lg" className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-[#13325e] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-600" aria-hidden="true" />
                      <span>
                        {pick(
                          `ಶಾಲಾ ದಾಖಲೆ ಪರಿಶೀಲನಾ ಸ್ಥಿತಿ (${SCHOOL_VERIFICATION_CHECKLIST.length} ಅಂಶಗಳು)`,
                          `Institutional Verification Status (${SCHOOL_VERIFICATION_CHECKLIST.length} Items)`
                        )}
                      </span>
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {SCHOOL_VERIFICATION_CHECKLIST.slice(0, 4).map((item) => (
                      <div key={item.id} className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1">
                        <strong className="text-[#13325e] block">
                          {pick(item.categoryKn, item.categoryEn)}
                        </strong>
                        <span className="text-slate-700 block">
                          {pick(item.itemKn, item.itemEn)}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeSection === 'timetable' && (
              <Card surface="white" padding="lg" className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#13325e]">
                    {t.bell_title}
                  </h3>
                  <span className="font-mono text-xs text-slate-600 tabular-nums">
                    09:45 AM – 04:30 PM
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-[#13325e] border-b border-slate-200 font-bold">
                        <th scope="col" className="py-2.5 px-3">
                          {pick('ಸಮಯ', 'Time Slot')}
                        </th>
                        <th scope="col" className="py-2.5 px-3">
                          {pick('ಅವಧಿ / ವಿಷಯ', 'Period / Activity')}
                        </th>
                        <th scope="col" className="py-2.5 px-3">
                          {pick('ಕಾಲಾವಧಿ', 'Duration')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {BELL_SCHEDULE.map((slot, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-semibold text-[#13325e] whitespace-nowrap tabular-nums">
                            {slot.time}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">
                            {pick(slot.slotKn, slot.slotEn)}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                            {pick(slot.durationKn, slot.durationEn)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {activeSection === 'resources' && (
              <Card surface="white" padding="lg" className="space-y-5">
                <h3 className="text-base sm:text-lg font-bold text-[#13325e]">
                  {t.staff_nav_resources}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SSLC_STUDY_MATERIALS.map((mat, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-md border border-slate-200 bg-slate-50 space-y-1.5"
                    >
                      <span className="text-xs font-semibold text-emerald-900">
                        {pick(mat.subjectKn, mat.subjectEn)} · {mat.year}
                      </span>
                      <h4 className="text-sm font-bold text-[#13325e]">
                        {pick(mat.titleKn, mat.titleEn)}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {pick(mat.mediumKn, mat.mediumEn)} ·{' '}
                        <span className="font-mono">{mat.fileSize}</span>
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <h4 className="text-sm font-bold text-[#13325e]">
                    {t.about_facilities_title}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {SCHOOL_FACILITIES.map((fac) => (
                      <div key={fac.id} className="p-3 rounded border border-slate-200 bg-white space-y-1">
                        <strong className="text-[#13325e] block">
                          {pick(fac.titleKn, fac.titleEn)}
                        </strong>
                        <p className="text-slate-600 leading-relaxed">
                          {pick(fac.descKn, fac.descEn)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {activeSection === 'notices' && (
              <Card surface="white" padding="lg" className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-[#13325e]">
                  {t.staff_nav_notices}
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

            {activeSection === 'attendance' && (
              <Card surface="white" padding="lg" className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#13325e]">
                    {t.staff_nav_attendance}
                  </h3>
                  <Badge tone="warning" icon={<Lock className="w-3 h-3" />}>
                    {pick('ಸರ್ವರ್ API ಅಗತ್ಯವಿದೆ', 'Backend Required')}
                  </Badge>
                </div>

                <Alert
                  tone="warning"
                  title={pick(
                    'ಹಾಜರಾತಿ ದಾಖಲಾತಿ ತಾತ್ಕಾಲಿಕವಾಗಿ ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ (Static Preview Mode)',
                    'Attendance Submission Disabled in Static Mode'
                  )}
                >
                  {pick(
                    'ಇದು ಕೇವಲ UI ರಚನೆಯ ಪೂರ್ವವೀಕ್ಷಣೆಯಾಗಿದೆ. ನೈಜ ವಿದ್ಯಾರ್ಥಿ ಹಾಜರಾತಿ ಸಲ್ಲಿಕೆಗಾಗಿ ದೃಢೀಕೃತ ಸರ್ವರ್ API (`POST /api/staff/attendance`), HRMS RBAC ಅನುಮತಿ ಹಾಗೂ ಶಾಲಾ ಡೇಟಾಬೇಸ್ ಸಂಪರ್ಕ ಅಗತ್ಯವಿದೆ.',
                    'This interface demonstrates the planned attendance register workflow. Submitting or mutating student attendance requires an authenticated backend API (`POST /api/staff/attendance`), server-verified staff RBAC, and persistent database storage.'
                  )}
                </Alert>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <label htmlFor="staff-att-class" className="font-bold text-slate-700">
                    {pick('ತರಗತಿ ಆಯ್ಕೆ (ಪೂರ್ವವೀಕ್ಷಣೆ):', 'Select Class (Preview):')}
                  </label>
                  <select
                    id="staff-att-class"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value as '8' | '9' | '10')}
                    className="px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 font-semibold"
                  >
                    <option value="8">{pick('8ನೇ ತರಗತಿ', 'Class 8')}</option>
                    <option value="9">{pick('9ನೇ ತರಗತಿ', 'Class 9')}</option>
                    <option value="10">{pick('10ನೇ ತರಗತಿ (SSLC)', 'Class 10 (SSLC)')}</option>
                  </select>
                </div>

                <div className="p-4 rounded-md border border-dashed border-slate-300 bg-slate-50 text-xs sm:text-sm text-slate-700 space-y-2">
                  <p className="font-bold text-[#13325e]">
                    {pick(
                      `${selectedClass}ನೇ ತರಗತಿ — ಹಾಜರಾತಿ ವಹಿ (SATS ಸಿಂಕ್ ಬಾಕಿ)`,
                      `Class ${selectedClass} — Register View (Pending SATS Roster API)`
                    )}
                  </p>
                  <p className="text-xs text-slate-600">
                    {pick(
                      'ಗೌಪ್ಯತಾ ನಿಯಮಗಳ ಪ್ರಕಾರ ಯಾವುದೇ ವಿದ್ಯಾರ್ಥಿಗಳ ಹೆಸರು ಅಥವಾ SATS ಸಂಖ್ಯೆಯನ್ನು ಸಾರ್ವಜನಿಕ ಫ್ರಂಟ್‌ಎಂಡ್ ಕೋಡ್‌ನಲ್ಲಿ ಇರಿಸಿಲ್ಲ.',
                      'Per strict student privacy policy, student names and SATS rosters are loaded only over authenticated server APIs and are omitted from static client code.'
                    )}
                  </p>
                  <Button variant="secondary" size="sm" disabled>
                    {pick('ಹಾಜರಾತಿ ಉಳಿಸಿ (ಸರ್ವರ್ ಸಂಪರ್ಕದ ನಂತರ ಸಕ್ರಿಯ)', 'Submit Attendance (Requires Backend API)')}
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
