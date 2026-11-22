import React, { useState, useEffect } from 'react';
import { Language, StudentProgressRecord } from '../types';
import { UI_STRINGS } from '../data/translations';
import { STUDENT_RECORDS } from '../data/studentRecords';
import { SCHOOL_INFO } from '../data/schoolData';

interface StudentProgressTrackerProps {
  lang: Language;
}

export const StudentProgressTracker: React.FC<StudentProgressTrackerProps> = ({ lang }) => {
  const t = UI_STRINGS[lang];

  // Form State
  const [satsInput, setSatsInput] = useState('');
  const [mobileInput, setMobileInput] = useState('');
  const [dobInput, setDobInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [authenticatedStudent, setAuthenticatedStudent] = useState<StudentProgressRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'grades' | 'attendance' | 'cocurricular' | 'reportcard'>('grades');

  // Security Simulation: Rate Limiting
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Security Simulation: Session Inactivity Timeout (15 minutes = 900 seconds)
  const [sessionSeconds, setSessionSeconds] = useState(900);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  // Rate Limiting Countdown
  useEffect(() => {
    if (lockoutSeconds > 0) {
      const timer = setTimeout(() => {
        setLockoutSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutSeconds]);

  // Session Inactivity Countdown when authenticated
  useEffect(() => {
    if (authenticatedStudent && sessionSeconds > 0) {
      const timer = setTimeout(() => {
        setSessionSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (authenticatedStudent && sessionSeconds <= 0) {
      setAuthenticatedStudent(null);
      setErrorMessage(t.progress_session_expired);
    }
  }, [authenticatedStudent, sessionSeconds, t.progress_session_expired]);

  // Handle Authentication Verification
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    setErrorMessage('');

    const matched = STUDENT_RECORDS.find(
      (s) =>
        s.satsNo === satsInput.trim() &&
        s.regMobile === mobileInput.trim() &&
        s.dob === dobInput.trim()
    );

    if (matched) {
      setAuthenticatedStudent(matched);
      setErrorMessage('');
      setFailedAttempts(0);
      setSessionSeconds(900); // 15-minute fresh session
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 5) {
        setLockoutSeconds(60);
        setErrorMessage(t.progress_rate_limit_err);
      } else {
        setErrorMessage(`${t.progress_err_not_found} (${lang === 'kn' ? 'ಉಳಿದ ಪ್ರಯತ್ನಗಳು' : 'Attempts remaining'}: ${5 - newAttempts})`);
      }
    }
  };

  // Quick Demo Auto-Fill
  const handleDemoFill = (student: StudentProgressRecord) => {
    if (lockoutSeconds > 0) return;
    setSatsInput(student.satsNo);
    setMobileInput(student.regMobile);
    setDobInput(student.dob);
    setAuthenticatedStudent(student);
    setErrorMessage('');
    setFailedAttempts(0);
    setSessionSeconds(900);
  };

  // Logout / End Session
  const handleLogout = () => {
    setAuthenticatedStudent(null);
    setSatsInput('');
    setMobileInput('');
    setDobInput('');
    setErrorMessage('');
    setSessionSeconds(900);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section id="progress" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <span>PROTOTYPE EVALUATION · SATS DEMO</span>
              <span>·</span>
              <span>ವಿದ್ಯಾರ್ಥಿ ಪ್ರಗತಿ ಪರೀಕ್ಷಾರ್ಥ ಮಾದರಿ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#13325e]">
              {t.progress_heading}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              {t.progress_sub}
            </p>
          </div>

          <button
            onClick={() => setIsSecurityModalOpen(true)}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded text-xs font-semibold transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1.5"
          >
            <span>🔒</span>
            <span>{t.progress_security_btn}</span>
          </button>
        </div>

        {/* Privacy & Statutory Guard Banner (Honest Prototype Mode Disclaimer) */}
        <div className="bg-amber-50/90 border border-amber-300 rounded-lg p-4 sm:p-5 mb-8 text-xs text-amber-950 flex flex-col sm:flex-row gap-4 items-start shadow-2xs">
          <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-lg font-bold shrink-0">
            🛡️
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-amber-900 uppercase tracking-wide">
                {t.progress_privacy_badge}
              </span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-slate-600">Simulated Client Prototype</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {t.progress_privacy_desc}
            </p>
          </div>
        </div>

        {!authenticatedStudent ? (
          /* Authentication Gate / Parent Login */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-base font-bold text-[#13325e] flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>
                    {lang === 'kn' ? 'ಪೋಷಕರ ರುಜುವಾತು ಪರಿಶೀಲನೆ (Parent Verification)' : 'Parent Identity Verification'}
                  </span>
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-semibold">
                  Demo Auth
                </span>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded text-xs leading-relaxed">
                  ⚠️ {errorMessage}
                </div>
              )}

              {lockoutSeconds > 0 && (
                <div className="p-3 bg-amber-100 border border-amber-300 text-amber-900 rounded text-xs font-semibold">
                  ⏳ {lang === 'kn' ? `ದಯವಿಟ್ಟು ಕಾಯಿರಿ: ${lockoutSeconds} ಸೆಕೆಂಡುಗಳು ಉಳಿದಿವೆ` : `Please wait: Locked for ${lockoutSeconds}s`}
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {t.progress_label_sats}
                  </label>
                  <input
                    type="text"
                    value={satsInput}
                    onChange={(e) => setSatsInput(e.target.value)}
                    placeholder="e.g. 104829371"
                    pattern="[0-9]{9}"
                    maxLength={9}
                    disabled={lockoutSeconds > 0}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#13325e] disabled:bg-slate-100"
                    required
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    {lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿಯ ಶಾಲಾ ದಾಖಲಾತಿ/ಅಂಕಪಟ್ಟಿಯಲ್ಲಿರುವ 9 ಅಂಕಿಗಳ SATS ಸಂಖ್ಯೆ' : '9-digit SATS ID issued by Karnataka Education Dept'}
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {t.progress_label_mobile}
                  </label>
                  <input
                    type="tel"
                    value={mobileInput}
                    onChange={(e) => setMobileInput(e.target.value)}
                    placeholder="e.g. 9845123456"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    disabled={lockoutSeconds > 0}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#13325e] disabled:bg-slate-100"
                    required
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    {lang === 'kn' ? 'ಶಾಲಾ ಪ್ರವೇಶದ ವೇಳೆ ನೀಡಲಾದ ಪೋಷಕರ 10-ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : '10-digit mobile registered in school admission records'}
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {t.progress_label_dob}
                  </label>
                  <input
                    type="date"
                    value={dobInput}
                    onChange={(e) => setDobInput(e.target.value)}
                    disabled={lockoutSeconds > 0}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#13325e] disabled:bg-slate-100"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={lockoutSeconds > 0}
                  className="w-full py-2.5 bg-[#13325e] text-white font-bold rounded text-xs hover:bg-[#0c1f3c] transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{t.progress_btn_verify}</span>
                </button>
              </form>
            </div>

            {/* Quick Demo Helper for Parents / Reviewers */}
            <div className="lg:col-span-5 bg-blue-50/70 border border-blue-200 rounded-lg p-5 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-[#13325e] flex items-center gap-1.5">
                  <span>💡</span>
                  <span>{t.progress_demo_title}</span>
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {lang === 'kn'
                    ? 'ಪೋರ್ಟಲ್‌ನ ವಿನ್ಯಾಸ ಹಾಗೂ ಅಂಕಗಳ ನಮೂನೆಯನ್ನು ತಕ್ಷಣವೇ ವೀಕ್ಷಿಸಲು ಕೆಳಗಿನ ಯಾವುದಾದರೂ ವಿದ್ಯಾರ್ಥಿ ವಿವರವನ್ನು ಆರಿಸಿ:'
                    : 'To test the student progress tracking interface instantly, select a sample enrolled student below:'}
                </p>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleDemoFill(STUDENT_RECORDS[0])}
                  className="w-full p-3 bg-white border border-blue-200 rounded text-left hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-[#13325e] group-hover:text-blue-700">
                      {STUDENT_RECORDS[0].studentNameKn} / {STUDENT_RECORDS[0].studentNameEn}
                    </strong>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                      Distinction A+
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap items-center gap-2 font-mono">
                    <span>SATS: 104829371</span>
                    <span>·</span>
                    <span>Mobile: 9845123456</span>
                    <span>·</span>
                    <span>DoB: 2010-05-14</span>
                    <span>·</span>
                    <span>Att: 94.7%</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoFill(STUDENT_RECORDS[1])}
                  className="w-full p-3 bg-white border border-blue-200 rounded text-left hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-[#13325e] group-hover:text-blue-700">
                      {STUDENT_RECORDS[1].studentNameKn} / {STUDENT_RECORDS[1].studentNameEn}
                    </strong>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                      First Class A
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap items-center gap-2 font-mono">
                    <span>SATS: 104829382</span>
                    <span>·</span>
                    <span>Mobile: 9741098765</span>
                    <span>·</span>
                    <span>DoB: 2011-08-22</span>
                    <span>·</span>
                    <span>Att: 83.2%</span>
                  </div>
                </button>
              </div>

              <div className="p-3 bg-white/80 rounded border border-blue-100 text-[11px] text-slate-600 space-y-1">
                <strong>{lang === 'kn' ? 'ಗೌಪ್ಯತಾ ನಿಯಮಗಳು & ತಾಂತ್ರಿಕ ವಿವರಣೆ:' : 'Privacy Rules & Architecture:'}</strong>
                <p>• {lang === 'kn' ? 'ಯಾವುದೇ ಆಧಾರ್ ಸಂಖ್ಯೆಯನ್ನು ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ ಅಥವಾ ಪ್ರದರ್ಶಿಸುವುದಿಲ್ಲ.' : 'No Aadhaar data is gathered, retained, or displayed.'}</p>
                <p>• {lang === 'kn' ? '5 ಕ್ಕಿಂತ ಹೆಚ್ಚು ತಪ್ಪಾದ ಪ್ರಯತ್ನಗಳಿಗೆ ಭದ್ರತಾ ಲಾಕ್‌ಔಟ್ ಅನ್ವಯವಾಗುತ್ತದೆ.' : 'Rate-limiting locks input after 5 failed attempts.'}</p>
                <p>• {lang === 'kn' ? '15 ನಿಮಿಷಗಳ ಅಧಿವೇಶನ ಮುಕ್ತಾಯ ಸಮಯ (Session Timeout).' : '15-minute inactivity timeout protects student data.'}</p>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Student Dashboard */
          <div className="space-y-6">
            {/* Student Profile Ribbon */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#13325e] text-white flex items-center justify-center text-lg font-bold border-2 border-amber-400 shadow-xs shrink-0">
                  {authenticatedStudent.studentNameEn.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {authenticatedStudent.grade} - Sec {authenticatedStudent.section}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Roll No: {authenticatedStudent.rollNo}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-600 font-medium">
                      {lang === 'kn' ? authenticatedStudent.mediumKn : authenticatedStudent.mediumEn}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-200 text-amber-950 rounded">
                      Fictional Sample
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#13325e] leading-snug mt-0.5">
                    {lang === 'kn' ? authenticatedStudent.studentNameKn : authenticatedStudent.studentNameEn}
                  </h3>
                  <div className="text-xs text-slate-600 flex items-center gap-3 flex-wrap mt-0.5">
                    <span>
                      {lang === 'kn' ? 'ಪೋಷಕರು:' : 'Parents:'}{' '}
                      <strong>{lang === 'kn' ? authenticatedStudent.fatherNameKn : authenticatedStudent.fatherNameEn}</strong>
                    </span>
                    <span>·</span>
                    <span className="font-mono">SATS: <strong>{authenticatedStudent.satsNo}</strong></span>
                  </div>
                </div>
              </div>

              {/* Session Timer & End Session Button */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right text-[11px]">
                  <span className="text-slate-500 block">{t.progress_session_timer}</span>
                  <span className="font-mono font-bold text-red-700">{formatTimer(sessionSeconds)}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2 bg-red-100 hover:bg-red-200 text-red-900 font-bold rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>{t.progress_btn_logout}</span>
                </button>
              </div>
            </div>

            {/* Metrics Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Metric 1: Overall CCE Score */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block font-medium">
                  {lang === 'kn' ? 'ವಾರ್ಷಿಕ ಒಟ್ಟು ಅಂಕಗಳು' : 'Total Marks Obtained'}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl sm:text-2xl font-bold text-[#13325e] font-mono tabular-nums">
                    {authenticatedStudent.subjects.reduce((sum, s) => sum + s.totalObtained, 0)} /{' '}
                    {authenticatedStudent.subjects.reduce((sum, s) => sum + s.totalMax, 0)}
                  </span>
                  <span className="text-xs font-bold text-emerald-800">
                    {(
                      (authenticatedStudent.subjects.reduce((sum, s) => sum + s.totalObtained, 0) /
                        authenticatedStudent.subjects.reduce((sum, s) => sum + s.totalMax, 0)) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>

              {/* Metric 2: Attendance */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block font-medium">
                  {lang === 'kn' ? 'ಒಟ್ಟಾರೆ ಹಾಜರಾತಿ' : 'Overall Attendance'}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl sm:text-2xl font-bold font-mono text-[#13325e] tabular-nums">
                    {authenticatedStudent.overallAttendancePct}%
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    ({authenticatedStudent.totalPresentDays}/{authenticatedStudent.totalWorkingDays} days)
                  </span>
                </div>
              </div>

              {/* Metric 3: Academic Standing */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block font-medium">
                  {lang === 'kn' ? 'ಶೈಕ್ಷಣಿಕ ಶ್ರೇಣಿ' : 'Academic Standing'}
                </span>
                <div className="mt-1">
                  <span className="text-base font-bold text-emerald-800">
                    {authenticatedStudent.overallAttendancePct >= 90
                      ? lang === 'kn'
                        ? 'ಡಿಸ್ಟಿಂಕ್ಷನ್ (A+ Grade)'
                        : 'Distinction (A+)'
                      : lang === 'kn'
                      ? 'ಪ್ರಥಮ ದರ್ಜೆ (First Class)'
                      : 'First Class (A)'}
                  </span>
                </div>
              </div>

              {/* Metric 4: Scholarship DBT Status */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block font-medium">
                  {lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿವೇತನ (SSP/DBT)' : 'Scholarship DBT'}
                </span>
                <div className="mt-1 text-slate-800 font-semibold line-clamp-1">
                  {lang === 'kn' ? authenticatedStudent.scholarshipStatusKn : authenticatedStudent.scholarshipStatusEn}
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 space-x-1 sm:space-x-4 no-print overflow-x-auto scrollbar-none" role="tablist">
              <button
                onClick={() => setActiveTab('grades')}
                className={`py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'grades'
                    ? 'border-[#13325e] text-[#13325e]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.progress_tab_grades}
              </button>
              <button
                onClick={() => setActiveTab('attendance')}
                className={`py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'attendance'
                    ? 'border-[#13325e] text-[#13325e]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.progress_tab_attendance}
              </button>
              <button
                onClick={() => setActiveTab('cocurricular')}
                className={`py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'cocurricular'
                    ? 'border-[#13325e] text-[#13325e]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.progress_tab_cocurricular}
              </button>
              <button
                onClick={() => setActiveTab('reportcard')}
                className={`py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'reportcard'
                    ? 'border-[#13325e] text-[#13325e]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.progress_tab_reportcard}
              </button>
            </div>

            {/* TAB 1: ACADEMIC GRADES (CCE) */}
            {activeTab === 'grades' && (
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#13325e]">
                    {lang === 'kn'
                      ? 'ನಿರಂತರ ಸಮಗ್ರ ಮೌಲ್ಯಮಾಪನ (CCE 2025-26) - ವಿಷಯವಾರು ಅಂಕಗಳ ವಿವರ'
                      : 'Continuous Comprehensive Evaluation (CCE 2025-26) - Subject Score Breakdown'}
                  </h4>
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    KSEAB Grading Scheme
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100/70 text-[#13325e] border-b border-slate-200 font-bold">
                        <th className="py-3 px-3 sm:px-4">Code</th>
                        <th className="py-3 px-3 sm:px-4">{lang === 'kn' ? 'ವಿಷಯ' : 'Subject'}</th>
                        <th className="py-3 px-2 sm:px-3 text-center font-mono">FA-1 (50)</th>
                        <th className="py-3 px-2 sm:px-3 text-center font-mono">FA-2 (50)</th>
                        <th className="py-3 px-2 sm:px-3 text-center font-mono">SA-1 (Mid)</th>
                        <th className="py-3 px-2 sm:px-3 text-center font-mono">FA-3 (50)</th>
                        <th className="py-3 px-2 sm:px-3 text-center font-mono">FA-4 (50)</th>
                        <th className="py-3 px-2 sm:px-3 text-center font-mono">SA-2 (Prep)</th>
                        <th className="py-3 px-2 sm:px-3 text-center font-mono">Grade</th>
                        <th className="py-3 px-3 sm:px-4 hidden md:table-cell">{lang === 'kn' ? 'ಶಿಕ್ಷಕರ ಅಭಿಪ್ರಾಯ' : 'Faculty Remarks'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      {authenticatedStudent.subjects.map((sub) => (
                        <tr key={sub.code} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3 sm:px-4 font-mono font-semibold text-slate-500">{sub.code}</td>
                          <td className="py-3 px-3 sm:px-4 font-bold text-[#13325e]">
                            {lang === 'kn' ? sub.subjectKn : sub.subjectEn}
                          </td>
                          <td className="py-3 px-2 sm:px-3 text-center font-mono tabular-nums">{sub.fa1}</td>
                          <td className="py-3 px-2 sm:px-3 text-center font-mono tabular-nums">{sub.fa2}</td>
                          <td className="py-3 px-2 sm:px-3 text-center font-mono tabular-nums font-semibold">{sub.sa1}</td>
                          <td className="py-3 px-2 sm:px-3 text-center font-mono tabular-nums">{sub.fa3}</td>
                          <td className="py-3 px-2 sm:px-3 text-center font-mono tabular-nums">{sub.fa4}</td>
                          <td className="py-3 px-2 sm:px-3 text-center font-mono tabular-nums font-bold text-[#13325e]">
                            {sub.sa2} <span className="text-[10px] text-slate-400 font-normal">/{sub.totalMax}</span>
                          </td>
                          <td className="py-3 px-2 sm:px-3 text-center">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-xs">
                              {sub.grade}
                            </span>
                          </td>
                          <td className="py-3 px-3 sm:px-4 text-xs text-slate-600 hidden md:table-cell">
                            {lang === 'kn' ? sub.teacherRemarksKn : sub.teacherRemarksEn}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: ATTENDANCE ANALYTICS */}
            {activeTab === 'attendance' && (
              <div className="space-y-6">
                {/* Attendance Alert Bar */}
                <div
                  className={`p-4 rounded-lg border text-xs sm:text-sm flex items-center justify-between gap-3 ${
                    authenticatedStudent.overallAttendancePct >= 75
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {authenticatedStudent.overallAttendancePct >= 75 ? '✅' : '⚠️'}
                    </span>
                    <div>
                      <strong>
                        {authenticatedStudent.overallAttendancePct >= 75
                          ? t.progress_attendance_good
                          : t.progress_attendance_warning}
                      </strong>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {lang === 'kn'
                          ? `ಒಟ್ಟು ಕರ್ತವ್ಯ ದಿನಗಳು: ${authenticatedStudent.totalWorkingDays} | ಹಾಜರಾದ ದಿನಗಳು: ${authenticatedStudent.totalPresentDays}`
                          : `Total Working Days: ${authenticatedStudent.totalWorkingDays} | Days Present: ${authenticatedStudent.totalPresentDays}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-2xl font-bold font-mono">{authenticatedStudent.overallAttendancePct}%</span>
                  </div>
                </div>

                {/* Monthly Attendance Chart & Table */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs p-5 space-y-4">
                  <h4 className="font-bold text-sm text-[#13325e]">
                    {lang === 'kn' ? 'ಮಾಹಾವಾರು ಹಾಜರಾತಿ ವಿವರ (June 2025 to Feb 2026)' : 'Month-wise Attendance Log (June 2025 - Feb 2026)'}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    {authenticatedStudent.monthlyAttendance.map((m) => (
                      <div key={m.monthEn} className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900 font-bold">
                            {lang === 'kn' ? m.monthKn : m.monthEn}
                          </strong>
                          <span className="font-mono font-bold text-[#13325e]">
                            {m.percentage}%
                          </span>
                        </div>
                        {/* Visual Progress Bar */}
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              m.percentage >= 90
                                ? 'bg-emerald-600'
                                : m.percentage >= 75
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${m.percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>{lang === 'kn' ? 'ಹಾಜರು:' : 'Present:'} {m.presentDays} ದಿನಗಳು</span>
                          <span>{lang === 'kn' ? 'ಒಟ್ಟು:' : 'Total:'} {m.workingDays}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                    <span>🍲</span>
                    <span>
                      {lang === 'kn'
                        ? 'ಅಕ್ಷರ ದಾಸೋಹ ಬಿಸಿಯೂಟ ಯೋಜನೆ: ಹಾಜರಾದ ಎಲ್ಲಾ 180 ದಿನಗಳಲ್ಲಿ ವಿದ್ಯಾರ್ಥಿಯು ಬಿಸಿಯೂಟ ಮತ್ತು ಕ್ಷೀರಭಾಗ್ಯ ಸೌಲಭ್ಯ ಪಡೆದಿದ್ದಾರೆ.'
                        : 'Akshara Dasoha PM POSHAN: Mid-day meals and milk rations availed on all 180 attendance days.'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CO-CURRICULAR & TRAITS */}
            {activeTab === 'cocurricular' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-slate-500 block">{lang === 'kn' ? 'ದೈಹಿಕ ಶಿಕ್ಷಣ & ಕ್ರೀಡೆ' : 'Physical Education & Sports'}</span>
                    <strong className="text-sm font-bold text-emerald-800 block">
                      {lang === 'kn' ? authenticatedStudent.coCurricular.peSportsKn : authenticatedStudent.coCurricular.peSportsEn}
                    </strong>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-slate-500 block">{lang === 'kn' ? 'ಚಿತ್ರಕಲೆ & ಕಲಾ ಶಿಕ್ಷಣ' : 'Arts & Craft'}</span>
                    <strong className="text-sm font-bold text-emerald-800 block">
                      {lang === 'kn' ? authenticatedStudent.coCurricular.artsCraftKn : authenticatedStudent.coCurricular.artsCraftEn}
                    </strong>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-slate-500 block">{lang === 'kn' ? 'ಸ್ಕೌಟ್ಸ್-ಗೈಡ್ಸ್ & ಶಿಸ್ತು' : 'Scouts, Guides & Conduct'}</span>
                    <strong className="text-sm font-bold text-emerald-800 block">
                      {lang === 'kn' ? authenticatedStudent.coCurricular.scoutsDisciplineKn : authenticatedStudent.coCurricular.scoutsDisciplineEn}
                    </strong>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-slate-500 block">{lang === 'kn' ? 'ವೈಯಕ್ತಿಕ ನೈರ್ಮಲ್ಯ' : 'Cleanliness & Punctuality'}</span>
                    <strong className="text-sm font-bold text-emerald-800 block">
                      {lang === 'kn' ? authenticatedStudent.coCurricular.cleanlinessKn : authenticatedStudent.coCurricular.cleanlinessEn}
                    </strong>
                  </div>
                </div>

                {/* Faculty & Principal Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                    <h4 className="text-xs font-bold text-[#13325e] uppercase tracking-wider">
                      {lang === 'kn' ? 'ತರಗತಿ ಶಿಕ್ಷಕರ ಮೌಲ್ಯಮಾಪನ (Class Teacher)' : 'Class Teacher Evaluation'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 italic bg-white p-3 rounded border border-slate-200">
                      "{lang === 'kn' ? authenticatedStudent.classTeacherRemarksKn : authenticatedStudent.classTeacherRemarksEn}"
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                    <h4 className="text-xs font-bold text-[#13325e] uppercase tracking-wider">
                      {lang === 'kn' ? 'ಮುಖ್ಯೋಪಾಧ್ಯಾಯರ ಅಭಿಪ್ರಾಯ (Headmaster)' : 'Headmaster Evaluation'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 italic bg-white p-3 rounded border border-slate-200">
                      "{lang === 'kn' ? authenticatedStudent.headmasterRemarksKn : authenticatedStudent.headmasterRemarksEn}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: OFFICIAL PROGRESS REPORT CARD (PRINTABLE) */}
            {activeTab === 'reportcard' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center no-print">
                  <span className="text-xs font-mono text-amber-900 bg-amber-100 px-2.5 py-1 rounded font-semibold">
                    [FICTIONAL PROTOTYPE REPORT - ಕರಡು ಮಾದರಿ]
                  </span>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-[#13325e] text-white font-bold rounded text-xs hover:bg-[#0c1f3c] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 6 2 18 2 18 9" />
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                      <rect x="6" y="14" width="12" height="8" />
                    </svg>
                    <span>{lang === 'kn' ? 'ಪ್ರಗತಿ ಪತ್ರ ಮುದ್ರಿಸಿ (Print Report Card)' : 'Print Official Report Card'}</span>
                  </button>
                </div>

                {/* Printable Official Card */}
                <div className="printable-area border-2 border-slate-400 p-6 sm:p-8 bg-white text-slate-900 space-y-6 rounded-lg shadow-sm">
                  {/* Card Header */}
                  <div className="text-center border-b-2 border-slate-300 pb-4 space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
                      {SCHOOL_INFO.deptKn}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#13325e]">
                      {lang === 'kn' ? SCHOOL_INFO.nameKn : SCHOOL_INFO.nameEn}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {SCHOOL_INFO.addressKn} · UDISE: <strong>{SCHOOL_INFO.udise}</strong>
                    </p>
                    <div className="pt-2">
                      <span className="inline-block px-3 py-1 bg-amber-100 border border-amber-300 text-[#13325e] font-bold text-xs uppercase tracking-wider rounded">
                        {lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿ ಪ್ರಗತಿ ಪರಿಶೀಲನಾ ಪತ್ರ 2025-26' : 'ANNUAL STUDENT PROGRESS REPORT 2025-26'}
                      </span>
                    </div>
                    <div className="mt-2 p-1.5 bg-amber-50 border border-dashed border-amber-300 rounded text-center text-[10px] text-amber-900 font-semibold">
                      {lang === 'kn'
                        ? '⚠️ ಪರೀಕ್ಷಾರ್ಥ ಕರಡು ಪ್ರತಿ · ಕಾಲ್ಪನಿಕ ಮಾದರಿ ದತ್ತಾಂಶ (Prototype Specimen Record - Fictional Data)'
                        : '⚠️ PROTOTYPE SPECIMEN RECORD · FICTIONAL SAMPLE DATA · NOT AN OFFICIAL BOARD CERTIFICATE'}
                    </div>
                  </div>

                  {/* Student Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border border-slate-200 p-3 rounded bg-slate-50">
                    <div>
                      <span className="text-slate-500 block">ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು:</span>
                      <strong>{lang === 'kn' ? authenticatedStudent.studentNameKn : authenticatedStudent.studentNameEn}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">SATS ID:</span>
                      <strong className="font-mono">{authenticatedStudent.satsNo}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">ತರಗತಿ & ವಿಭಾಗ:</span>
                      <strong>{authenticatedStudent.grade} ({authenticatedStudent.section})</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">ಹಾಜರಾತಿ ಶೇಕಡಾವಾರು:</span>
                      <strong className="font-mono text-emerald-800">{authenticatedStudent.overallAttendancePct}%</strong>
                    </div>
                  </div>

                  {/* Summary Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-300 border-collapse">
                      <thead>
                        <tr className="bg-slate-200/80 text-slate-900 border-b border-slate-300 font-bold">
                          <th className="p-2 border-r border-slate-300">ವಿಷಯ (Subject)</th>
                          <th className="p-2 border-r border-slate-300 text-center font-mono">FA (200)</th>
                          <th className="p-2 border-r border-slate-300 text-center font-mono">SA (200)</th>
                          <th className="p-2 border-r border-slate-300 text-center font-mono">Final Obtained</th>
                          <th className="p-2 text-center font-mono">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-300 text-slate-800">
                        {authenticatedStudent.subjects.map((sub) => (
                          <tr key={sub.code}>
                            <td className="p-2 border-r border-slate-300 font-medium">
                              {sub.subjectKn} ({sub.code})
                            </td>
                            <td className="p-2 border-r border-slate-300 text-center font-mono">
                              {sub.fa1 + sub.fa2 + sub.fa3 + sub.fa4}
                            </td>
                            <td className="p-2 border-r border-slate-300 text-center font-mono">
                              {sub.sa1 + sub.sa2}
                            </td>
                            <td className="p-2 border-r border-slate-300 text-center font-mono font-bold">
                              {sub.totalObtained} / {sub.totalMax}
                            </td>
                            <td className="p-2 text-center font-bold text-emerald-800">{sub.grade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Signatures */}
                  <div className="pt-10 flex justify-between items-end text-xs">
                    <div className="text-center">
                      <div className="h-8 border-b border-slate-400 w-36 mb-1 flex items-center justify-center text-[10px] text-slate-400 italic">
                        [ಮಾದರಿ / Sample]
                      </div>
                      <span className="font-semibold text-slate-700">
                        {lang === 'kn' ? 'ತರಗತಿ ಶಿಕ್ಷಕರ ಸಹಿ (ಮಾದರಿ)' : 'Class Teacher Sign (Sample)'}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 border-2 border-dashed border-amber-500 rounded-full flex flex-col items-center justify-center text-[9px] text-amber-800 mx-auto mb-1 font-semibold bg-amber-50/50">
                        <span>[ಮಾದರಿ ಮುದ್ರೆ]</span>
                        <span>SPECIMEN</span>
                        <span>SEAL</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Government High School, Davangere</span>
                    </div>
                    <div className="text-center">
                      <div className="h-8 border-b border-slate-400 w-36 mb-1 flex items-center justify-center text-[10px] text-slate-400 italic">
                        [ಮಾದರಿ / Sample]
                      </div>
                      <span className="font-bold text-[#13325e]">
                        {lang === 'kn' ? SCHOOL_INFO.headmasterKn : SCHOOL_INFO.headmasterEn}
                      </span>
                      <span className="block text-[10px] text-slate-500">
                        {lang === 'kn' ? 'ಮುಖ್ಯೋಪಾಧ್ಯಾಯರು (ಮಾದರಿ)' : 'Headmaster (Specimen)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Production Deployment Architecture & Security Checklist Modal */}
      {isSecurityModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full border-t-4 border-[#13325e] overflow-hidden my-6">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  TECHNICAL DEPLOYMENT SPECIFICATION
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#13325e]">
                  {t.progress_security_modal_title}
                </h3>
              </div>
              <button
                onClick={() => setIsSecurityModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-700 max-h-[70vh] overflow-y-auto">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-950">
                <strong>{lang === 'kn' ? 'ತಾಂತ್ರಿಕ ನೀತಿ:' : 'Policy Standard:'} </strong>
                {lang === 'kn'
                  ? 'ನೈಜ ವಿದ್ಯಾರ್ಥಿಗಳ ಅಂಕಗಳು ಹಾಗೂ ಹಾಜರಾತಿಯನ್ನು ಸಾರ್ವಜನಿಕವಾಗಿ ಕ್ಲೈಂಟ್-ಸೈಡ್ ಫೈಲ್‌ಗಳಲ್ಲಿ ಸಂಗ್ರಹಿಸುವುದು ಶಿಕ್ಷಣ ಇಲಾಖೆಯ ನಿಯಮಾವಳಿಗಳ ಉಲ್ಲಂಘನೆಯಾಗುತ್ತದೆ. ಉತ್ಪಾದನಾ ಹಂತದಲ್ಲಿ ಕೆಳಗಿನ 7 ರಕ್ಷಣಾತ್ಮಕ ಹಂತಗಳನ್ನು ಕಡ್ಡಾಯವಾಗಿ ಅಳವಡಿಸಬೇಕು:'
                  : 'Exposing student academic records in client-side scripts violates educational privacy policies. Before connecting real student data, the following 7 server-side controls must be implemented:'}
              </div>

              <ol className="list-decimal pl-5 space-y-2.5 text-xs text-slate-700 leading-relaxed">
                <li>
                  <strong className="text-slate-900">{lang === 'kn' ? 'ಕ್ಲೈಂಟ್ ಸೈಡ್ ದತ್ತಾಂಶ ನಿಷೇಧ (Zero Client-Side PII):' : 'Zero Client-Side PII:'} </strong>
                  {lang === 'kn'
                    ? 'ನೈಜ ವಿದ್ಯಾರ್ಥಿಗಳ ಹೆಸರು, ಅಂಕಗಳು ಹಾಗೂ ಹಾಜರಾತಿಯನ್ನು ಬ್ರೌಸರ್ ಜಾವಾಸ್ಕ್ರಿಪ್ಟ್ ಫೈಲ್‌ಗಳಲ್ಲಿ ಸಂಗ್ರಹಿಸಬಾರದು. ಕೇವಲ ಪ್ರಮಾಣೀಕೃತ ಸರ್ವರ್ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಮಾತ್ರ ಇರಬೇಕು.'
                    : 'Real student names, grades, and attendance must never be committed to browser JavaScript bundles; they must reside solely in an authenticated database.'}
                </li>
                <li>
                  <strong className="text-slate-900">{lang === 'kn' ? 'ಸರ್ವರ್-ಸೈಡ್ ಪೋಷಕ ಮೊಬೈಲ್ OTP ದೃಢೀಕರಣ:' : 'Server-Side 2FA Parent Mobile OTP:'} </strong>
                  {lang === 'kn'
                    ? 'ಕೇವಲ SATS ಸಂಖ್ಯೆ ನಮೂದಿಸಿದರೆ ಸಾಲದು; ಶಾಲೆಗೆ ನೋಂದಾಯಿಸಿದ ಪೋಷಕರ ಮೊಬೈಲ್‌ಗೆ NIC / ಸರ್ಕಾರಿ SMS ಗೇಟ್‌ವೇ ಮೂಲಕ OTP ರವಾನಿಸಿ ಪರಿಶೀಲಿಸಬೇಕು.'
                    : 'Aadhaar/SATS alone must not allow access. Authentication must require an OTP sent via authorized NIC/Govt SMS gateway to the parent mobile registered on file.'}
                </li>
                <li>
                  <strong className="text-slate-900">{lang === 'kn' ? 'ಬ್ರೂಟ್-ಫೋರ್ಸ್ ದರ ನಿಯಂತ್ರಣ (Server Rate-Limiting):' : 'Server Rate-Limiting & Lockout:'} </strong>
                  {lang === 'kn'
                    ? 'ಪ್ರತಿ IP ಮತ್ತು ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ 15 ನಿಮಿಷಗಳಲ್ಲಿ ಗರಿಷ್ಠ 5 ವಿಫಲ ಪ್ರಯತ್ನಗಳ ಮಿತಿ ನಿಗದಿಪಡಿಸಬೇಕು.'
                    : 'Enforce strict server-side rate-limiting (max 5 failed attempts per 15 minutes) to prevent brute-forcing student SATS IDs.'}
                </li>
                <li>
                  <strong className="text-slate-900">{lang === 'kn' ? 'ಸುರಕ್ಷಿತ ಅಧಿವೇಶನ (HttpOnly Session Cookies):' : 'Secure HttpOnly Session Cookies:'} </strong>
                  {lang === 'kn'
                    ? 'JWT ಅಧಿವೇಶನ ಟೋಕನ್‌ಗಳನ್ನು HttpOnly, Secure, SameSite=Strict ಕುಕೀಗಳಲ್ಲಿ ಇರಿಸಿ 15 ನಿಮಿಷಗಳ ನಿಷ್ಕ್ರಿಯತೆಯ ನಂತರ ತಾನಾಗಿಯೇ ಅಳಿಸಿಹಾಕಬೇಕು.'
                    : 'Tokens must be stored strictly in HttpOnly, Secure cookies with 15-minute inactivity timeouts.'}
                </li>
                <li>
                  <strong className="text-slate-900">{lang === 'kn' ? 'ಪಾತ್ರಾಧಾರಿತ ಪ್ರವೇಶ ನಿಯಂತ್ರಣ (RBAC):' : 'Role-Based Access Control (RBAC):'} </strong>
                  {lang === 'kn'
                    ? 'ಪೋಷಕರು ಕೇವಲ ತಮ್ಮ ಮಗುವಿನ ವಿವರವನ್ನು ಮಾತ್ರ ನೋಡಲು ಅನುಮತಿಸಬೇಕು. ಶಿಕ್ಷಕರು ಹಾಗೂ ಮುಖ್ಯೋಪಾಧ್ಯಾಯರಿಗೆ ಪ್ರತ್ಯೇಕ ಪಾತ್ರಾಧಾರಿತ ನಿರ್ವಾಹಕ ಲಾಗಿನ್ ಇರಬೇಕು.'
                    : 'Enforce least-privilege row-level security allowing parents to view only their enrolled child.'}
                </li>
                <li>
                  <strong className="text-slate-900">{lang === 'kn' ? 'ಆಡಿಟ್ ಲಾಗಿಂಗ್ (Audit Logging):' : 'Immutable Access Audit Logs:'} </strong>
                  {lang === 'kn'
                    ? 'ಪ್ರತಿಯೊಂದು ಪ್ರಗತಿ ಪತ್ರ ವೀಕ್ಷಣೆಯ ದಿನಾಂಕ, ಸಮಯ, ಐಪಿ ವಿಳಾಸ ಹಾಗೂ ಪೋಷಕರ ಮೊಬೈಲ್ ವಿವರಗಳನ್ನು ದಾಖಲಿಸಿಕೊಳ್ಳಬೇಕು.'
                    : 'Log all grade view requests with timestamps, user identities, and IP addresses for school compliance auditing.'}
                </li>
                <li>
                  <strong className="text-slate-900">{lang === 'kn' ? 'ಆಧಾರ್ ದತ್ತಾಂಶ ಸಂಗ್ರಹಿಸದಿರುವುದು (Aadhaar Minimization):' : 'Aadhaar Minimization:'} </strong>
                  {lang === 'kn'
                    ? 'ನ್ಯಾಯಾಲಯದ ಮಾರ್ಗಸೂಚಿಯಂತೆ ಶಾಲಾ ವೆಬ್‌ಸೈಟ್‌ಗಳಲ್ಲಿ ಯಾವುದೇ ಕಾರಣಕ್ಕೂ ಆಧಾರ್ ಸಂಖ್ಯೆಯನ್ನು ಪ್ರದರ್ಶಿಸಬಾರದು ಅಥವಾ ಸಂಗ್ರಹಿಸಬಾರದು.'
                    : 'Do not collect, store, or display student Aadhaar numbers on public school portals.'}
                </li>
              </ol>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsSecurityModalOpen(false)}
                className="px-4 py-2 bg-[#13325e] text-white font-bold rounded text-xs hover:bg-[#0c1f3c] transition-colors cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
