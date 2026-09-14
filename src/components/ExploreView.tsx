import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Tag,
  Lock,
  Quote,
  Search,
  X,
  Compass,
} from 'lucide-react';
import { Post, Note, User, AppLanguage } from '../types';
import { TRANSLATIONS, translateTag, getLocalizedPost, getLocalizedNote, matchesMultilingualTag } from '../services/i18n';

interface ExploreViewProps {
  posts: Post[];
  notes: Note[];
  currentUser: User;
  onSelectPost: (post: Post) => void;
  onSelectTag: (tag: string) => void;
  lang?: AppLanguage;
}

const BODY_AFFIRMATIONS: Record<AppLanguage, string[]> = {
  fa: [
    'بدن من یک دکوراسیون برای تحسین دیگران نیست؛ خانه امن روح من است 🕊️',
    'خطوط روی پوستم، مسیرهای رسیدن به قدرت امروزم هستند ✨',
    'هیچ زاویه بدی وجود نداره؛ زاویه‌ها فقط حقیقت تنوع انسانی رو نشون میدن 🌸',
    'زیبایی واقعی در تفاوت‌هاست، نه در کپی‌برداری از فیلترهای الگوریتمی 🌱',
    'امروز به خاطر تمام کارهایی که بدنم برام انجام داده، ازش تشکر می‌کنم 🤍',
  ],
  en: [
    'My body is not an ornament for others; it is the sacred home of my soul 🕊️',
    'The lines on my skin are the pathways that led to my resilience ✨',
    'There are no bad angles; every angle reflects authentic human diversity 🌸',
    'Authentic beauty lives in uniqueness, not algorithmic filters 🌱',
    'Today I express profound gratitude for everything my body has carried 🤍',
  ],
  es: [
    'Mi cuerpo no es una decoración; es el hogar seguro de mi alma 🕊️',
    'Las marcas en mi piel son caminos de fuerza y resiliencia ✨',
    'No existen ángulos malos; cada perspectiva refleja la belleza diversa 🌸',
    'La belleza auténtica reside en las diferencias, no en los filtros 🌱',
    'Hoy agradezco a mi cuerpo todo el camino que ha recorrido conmigo 🤍',
  ],
  ar: [
    'جسدي ليس مجرد مظهر لنيل إعجاب الآخرين، بل هو المأوى الآمن لروحي 🕊️',
    'الخطوط على جلدي هي مسارات وصلت بي إلى قوتي اليوم ✨',
    'لا توجد زوايا سيئة، كل الزوايا تعكس تنوع الجمال البشري 🌸',
    'الجمال الحقيقي يكمن في الاختلاف وليس في فلاتر التجميل المصطنعة 🌱',
    'أشكر جسدي اليوم على كل الدعم والرحلة التي خاضها معي 🤍',
  ],
  fr: [
    'Mon corps n’est pas un objet d’apparat ; c’est le foyer de mon âme 🕊️',
    'Les marques sur ma peau sont les sentiers de ma résilience ✨',
    'Il n’y a aucun mauvais angle ; chaque regard révèle la richesse humaine 🌸',
    'La beauté véritable réside dans nos différences, loin des filtres artificiels 🌱',
    'Aujourd’hui, je remercie mon corps pour chaque pas accompli 🤍',
  ],
};

const EXPLORE_TAGS = [
  'همه',
  'استرچ_مارک',
  'جای_زخم',
  'ویتیلیگو',
  'بدن_واقعی',
  'کاهش_وزن',
  'سلولیت_طبیعی',
  'پوست_طبیعی',
  'کک_و_مک',
];

export const ExploreView: React.FC<ExploreViewProps> = ({
  posts,
  notes,
  currentUser,
  onSelectPost,
  onSelectTag,
  lang = 'fa',
}) => {
  const currentLang: AppLanguage = (lang as AppLanguage) || 'fa';
  const t = TRANSLATIONS[currentLang];
  const [selectedTag, setSelectedTag] = useState<string>('همه');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0);

  const affirmations = BODY_AFFIRMATIONS[currentLang] || BODY_AFFIRMATIONS.fa;

  const handleNextAffirmation = () => {
    setCurrentAffirmationIndex(prev => (prev + 1) % affirmations.length);
  };

  // Filter posts based on search query and category tag
  const filteredPosts = useMemo(() => {
    let result = posts;

    // Filter by tag
    if (selectedTag !== 'همه') {
      result = result.filter(p => {
        if (p.tags.includes(selectedTag)) return true;
        // Tag aliases matching
        if (selectedTag === 'جای_زخم' && p.tags.includes('زخم_جراحی')) return true;
        if (selectedTag === 'بدن_واقعی' && (p.tags.includes('واقعیت_بدن') || p.tags.includes('پذیرش_بدن'))) return true;
        return false;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => {
        const localized = getLocalizedPost(p, currentLang);
        const matchCaption = (p.caption || '').toLowerCase().includes(q) || localized.caption.toLowerCase().includes(q);
        const matchJourney = (p.bodyJourney || '').toLowerCase().includes(q) || localized.bodyJourney.toLowerCase().includes(q);
        const matchAuthor = p.user.name.toLowerCase().includes(q) || p.user.username.toLowerCase().includes(q);
        const matchTags = matchesMultilingualTag(p.tags, q) || p.tags.some(tag => tag.toLowerCase().includes(q) || translateTag(tag, currentLang).toLowerCase().includes(q));
        return matchCaption || matchJourney || matchAuthor || matchTags;
      });
    }

    return result;
  }, [posts, selectedTag, searchQuery, currentLang]);

  return (
    <div className="w-full max-w-3xl lg:max-w-4xl mx-auto min-w-0 p-3 sm:p-5 pb-24 space-y-4">
      {/* Search & Discovery Bar */}
      <div className="relative w-full max-w-full">
        <div className="absolute inset-y-0 right-3.5 rtl:right-3.5 ltr:left-3.5 flex items-center pointer-events-none text-[#8d83a1]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={t.searchExplorePlaceholder}
          className="w-full bg-[#171424] border border-[#2d263f] focus:border-[#d6a592] rounded-2xl py-2.5 rtl:pr-10 rtl:pl-9 ltr:pl-10 ltr:pr-9 text-xs text-[#ece6f7] placeholder-[#796f8c] outline-none transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 rtl:left-3 ltr:right-3 flex items-center text-[#8d83a1] hover:text-[#e8a598] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Daily Affirmation Card */}
      <div className="w-full max-w-full p-4 rounded-3xl cozy-card-warm relative overflow-hidden">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#e8a598] mb-2">
          <Sparkles className="w-4 h-4" />
          <span>{t.exploreAffirmationTitle}</span>
        </div>

        <p className="text-xs text-[#f1ecfa] leading-relaxed font-medium break-words">
          «{affirmations[currentAffirmationIndex] || affirmations[0]}»
        </p>
      </div>

      {/* Community Notes Wall */}
      {notes && notes.length > 0 && (
        <div className="w-full max-w-full min-w-0">
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-xs font-bold text-[#e2dcee] flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5 text-[#9bb39d]" />
              <span>{t.exploreNotesWall}</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full max-w-full">
            {notes.slice(0, 4).map(n => (
              <div
                key={n.id}
                className="min-w-0 p-3 rounded-2xl bg-[#171524] border border-[#2d263c] flex flex-col justify-between overflow-hidden shadow-sm hover:border-[#433758] transition-all"
              >
                <p className="text-xs text-[#ded8ea] leading-relaxed mb-2 font-medium break-words line-clamp-2">
                  «{getLocalizedNote(n.id, n.text, currentLang)}»
                </p>
                <div className="flex items-center gap-1.5 pt-2 border-t border-[#262033] min-w-0 overflow-hidden">
                  <img
                    src={n.user?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'}
                    alt={n.user?.name || ''}
                    className="w-5 h-5 rounded-full object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-[10px] text-[#9a91ab] truncate min-w-0 flex-1">
                    {n.user?.name || 'کاربر'}
                  </span>
                  <span className="shrink-0 text-xs">{n.moodEmoji}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tag Filters */}
      <div className="w-full max-w-full min-w-0 overflow-hidden">
        <div className="flex items-center gap-1.5 mb-2 px-1 text-xs text-[#bbb4cb] font-semibold">
          <Tag className="w-3.5 h-3.5 text-[#d6a592] shrink-0" />
          <span className="truncate">
            {currentLang === 'fa'
              ? 'دسته‌بندی ویژگی‌های طبیعی:'
              : currentLang === 'ar'
              ? 'تصنيفات ملامح الجسد الطبيعية:'
              : currentLang === 'es'
              ? 'Categorías de rasgos naturales:'
              : currentLang === 'fr'
              ? 'Catégories de traits naturels :'
              : 'Natural Body Features:'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 w-full max-w-full">
          {EXPLORE_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTag(tag);
                if (tag !== 'همه') onSelectTag(tag);
              }}
              className={`text-xs px-3 py-1 rounded-full whitespace-nowrap border transition-all cursor-pointer shrink-0 ${
                selectedTag === tag
                  ? 'bg-[#3b2d42] text-[#f2e7fc] border-[#d6a592] shadow-sm'
                  : 'bg-[#181624] text-[#9991a9] border-[#2c263c] hover:border-[#423956]'
              }`}
            >
              {tag === 'همه' ? t.allTag : `#${translateTag(tag, currentLang)}`}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Header & Result Count */}
      <div className="flex items-center justify-between px-1 text-xs text-[#9d94b0]">
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-[#d6a592]" />
          <span>
            {filteredPosts.length}{' '}
            {currentLang === 'fa'
              ? 'روایت تصویری'
              : currentLang === 'ar'
              ? 'منشور'
              : currentLang === 'es'
              ? 'publicaciones'
              : currentLang === 'fr'
              ? 'publications'
              : 'posts'}
          </span>
        </div>
        {(selectedTag !== 'همه' || searchQuery.trim() !== '') && (
          <button
            onClick={() => {
              setSelectedTag('همه');
              setSearchQuery('');
            }}
            className="text-[11px] text-[#e8a598] hover:underline cursor-pointer"
          >
            {t.resetFilters}
          </button>
        )}
      </div>

      {/* Filtered Grid Gallery */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 w-full max-w-full">
          {filteredPosts.map(post => {
            const localized = getLocalizedPost(post, currentLang);
            const isSensitiveLocked = post.isSensitive && !currentUser.isAgeVerified;

            return (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="min-w-0 w-full group relative aspect-[4/5] rounded-2xl overflow-hidden bg-black border border-[#2c253d] cursor-pointer hover:border-[#d6a592] transition-all shadow-md"
              >
                <img
                  src={post.imageUrl}
                  alt={localized.caption || post.caption}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                    isSensitiveLocked ? 'blur-md scale-105' : ''
                  }`}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                {/* Author Avatar Pill at Top */}
                <div className="absolute top-2 right-2 rtl:right-2 ltr:left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 z-10">
                  <img
                    src={post.user?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'}
                    alt={post.user?.name || ''}
                    className="w-3.5 h-3.5 rounded-full object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-[9px] text-white/90 truncate max-w-[80px]">
                    {post.user?.name || 'کاربر'}
                  </span>
                </div>

                {/* Sensitive badge */}
                {isSensitiveLocked && (
                  <div className="absolute top-2 left-2 rtl:left-2 ltr:right-2 px-2 py-0.5 rounded-full bg-[#201c2e]/90 text-[#e8a598] border border-[#483d63] text-[10px] font-semibold flex items-center gap-1 backdrop-blur-sm z-10">
                    <Lock className="w-3 h-3" />
                    <span>{t.sensitiveOverlayPill}</span>
                  </div>
                )}

                {/* Bottom Caption & Stats */}
                <div className="absolute bottom-2 left-2 right-2 text-right rtl:text-right ltr:text-left min-w-0 overflow-hidden z-10">
                  <p className="text-[10px] text-[#ded8eb] line-clamp-2 min-w-0 break-words leading-relaxed font-normal">
                    {localized.caption || post.caption}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#e8a598] font-medium">
                    <span>🤗 {post.hugCount}</span>
                    <span>🤍 {post.likesCount}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-12 px-4 rounded-3xl bg-[#171424]/80 border border-[#2b253c] text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#2a2238] flex items-center justify-center text-[#e8a598]">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-[#eae5f5]">{t.noExploreResults}</p>
          <button
            onClick={() => {
              setSelectedTag('همه');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-2xl bg-[#392d43] hover:bg-[#4a3a56] text-[#e8a598] text-xs font-semibold border border-[#d6a592]/40 transition-all cursor-pointer shadow-sm"
          >
            {t.resetFilters}
          </button>
        </div>
      )}
    </div>
  );
};
