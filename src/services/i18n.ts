/**
 * @file i18n.ts
 * @description Internationalization (i18n) and localization dictionary for NotPerfect.
 * Supports 5 languages:
 * - English ('en') — LTR
 * - Persian ('fa') — RTL
 * - Spanish ('es') — LTR
 * - Arabic ('ar') — RTL
 * - French ('fr') — LTR
 *
 * Provides bidirectional layout helpers (isRTL), multilingual tag discovery,
 * and localized date/time formatting.
 */

import { AppLanguage } from '../types';

export interface Translations {
  appName: string;
  appSlogan: string;
  navFeed: string;
  navExplore: string;
  navCreate: string;
  navMessages: string;
  navProfile: string;
  navSettings: string;
  
  // Product Switcher
  productMobileApp: string;
  productAdminPortal: string;
  productSwitchNotice: string;
  backToApp: string;

  // Reactions
  reactionHug: string;
  reactionLove: string;
  reactionCourage: string;
  reactionPeace: string;
  reactionBloom: string;
  
  // Posts & Feed
  sensitiveContentBadge: string;
  sensitiveContentTitle: string;
  sensitiveContentDesc: string;
  viewSensitiveContent: string;
  reBlurSensitive: string;
  bodyStory: string;
  commentsCount: string;
  leaveCommentPlaceholder: string;
  sendComment: string;
  moderationNotice: string;
  myStory: string;
  addStory: string;
  sharePost: string;
  noPostsYet: string;
  
  // Age Verification
  ageVerificationTitle: string;
  ageVerificationSubtitle: string;
  ageVerificationDesc: string;
  googleAuthVerification: string;
  googleAuthVerificationDesc: string;
  videoFaceVerification: string;
  videoFaceVerificationDesc: string;
  startVideoRecording: string;
  stopVideoRecording: string;
  submitVideoVerification: string;
  recordingInProgress: string;
  speakPromptInstruction: string;
  verifiedBadge: string;
  unverifiedBadge: string;
  pendingVerification: string;
  verifyAgeBtn: string;
  ageNoticeBannerTitle: string;
  ageNoticeBannerDesc: string;
  ageStatusVerifiedDesc: string;
  ageStatusUnverifiedDesc: string;
  
  // Notes & Messages
  directMessagesTitle: string;
  notesTrayTitle: string;
  yourNote: string;
  addNotePrompt: string;
  noteModalTitle: string;
  noteInputPlaceholder: string;
  saveNoteBtn: string;
  noteExpiryNotice: string;
  searchChatsPlaceholder: string;
  voiceMessageLabel: string;
  typeMessagePlaceholder: string;
  recordingVoice: string;
  noMessagesYet: string;

  // Profile
  profilePhotos: string;
  profileNotes: string;
  profileFollowers: string;
  profileFollowing: string;
  editProfile: string;
  bodyJourneyTitle: string;
  tabPhotos: string;
  tabSaved: string;
  tabJourney: string;
  displayNameLabel: string;
  badgeLabel: string;
  bioLabel: string;
  saveChanges: string;

  // Explore
  exploreAffirmationTitle: string;
  nextAffirmation: string;
  exploreNotesWall: string;
  allTag: string;
  searchExplorePlaceholder: string;
  noExploreResults: string;
  resetFilters: string;

  // Settings & Hamburger Menu
  settingsTitle: string;
  accountSection: string;
  ageStatus: string;
  languageSection: string;
  privacySection: string;
  themeSection: string;
  communityGuidelines: string;
  adminPortalBtn: string;
  resetDataBtn: string;
  blurSensitiveToggleTitle: string;
  blurSensitiveToggleDesc: string;
  safeSpaceActive: string;
  safeSpaceDesc: string;
  manifestoText: string;
  
  // Language Names
  langPersian: string;
  langEnglish: string;
  langSpanish: string;
  langArabic: string;
  langFrench: string;
  
  // General
  back: string;
  save: string;
  cancel: string;
  success: string;
  error: string;
  report: string;
  reportedSuccess: string;
  follow: string;
  following: string;
  menu: string;

  // Cozy Sensitive Frame & Reactions
  sensitiveFrameTitle: string;
  sensitiveFrameDesc: string;
  sensitiveFrameButton: string;
  sensitiveOverlayPill: string;
  reactionsHeading: string;

  // Post Translations
  seeOriginal: string;
  seeTranslation: string;

  // Chat Date Dividers
  today: string;
  yesterday: string;

  // Auth & Account
  login: string;
  signup: string;
  loginTitle: string;
  signupTitle: string;
  loginSubtitle: string;
  signupSubtitle: string;
  continueWithGoogle: string;
  googleAuthSuccess: string;
  emailOrUsername: string;
  email: string;
  fullName: string;
  username: string;
  password: string;
  bioPlaceholder: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  createAccount: string;
  logout: string;
  logoutConfirm: string;
  loginSuccess: string;
  signupSuccess: string;
  orDivider: string;
  guestMode: string;
  loginRequired: string;
  rememberMe: string;

  // Create Post Modal Translations
  createPostTitle: string;
  unretouchedImageLabel: string;
  changeImageBtn: string;
  tag18Active: string;
  choosePhotoGalleryOrCamera: string;
  noFiltersNotice: string;
  orPickPresetSample: string;
  captionAndFeelingLabel: string;
  captionPlaceholder: string;
  bodyJourneyLabel: string;
  bodyJourneyPlaceholder: string;
  tagsLabel: string;
  submitPostBtn: string;
  sensitiveToggleTitle: string;
  sensitiveToggleSubtitle: string;
  sensitiveToggleExplanation: string;

  // Report Modal Translations
  reportModalTitle: string;
  reportTargetPost: string;
  reportTargetComment: string;
  reportTargetUser: string;
  reportSubjectLabel: string;
  reportReasonMissing18: string;
  reportReasonMissing18Desc: string;
  reportReasonBodyShaming: string;
  reportReasonBodyShamingDesc: string;
  reportReasonHarassment: string;
  reportReasonHarassmentDesc: string;
  reportReasonExplicit: string;
  reportReasonExplicitDesc: string;
  reportReasonHateSpeech: string;
  reportReasonHateSpeechDesc: string;
  reportReasonOther: string;
  reportReasonOtherDesc: string;
  reportAdditionalDetailsLabel: string;
  reportAdditionalDetailsPlaceholder: string;
  reportSubmitBtn: string;
  reportSuccessTitle: string;
  reportSuccessDesc: string;
}

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  fa: {
    appName: 'NotPerfect',
    appSlogan: 'پذیرش زیباییِ نقص‌ها',
    navFeed: 'فید',
    navExplore: 'کاوش',
    navCreate: 'پست جدید',
    navMessages: 'پیام‌ها',
    navProfile: 'پروفایل',
    navSettings: 'تنظیمات',
    
    productMobileApp: 'اپلیکیشن NotPerfect',
    productAdminPortal: 'میز کار نظارت و ادمین',
    productSwitchNotice: 'سوئیچ بین دو محصول پلتفرم',
    backToApp: 'بازگشت به اپلیکیشن',

    reactionHug: 'پذیرش',
    reactionLove: 'عشق به خود',
    reactionCourage: 'شجاعت',
    reactionPeace: 'التیام',
    reactionBloom: 'طبیعی',
    
    sensitiveContentBadge: 'تگ محتوای حساس (+۱۸)',
    sensitiveContentTitle: 'تصویر حاوی بخش‌های طبیعی و خصوصی بدن',
    sensitiveContentDesc: 'این تصویر برای احترام به نگاه شما تار شده است. برای مشاهده، نیاز به تایید سن بالای ۱۸ سال دارید.',
    viewSensitiveContent: 'مشاهده تصویر (+۱۸)',
    reBlurSensitive: 'مات‌کردن مجدد (+۱۸)',
    bodyStory: 'داستان این بدن:',
    commentsCount: 'دیدگاه صمیمانه',
    leaveCommentPlaceholder: 'یک جمله پر از مهر و همراهی بنویسید...',
    sendComment: 'ارسال',
    moderationNotice: 'این محتوا به علت نقض اصول فضای امن، توسط ناظران حذف شد.',
    myStory: 'استوری من',
    addStory: 'افزودن استوری',
    sharePost: 'ارسال پست جدید',
    noPostsYet: 'هنوز پستی ارسال نشده است.',
    
    ageVerificationTitle: 'احراز سن بالای ۱۸ سال',
    ageVerificationSubtitle: 'فضای امن برای پذیرش بدن‌های واقعی',
    ageVerificationDesc: 'برای تماشای تصاویر بدون مات‌شدگی، لطفا سن خود را با حساب گوگل یا یک ویدیوی ۵ ثانیه‌ای چهره تایید فرمایید.',
    googleAuthVerification: 'تایید سریع با حساب گوگل',
    googleAuthVerificationDesc: 'تایید فوری بر اساس تاریخ تولد حساب رسمی گوگل',
    videoFaceVerification: 'ولیدیشن ویدیویی چهره',
    videoFaceVerificationDesc: 'روشن کردن دوربین و قرائت جمله امنیتی تایید هویت',
    startVideoRecording: 'شروع ضبط ویدیوی کوتاه (۵ ثانیه)',
    stopVideoRecording: 'اتمام ضبط',
    submitVideoVerification: 'ارسال ویدیو جهت بررسی ناظران',
    recordingInProgress: 'در حال ضبط ویدیو...',
    speakPromptInstruction: 'لطفا این جمله را در ویدیو با صدای رسا بیان کنید:',
    verifiedBadge: 'تایید شده (+۱۸)',
    unverifiedBadge: 'تایید نشده',
    pendingVerification: 'در انتظار بررسی ناظران',
    verifyAgeBtn: 'تایید سن (+۱۸)',
    ageNoticeBannerTitle: 'احراز سن بالای ۱۸ سال',
    ageNoticeBannerDesc: 'برای تماشای عکس‌های بدون روتوش، سن خود را تایید کنید.',
    ageStatusVerifiedDesc: 'هویت شما تایید شده و دسترسی کامل به تصاویر طبیعی و بدون فیلتر دارید.',
    ageStatusUnverifiedDesc: 'برای تماشای تصاویر صمیمی و بدون فیلتر، سن خود را تایید کنید.',
    
    directMessagesTitle: 'پیام‌ها و گفتگوهای امن',
    notesTrayTitle: 'یادداشت‌های ۲۴ ساعته',
    yourNote: 'نوت شما',
    addNotePrompt: 'نوت شما...',
    noteModalTitle: 'یادداشت ۲۴ ساعته (Note)',
    noteInputPlaceholder: 'حس یا فکر کوتاهی درباره بدنت بنویس...',
    saveNoteBtn: 'ثبت نوت',
    noteExpiryNotice: 'این نوت بعد از ۲۴ ساعت محو می‌شود و دوستانت در بالای پیام‌ها آن را می‌بینند.',
    searchChatsPlaceholder: 'جستجو در گفتگوها...',
    voiceMessageLabel: 'پیام صوتی',
    typeMessagePlaceholder: 'پیامی بنویسید...',
    recordingVoice: 'در حال ضبط صدا...',
    noMessagesYet: 'هنوز پیامی ارسال نشده است.',

    profilePhotos: 'پست‌ها',
    profileNotes: 'نوت‌ها',
    profileFollowers: 'همراهان',
    profileFollowing: 'دنبال‌شده‌ها',
    editProfile: 'ویرایش بیو و مشخصات',
    bodyJourneyTitle: 'داستان بدن من (Body Journey)',
    tabPhotos: 'پست‌ها',
    tabSaved: 'ذخیره‌شده‌ها',
    tabJourney: 'سفر پذیرش تن',
    displayNameLabel: 'نام نمایشی:',
    badgeLabel: 'نشان یا لقب:',
    bioLabel: 'بیوگرافی و دیدگاه:',
    saveChanges: 'ذخیره تغییرات',

    exploreAffirmationTitle: 'نجوای آرامش و پذیرش تن',
    nextAffirmation: 'جمله بعدی ✨',
    exploreNotesWall: 'نوت‌های ۲۴ ساعته جامعه NotPerfect',
    allTag: 'همه',
    searchExplorePlaceholder: 'جستجو در اکسپلور، برچسب‌ها، افراد...',
    noExploreResults: 'هیچ پستی با این مشخصات یافت نشد 🌸',
    resetFilters: 'مشاهده همه پست‌ها',

    settingsTitle: 'تنظیمات و گزینه‌ها',
    accountSection: 'حساب کاربری و هویت',
    ageStatus: 'وضعیت احراز سن (+۱۸)',
    languageSection: 'زبان برنامه (Language)',
    privacySection: 'امنیت و فیلتر محتوا',
    themeSection: 'ظاهر و استایل',
    communityGuidelines: 'منشور و مرام‌نامه NotPerfect',
    adminPortalBtn: 'ورود به پنل مدیریت و نظارت (Admin Portal)',
    resetDataBtn: 'بازنشانی اطلاعات تستی',
    blurSensitiveToggleTitle: 'تار بودن پیش‌فرض عکس‌های حساس (+۱۸)',
    blurSensitiveToggleDesc: 'تصاویر بدون روتوش یا خصوصی با کلیک شما آشکار می‌شوند',
    safeSpaceActive: 'فضای امن فعال است',
    safeSpaceDesc: 'فیلترهای هوشمند مسدودسازی تمسخر اندام فعال است',
    manifestoText: 'در NotPerfect، بدن شما اثر انگشت زیستن شماست. هر زخم، هر خط استرچ، هر تغییر رنگدانه و هر انحنا، داستانی ارزشمند است. ما اینجاییم تا با حذف استانداردهای دروغین تجاری، به آرامش پذیرش خود برسیم.',

    langPersian: 'فارسی (FA)',
    langEnglish: 'English (EN)',
    langSpanish: 'Español (ES)',
    langArabic: 'العربية (AR)',
    langFrench: 'Français (FR)',
    
    back: 'بازگشت',
    save: 'ذخیره',
    cancel: 'انصراف',
    success: 'عملیات با موفقیت انجام شد',
    error: 'خطایی رخ داد',
    report: 'گزارش تخلف',
    reportedSuccess: 'گزارش شما با احترام ثبت شد و برای حفظ این فضای امن بررسی می‌شود.',
    follow: 'دنبال کردن',
    following: 'دنبال می‌کنید',
    menu: 'منو و تنظیمات',

    // Cozy Sensitive Frame & Reactions
    sensitiveFrameTitle: 'قابِ صمیمی و بدون فیلتر 🌿',
    sensitiveFrameDesc: 'این تصویر، روایتی عمیق‌تر و صمیمی‌تر از زیبایی‌های طبیعی تن است. برای پاسداشت این فضای امن، با یک تایید سن ساده و صمیمانه، پرده از این قاب بردارید ✨',
    sensitiveFrameButton: 'مشاهده با تایید سن صمیمانه 🕊️',
    sensitiveOverlayPill: 'قابِ خصوصی 🌿',
    reactionsHeading: 'واکنش‌ها',
    seeOriginal: 'مشاهده متن اصلی',
    seeTranslation: 'مشاهده ترجمه',
    today: 'امروز',
    yesterday: 'دیروز',

    // Auth & Account
    login: 'ورود',
    signup: 'ثبت‌نام',
    loginTitle: 'ورود به NotPerfect',
    signupTitle: 'عضویت در پناهگاه امن NotPerfect',
    loginSubtitle: 'جایی که زیبایی حقیقی بدون فیلتر و قضاوت جشن گرفته می‌شود',
    signupSubtitle: 'داستان بدن خود را با امنیت به اشتراک بگذارید و با افراد حامی ارتباط بگیرید',
    continueWithGoogle: 'ورود سریع با گوگل',
    googleAuthSuccess: 'با موفقیت از طریق گوگل وارد شدید ✨',
    emailOrUsername: 'ایمیل یا نام کاربری',
    email: 'ایمیل',
    fullName: 'نام و نام‌خانوادگی',
    username: 'نام کاربری',
    password: 'رمز عبور',
    bioPlaceholder: 'بیوگرافی یا داستان پوست، خطوط و پذیرش بدن شما...',
    dontHaveAccount: 'هنوز حسابی ندارید؟',
    alreadyHaveAccount: 'قبلاً ثبت‌نام کرده‌اید؟',
    createAccount: 'ایجاد حساب کاربری جدید',
    logout: 'خروج از حساب',
    logoutConfirm: 'آیا می‌خواهید از حساب خود خارج شوید؟',
    loginSuccess: 'با موفقیت وارد شدید! خوش آمدید 🌸',
    signupSuccess: 'حساب کاربری شما با موفقیت ساخته شد 🌿',
    orDivider: 'یا',
    guestMode: 'مشاهده به عنوان مهمان',
    loginRequired: 'برای این عمل ابتدا وارد حساب خود شوید',
    rememberMe: 'مرا به خاطر بسپار',

    // Create Post Modal Translations
    createPostTitle: 'پست جدید (بدن واقعی)',
    unretouchedImageLabel: 'تصویر بدون روتوش:',
    changeImageBtn: 'تغییر تصویر',
    tag18Active: 'تگ +18 فعال',
    choosePhotoGalleryOrCamera: 'انتخاب عکس از گالری یا دوربین',
    noFiltersNotice: 'بدون فیلترهای صاف‌کننده و زاویه‌ساز',
    orPickPresetSample: 'یا انتخاب نمونه آزمایشی بدن واقعی:',
    captionAndFeelingLabel: 'کپشن و احساس شما:',
    captionPlaceholder: 'درباره عکسی که به اشتراک گذاشتی چیزی بنویس...',
    bodyJourneyLabel: 'داستان بدن (Body Journey):',
    bodyJourneyPlaceholder: 'مسیر، تغییرات، زخم‌ها یا تجربیات تن را بنویسید...',
    tagsLabel: 'برچسب‌ها (هشتگ‌ها):',
    submitPostBtn: 'اشتراک‌گذاری پست صمیمانه',
    sensitiveToggleTitle: 'تگ محتوای حساس (+۱۸)',
    sensitiveToggleSubtitle: 'عکس‌های نزدیک یا بخش‌های حساس بدن',
    sensitiveToggleExplanation: 'این پست با پوشش مات و هشدار احترام‌آمیز به دیگر کاربران نمایش داده خواهد شد تا با انتخاب خودشان مشاهده کنند.',

    // Report Modal Translations
    reportModalTitle: 'گزارش تخلف محتوا',
    reportTargetPost: 'پست',
    reportTargetComment: 'نظر',
    reportTargetUser: 'کاربر',
    reportSubjectLabel: 'مورد گزارش:',
    reportReasonMissing18: 'عدم ثبت تگ محتوای حساس (+۱۸)',
    reportReasonMissing18Desc: 'تصویر حاوی بخش‌های برهنه یا حساس بدن است اما تگ ۱۸+ نخورده است.',
    reportReasonBodyShaming: 'سرزنش و تمسخر بدن (Body Shaming)',
    reportReasonBodyShamingDesc: 'محتوا برخلاف فلسفه پذیرش NotPerfect، اقدام به تمسخر یا تخریب ویژگی‌های طبیعی کرده است.',
    reportReasonHarassment: 'آزار، تحقیر یا مزاحمت شخصی',
    reportReasonHarassmentDesc: 'ارسال پیام‌های توهین‌آمیز یا اصرار بر تماس‌های ناخواسته.',
    reportReasonExplicit: 'محتوای ناخواسته یا غیراخلاقی خشن',
    reportReasonExplicitDesc: 'ارسال تصاویر مغایر با هنجارهای فضای امن پذیرش تن.',
    reportReasonHateSpeech: 'نفرت‌پراکنی و توهین به قومیت/جنسیت',
    reportReasonHateSpeechDesc: 'هرگونه تبعیض یا بدزبانی علیه افراد یا گروه‌ها.',
    reportReasonOther: 'سایر موارد نقض قوانین',
    reportReasonOtherDesc: 'موارد دیگر را در کادر توضیحات بنویسید.',
    reportAdditionalDetailsLabel: 'توضیحات بیشتر (اختیاری):',
    reportAdditionalDetailsPlaceholder: 'جزئیات گزارش خود را در صورت نیاز اینجا بنویسید...',
    reportSubmitBtn: 'ارسال گزارش محرمانه',
    reportSuccessTitle: 'گزارش شما با موفقیت ثبت شد',
    reportSuccessDesc: 'گزارش شما با احترام بررسی و اقدامات لازم انجام خواهد شد. سپاس از همراهی شما 🌿',
  },
  
  en: {
    appName: 'NotPerfect',
    appSlogan: 'Embracing the Beauty of Flaws',
    navFeed: 'Feed',
    navExplore: 'Explore',
    navCreate: 'Post',
    navMessages: 'Messages',
    navProfile: 'Profile',
    navSettings: 'Settings',
    
    productMobileApp: 'NotPerfect App',
    productAdminPortal: 'Admin & Safety Portal',
    productSwitchNotice: 'Switch between platform products',
    backToApp: 'Back to App',

    reactionHug: 'Acceptance',
    reactionLove: 'Self-Love',
    reactionCourage: 'Courage',
    reactionPeace: 'Healing',
    reactionBloom: 'Natural',
    
    sensitiveContentBadge: 'Sensitive Content (+18)',
    sensitiveContentTitle: 'Image contains unretouched or private body areas',
    sensitiveContentDesc: 'This image is blurred by default. Viewing requires verified 18+ age status.',
    viewSensitiveContent: 'View Photo (+18)',
    reBlurSensitive: 'Re-blur Photo',
    bodyStory: 'Body Story:',
    commentsCount: 'kind comments',
    leaveCommentPlaceholder: 'Leave an empathetic comment...',
    sendComment: 'Send',
    moderationNotice: 'This content was removed by moderators to protect our safe space.',
    myStory: 'Your Story',
    addStory: 'Add Story',
    sharePost: 'Create New Post',
    noPostsYet: 'No posts yet.',
    
    ageVerificationTitle: 'Age Verification (18+)',
    ageVerificationSubtitle: 'Safe space for authentic body acceptance',
    ageVerificationDesc: 'To unblur sensitive photos, please verify you are 18+ via Google Account sync or a short 5-second face video.',
    googleAuthVerification: 'Instant Google Verification',
    googleAuthVerificationDesc: 'Quick check using verified Google Account birthdate',
    videoFaceVerification: 'Video Face Validation',
    videoFaceVerificationDesc: 'Turn on camera and state the dynamic verification phrase',
    startVideoRecording: 'Start 5s Video Recording',
    stopVideoRecording: 'Finish Recording',
    submitVideoVerification: 'Submit Video for Review',
    recordingInProgress: 'Recording video...',
    speakPromptInstruction: 'Please clearly speak this security phrase in your video:',
    verifiedBadge: 'Verified (18+)',
    unverifiedBadge: 'Unverified',
    pendingVerification: 'Pending Review',
    verifyAgeBtn: 'Verify Age (18+)',
    ageNoticeBannerTitle: '18+ Age Verification Required',
    ageNoticeBannerDesc: 'Verify your age to view unblurred, natural body photos.',
    ageStatusVerifiedDesc: 'Your age is verified. You have full access to natural, authentic, and unretouched body photos.',
    ageStatusUnverifiedDesc: 'Verify your age to view unblurred, intimate, and authentic body photos.',
    
    directMessagesTitle: 'Direct Messages',
    notesTrayTitle: '24h Community Notes',
    yourNote: 'Your note',
    addNotePrompt: 'Your note...',
    noteModalTitle: '24h Quick Note',
    noteInputPlaceholder: 'Share a gentle thought about your body...',
    saveNoteBtn: 'Share Note',
    noteExpiryNotice: 'This note disappears in 24h and appears at the top of your messages.',
    searchChatsPlaceholder: 'Search messages...',
    voiceMessageLabel: 'Voice Message',
    typeMessagePlaceholder: 'Type a message...',
    recordingVoice: 'Recording audio...',
    noMessagesYet: 'No messages yet.',

    profilePhotos: 'Posts',
    profileNotes: 'Notes',
    profileFollowers: 'Followers',
    profileFollowing: 'Following',
    editProfile: 'Edit Profile',
    bodyJourneyTitle: 'My Body Journey',
    tabPhotos: 'Posts',
    tabSaved: 'Saved',
    tabJourney: 'Body Journey',
    displayNameLabel: 'Display Name:',
    badgeLabel: 'Title / Badge:',
    bioLabel: 'Bio & Perspective:',
    saveChanges: 'Save Changes',

    exploreAffirmationTitle: 'Daily Body Acceptance Note',
    nextAffirmation: 'Next Note ✨',
    exploreNotesWall: 'NotPerfect Community Notes',
    allTag: 'All',
    searchExplorePlaceholder: 'Search explore, tags, people...',
    noExploreResults: 'No posts found matching your criteria 🌸',
    resetFilters: 'View all posts',

    settingsTitle: 'Settings & Options',
    accountSection: 'Account & Identity',
    ageStatus: '18+ Age Status',
    languageSection: 'Language',
    privacySection: 'Safety & Content Filter',
    themeSection: 'Appearance & Theme',
    communityGuidelines: 'Community Safety Guidelines',
    adminPortalBtn: 'Open Admin & Moderation Portal',
    resetDataBtn: 'Reset Demo Data',
    blurSensitiveToggleTitle: 'Blur sensitive photos (+18) by default',
    blurSensitiveToggleDesc: 'Raw unretouched photos will reveal upon your tap',
    safeSpaceActive: 'Safe space filter active',
    safeSpaceDesc: 'Anti-body shaming and harassment filters are active',
    manifestoText: 'At NotPerfect, your body is your living fingerprint. Every scar, every stretch mark, pigmentation shift, and natural contour holds value. We are here to embrace authentic reality without artificial filters.',

    langPersian: 'فارسی (Persian)',
    langEnglish: 'English (US)',
    langSpanish: 'Español (Spanish)',
    langArabic: 'العربية (Arabic)',
    langFrench: 'Français (French)',
    
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    success: 'Action completed successfully',
    error: 'An error occurred',
    report: 'Report',
    reportedSuccess: 'Your report was received with care and will be reviewed.',
    follow: 'Follow',
    following: 'Following',
    menu: 'Menu & Settings',

    // Cozy Sensitive Frame & Reactions
    sensitiveFrameTitle: 'An intimate, authentic frame 🌿',
    sensitiveFrameDesc: 'This image shares an intimate story of raw, natural beauty. To honor this gentle sanctuary, unlock this frame with a quick, private age check ✨',
    sensitiveFrameButton: 'Unlock with gentle age check 🕊️',
    sensitiveOverlayPill: 'Private Frame 🌿',
    reactionsHeading: 'Reactions',
    seeOriginal: 'See original',
    seeTranslation: 'See translation',
    today: 'Today',
    yesterday: 'Yesterday',

    // Auth & Account
    login: 'Log In',
    signup: 'Sign Up',
    loginTitle: 'Welcome to NotPerfect',
    signupTitle: 'Join Our Sanctuary',
    loginSubtitle: 'Where raw, unretouched beauty is celebrated without judgment',
    signupSubtitle: 'Share your body journey safely and connect with empathetic souls',
    continueWithGoogle: 'Continue with Google',
    googleAuthSuccess: 'Successfully signed in with Google ✨',
    emailOrUsername: 'Email or Username',
    email: 'Email',
    fullName: 'Full Name',
    username: 'Username',
    password: 'Password',
    bioPlaceholder: 'Your story, skin journey, or body acceptance path...',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    createAccount: 'Create New Account',
    logout: 'Log Out',
    logoutConfirm: 'Are you sure you want to log out?',
    loginSuccess: 'Welcome back! Successfully logged in 🌸',
    signupSuccess: 'Account created with love! Welcome 🌿',
    orDivider: 'or',
    guestMode: 'Continue as Guest',
    loginRequired: 'Please log in to perform this action',
    rememberMe: 'Remember me',

    // Create Post Modal Translations
    createPostTitle: 'New Post (Real Body)',
    unretouchedImageLabel: 'Unretouched Photo:',
    changeImageBtn: 'Change Photo',
    tag18Active: '18+ Tag Active',
    choosePhotoGalleryOrCamera: 'Select photo from gallery or camera',
    noFiltersNotice: 'No smoothing filters or body alteration',
    orPickPresetSample: 'Or select a real body test sample:',
    captionAndFeelingLabel: 'Caption & Your Feelings:',
    captionPlaceholder: 'Write something authentic about your photo...',
    bodyJourneyLabel: 'Body Journey:',
    bodyJourneyPlaceholder: 'Share your journey, healing, scars, or growth...',
    tagsLabel: 'Tags (Hashtags):',
    submitPostBtn: 'Share Authentic Post',
    sensitiveToggleTitle: 'Sensitive Content Tag (18+)',
    sensitiveToggleSubtitle: 'Close-ups or private body areas',
    sensitiveToggleExplanation: 'This post will be respectfully blurred with a gentle warning so users can choose when to view.',

    // Report Modal Translations
    reportModalTitle: 'Report Content Violation',
    reportTargetPost: 'Post',
    reportTargetComment: 'Comment',
    reportTargetUser: 'User',
    reportSubjectLabel: 'Report Target:',
    reportReasonMissing18: 'Missing Sensitive Tag (18+)',
    reportReasonMissing18Desc: 'Photo contains intimate or unretouched private body areas without the 18+ tag.',
    reportReasonBodyShaming: 'Body Shaming or Ridicule',
    reportReasonBodyShamingDesc: 'Content mocks natural body features, contrary to NotPerfect acceptance values.',
    reportReasonHarassment: 'Harassment or Bullying',
    reportReasonHarassmentDesc: 'Sending offensive messages or unwanted contact.',
    reportReasonExplicit: 'Unsolicited Explicit Content',
    reportReasonExplicitDesc: 'Content violating our safe space and body acceptance standards.',
    reportReasonHateSpeech: 'Hate Speech or Discrimination',
    reportReasonHateSpeechDesc: 'Any prejudice, discriminatory remarks, or insults.',
    reportReasonOther: 'Other Policy Violations',
    reportReasonOtherDesc: 'Describe any other issue in the details box.',
    reportAdditionalDetailsLabel: 'Additional Details (Optional):',
    reportAdditionalDetailsPlaceholder: 'Add any context or specifics for our review team...',
    reportSubmitBtn: 'Submit Confidential Report',
    reportSuccessTitle: 'Report Successfully Submitted',
    reportSuccessDesc: 'Thank you for keeping our community safe. Our team will review this promptly 🌿',
  },

  es: {
    appName: 'NotPerfect',
    appSlogan: 'La belleza de lo auténtico',
    navFeed: 'Inicio',
    navExplore: 'Explorar',
    navCreate: 'Publicar',
    navMessages: 'Mensajes',
    navProfile: 'Perfil',
    navSettings: 'Ajustes',
    
    productMobileApp: 'App NotPerfect',
    productAdminPortal: 'Panel de Administración',
    productSwitchNotice: 'Cambiar entre los dos productos',
    backToApp: 'Volver a la App',

    reactionHug: 'Aceptación',
    reactionLove: 'Amor propio',
    reactionCourage: 'Valentía',
    reactionPeace: 'Sanación',
    reactionBloom: 'Natural',
    
    sensitiveContentBadge: 'Contenido Sensible (+18)',
    sensitiveContentTitle: 'La imagen contiene partes del cuerpo naturales y privadas',
    sensitiveContentDesc: 'Esta imagen está difuminada por respeto. Verla requiere verificación de mayoría de edad (+18).',
    viewSensitiveContent: 'Ver Imagen (+18)',
    reBlurSensitive: 'Difuminar de nuevo',
    bodyStory: 'Historia del cuerpo:',
    commentsCount: 'comentarios cálidos',
    leaveCommentPlaceholder: 'Escribe un mensaje de apoyo y empatía...',
    sendComment: 'Enviar',
    moderationNotice: 'Este contenido ha sido retirado para proteger el espacio seguro.',
    myStory: 'Mi Historia',
    addStory: 'Añadir Historia',
    sharePost: 'Publicar foto',
    noPostsYet: 'Aún no hay publicaciones.',
    
    ageVerificationTitle: 'Verificación de Edad (+18)',
    ageVerificationSubtitle: 'Espacio seguro de aceptación corporal',
    ageVerificationDesc: 'Para desbloquear fotos sensibles, por favor confirma tu mayoría de edad mediante Google o un breve video facial.',
    googleAuthVerification: 'Verificación rápida con Google',
    googleAuthVerificationDesc: 'Validación instantánea según tu fecha de nacimiento en Google',
    videoFaceVerification: 'Validación facial por video',
    videoFaceVerificationDesc: 'Activa la cámara y lee la frase de seguridad aleatoria',
    startVideoRecording: 'Grabar video corto (5 seg)',
    stopVideoRecording: 'Terminar grabación',
    submitVideoVerification: 'Enviar video a moderación',
    recordingInProgress: 'Grabando video...',
    speakPromptInstruction: 'Por favor lee esta frase claramente en el video:',
    verifiedBadge: 'Verificado (+18)',
    unverifiedBadge: 'Sin verificar',
    pendingVerification: 'En revisión',
    verifyAgeBtn: 'Verificar edad (+18)',
    ageNoticeBannerTitle: 'Verificación de edad (+18)',
    ageNoticeBannerDesc: 'Confirma tu edad para ver fotografías corporales sin filtros.',
    ageStatusVerifiedDesc: 'Tu edad está verificada. Tienes acceso completo a fotografías naturales y sin retoques.',
    ageStatusUnverifiedDesc: 'Verifica tu edad para ver fotografías corporales íntimas y sin filtros.',
    
    directMessagesTitle: 'Mensajes Directos',
    notesTrayTitle: 'Notas de 24h',
    yourNote: 'Tu nota',
    addNotePrompt: 'Tu nota...',
    noteModalTitle: 'Nota de 24 horas',
    noteInputPlaceholder: 'Comparte un pensamiento sobre tu cuerpo...',
    saveNoteBtn: 'Guardar nota',
    noteExpiryNotice: 'Esta nota desaparecerá en 24h y tus amigos la verán en la bandeja.',
    searchChatsPlaceholder: 'Buscar conversaciones...',
    voiceMessageLabel: 'Mensaje de voz',
    typeMessagePlaceholder: 'Escribe un mensaje...',
    recordingVoice: 'Grabando audio...',
    noMessagesYet: 'No hay mensajes aún.',

    profilePhotos: 'Publicaciones',
    profileNotes: 'Notas',
    profileFollowers: 'Seguidores',
    profileFollowing: 'Siguiendo',
    editProfile: 'Editar Perfil',
    bodyJourneyTitle: 'Mi Historia Corporal',
    tabPhotos: 'Publicaciones',
    tabSaved: 'Guardados',
    tabJourney: 'Aceptación',
    displayNameLabel: 'Nombre visible:',
    badgeLabel: 'Título / Emblema:',
    bioLabel: 'Biografía:',
    saveChanges: 'Guardar cambios',

    exploreAffirmationTitle: 'Reflexión de aceptación diaria',
    nextAffirmation: 'Siguiente frase ✨',
    exploreNotesWall: 'Muro de notas de NotPerfect',
    allTag: 'Todos',
    searchExplorePlaceholder: 'Buscar en explorar, etiquetas, personas...',
    noExploreResults: 'No se encontraron publicaciones con estos criterios 🌸',
    resetFilters: 'Ver todas las publicaciones',

    settingsTitle: 'Ajustes y Opciones',
    accountSection: 'Cuenta e Identidad',
    ageStatus: 'Estado de verificación +18',
    languageSection: 'Idioma (Language)',
    privacySection: 'Seguridad y Filtros',
    themeSection: 'Apariencia y Estilo',
    communityGuidelines: 'Normas de la Comunidad',
    adminPortalBtn: 'Acceder al Panel de Administración',
    resetDataBtn: 'Restablecer datos de prueba',
    blurSensitiveToggleTitle: 'Fotos sensibles (+18) difuminadas por defecto',
    blurSensitiveToggleDesc: 'Las imágenes se mostrarán cuando toques sobre ellas',
    safeSpaceActive: 'Espacio seguro activo',
    safeSpaceDesc: 'Filtros contra el acoso y burla corporal activos',
    manifestoText: 'En NotPerfect, tu cuerpo es tu huella vital. Cada cicatriz, estría y curva cuenta una historia que merece respeto.',

    langPersian: 'فارسی (Persa)',
    langEnglish: 'English (Inglés)',
    langSpanish: 'Español',
    langArabic: 'العربية (Árabe)',
    langFrench: 'Français (Francés)',
    
    back: 'Volver',
    save: 'Guardar',
    cancel: 'Cancelar',
    success: 'Operación completada con éxito',
    error: 'Ocurrió un error',
    report: 'Denunciar',
    reportedSuccess: 'Tu reporte fue recibido con cuidado y será revisado.',
    follow: 'Seguir',
    following: 'Siguiendo',
    menu: 'Menú y Ajustes',

    // Cozy Sensitive Frame & Reactions
    sensitiveFrameTitle: 'Un espacio íntimo y real 🌿',
    sensitiveFrameDesc: 'Esta imagen comparte una historia profunda de belleza natural. Para cuidar este espacio seguro, desbloquéala con una verificación rápida ✨',
    sensitiveFrameButton: 'Desbloquear con verificación 🕊️',
    sensitiveOverlayPill: 'Marco íntimo 🌿',
    reactionsHeading: 'Reacciones',
    seeOriginal: 'Ver original',
    seeTranslation: 'Ver traducción',
    today: 'Hoy',
    yesterday: 'Ayer',

    // Auth & Account
    login: 'Iniciar sesión',
    signup: 'Registrarse',
    loginTitle: 'Bienvenido a NotPerfect',
    signupTitle: 'Únete a nuestro santuario',
    loginSubtitle: 'Donde la belleza auténtica se celebra sin filtros ni juicios',
    signupSubtitle: 'Comparte la historia de tu cuerpo y conecta con personas comprensivas',
    continueWithGoogle: 'Continuar con Google',
    googleAuthSuccess: 'Sesión iniciada con Google con éxito ✨',
    emailOrUsername: 'Correo o Usuario',
    email: 'Correo electrónico',
    fullName: 'Nombre completo',
    username: 'Nombre de usuario',
    password: 'Contraseña',
    bioPlaceholder: 'Tu historia de autoaceptación y cicatrices...',
    dontHaveAccount: '¿No tienes cuenta?',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    createAccount: 'Crear cuenta nueva',
    logout: 'Cerrar sesión',
    logoutConfirm: '¿Seguro que deseas cerrar sesión?',
    loginSuccess: '¡Bienvenido de nuevo! 🌸',
    signupSuccess: '¡Cuenta creada con éxito! Bienvenido 🌿',
    orDivider: 'o',
    guestMode: 'Continuar como invitado',
    loginRequired: 'Inicia sesión para realizar esta acción',
    rememberMe: 'Recordarme',

    // Create Post Modal Translations
    createPostTitle: 'Nueva publicación (Cuerpo real)',
    unretouchedImageLabel: 'Foto sin retoques:',
    changeImageBtn: 'Cambiar imagen',
    tag18Active: 'Etiqueta +18 activa',
    choosePhotoGalleryOrCamera: 'Elegir foto de galería o cámara',
    noFiltersNotice: 'Sin filtros de suavizado ni distorsión corporal',
    orPickPresetSample: 'O elige una muestra de cuerpo real:',
    captionAndFeelingLabel: 'Pie de foto y sensaciones:',
    captionPlaceholder: 'Escribe algo sincero sobre tu foto...',
    bodyJourneyLabel: 'Historia corporal (Body Journey):',
    bodyJourneyPlaceholder: 'Comparte tu viaje, cicatrices o cambios...',
    tagsLabel: 'Etiquetas (Hashtags):',
    submitPostBtn: 'Compartir publicación sincera',
    sensitiveToggleTitle: 'Etiqueta de contenido sensible (+18)',
    sensitiveToggleSubtitle: 'Primeros planos o áreas íntimas del cuerpo',
    sensitiveToggleExplanation: 'Esta publicación se mostrará desenfocada con un aviso respetuoso.',

    // Report Modal Translations
    reportModalTitle: 'Reportar infracción de contenido',
    reportTargetPost: 'Publicación',
    reportTargetComment: 'Comentario',
    reportTargetUser: 'Usuario',
    reportSubjectLabel: 'Elemento a reportar:',
    reportReasonMissing18: 'Falta etiqueta sensible (+18)',
    reportReasonMissing18Desc: 'La foto contiene áreas corporales íntimas sin la etiqueta requerida.',
    reportReasonBodyShaming: 'Vergüenza corporal (Body Shaming)',
    reportReasonBodyShamingDesc: 'Contenido que se burla de rasgos corporales naturales.',
    reportReasonHarassment: 'Acoso o intimidación',
    reportReasonHarassmentDesc: 'Mensajes ofensivos o contacto no deseado.',
    reportReasonExplicit: 'Contenido explícito no solicitado',
    reportReasonExplicitDesc: 'Imágenes que atentan contra las normas de nuestro espacio seguro.',
    reportReasonHateSpeech: 'Discurso de odio',
    reportReasonHateSpeechDesc: 'Discriminación o insultos por etnia, género u orientación.',
    reportReasonOther: 'Otras infracciones',
    reportReasonOtherDesc: 'Describe el caso en el campo de texto.',
    reportAdditionalDetailsLabel: 'Detalles adicionales (opcional):',
    reportAdditionalDetailsPlaceholder: 'Añade información relevante para nuestro equipo...',
    reportSubmitBtn: 'Enviar reporte confidencial',
    reportSuccessTitle: 'Reporte enviado con éxito',
    reportSuccessDesc: 'Gracias por cuidar nuestro espacio seguro. Lo revisaremos pronto 🌿',
  },

  ar: {
    appName: 'NotPerfect',
    appSlogan: 'احتضان جمال الاختلاف والعيوب الطبيعية',
    navFeed: 'الرئيسية',
    navExplore: 'استكشاف',
    navCreate: 'نشر',
    navMessages: 'الرسائل',
    navProfile: 'الملف الشخصي',
    navSettings: 'الإعدادات',
    
    productMobileApp: 'تطبيق NotPerfect',
    productAdminPortal: 'لوحة المشرفين والإدارة',
    productSwitchNotice: 'التبديل بين منصتي النظام',
    backToApp: 'العودة إلى التطبيق',

    reactionHug: 'قبول',
    reactionLove: 'حب الذات',
    reactionCourage: 'شجاعة',
    reactionPeace: 'سلام',
    reactionBloom: 'طبيعي',
    
    sensitiveContentBadge: 'محتوى حساس (+۱۸)',
    sensitiveContentTitle: 'الصورة تحتوي على تفاصيل جسدية خاصة وطبيعية',
    sensitiveContentDesc: 'تم تعتيم هذه الصورة احتراماً لرغبتك. للمشاهدة، يلزم تأكيد السن فوق ۱۸ عاماً.',
    viewSensitiveContent: 'مشاهدة الصورة (+۱۸)',
    reBlurSensitive: 'إعادة التعتيم',
    bodyStory: 'قصة هذا الجسد:',
    commentsCount: 'تعليقات لطيفة',
    leaveCommentPlaceholder: 'اكتب كلمة طيبة ومليئة بالدعم...',
    sendComment: 'إرسال',
    moderationNotice: 'تمت إزالة هذا المحتوى من قبل المشرفين للحفاظ على أمان المنصة.',
    myStory: 'قصتي',
    addStory: 'إضافة قصة',
    sharePost: 'نشر صورة جديدة',
    noPostsYet: 'لا توجد منشورات بعد.',
    
    ageVerificationTitle: 'إثبات السن (+۱۸ عاماً)',
    ageVerificationSubtitle: 'مساحة آمنة لقبول الجسد كما هو',
    ageVerificationDesc: 'لعرض الصور الحساسة، يرجى تأكيد السن عبر حساب Google أو عبر تصوير فيديو قصير للوجه لمدة ۵ ثوانٍ.',
    googleAuthVerification: 'تأكيد فوري عبر حساب Google',
    googleAuthVerificationDesc: 'تأكيد مباشر وفق تاريخ الميلاد المسجل رسمياً في حساب Google',
    videoFaceVerification: 'التحقق المرئي عبر الفيديو',
    videoFaceVerificationDesc: 'تشغيل الكاميرا ونطق الجملة الأمنية المحددة للتحقق',
    startVideoRecording: 'بدء تصوير الفيديو (۵ ثوانٍ)',
    stopVideoRecording: 'إنهاء التسجيل',
    submitVideoVerification: 'إرسال الفيديو للمراجعة',
    recordingInProgress: 'جاري تسجيل الفيديو...',
    speakPromptInstruction: 'يرجى نطق هذه العبارة بوضوح في الفيديو:',
    verifiedBadge: 'تم التحقق (+۱۸)',
    unverifiedBadge: 'غير مؤكد',
    pendingVerification: 'قيد المراجعة',
    verifyAgeBtn: 'تأكيد السن (+۱۸)',
    ageNoticeBannerTitle: 'تأكيد بلوغ ۱۸ عاماً',
    ageNoticeBannerDesc: 'أكد سنك لمشاهدة الصور الواقعية بدون تعتيم.',
    ageStatusVerifiedDesc: 'تم تأكيد سنك بنجاح ولديك وصول كامل إلى الصور الطبيعية غير المعدلة.',
    ageStatusUnverifiedDesc: 'يرجى تأكيد بلوغ ۱۸ عاماً لمشاهدة الصور الواقعية بدون تعتيم.',
    
    directMessagesTitle: 'الرسائل والمحادثات الآمنة',
    notesTrayTitle: 'ملاحظات ۲۴ ساعة',
    yourNote: 'ملاحظتك',
    addNotePrompt: 'ملاحظتك...',
    noteModalTitle: 'ملاحظة سريعة لمدة ۲۴ ساعة',
    noteInputPlaceholder: 'شارك فكرة لطيفة عن جسدك...',
    saveNoteBtn: 'حفظ الملاحظة',
    noteExpiryNotice: 'تختفي هذه الملاحظة تلقائياً بعد ۲۴ ساعة وتظهر لأصدقائك في أعلى الرسائل.',
    searchChatsPlaceholder: 'البحث في المحادثات...',
    voiceMessageLabel: 'رسالة صوتية',
    typeMessagePlaceholder: 'اكتب رسالة...',
    recordingVoice: 'جاري التسجيل الصوتي...',
    noMessagesYet: 'لا توجد رسائل بعد.',

    profilePhotos: 'المنشورات',
    profileNotes: 'الملاحظات',
    profileFollowers: 'المتابعون',
    profileFollowing: 'يتابع',
    editProfile: 'تعديل الملف الشخصي',
    bodyJourneyTitle: 'رحلة جسدي (Body Journey)',
    tabPhotos: 'المنشورات',
    tabSaved: 'المحفوظات',
    tabJourney: 'رحلة القبول',
    displayNameLabel: 'الاسم الظاهر:',
    badgeLabel: 'اللقب / الشارة:',
    bioLabel: 'السيرة الذاتية:',
    saveChanges: 'حفظ التعديلات',

    exploreAffirmationTitle: 'همسة اليوم لتقبل الجسد',
    nextAffirmation: 'العبارة التالية ✨',
    exploreNotesWall: 'ملاحظات مجتمع NotPerfect',
    allTag: 'الكل',
    searchExplorePlaceholder: 'البحث في الاستكشاف، الوسوم، الأشخاص...',
    noExploreResults: 'لم يتم العثور على منشورات مطابقة 🌸',
    resetFilters: 'عرض كل المنشورات',

    settingsTitle: 'الإعدادات والخيارات',
    accountSection: 'الحساب والتحقق',
    ageStatus: 'حالة إثبات السن (+۱۸)',
    languageSection: 'اللغة (Language)',
    privacySection: 'الأمان وفلاتر المحتوى',
    themeSection: 'المظهر والنمط',
    communityGuidelines: 'ميثاق الأمان والاحترام',
    adminPortalBtn: 'الدخول إلى لوحة الإدارة والمشرفين',
    resetDataBtn: 'استعادة البيانات التجريبية',
    blurSensitiveToggleTitle: 'تعتيم الصور الحساسة (+۱۸) افتراضياً',
    blurSensitiveToggleDesc: 'يتم إظهار الصور الطبيعية عند النقر عليها فقط',
    safeSpaceActive: 'المساحة الآمنة مفعلة',
    safeSpaceDesc: 'فلاتر منع التنمر على الأجساد مفعلة تلقائياً',
    manifestoText: 'في NotPerfect، جسدك هو بصمة حياتك الفريدة. كل ندبة وتغيير طبيعي يحمل حكاية تستحق التقدير والسلام.',

    langPersian: 'فارسی (الفارسية)',
    langEnglish: 'English (الإنجليزية)',
    langSpanish: 'Español (الإسبانية)',
    langArabic: 'العربية',
    langFrench: 'Français (الفرنسية)',
    
    back: 'رجوع',
    save: 'حفظ',
    cancel: 'إلغاء',
    success: 'تمت العملية بنجاح',
    error: 'حدث خطأ ما',
    report: 'إبلاغ',
    reportedSuccess: 'تم استلام بلاغك بعناية للمحافظة على أمان المنصة.',
    follow: 'متابعة',
    following: 'تتابعه',
    menu: 'القائمة والإعدادات',

    // Cozy Sensitive Frame & Reactions
    sensitiveFrameTitle: 'مَشهد حميم وطبيعي 🌿',
    sensitiveFrameDesc: 'تحمل هذه الصورة قصة دافئة وعميقة لتقبّل الجسد الحقيقي. للحفاظ على أمان هذا الفضاء، يمكنك كشف هذا المشهد بتأكيد سريع ومحترم للسن ✨',
    sensitiveFrameButton: 'فتح بعد تأكيد السن 🕊️',
    sensitiveOverlayPill: 'إطار خاص 🌿',
    reactionsHeading: 'تفاعلات',
    seeOriginal: 'عرض النص الأصلي',
    seeTranslation: 'عرض الترجمة',
    today: 'اليوم',
    yesterday: 'أمس',

    // Auth & Account
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',
    loginTitle: 'مرحباً بك في NotPerfect',
    signupTitle: 'انضم إلى مجتمعنا الآمن',
    loginSubtitle: 'حيث يُحتفى بالجمال الطبيعي الحقيقي دون فلاتر أو أحكام',
    signupSubtitle: 'شارك قصة جسدك بأمان وتواصل مع أشخاص داعمين',
    continueWithGoogle: 'المتابعة باستخدام Google',
    googleAuthSuccess: 'تم تسجيل الدخول بنجاح عبر Google ✨',
    emailOrUsername: 'البريد أو اسم المستخدم',
    email: 'البريد الإلكتروني',
    fullName: 'الاسم الكامل',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    bioPlaceholder: 'قصتك مع تقبل الجسد والندوب والخطوط الطبيعية...',
    dontHaveAccount: 'ليس لديك حساب؟',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    createAccount: 'إنشاء حساب جديد',
    logout: 'تسجيل الخروج',
    logoutConfirm: 'هل أنت متأكد من رغبتك في تسجيل الخروج؟',
    loginSuccess: 'أهلاً بعودتك! تم تسجيل الدخول بنجاح 🌸',
    signupSuccess: 'تم إنشاء حسابك بمحبة! أهلاً بك 🌿',
    orDivider: 'أو',
    guestMode: 'المتابعة كزائر',
    loginRequired: 'يرجى تسجيل الدخول للقيام بهذا الإجراء',
    rememberMe: 'تذكرني',

    // Create Post Modal Translations
    createPostTitle: 'منشور جديد (الجسد الطبيعي)',
    unretouchedImageLabel: 'صورة بلا تعديل أو فلاتر:',
    changeImageBtn: 'تغيير الصورة',
    tag18Active: 'وسم +18 مفعّل',
    choosePhotoGalleryOrCamera: 'اختيار صورة من المعرض أو الكاميرا',
    noFiltersNotice: 'دون فلاتر تجميل أو تنحيف صناعي',
    orPickPresetSample: 'أو اختر عينة تجريبية للجسد الواقعي:',
    captionAndFeelingLabel: 'الوصف ومشاعرك:',
    captionPlaceholder: 'اكتب شيئاً صادقاً يعبر عن صورتك وطبيعتك...',
    bodyJourneyLabel: 'رحلة الجسد (Body Journey):',
    bodyJourneyPlaceholder: 'شارك مسيرتك وتغيرات جسدك والندوب بكل حب...',
    tagsLabel: 'الوسوم (الهاشتاغات):',
    submitPostBtn: 'مشاركة المنشور بكل ثقة',
    sensitiveToggleTitle: 'وسم المحتوى الحساس (+18)',
    sensitiveToggleSubtitle: 'لقطات قريبة أو أجزاء حساسة من الجسد',
    sensitiveToggleExplanation: 'سيتم عرض هذا المنشور بشكل مموه مع تحذير محترم ليقرر المستخدم فتحه برغبته.',

    // Report Modal Translations
    reportModalTitle: 'الإبلاغ عن مخالفة محتوى',
    reportTargetPost: 'منشور',
    reportTargetComment: 'تعليق',
    reportTargetUser: 'مستخدم',
    reportSubjectLabel: 'موضوع البلاغ:',
    reportReasonMissing18: 'عدم وضع وسم محتوى حساس (+18)',
    reportReasonMissing18Desc: 'تحتوي الصورة على أجزاء جسدية حميمة دون وضع وسم +18 المناسب.',
    reportReasonBodyShaming: 'التنمر والسخرية من الجسد (Body Shaming)',
    reportReasonBodyShamingDesc: 'محتوى يسخر من الملامح الطبيعية خلافاً لمبادئ NotPerfect.',
    reportReasonHarassment: 'المضايقة أو الإساءة الشخصية',
    reportReasonHarassmentDesc: 'إرسال رسائل مسيئة أو تكرار تواصل غير مرغوب فيه.',
    reportReasonExplicit: 'محتوى غير لائق أو خادش',
    reportReasonExplicitDesc: 'صور لا تتماشى مع معايير المساحة الآمنة لتقبل الجسد.',
    reportReasonHateSpeech: 'خطاب كراهية أو تمييز',
    reportReasonHateSpeechDesc: 'أي عبارات تمييزية أو مسيئة ضد أشخاص أو فئات.',
    reportReasonOther: 'مخالفات أخرى للسياسة',
    reportReasonOtherDesc: 'يرجى توضيح التفاصيل في الحقل أدناه.',
    reportAdditionalDetailsLabel: 'تفاصيل إضافية (اختياري):',
    reportAdditionalDetailsPlaceholder: 'أضف أي معلومات لمساعدة فريق المراجعة...',
    reportSubmitBtn: 'إرسال البلاغ السري',
    reportSuccessTitle: 'تم تسجيل البلاغ بنجاح',
    reportSuccessDesc: 'شكراً لمساهمتك في حماية مساحتنا الآمنة. سيتم التدقيق فوراً 🌿',
  },

  fr: {
    appName: 'NotPerfect',
    appSlogan: "Célébrer la beauté de l'authenticité",
    navFeed: 'Fil',
    navExplore: 'Explorer',
    navCreate: 'Publier',
    navMessages: 'Messages',
    navProfile: 'Profil',
    navSettings: 'Paramètres',
    
    productMobileApp: 'Application NotPerfect',
    productAdminPortal: "Portail d'Administration",
    productSwitchNotice: 'Basculer entre les deux produits',
    backToApp: "Retour à l'App",

    reactionHug: 'Acceptation',
    reactionLove: 'Amour de soi',
    reactionCourage: 'Courage',
    reactionPeace: 'Sérénité',
    reactionBloom: 'Naturel',
    
    sensitiveContentBadge: 'Contenu Sensible (+18)',
    sensitiveContentTitle: 'Cette image montre des zones corporelles intimes et naturelles',
    sensitiveContentDesc: 'Cette photo est floutée par respect. La visualisation nécessite une vérification d’âge (+18 ans).',
    viewSensitiveContent: 'Voir la photo (+18)',
    reBlurSensitive: 'Flouter à nouveau',
    bodyStory: 'Histoire du corps :',
    commentsCount: 'commentaires bienveillants',
    leaveCommentPlaceholder: 'Écrivez un message doux et encourageant...',
    sendComment: 'Envoyer',
    moderationNotice: 'Ce contenu a été retiré par les modérateurs afin de préserver cet espace bienveillant.',
    myStory: 'Votre story',
    addStory: 'Ajouter une story',
    sharePost: 'Nouvelle publication',
    noPostsYet: 'Aucune publication pour le moment.',
    
    ageVerificationTitle: 'Vérification de la majorité (+18 ans)',
    ageVerificationSubtitle: 'Un espace sûr pour accepter son corps au naturel',
    ageVerificationDesc: 'Pour voir les photos sensibles, veuillez confirmer votre âge via Google ou une courte vidéo de 5 secondes.',
    googleAuthVerification: 'Vérification instantanée avec Google',
    googleAuthVerificationDesc: 'Vérification automatique via la date de naissance de votre compte Google',
    videoFaceVerification: 'Validation vidéo du visage',
    videoFaceVerificationDesc: 'Allumez votre caméra et récitez la phrase de sécurité demandée',
    startVideoRecording: 'Enregistrer une vidéo (5 sec)',
    stopVideoRecording: 'Arrêter l’enregistrement',
    submitVideoVerification: 'Envoyer la vidéo pour validation',
    recordingInProgress: 'Enregistrement en cours...',
    speakPromptInstruction: 'Veuillez énoncer clairement cette phrase dans votre vidéo :',
    verifiedBadge: 'Vérifié (+18)',
    unverifiedBadge: 'Non vérifié',
    pendingVerification: 'En attente de validation',
    verifyAgeBtn: 'Confirmer l’âge (+18)',
    ageNoticeBannerTitle: 'Confirmation de la majorité (+18)',
    ageNoticeBannerDesc: 'Confirmez votre âge pour afficher les photos corporelles sans filtre.',
    ageStatusVerifiedDesc: 'Votre âge est vérifié. Vous avez un accès complet aux photos naturelles et authentiques.',
    ageStatusUnverifiedDesc: 'Confirmez votre âge pour afficher les photos intimes et corporelles sans filtre.',
    
    directMessagesTitle: 'Messages Privés',
    notesTrayTitle: 'Notes éphémères (24h)',
    yourNote: 'Votre note',
    addNotePrompt: 'Votre note...',
    noteModalTitle: 'Note éphémère de 24h',
    noteInputPlaceholder: 'Partagez une pensée bienveillante sur votre corps...',
    saveNoteBtn: 'Enregistrer la note',
    noteExpiryNotice: 'Cette note disparaît après 24h et s’affiche en haut des messages de vos amis.',
    searchChatsPlaceholder: 'Rechercher une conversation...',
    voiceMessageLabel: 'Message vocal',
    typeMessagePlaceholder: 'Écrivez un message...',
    recordingVoice: 'Enregistrement audio en cours...',
    noMessagesYet: 'Aucun message pour l’instant.',

    profilePhotos: 'Publications',
    profileNotes: 'Notes',
    profileFollowers: 'Abonnés',
    profileFollowing: 'Abonnements',
    editProfile: 'Modifier le profil',
    bodyJourneyTitle: 'Mon voyage corporel',
    tabPhotos: 'Publications',
    tabSaved: 'Enregistrés',
    tabJourney: 'Acceptation',
    displayNameLabel: 'Nom affiché :',
    badgeLabel: 'Titre / Badge :',
    bioLabel: 'Biographie :',
    saveChanges: 'Enregistrer les modifications',

    exploreAffirmationTitle: 'Pensée du jour sur le corps',
    nextAffirmation: 'Phrase suivante ✨',
    exploreNotesWall: 'Mur des notes de NotPerfect',
    allTag: 'Tous',
    searchExplorePlaceholder: 'Rechercher dans explorer, tags, personnes...',
    noExploreResults: 'Aucune publication trouvée avec ces critères 🌸',
    resetFilters: 'Voir toutes les publications',

    settingsTitle: 'Options & Paramètres',
    accountSection: 'Compte & Identité',
    ageStatus: 'Statut de vérification d’âge (+18)',
    languageSection: 'Langue (Language)',
    privacySection: 'Sécurité et modération',
    themeSection: 'Apparence & Style',
    communityGuidelines: 'Règles de la communauté',
    adminPortalBtn: "Ouvrir le portail d'administration",
    resetDataBtn: 'Réinitialiser les données de test',
    blurSensitiveToggleTitle: 'Flouter les photos sensibles (+18) par défaut',
    blurSensitiveToggleDesc: 'Les photos sans filtre se révèlent sur simple clic',
    safeSpaceActive: 'Espace sécurisé actif',
    safeSpaceDesc: 'Filtres de protection contre la grossophobie et le harcèlement actifs',
    manifestoText: 'Chez NotPerfect, votre corps est l’empreinte de votre parcours. Chaque cicatrice, vergeture et courbe a sa valeur et son histoire.',

    langPersian: 'فارسی (Persan)',
    langEnglish: 'English (Anglais)',
    langSpanish: 'Español (Espagnol)',
    langArabic: 'العربية (Arabe)',
    langFrench: 'Français',
    
    back: 'Retour',
    save: 'Enregistrer',
    cancel: 'Annuler',
    success: 'Opération réussie',
    error: 'Une erreur est survenue',
    report: 'Signaler',
    reportedSuccess: 'Votre signalement a été transmis avec bienveillance.',
    follow: 'Suivre',
    following: 'Abonné',
    menu: 'Menu et Paramètres',

    // Cozy Sensitive Frame & Reactions
    sensitiveFrameTitle: 'Un regard intime et sans filtre 🌿',
    sensitiveFrameDesc: 'Ce cliché partage une célébration sincère du corps naturel. Pour préserver cet espace bienveillant, révélez cette image avec une vérification rapide ✨',
    sensitiveFrameButton: 'Révéler avec vérification 🕊️',
    sensitiveOverlayPill: 'Cadre intime 🌿',
    reactionsHeading: 'Réactions',
    seeOriginal: "Voir l'original",
    seeTranslation: 'Voir la traduction',
    today: "Aujourd'hui",
    yesterday: 'Hier',

    // Auth & Account
    login: 'Connexion',
    signup: "S'inscrire",
    loginTitle: 'Bienvenue sur NotPerfect',
    signupTitle: 'Rejoignez notre sanctuaire',
    loginSubtitle: 'Où la beauté réelle et sans filtre est célébrée avec douceur',
    signupSubtitle: 'Partagez le voyage de votre corps et connectez-vous avec des âmes bienveillantes',
    continueWithGoogle: 'Continuer avec Google',
    googleAuthSuccess: 'Connexion via Google réussie ✨',
    emailOrUsername: "E-mail ou nom d'utilisateur",
    email: 'E-mail',
    fullName: 'Nom complet',
    username: "Nom d'utilisateur",
    password: 'Mot de passe',
    bioPlaceholder: "Votre histoire d'acceptation de soi et de votre peau...",
    dontHaveAccount: "Vous n'avez pas de compte ?",
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    createAccount: 'Créer un compte',
    logout: 'Se déconnecter',
    logoutConfirm: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    loginSuccess: 'Ravi de vous revoir ! Connexion réussie 🌸',
    signupSuccess: 'Compte créé avec amour ! Bienvenue 🌿',
    orDivider: 'ou',
    guestMode: 'Continuer en tant qu’invité',
    loginRequired: 'Veuillez vous connecter pour effectuer cette action',
    rememberMe: 'Se souvenir de moi',

    // Create Post Modal Translations
    createPostTitle: 'Nouvelle publication (Corps réel)',
    unretouchedImageLabel: 'Photo sans retouche :',
    changeImageBtn: 'Changer l’image',
    tag18Active: 'Tag +18 activé',
    choosePhotoGalleryOrCamera: 'Choisir une photo de la galerie ou de l’appareil',
    noFiltersNotice: 'Sans filtres lissants ni retouche corporelle',
    orPickPresetSample: 'Ou choisissez un échantillon de corps authentique :',
    captionAndFeelingLabel: 'Légende et ressenti :',
    captionPlaceholder: 'Écrivez un mot sincère sur cette photo...',
    bodyJourneyLabel: 'Voyage corporel (Body Journey) :',
    bodyJourneyPlaceholder: 'Racontez votre parcours, cicatrices et changements...',
    tagsLabel: 'Mots-clés (Hashtags) :',
    submitPostBtn: 'Partager la publication bienveillante',
    sensitiveToggleTitle: 'Tag contenu sensible (+18)',
    sensitiveToggleSubtitle: 'Gros plans ou zones intimes du corps',
    sensitiveToggleExplanation: 'Cette publication sera floutée avec un avertissement respectueux pour laisser le choix à chacun.',

    // Report Modal Translations
    reportModalTitle: 'Signaler un contenu',
    reportTargetPost: 'Publication',
    reportTargetComment: 'Commentaire',
    reportTargetUser: 'Utilisateur',
    reportSubjectLabel: 'Objet du signalement :',
    reportReasonMissing18: 'Tag sensible (+18) manquant',
    reportReasonMissing18Desc: 'La photo montre des zones intimes du corps sans le tag +18 requis.',
    reportReasonBodyShaming: 'Dénigrement corporel (Body Shaming)',
    reportReasonBodyShamingDesc: 'Contenu se moquant des traits naturels, contraire aux valeurs de NotPerfect.',
    reportReasonHarassment: 'Harcèlement ou propos blessants',
    reportReasonHarassmentDesc: 'Messages offensants ou contact non consenti.',
    reportReasonExplicit: 'Contenu explicite non sollicité',
    reportReasonExplicitDesc: 'Images contraires à l’éthique de notre communauté bienveillante.',
    reportReasonHateSpeech: 'Discours haineux ou discriminatoire',
    reportReasonHateSpeechDesc: 'Toute discrimination ou insulte envers un groupe ou une personne.',
    reportReasonOther: 'Autre violation des règles',
    reportReasonOtherDesc: 'Décrivez le problème dans le champ de texte ci-dessous.',
    reportAdditionalDetailsLabel: 'Détails complémentaires (facultatif) :',
    reportAdditionalDetailsPlaceholder: 'Ajoutez des précisions pour notre équipe de modération...',
    reportSubmitBtn: 'Envoyer le signalement confidentiel',
    reportSuccessTitle: 'Signalement envoyé avec succès',
    reportSuccessDesc: 'Merci de préserver la sécurité de notre communauté. Nous allons l’examiner rapidement 🌿',
  },
};

export const isRTL = (lang?: string): boolean => {
  return lang === 'fa' || lang === 'ar';
};

/**
 * Translates relative timestamps (e.g., "۱ ساعت پیش", "دیروز") into the active language.
 */
export const formatRelativeTime = (timeStr: string | undefined, lang: AppLanguage): string => {
  if (!timeStr) return '';
  const trimmed = timeStr.trim();

  const timeMap: Record<string, Record<AppLanguage, string>> = {
    'همین الان': { fa: 'همین الان', en: 'Just now', es: 'Ahora mismo', ar: 'الآن', fr: 'À l’instant' },
    'هم‌اکنون': { fa: 'همین الان', en: 'Just now', es: 'Ahora mismo', ar: 'الآن', fr: 'À l’instant' },
    'لحظاتی پیش': { fa: 'لحظاتی پیش', en: 'A moment ago', es: 'Hace un momento', ar: 'منذ لحظات', fr: 'Il y a un instant' },
    '۱ ساعت پیش': { fa: '۱ ساعت پیش', en: '1 hour ago', es: 'Hace 1 hora', ar: 'منذ ساعة', fr: 'Il y a 1 heure' },
    '۲ ساعت پیش': { fa: '۲ ساعت پیش', en: '2 hours ago', es: 'Hace 2 horas', ar: 'منذ ساعتين', fr: 'Il y a 2 heures' },
    '۳ ساعت پیش': { fa: '۳ ساعت پیش', en: '3 hours ago', es: 'Hace 3 horas', ar: 'منذ ۳ ساعات', fr: 'Il y a 3 heures' },
    '۴ ساعت پیش': { fa: '۴ ساعت پیش', en: '4 hours ago', es: 'Hace 4 horas', ar: 'منذ ۴ ساعات', fr: 'Il y a 4 heures' },
    '۵ ساعت پیش': { fa: '۵ ساعت پیش', en: '5 hours ago', es: 'Hace 5 horas', ar: 'منذ ۵ ساعات', fr: 'Il y a 5 heures' },
    '۶ ساعت پیش': { fa: '۶ ساعت پیش', en: '6 hours ago', es: 'Hace 6 horas', ar: 'منذ ۶ ساعات', fr: 'Il y a 6 heures' },
    '۱۸ ساعت پیش': { fa: '۱۸ ساعت پیش', en: '18 hours ago', es: 'Hace 18 horas', ar: 'منذ ۱۸ ساعة', fr: 'Il y a 18 heures' },
    'دیروز': { fa: 'دیروز', en: 'Yesterday', es: 'Ayer', ar: 'أمس', fr: 'Hier' },
    '۲ روز پیش': { fa: '۲ روز پیش', en: '2 days ago', es: 'Hace 2 días', ar: 'منذ يومين', fr: 'Il y a 2 jours' },
    '۳ روز پیش': { fa: '۳ روز پیش', en: '3 days ago', es: 'Hace 3 días', ar: 'منذ ۳ أيام', fr: 'Il y a 3 jours' },
  };

  if (timeMap[trimmed]) {
    return timeMap[trimmed][lang] || timeMap[trimmed].en || trimmed;
  }

  // Fallback for hour regex patterns
  const match = trimmed.match(/^(\d+|[\u06F0-\u06F9]+)\s*ساعت\s*پیش$/);
  if (match) {
    const num = match[1];
    if (lang === 'en') return `${num} hours ago`;
    if (lang === 'es') return `Hace ${num} horas`;
    if (lang === 'ar') return `منذ ${num} ساعات`;
    if (lang === 'fr') return `Il y a ${num} heures`;
    return trimmed;
  }

  return trimmed;
};

/**
 * Translates reaction labels based on active language.
 */
export const getReactionLabel = (type: string, lang: AppLanguage): string => {
  const map: Record<string, Record<AppLanguage, string>> = {
    hug: { fa: 'پذیرش و آغوش', en: 'Embrace', es: 'Abrazo', ar: 'عِناق وقبول', fr: 'Étreinte' },
    love: { fa: 'عشق به خود', en: 'Self-Love', es: 'Amor Propio', ar: 'حب الذات', fr: 'Amour de soi' },
    courage: { fa: 'شجاعت تن', en: 'Body Courage', es: 'Coraje', ar: 'شجاعة الجسد', fr: 'Courage' },
    peace: { fa: 'التیام و صلح', en: 'Healing & Peace', es: 'Paz', ar: 'سلام وتشافي', fr: 'Paix & Guérison' },
    bloom: { fa: 'زیبایی طبیعی', en: 'Natural Bloom', es: 'Florecer', ar: 'ازدهار طبيعي', fr: 'Épanouissement' },
  };

  return map[type]?.[lang] || map[type]?.en || type;
};

/**
 * Translates known user badges / roles (like "سفیر پذیرش بدن") across all 5 languages.
 */
export const translateUserBadge = (badge: string | undefined, lang: AppLanguage): string => {
  if (!badge) return '';

  const badgeMap: Record<string, Record<AppLanguage, string>> = {
    'سفیر پذیرش بدن 🌿': {
      fa: 'سفیر پذیرش بدن 🌿',
      en: 'Body Acceptance Ambassador 🌿',
      es: 'Embajador de Aceptación Corporal 🌿',
      ar: 'سفير قبول الجسد 🌿',
      fr: 'Ambassadeur de l’Acceptation Corporelle 🌿',
    },
    'سفیر پذیرش بدن': {
      fa: 'سفیر پذیرش بدن 🌿',
      en: 'Body Acceptance Ambassador 🌿',
      es: 'Embajador de Aceptación Corporal 🌿',
      ar: 'سفير قبول الجسد 🌿',
      fr: 'Ambassadeur de l’Acceptation Corporelle 🌿',
    },
    'روایتگر زخم‌های زنده 🌱': {
      fa: 'روایتگر زخم‌های زنده 🌱',
      en: 'Storyteller of Living Scars 🌱',
      es: 'Narrador de Cicatrices Vivas 🌱',
      ar: 'راوي الندبات الحية 🌱',
      fr: 'Conteur de Cicatrices Vivantes 🌱',
    },
    'راوی رهایی از کمال‌گرایی 🌸': {
      fa: 'راوی رهایی از کمال‌گرایی 🌸',
      en: 'Freedom from Perfection Storyteller 🌸',
      es: 'Narrador de Liberación del Perfeccionismo 🌸',
      ar: 'راوي التحرر من المثالية 🌸',
      fr: 'Conteur de Libération du Perfectionnisme 🌸',
    },
    'راوی رهایی از کمال‌گرایی ✨': {
      fa: 'راوی رهایی از کمال‌گرایی ✨',
      en: 'Freedom from Perfection Storyteller ✨',
      es: 'Narrador de Liberación del Perfeccionismo ✨',
      ar: 'راوي التحرر من المثالية ✨',
      fr: 'Conteur de Libération du Perfectionnisme ✨',
    },
    'راوی رهایی از کمال‌گرایی': {
      fa: 'راوی رهایی از کمال‌گرایی ✨',
      en: 'Freedom from Perfection Storyteller ✨',
      es: 'Narrador de Liberación del Perfeccionismo ✨',
      ar: 'راوي التحرر من المثالية ✨',
      fr: 'Conteur de Libération du Perfectionnisme ✨',
    },
    'پوینده آرامش درونی 🕊️': {
      fa: 'پوینده آرامش درونی 🕊️',
      en: 'Inner Peace Seeker 🕊️',
      es: 'Buscador de Paz Interior 🕊️',
      ar: 'باحث عن السلام الداخلي 🕊️',
      fr: 'Chercheur de Paix Intérieure 🕊️',
    },
    'پوینده آرامش درونی ☕': {
      fa: 'پوینده آرامش درونی ☕',
      en: 'Inner Peace Seeker ☕',
      es: 'Buscador de Paz Interior ☕',
      ar: 'باحث عن السلام الداخلي ☕',
      fr: 'Chercheur de Paix Intérieure ☕',
    },
    'روایتگر اسکار و پوست واقعی 🌸': {
      fa: 'روایتگر اسکار و پوست واقعی 🌸',
      en: 'Storyteller of Scars & Real Skin 🌸',
      es: 'Narrador de Cicatrices y Piel Real 🌸',
      ar: 'راوي الندبات والجلد الطبيعي 🌸',
      fr: 'Conteur de Cicatrices et Peau Réelle 🌸',
    },
    'طبیعی و بدون روتوش 🌱': {
      fa: 'طبیعی و بدون روتوش 🌱',
      en: 'Raw & Unretouched 🌱',
      es: 'Natural y Sin Filtros 🌱',
      ar: 'طبيعي وبدون رتوش 🌱',
      fr: 'Naturel et Sans Retouche 🌱',
    },
    'عضو خانواده NotPerfect 🤍': {
      fa: 'عضو خانواده NotPerfect 🤍',
      en: 'NotPerfect Family Member 🤍',
      es: 'Miembro de la Familia NotPerfect 🤍',
      ar: 'عضو عائلة NotPerfect 🤍',
      fr: 'Membre de la famille NotPerfect 🤍',
    },
  };

  const normalized = badge.trim();
  for (const [key, translations] of Object.entries(badgeMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return translations[lang] || translations.en || badge;
    }
  }

  return badge;
};

/**
 * Translates hashtag keywords across languages.
 */
export const translateTag = (tag: string, lang: AppLanguage): string => {
  const tagMap: Record<string, Record<AppLanguage, string>> = {
    'همه': { fa: 'همه', en: 'All', es: 'Todos', ar: 'الكل', fr: 'Tous' },
    'بدن_واقعی': { fa: 'بدن_واقعی', en: 'real_body', es: 'cuerpo_real', ar: 'جسد_حقيقي', fr: 'corps_reel' },
    'پذیرش_بدن': { fa: 'پذیرش_بدن', en: 'body_acceptance', es: 'aceptacion_corporal', ar: 'قبول_الجسد', fr: 'acceptation_du_corps' },
    'استرچ_مارک': { fa: 'استرچ_مارک', en: 'stretch_marks', es: 'estrias', ar: 'علامات_التمدد', fr: 'vergetures' },
    'جای_زخم': { fa: 'جای_زخم', en: 'scars', es: 'cicatrices', ar: 'ندبات', fr: 'cicatrices' },
    'زخم_جراحی': { fa: 'زخم_جراحی', en: 'surgical_scars', es: 'cicatrices_quirurgicas', ar: 'ندبات_جراحية', fr: 'cicatrices_chirurgicales' },
    'واقعیت_بدن': { fa: 'واقعیت_بدن', en: 'body_reality', es: 'realidad_corporal', ar: 'حقيقة_الجسد', fr: 'realite_du_corps' },
    'ویتیلیگو': { fa: 'ویتیلیگو', en: 'vitiligo', es: 'vitiligo', ar: 'بهاق', fr: 'vitiligo' },
    'بدون_فیلتر': { fa: 'بدون_فیلتر', en: 'no_filter', es: 'sin_filtro', ar: 'بدون_فلتر', fr: 'sans_filtre' },
    'سلولیت_طبیعی': { fa: 'سلولیت_طبیعی', en: 'natural_cellulite', es: 'celulitis_natural', ar: 'سيلوليت_طبيعي', fr: 'cellulite_naturelle' },
    'کاهش_وزن': { fa: 'کاهش_وزن', en: 'weight_loss_journey', es: 'viaje_de_peso', ar: 'فقدان_الوزن', fr: 'parcours_poids' },
    'پوست_من_داستان_من': { fa: 'پوست_من_داستان_من', en: 'my_skin_my_story', es: 'mi_piel_mi_historia', ar: 'بشرتي_قصتي', fr: 'ma_peau_mon_histoire' },
    'پوست_طبیعی': { fa: 'پوست_طبیعی', en: 'natural_skin', es: 'piel_natural', ar: 'بشرة_طبيعية', fr: 'peau_naturelle' },
    'کک_و_مک': { fa: 'کک_و_مک', en: 'freckles', es: 'pecas', ar: 'نمش', fr: 'taches_de_rousseur' },
    'مثبت۱۸': { fa: 'صمیمی', en: 'intimate_view', es: 'vista_intima', ar: 'مشهد_حميم', fr: 'vue_intime' },
    'عریان_از_قضاوت': { fa: 'عریان_از_قضاوت', en: 'free_from_judgment', es: 'sin_juicios', ar: 'بلا_أحكام', fr: 'sans_jugement' },
  };

  return tagMap[tag]?.[lang] || tag;
};

/**
 * Returns localized preset body image titles for CreatePostModal.
 */
export const getPresetImageTitle = (key: string, lang: AppLanguage): string => {
  const titles: Record<string, Record<AppLanguage, string>> = {
    vitiligo: {
      fa: 'ویتیلیگو و بافت طبیعی',
      en: 'Vitiligo & Natural Texture',
      es: 'Vitíligo y textura natural',
      ar: 'البهاق والملمس الطبيعي',
      fr: 'Vitiligo et texture naturelle',
    },
    scars: {
      fa: 'زخم جراحی و استرچ مارک',
      en: 'Surgical Scars & Stretch Marks',
      es: 'Cicatrices de cirugía y estrías',
      ar: 'ندبات جراحية وعلامات تمدد',
      fr: 'Cicatrices chirurgicales et vergetures',
    },
    lines: {
      fa: 'خطوط طبیعی پوست',
      en: 'Natural Skin Lines',
      es: 'Líneas naturales de la piel',
      ar: 'خطوط البشرة الطبيعية',
      fr: 'Lignes naturelles de la peau',
    },
    curves: {
      fa: 'انحنای طبیعی و بدون ادیت',
      en: 'Natural Unedited Curves',
      es: 'Curvas naturales sin edición',
      ar: 'انحناءات طبيعية بلا تعديل',
      fr: 'Courbes naturelles sans retouche',
    },
  };

  return titles[key]?.[lang] || titles[key]?.en || key;
};

/**
 * Cross-language hashtag and tag synonym matching.
 * Searching in English ("stretch marks", "scars"), Persian ("استرچ مارک", "جای زخم"),
 * Spanish ("estrías"), French ("vergetures"), or Arabic ("ندبات") matches the corresponding posts.
 */
export const matchesMultilingualTag = (postTags: string[], searchQuery: string): boolean => {
  if (!searchQuery || !searchQuery.trim()) return false;
  const q = searchQuery.toLowerCase().replace(/[_\s\-#]+/g, '').trim();
  if (!q) return false;

  const SYNONYM_GROUPS: Record<string, string[]> = {
    stretch_marks: [
      'استرچ_مارک', 'استرچمارک', 'استرچ', 'ترک_پوستی', 'ترک', 'ترکهای_پوستی',
      'stretch_marks', 'stretchmarks', 'stretch', 'marks', 'stretches',
      'estrias', 'estria', 'estrías', 'estría',
      'علامات_التمدد', 'علامات_تمدد', 'التمدد', 'تمدد',
      'vergetures', 'vergeture',
    ],
    scars: [
      'جای_زخم', 'زخم_جراحی', 'جای_زخمها', 'زخم', 'اسکار', 'زخمها', 'جراحی',
      'scars', 'scar', 'surgical_scars', 'surgical', 'surgery',
      'cicatrices', 'cicatriz', 'cicatrices_quirurgicas',
      'ندبات', 'ندبة', 'ندبات_جراحية', 'جراحة', 'أثر_جرح',
      'cicatrices_chirurgicales',
    ],
    vitiligo: [
      'ویتیلیگو', 'پیسی', 'برص', 'لک_و_پیس', 'پیسی_پوست',
      'vitiligo', 'leucoderma',
      'bahaq', 'بهاق',
    ],
    real_body: [
      'بدن_واقعی', 'واقعیت_بدن', 'پذیرش_بدن', 'بدن', 'تن',
      'real_body', 'body_reality', 'body_acceptance', 'body', 'authentic_body',
      'cuerpo_real', 'realidad_corporal', 'aceptacion_corporal', 'cuerpo',
      'جسد_حقيقي', 'حقيقة_الجسد', 'قبول_الجسد', 'جسد',
      'corps_reel', 'realite_du_corps', 'acceptation_du_corps', 'corps',
    ],
    cellulite: [
      'سلولیت_طبیعی', 'سلولیت',
      'natural_cellulite', 'cellulite',
      'celulitis_natural', 'celulitis',
      'سيلوليت_طبيعي', 'سيلوليت',
      'cellulite_naturelle',
    ],
    freckles: [
      'کک_و_مک', 'کک', 'مک', 'لک',
      'freckles', 'freckle',
      'pecas', 'peca',
      'نمش',
      'taches_de_rousseur', 'rousseur',
    ],
    weight_loss: [
      'کاهش_وزن', 'وزن', 'لاغری', 'تناسب_اندام',
      'weight_loss', 'weight_loss_journey', 'weight', 'loss',
      'viaje_de_peso', 'peso',
      'فقدان_الوزن', 'خسارة_الوزن', 'وزن',
      'parcours_poids', 'perte_de_poids', 'poids',
    ],
    skin_story: [
      'پوست_من_داستان_من', 'پوست_طبیعی', 'پوست',
      'my_skin_my_story', 'natural_skin', 'skin',
      'mi_piel_mi_historia', 'piel_natural', 'piel',
      'بشرتي_قصتي', 'بشرة_طبيعية', 'بشرة', 'جلد',
      'ma_peau_mon_histoire', 'peau_naturelle', 'peau',
    ],
    no_filter: [
      'بدون_فیلتر', 'بدون_روتوش', 'فیلتر',
      'no_filter', 'unfiltered', 'raw', 'filter',
      'sin_filtro', 'sin_retoque',
      'بدون_فلتر', 'بدون_تعديل',
      'sans_filtre', 'sans_retouche',
    ],
  };

  // Check matching synonym groups for query
  const matchingGroupKeys: string[] = [];
  for (const [groupKey, synonyms] of Object.entries(SYNONYM_GROUPS)) {
    const matches = synonyms.some(syn => {
      const cleanSyn = syn.toLowerCase().replace(/[_\s\-#]+/g, '');
      return cleanSyn === q || cleanSyn.includes(q) || q.includes(cleanSyn);
    });
    if (matches) matchingGroupKeys.push(groupKey);
  }

  // Check against each tag of the post
  for (const rawTag of postTags) {
    const cleanTag = rawTag.toLowerCase().replace(/[_\s\-#]+/g, '');
    if (cleanTag === q || cleanTag.includes(q) || q.includes(cleanTag)) {
      return true;
    }

    for (const groupKey of matchingGroupKeys) {
      const groupSynonyms = SYNONYM_GROUPS[groupKey];
      if (groupSynonyms) {
        const tagBelongsToGroup = groupSynonyms.some(syn => {
          const cleanSyn = syn.toLowerCase().replace(/[_\s\-#]+/g, '');
          return cleanSyn === cleanTag || cleanSyn.includes(cleanTag) || cleanTag.includes(cleanSyn);
        });
        if (tagBelongsToGroup) return true;
      }
    }
  }

  return false;
};

/**
 * Returns localized post captions and body stories for known posts,
 * while keeping user names and user handles completely untranslated.
 */
export const getLocalizedPost = (
  post: { id: string; caption?: string; bodyJourney?: string },
  lang: AppLanguage
): { caption: string; bodyJourney: string } => {
  const fallbackCaption = post.caption || '';
  const fallbackJourney = post.bodyJourney || '';

  if (lang === 'fa') {
    return { caption: fallbackCaption, bodyJourney: fallbackJourney };
  }

  const postTranslations: Record<string, Record<AppLanguage, { caption: string; bodyJourney: string }>> = {
    post_1: {
      fa: {
        caption: fallbackCaption,
        bodyJourney: fallbackJourney,
      },
      en: {
        caption: 'Vitiligo used to be my nightmare for years, until I started seeing it as unique art on a canvas. Today I love every shade of my difference.',
        bodyJourney: 'A 7-year journey of embracing changing skin pigments and turning fear into quiet confidence.',
      },
      es: {
        caption: 'El vitíligo solía ser mi pesadilla, hasta que aprendí a verlo como una obra de arte sobre un lienzo. Hoy amo cada tono de mi piel diferente.',
        bodyJourney: '7 años aprendiendo a abrazar los cambios de pigmentación y convertir el miedo en orgullo sereno.',
      },
      ar: {
        caption: 'كان البُهاق كابوساً لسنوات، حتى تعلّمت أن أراه كلوحة فنية فريدة. اليوم أحب كل لون واختلاف في جسدي.',
        bodyJourney: 'رحلة ۷ سنوات في معايشة تغيّر لون البشرة وتحويل الخوف إلى طمأنينة وثقة.',
      },
      fr: {
        caption: 'Le vitiligo a longtemps été mon angoisse, jusqu’au jour où j’ai su le voir comme une toile d’art. Aujourd’hui j’aime chacune de mes nuances.',
        bodyJourney: '7 années à apprivoiser les changements de pigmentation et transformer la peur en sérénité.',
      },
    },
    post_2: {
      fa: {
        caption: fallbackCaption,
        bodyJourney: fallbackJourney,
      },
      en: {
        caption: 'When I lost 40 kg, I thought my body would look like fitness magazines. But loose skin and stretch marks remained. I cried at first, then realized this skin is proof of winning my greatest battle.',
        bodyJourney: 'Marks of a major weight loss transformation and surgery scars.',
      },
      es: {
        caption: 'Cuando bajé 40 kg, esperaba parecer de revista fitness. Pero quedaron piel suelta y estrías. Lloré al inicio, luego comprendí que son las medallas de mi mayor victoria.',
        bodyJourney: 'Huellas de una gran pérdida de peso y cicatrices de cirugía.',
      },
      ar: {
        caption: 'عندما خسرت ۴۰ كغم، ظننت أن جسدي سيشبه مجلات اللياقة. لكن بقيت علامات التمدد والجلد المترهل. أدركت أنها شواهد فوزي في أعظم معاركي.',
        bodyJourney: 'علامات رحلة إنقاص الوزن الكبيرة وندبات عملية الزائدة.',
      },
      fr: {
        caption: 'Après avoir perdu 40 kg, je croyais ressembler aux couvertures de fitness. Mais la peau distendue et les vergetures sont restées. C’est la preuve vivante de ma plus belle victoire.',
        bodyJourney: 'Traces d’une transformation majeure et cicatrices de chirurgie.',
      },
    },
    post_3_sensitive: {
      fa: {
        caption: fallbackCaption,
        bodyJourney: fallbackJourney,
      },
      en: {
        caption: 'A gentle close-up of genuine skin texture, hip stretch marks, and soft cellulite. Why did media teach us to feel shame for basic physiology? I embrace this living body.',
        bodyJourney: 'Natural cellulite and growth stretch marks from adolescence.',
      },
      es: {
        caption: 'Un primer plano suave de la textura real de la piel, estrías y celulitis natural. ¿Por qué avergonzarnos de la fisiología? Abrazo este cuerpo vivo.',
        bodyJourney: 'Celulitis natural y estrías de crecimiento corporal.',
      },
      ar: {
        caption: 'لقطة دافئة لملمس البشرة الطبيعي وعلامات التمدد والسيلوليت. لماذا علّمنا الإعلام أن نخجل من طبيعتنا؟ أحتضن هذا الجسد الحي بكل حب.',
        bodyJourney: 'سيلوليت وعلامات تمدد طبيعية لمراحل النمو.',
      },
      fr: {
        caption: 'Un gros plan doux sur la texture naturelle de la peau, les vergetures et la cellulite. Pourquoi avoir honte de notre physiologie ? J’embrasse ce corps vivant.',
        bodyJourney: 'Cellulite naturelle et vergetures de croissance.',
      },
    },
    post_4: {
      fa: { caption: fallbackCaption, bodyJourney: fallbackJourney },
      en: {
        caption: 'Years of acne marks and facial freckles. Today I step out into the sunlight without heavy concealer. Skin breathes and tells life stories.',
        bodyJourney: 'Reconciliation with acne texture, adult breakout marks, and natural sun freckles.',
      },
      es: {
        caption: 'Años de marcas de acné y pecas. Hoy salgo a la luz sin capas pesadas. La piel respira y cuenta la historia de vivir.',
        bodyJourney: 'Reconciliación con la textura del acné y las pecas naturales.',
      },
      ar: {
        caption: 'سنوات من آثار حب الشباب والنمش. اليوم أخرج للنور دون مساحيق ثقيلة. البشرة تتنفس وتروي حكاية الحياة.',
        bodyJourney: 'التصالح مع ملمس البشرة الطبيعي وآثار حب الشباب.',
      },
      fr: {
        caption: 'Des années d’acné et de taches de rousseur. Aujourd’hui je sors sous le soleil sans artifice. La peau respire et raconte la vie.',
        bodyJourney: 'Réconciliation avec le grain de peau et les marques d’acné.',
      },
    },
    post_5: {
      fa: { caption: fallbackCaption, bodyJourney: fallbackJourney },
      en: {
        caption: 'Morning light across my natural waistline. The softness of our bodies is warmth, comfort, and vitality, never something to hide.',
        bodyJourney: 'Embracing natural soft contours and leaving rigid body standards behind.',
      },
      es: {
        caption: 'Luz matutina sobre mis curvas naturales. La suavidad del cuerpo es calidez y vida, no un defecto que ocultar.',
        bodyJourney: 'Abrazando la suavidad natural y despidiendo las exigencias externas.',
      },
      ar: {
        caption: 'نور الصباح الدافئ على انحناءات جسدي الطبيعية. نعومة أجسادنا هي حيوية ودفء، وليست عيباً نواريه.',
        bodyJourney: 'احتضان القوام الطبيعي والتخلي عن المعايير المصطنعة.',
      },
      fr: {
        caption: 'Lumière matinale sur mes courbes douces. La tendresse de notre corps est signe de vie, non une faute à cacher.',
        bodyJourney: 'Épouser ses formes douces et quitter les diktats rigides.',
      },
    },
    post_6: {
      fa: { caption: fallbackCaption, bodyJourney: fallbackJourney },
      en: {
        caption: 'Two different skin tones blending on my hands like marble. What once felt like uncertainty has turned into my unique peace.',
        bodyJourney: 'Daily moments of vitiligo and natural skin beauty.',
      },
      es: {
        caption: 'Dos tonos de piel fundiéndose en mis manos como mármol. Lo que fue incertidumbre hoy es mi paz serena.',
        bodyJourney: 'Momentos diarios con vitíligo y belleza natural.',
      },
      ar: {
        caption: 'لونان يتداخلان على يديّ كالرخام النادر. ما كان يوماً تردداً تحوّل اليوم إلى سلام عميق.',
        bodyJourney: 'يوميات مع البهاق والجمال الطبيعي.',
      },
      fr: {
        caption: 'Deux teintes qui s’entrelacent sur mes mains comme du marbre. Mon ancienne inquiétude est devenue ma douce sérénité.',
        bodyJourney: 'Moments quotidiens avec le vitiligo et la peau naturelle.',
      },
    },
    post_7: {
      fa: { caption: fallbackCaption, bodyJourney: fallbackJourney },
      en: {
        caption: 'Surgical recovery scars and stretch marks post gym. Scars are not flaws; they are the warrior lines of having lived and healed.',
        bodyJourney: 'Post-surgery recovery and athletic training with authentic body marks.',
      },
      es: {
        caption: 'Cicatrices de recuperación y estrías tras el gimnasio. No son defectos, son las líneas de haber vivido y sanado.',
        bodyJourney: 'Recuperación quirúrgica y entrenamiento con marcas reales.',
      },
      ar: {
        caption: 'ندبات التعافي من الجراحة وعلامات تمدد الرياضة. الندبات ليست عيوباً، بل هي خطوط انتصارك في الشفاء والحياة.',
        bodyJourney: 'التعافي بعد الجراحة والتدريب الرياضي مع أثر الحياة.',
      },
      fr: {
        caption: 'Cicatrices post-chirurgie et vergetures d’entraînement. Ce ne sont pas des défauts, mais les marques de la résilience.',
        bodyJourney: 'Convalescence et sport avec ses marques vécues.',
      },
    },
    post_8: {
      fa: { caption: fallbackCaption, bodyJourney: fallbackJourney },
      en: {
        caption: 'My raw skin, breathing freely without photo retouching apps. Learning to see myself with gentle, loving eyes every single day.',
        bodyJourney: 'Beginning the heartfelt journey of befriending my mirror reflection.',
      },
      es: {
        caption: 'Mi piel al natural, respirando sin aplicaciones de retoque. Aprendiendo a mirarme con ojos amables cada día.',
        bodyJourney: 'Iniciando el camino de amistad con el propio reflejo.',
      },
      ar: {
        caption: 'بشرتي الحقيقية، تتنفس بحرية دون تطبيقات التعديل. أتعلم كل يوم أن أنظر لنفسي بعين المودة والرفق.',
        bodyJourney: 'بداية رحلة التصالح والمحبة مع صورتي في المرآة.',
      },
      fr: {
        caption: 'Ma peau brute, respirant sans retouches numériques. Réapprendre chaque jour à se regarder avec bienveillance.',
        bodyJourney: 'Commencement du voyage d’amitié avec mon propre reflet.',
      },
    },
  };

  const localized = postTranslations[post.id]?.[lang];
  return localized || { caption: fallbackCaption, bodyJourney: fallbackJourney };
};

/**
 * Returns localized comments text for demo comments.
 */
export const getLocalizedComment = (commentId: string, fallback: string, lang: AppLanguage): string => {
  if (lang === 'fa') return fallback;

  const commentMap: Record<string, Record<AppLanguage, string>> = {
    c1: {
      fa: fallback,
      en: 'It truly looks like an extraordinary, unique piece of art! Kudos to your courage 🌿',
      es: '¡Realmente parece una obra de arte única y extraordinaria! Bravo por tu valentía 🌿',
      ar: 'تبدو حقاً كلوحة فنية فريدة ومميزة! كل التقدير لشجاعتكِ 🌿',
      fr: 'C’est véritablement une œuvre d’art unique ! Bravo pour ton courage 🌿',
    },
    c2: {
      fa: fallback,
      en: 'This post brought me so much peace and hope. Thank you for being real 🤍',
      es: 'Esta publicación me dio tanta paz y esperanza. Gracias por ser real 🤍',
      ar: 'منحني هذا المنشور الكثير من الأمل والسلام الداخلي. شكراً لصدقكِ 🤍',
      fr: 'Ce post m’apporte tellement d’apaisement et d’espoir. Merci d’être authentique 🤍',
    },
    c3: {
      fa: fallback,
      en: 'Be proud of this warrior body! Every single line is your medal 👏',
      es: '¡Enorgullécete de este cuerpo luchador! Cada línea es tu medalla 👏',
      ar: 'افتخر بهذا الجسد القوي! كل خط فيه هو وسام شرف لك 👏',
      fr: 'Sois fier de ce corps guerrier ! Chaque ligne est une médaille d’honneur 👏',
    },
    c4: {
      fa: fallback,
      en: 'This vulnerability and honesty is needed across our society. Wonderful.',
      es: 'Esta honestidad y vulnerabilidad es necesaria en toda nuestra sociedad. Maravilloso.',
      ar: 'هذا الصدق والشفافية ضروريان لمجتمعنا بأكمله. رائع جداً.',
      fr: 'Cette authenticité et cette douceur sont précieuses pour nous tous. Magnifique.',
    },
  };

  return commentMap[commentId]?.[lang] || fallback;
};

/**
 * Returns localized 24h note text for demo notes.
 */
export const getLocalizedNote = (noteId: string, fallback: string, lang: AppLanguage): string => {
  if (lang === 'fa') return fallback;

  const noteMap: Record<string, Record<AppLanguage, string>> = {
    note_niloofar: {
      fa: fallback,
      en: 'Made peace with my skin lines today 🕊️',
      es: 'Hoy hice las paces con las líneas de mi piel 🕊️',
      ar: 'تصالحت اليوم مع خطوط بشرتي 🕊️',
      fr: 'Réconciliée avec les lignes de ma peau aujourd’hui 🕊️',
    },
    note_kian: {
      fa: fallback,
      en: 'The body is for living, not just for being watched!',
      es: '¡El cuerpo es para vivir, no sólo para ser mirado!',
      ar: 'الجسد وُجد لنعيش به، لا لنُحاكم بمظهره!',
      fr: 'Le corps est fait pour vivre, pas seulement pour être regardé !',
    },
    note_sara: {
      fa: fallback,
      en: 'Peace began once I threw out all the filters ✨',
      es: 'La paz comenzó cuando dejé atrás los filtros ✨',
      ar: 'بدأ السلام الداخلي حين تخلصتُ من كل الفلاتر ✨',
      fr: 'La paix a commencé quand j’ai abandonné tous les filtres ✨',
    },
    note_me: {
      fa: fallback,
      en: 'Embracing my authentic self day by day ✨',
      es: 'Abrazando mi verdadero ser día a día ✨',
      ar: 'أتقبّل نفسي الحقيقية يوماً بعد يوم ✨',
      fr: 'J’apprivoise mon moi authentique chaque jour ✨',
    },
  };

  return noteMap[noteId]?.[lang] || fallback;
};

/**
 * Returns the localized name of a language formatted for the current viewer language.
 */
export const getLanguageDisplayName = (targetLang: AppLanguage, inLang: AppLanguage): string => {
  const names: Record<AppLanguage, Record<AppLanguage, string>> = {
    fa: { fa: 'فارسی', en: 'Persian', es: 'persa', ar: 'الفارسية', fr: 'persan' },
    en: { fa: 'انگلیسی', en: 'English', es: 'inglés', ar: 'الإنجليزية', fr: 'anglais' },
    es: { fa: 'اسپانیایی', en: 'Spanish', es: 'español', ar: 'الإسبانية', fr: 'espagnol' },
    ar: { fa: 'عربی', en: 'Arabic', es: 'árabe', ar: 'العربية', fr: 'arabe' },
    fr: { fa: 'فرانسوی', en: 'French', es: 'francés', ar: 'الفرنسية', fr: 'français' },
  };
  return names[targetLang]?.[inLang] || names[targetLang]?.['en'] || targetLang;
};

/**
 * Returns the translation notice string indicating which language the post was translated from.
 */
export const getTranslationNotice = (originalLang: AppLanguage, currentLang: AppLanguage): string => {
  const langName = getLanguageDisplayName(originalLang, currentLang);
  switch (currentLang) {
    case 'fa':
      return `ترجمه شده از ${langName}`;
    case 'en':
      return `Translated from ${langName}`;
    case 'es':
      return `Traducido del ${langName}`;
    case 'ar':
      return `مترجم من ${langName}`;
    case 'fr':
      return `Traduit du ${langName}`;
    default:
      return `Translated from ${langName}`;
  }
};

/**
 * Safely parse a message's createdAt value.
 * Handles ISO date strings, timestamps, and time-only strings like '۱۰:۲۴' or '10:24'.
 */
export const parseMessageDate = (createdAt?: string): Date => {
  if (!createdAt) return new Date();

  // Test if it's already parseable by Date
  const parsed = new Date(createdAt);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  // Handle Persian digits in time strings like '۱۰:۲۴'
  const westernized = createdAt.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
  const timeMatch = westernized.match(/(\d{1,2}):(\d{2})/);
  if (timeMatch) {
    const hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const today = new Date();
    today.setHours(hours, minutes, 0, 0);
    return today;
  }

  return new Date();
};

/**
 * Formats message time cleanly for the bubble (e.g., '14:24' or '۱۴:۲۴').
 * Guaranteed NEVER to output 'Invalid Date'!
 */
export const formatMessageTime = (createdAt?: string, lang: string = 'fa'): string => {
  if (!createdAt) {
    return new Date().toLocaleTimeString(lang === 'fa' ? 'fa-IR' : lang, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // If already a clean time format (e.g., '۱۰:۲۴' or '10:24')
  if (/^([۰-۹]{1,2}:[۰-۹]{2}|\d{1,2}:\d{2})$/.test(createdAt.trim())) {
    return createdAt.trim();
  }

  const d = parseMessageDate(createdAt);
  try {
    return d.toLocaleTimeString(lang === 'fa' ? 'fa-IR' : lang, {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '12:00';
  }
};

/**
 * Extract calendar day key 'YYYY-MM-DD' for grouping messages by day.
 */
export const getMessageDayKey = (createdAt?: string): string => {
  const d = parseMessageDate(createdAt);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format day label for the day popup / divider badge:
 * - 'امروز' / 'Today'
 * - 'دیروز' / 'Yesterday'
 * - Localized full date (e.g. '۱۲ شهریور ۱۴۰۵' or 'Sep 12, 2026')
 */
export const formatChatDayBadge = (dateKey: string, lang: string = 'fa'): string => {
  const now = new Date();
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const yesterday = new Date(now.getTime() - 86400000);
  const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  const appLang = (lang as AppLanguage) || 'fa';
  const t = TRANSLATIONS[appLang] || TRANSLATIONS.fa;

  if (dateKey === todayKey) {
    return t.today;
  }
  if (dateKey === yesterdayKey) {
    return t.yesterday;
  }

  try {
    const parts = dateKey.split('-');
    if (parts.length === 3) {
      const targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      if (!isNaN(targetDate.getTime())) {
        if (lang === 'fa') {
          return targetDate.toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        }
        return targetDate.toLocaleDateString(lang, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
    }
  } catch {
    // fallback
  }

  return dateKey;
};

/**
 * Format full date & time for hover/touch tooltip popup on each message (e.g. 'امروز، ۱۰:۲۴' or 'Today, 10:24 AM')
 */
export const formatMessageFullTooltip = (createdAt?: string, lang: string = 'fa'): string => {
  const dayKey = getMessageDayKey(createdAt);
  const dayLabel = formatChatDayBadge(dayKey, lang);
  const timeLabel = formatMessageTime(createdAt, lang);
  return `${dayLabel} • ${timeLabel}`;
};

