import React, { useState } from 'react';
import {
  Upload,
  X,
  Sparkles,
  ShieldAlert,
  Image as ImageIcon,
  Check,
  Heart,
  Tag,
} from 'lucide-react';
import { User, Post, AppLanguage } from '../types';
import { TRANSLATIONS, translateTag, getPresetImageTitle } from '../services/i18n';

interface CreatePostModalProps {
  currentUser: User;
  onClose: () => void;
  onSubmit: (
    newPost: Omit<Post, 'id' | 'createdAt' | 'likesCount' | 'hugCount' | 'comments'>
  ) => void;
  lang?: AppLanguage;
}

const PRESET_BODY_IMAGES = [
  {
    key: 'vitiligo',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    key: 'scars',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    key: 'lines',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  },
  {
    key: 'curves',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
  },
];

const POPULAR_TAGS = [
  'پذیرش_بدن',
  'استرچ_مارک',
  'جای_زخم',
  'ویتیلیگو',
  'بدن_واقعی',
  'بدون_فیلتر',
  'کاهش_وزن',
  'سلولیت_طبیعی',
  'پوست_من_داستان_من',
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  currentUser,
  onClose,
  onSubmit,
  lang = 'fa',
}) => {
  const currentLang: AppLanguage = (lang as AppLanguage) || 'fa';
  const t = TRANSLATIONS[currentLang];
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [bodyJourney, setBodyJourney] = useState('');
  const [isSensitive, setIsSensitive] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(['بدن_واقعی']);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;

    onSubmit({
      userId: currentUser.id,
      user: currentUser,
      imageUrl,
      caption: caption.trim() || (currentLang === 'fa' ? 'بدون هیچ روتوشی؛ این من هستم با تمام داستان‌های پوستم 🌱' : 'Unfiltered and authentic; this is me with all my natural beauty 🌱'),
      bodyJourney: bodyJourney.trim(),
      tags: selectedTags,
      isSensitive,
      originalLanguage: currentLang,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="w-full sm:max-w-md bg-[#171523] border-t sm:border border-[#3c344f] rounded-t-[28px] sm:rounded-3xl p-4 sm:p-5 shadow-2xl max-h-[90dvh] flex flex-col overflow-hidden">
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden w-10 h-1 bg-[#4b435e] rounded-full mx-auto mb-2.5" />
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#292436]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#352a3b] border border-[#d6a592]/30 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-[#e8a598]" />
            </div>
            <h3 className="text-xs font-bold text-[#f3edf9]">{t.createPostTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#8e879f] hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-0.5">
          {/* Image Upload Area */}
          <div>
            <label className="text-[11px] font-semibold text-[#cfcadb] block mb-1.5">
              {t.unretouchedImageLabel}
            </label>

            {imageUrl ? (
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#483f5e] bg-black">
                <img
                  src={imageUrl}
                  alt="Selected upload"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 rtl:right-2 ltr:left-2 px-2 py-1 rounded-full bg-black/70 text-white text-[10px] hover:bg-black cursor-pointer"
                >
                  {t.changeImageBtn}
                </button>
                {isSensitive && (
                  <div className="absolute bottom-2 left-2 rtl:left-2 ltr:right-2 px-2 py-0.5 rounded-md bg-[#422027] text-[#f28e83] border border-[#f28e83]/40 text-[9px] font-bold">
                    {t.tag18Active}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="h-32 rounded-2xl border-2 border-dashed border-[#443b57] hover:border-[#d6a592] bg-[#12101b] flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all p-3 text-center">
                  <Upload className="w-6 h-6 text-[#d6a592]" />
                  <span className="text-xs font-medium text-[#ded8ea]">
                    {t.choosePhotoGalleryOrCamera}
                  </span>
                  <span className="text-[10px] text-[#8a829a]">
                    {t.noFiltersNotice}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Or Pick a Body-Positive Sample Preset */}
                <div className="pt-1">
                  <span className="text-[10px] text-[#9a91ab] block mb-1">
                    {t.orPickPresetSample}
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {PRESET_BODY_IMAGES.map((preset, idx) => {
                      const presetTitle = getPresetImageTitle(preset.key, currentLang);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImageUrl(preset.url)}
                          className="group relative aspect-square rounded-xl overflow-hidden border border-[#3b344e] hover:border-[#e8a598] transition-all cursor-pointer"
                          title={presetTitle}
                        >
                          <img
                            src={preset.url}
                            alt={presetTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* +18 Sensitive Content Toggle */}
          <div className="p-3 rounded-2xl bg-[#231b25] border border-[#4d2834]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#3d1a24] text-[#f28e83] flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#f5eaec]">{t.sensitiveToggleTitle}</h4>
                  <p className="text-[10px] text-[#bda7b0]">
                    {t.sensitiveToggleSubtitle}
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSensitive}
                  onChange={e => setIsSensitive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#3c344a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#c95d52]"></div>
              </label>
            </div>
            {isSensitive && (
              <p className="text-[10px] text-[#e8b5b0] mt-2 pt-2 border-t border-[#462832] leading-relaxed">
                {t.sensitiveToggleExplanation}
              </p>
            )}
          </div>

          {/* Caption */}
          <div>
            <label className="text-[11px] font-semibold text-[#cfcadb] block mb-1">
              {t.captionAndFeelingLabel}
            </label>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder={t.captionPlaceholder}
              rows={2}
              className="w-full bg-[#111019] text-xs text-[#eae6f5] rounded-xl p-2.5 border border-[#383149] focus:border-[#d6a592] outline-none resize-none placeholder:text-[#676077]"
            />
          </div>

          {/* Body Story / Journey */}
          <div>
            <label className="text-[11px] font-semibold text-[#d6a592] flex items-center gap-1 mb-1">
              <Sparkles className="w-3 h-3" />
              <span>{t.bodyJourneyLabel}</span>
            </label>
            <textarea
              value={bodyJourney}
              onChange={e => setBodyJourney(e.target.value)}
              placeholder={t.bodyJourneyPlaceholder}
              rows={2}
              className="w-full bg-[#111019] text-xs text-[#eae6f5] rounded-xl p-2.5 border border-[#383149] focus:border-[#d6a592] outline-none resize-none placeholder:text-[#676077]"
            />
          </div>

          {/* Body Tags */}
          <div>
            <label className="text-[11px] font-semibold text-[#cfcadb] flex items-center gap-1 mb-1.5">
              <Tag className="w-3 h-3" />
              <span>{t.tagsLabel}</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_TAGS.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#3b2e44] text-[#f2e7fc] border-[#d6a592]'
                        : 'bg-[#181622] text-[#9b93ab] border-[#2f293d] hover:border-[#4d4463]'
                    }`}
                  >
                    #{translateTag(tag, currentLang)}
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[#292436] flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={!imageUrl}
            className="flex-1 py-2.5 bg-gradient-to-r from-[#7a4e61] to-[#ba7f73] text-white rounded-xl text-xs font-bold disabled:opacity-40 hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{t.submitPostBtn}</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-[#201d2b] text-[#a69eb5] rounded-xl text-xs hover:text-white cursor-pointer"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};
