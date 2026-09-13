import React, { useState } from 'react';
import { ShieldAlert, X, Check } from 'lucide-react';
import { ReportReason, ReportTargetType, AppLanguage } from '../types';
import { TRANSLATIONS } from '../services/i18n';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
  targetPreview: string;
  targetUserId: string;
  targetUserName: string;
  onSubmitReport: (params: {
    targetType: ReportTargetType;
    targetId: string;
    targetPreview: string;
    targetUserId: string;
    targetUserName: string;
    reason: ReportReason;
    description?: string;
  }) => void;
  lang?: AppLanguage;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetPreview,
  targetUserId,
  targetUserName,
  onSubmitReport,
  lang = 'fa',
}) => {
  const currentLang: AppLanguage = (lang as AppLanguage) || 'fa';
  const t = TRANSLATIONS[currentLang];
  const [selectedReason, setSelectedReason] = useState<ReportReason>('missing_18_tag');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const reportReasons: { value: ReportReason; label: string; desc: string }[] = [
    {
      value: 'missing_18_tag',
      label: t.reportReasonMissing18,
      desc: t.reportReasonMissing18Desc,
    },
    {
      value: 'body_shaming',
      label: t.reportReasonBodyShaming,
      desc: t.reportReasonBodyShamingDesc,
    },
    {
      value: 'harassment',
      label: t.reportReasonHarassment,
      desc: t.reportReasonHarassmentDesc,
    },
    {
      value: 'unsolicited_explicit',
      label: t.reportReasonExplicit,
      desc: t.reportReasonExplicitDesc,
    },
    {
      value: 'hate_speech',
      label: t.reportReasonHateSpeech,
      desc: t.reportReasonHateSpeechDesc,
    },
    {
      value: 'other',
      label: t.reportReasonOther,
      desc: t.reportReasonOtherDesc,
    },
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport({
      targetType,
      targetId,
      targetPreview,
      targetUserId,
      targetUserName,
      reason: selectedReason,
      description: description.trim(),
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  const getTargetTypeLabel = () => {
    if (targetType === 'comment') return t.reportTargetComment;
    if (targetType === 'user') return t.reportTargetUser;
    return t.reportTargetPost;
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="w-full max-w-sm bg-[#181625] border border-[#3e3552] rounded-3xl p-4 shadow-2xl max-h-[92%] overflow-y-auto no-scrollbar">
        {submitted ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#1e2a22] text-[#9bb39d] flex items-center justify-center border border-[#9bb39d]/40 shadow-lg">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-bold text-[#f1ecfa]">{t.reportSuccessTitle}</h3>
            <p className="text-[11px] text-[#a49cb5] max-w-[220px]">
              {t.reportSuccessDesc}
            </p>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#292437]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#3d1f27] text-[#f28e83] flex items-center justify-center border border-[#f28e83]/30">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#f2ecf9]">{t.reportModalTitle}</h3>
                  <p className="text-[10px] text-[#9b93ab]">
                    {getTargetTypeLabel()}: {targetUserName}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-[#8b849b] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Preview */}
            <div className="my-2.5 p-2 rounded-xl bg-[#12101b] border border-[#2b2539] text-[11px] text-[#ded8ea] truncate">
              <span className="text-[#9a91ab] ml-1 rtl:ml-1 ltr:mr-1 font-medium">{t.reportSubjectLabel}</span>
              {targetPreview}
            </div>

            {/* Reason Selection */}
            <form onSubmit={handleSubmit} className="space-y-2.5">
              <label className="text-[11px] font-semibold text-[#cfcadb] block">
                {t.reportSubjectLabel}
              </label>

              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {reportReasons.map(r => (
                  <label
                    key={r.value}
                    onClick={() => setSelectedReason(r.value)}
                    className={`block p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedReason === r.value
                        ? 'bg-[#312536] border-[#e8a598] text-[#f7eef5]'
                        : 'bg-[#14121d] border-[#292436] text-[#b6acc8] hover:border-[#423a54]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[11px]">{r.label}</span>
                      <input
                        type="radio"
                        name="reportReason"
                        checked={selectedReason === r.value}
                        onChange={() => setSelectedReason(r.value)}
                        className="accent-[#e8a598]"
                      />
                    </div>
                    <p className="text-[10px] text-[#8e879f] mt-0.5 leading-relaxed">
                      {r.desc}
                    </p>
                  </label>
                ))}
              </div>

              <div>
                <label className="text-[10px] text-[#aba4bd] block mb-1">
                  {t.reportAdditionalDetailsLabel}
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={t.reportAdditionalDetailsPlaceholder}
                  rows={2}
                  className="w-full bg-[#12101b] text-xs text-[#ded8eb] p-2 rounded-xl border border-[#2f293d] focus:border-[#e8a598] outline-none resize-none placeholder:text-[#676077]"
                />
              </div>

              <div className="flex gap-2 pt-1 border-t border-[#292437]">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gradient-to-r from-[#7a4e61] to-[#ba7f73] text-white rounded-xl text-xs font-bold cursor-pointer hover:brightness-110 active:scale-95 transition-all shadow"
                >
                  {t.reportSubmitBtn}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 bg-[#221f2f] text-[#a59db5] rounded-xl text-xs hover:text-white cursor-pointer"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
