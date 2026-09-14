import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Video,
  Camera,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Play,
  Square,
  Lock,
} from 'lucide-react';
import { User, AppLanguage } from '../types';
import { TRANSLATIONS } from '../services/i18n';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onVerified: (method: 'google' | 'video', videoData?: { snapshotUrl: string; phrase: string; code: string }) => void;
  lang?: AppLanguage;
}

export const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onVerified,
  lang = 'fa',
}) => {
  const t = TRANSLATIONS[lang];
  const [method, setMethod] = useState<'choose' | 'google' | 'video'>('choose');

  // Video verification states
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedSnapshot, setRecordedSnapshot] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('8429');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<any>(null);

  // Generate random verification code and phrase
  useEffect(() => {
    if (isOpen) {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setVerificationCode(code);
      setMethod('choose');
      setRecordedSnapshot(null);
      setIsSubmitted(false);
    }
  }, [isOpen]);

  // Localized strings
  const randomPhrase =
    lang === 'fa'
      ? `من ${currentUser.name} هستم، با سن بالای ۱۸ سال و با رضایت کامل در فضای امن NotPerfect حضور دارم — کد تایید ${verificationCode}`
      : lang === 'ar'
      ? `أنا ${currentUser.name}، أؤكد أن عمري أكثر من ۱۸ عاماً وبكامل إرادتي في مجتمع NotPerfect — رمز التأكيد ${verificationCode}`
      : lang === 'es'
      ? `Soy ${currentUser.name}, confirmo que soy mayor de 18 años y participo voluntariamente en NotPerfect — Código: ${verificationCode}`
      : lang === 'fr'
      ? `Je suis ${currentUser.name}, je confirme avoir plus de 18 ans et participer librement à NotPerfect — Code : ${verificationCode}`
      : `I am ${currentUser.name}, confirming that I am 18+ years old and participating with full consent in NotPerfect — Code: ${verificationCode}`;

  const instantBadge =
    lang === 'fa' ? 'آنی و بدون معطلی' : lang === 'ar' ? 'فوري وبدون انتظار' : lang === 'es' ? 'Instantáneo' : lang === 'fr' ? 'Instantané' : 'Instant';

  const fiveSecBadge =
    lang === 'fa' ? '۵ ثانیه' : lang === 'ar' ? '۵ ثوانٍ' : lang === 'es' ? '5 seg' : lang === 'fr' ? '5 sec' : '5 sec';

  const googleVerifyTitle =
    lang === 'fa'
      ? 'استعلام خودکار تاریخ تولد از حساب Google'
      : lang === 'ar'
      ? 'التحقق التلقائي من تاريخ الميلاد عبر Google'
      : lang === 'es'
      ? 'Comprobación de fecha de nacimiento vía Google'
      : lang === 'fr'
      ? 'Vérification de la date de naissance via Google'
      : 'Automatic birthdate check via Google account';

  const googleVerifyDesc =
    lang === 'fa'
      ? 'تاریخ تولد ثبت شده در حساب Google شما بررسی شده و سن بالای ۱۸ سال تایید خواهد شد.'
      : lang === 'ar'
      ? 'سيتم التحقق من تاريخ الميلاد المسجل في حساب Google وتأكيد بلوغك سن ۱۸ عاماً.'
      : lang === 'es'
      ? 'Se verificará la fecha de nacimiento de tu cuenta Google para confirmar la mayoría de edad (18+).'
      : lang === 'fr'
      ? 'La date de naissance enregistrée sur Google sera vérifiée pour confirmer votre majorité (18+).'
      : 'The birthdate registered on your Google account will be checked to confirm you are 18+.';

  const connectedAccountLabel =
    lang === 'fa' ? 'حساب متصل:' : lang === 'ar' ? 'الحساب المرتبط:' : lang === 'es' ? 'Cuenta conectada:' : lang === 'fr' ? 'Compte associé :' : 'Connected account:';

  const googleAgeStatusLabel =
    lang === 'fa' ? 'وضعیت سن Google:' : lang === 'ar' ? 'حالة السن في Google:' : lang === 'es' ? 'Estado de edad:' : lang === 'fr' ? 'Statut de majorité :' : 'Google age status:';

  const adultBadge =
    lang === 'fa' ? 'بزرگسال (+۱۸ سال) ✓' : lang === 'ar' ? 'بالغ (+۱۸ عاماً) ✓' : lang === 'es' ? 'Adulto (18+) ✓' : lang === 'fr' ? 'Majeur (18+) ✓' : 'Adult (18+) ✓';

  const instantConfirmBtn =
    lang === 'fa' ? 'تایید فوری سن (+۱۸)' : lang === 'ar' ? 'تأكيد فوري للسن (+۱۸)' : lang === 'es' ? 'Confirmar edad (+18)' : lang === 'fr' ? 'Confirmer l’âge (+18)' : 'Confirm Age (18+)';

  const faceInFrameHint =
    lang === 'fa' ? 'صورت در کادر' : lang === 'ar' ? 'الوجه داخل الإطار' : lang === 'es' ? 'Rostro en el marco' : lang === 'fr' ? 'Visage dans le cadre' : 'Face in frame';

  const videoRecordedSuccess =
    lang === 'fa' ? 'ویدیو با موفقیت ضبط شد ✓' : lang === 'ar' ? 'تم تسجيل الفيديو بنجاح ✓' : lang === 'es' ? 'Video grabado con éxito ✓' : lang === 'fr' ? 'Vidéo enregistrée avec succès ✓' : 'Video recorded successfully ✓';

  const recordAgainBtn =
    lang === 'fa' ? 'ضبط دوباره' : lang === 'ar' ? 'إعادة التسجيل' : lang === 'es' ? 'Grabar de nuevo' : lang === 'fr' ? 'Recommencer' : 'Record again';

  const confirmVideoBtn =
    lang === 'fa' ? 'تایید و ثبت ویدیو (+۱۸)' : lang === 'ar' ? 'تأكيد وإرسال الفيديو (+۱۸)' : lang === 'es' ? 'Confirmar video (+18)' : lang === 'fr' ? 'Valider la vidéo (+18)' : 'Confirm Video (18+)';

  const useProfileFaceSim =
    lang === 'fa' ? 'استفاده از چهره پروفایل (حالت شبیه‌ساز)' : lang === 'ar' ? 'استخدام صورة الملف (محاكاة)' : lang === 'es' ? 'Usar foto de perfil (simulación)' : lang === 'fr' ? 'Utiliser la photo de profil (simulation)' : 'Use profile photo (simulation)';

  const successTitle =
    lang === 'fa' ? 'احراز هویت سن با موفقیت ثبت شد' : lang === 'ar' ? 'تم تأكيد السن بنجاح' : lang === 'es' ? 'Edad verificada con éxito' : lang === 'fr' ? 'Âge vérifié avec succès' : 'Age Verified Successfully';

  const successDesc =
    lang === 'fa'
      ? 'اکنون دسترسی به مشاهده عکس‌های با تگ محتوای حساس (+۱۸) برای شما فعال شد.'
      : lang === 'ar'
      ? 'تم الآن تفعيل إمكانية تصفح الصور الحساسة (+۱۸) بالكامل.'
      : lang === 'es'
      ? 'Ahora tienes acceso a ver fotos corporales y contenido sensible (+18).'
      : lang === 'fr'
      ? 'Vous avez désormais accès aux photos corporelles sans restriction (+18).'
      : 'Access to natural and sensitive body photos (18+) is now unlocked.';

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } else {
        setCameraError(
          lang === 'fa' ? 'دوربین در این مرورگر پشتیبانی نمی‌شود.' : 'Camera is not supported in this browser.'
        );
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        lang === 'fa'
          ? 'اجازه دسترسی به دوربین داده نشد یا در دسترس نیست. می‌توانید از حالت شبیه‌ساز چهره استفاده کنید.'
          : 'Camera access denied or unavailable. You can use simulation mode.'
      );
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Clean up on unmount or close
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (method === 'video' && !recordedSnapshot) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [method]);

  // Handle Recording 5s
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);

    let count = 0;
    timerRef.current = setInterval(() => {
      count += 1;
      setRecordingSeconds(count);

      if (count >= 5) {
        handleStopRecording();
      }
    }, 1000);
  };

  const handleStopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);

    // Capture snapshot from canvas or generate cozy test portrait
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 400;
      canvas.height = video.videoHeight || 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const snapshot = canvas.toDataURL('image/jpeg', 0.85);
        setRecordedSnapshot(snapshot);
      }
    } else {
      // Fallback portrait for testing without physical camera
      setRecordedSnapshot(currentUser.avatar);
    }
    stopCamera();
  };

  // Google instant verification
  const handleGoogleVerify = () => {
    onVerified('google');
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Submit Video verification
  const handleSubmitVideo = () => {
    const snapshot = recordedSnapshot || currentUser.avatar;
    onVerified('video', {
      snapshotUrl: snapshot,
      phrase: randomPhrase,
      code: verificationCode,
    });
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="w-full sm:max-w-md rounded-t-[28px] sm:rounded-3xl bg-[#171422] border-t sm:border border-[#3e344e] p-4 sm:p-5 text-start shadow-2xl overflow-hidden relative max-h-[90dvh] overflow-y-auto no-scrollbar">
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden w-10 h-1 bg-[#4b435e] rounded-full mx-auto mb-2.5" />
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#282236]">
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1 text-[#8f88a2] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#f5edf9]">
            <ShieldCheck className="w-4 h-4 text-[#e8a598]" />
            <span>{t.ageVerificationTitle}</span>
          </div>
        </div>

        {/* Success State */}
        {isSubmitted ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#1b2b20] border border-[#9bb39d]/50 flex items-center justify-center text-[#9bb39d] mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-bold text-[#f2eaf7] mb-1">
              {successTitle}
            </h4>
            <p className="text-xs text-[#baaecd] max-w-[260px] leading-relaxed">
              {successDesc}
            </p>
          </div>
        ) : method === 'choose' ? (
          /* Step 1: Choose Verification Method */
          <div className="py-4 space-y-3">
            <div className="text-center mb-4">
              <div className="inline-flex p-2.5 rounded-full bg-[#352536] text-[#e8a598] mb-2 border border-[#e8a598]/30">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#f5eff9]">
                {t.ageVerificationSubtitle}
              </h3>
              <p className="text-xs text-[#a9a1bd] mt-1 leading-relaxed">
                {t.ageVerificationDesc}
              </p>
            </div>

            {/* Option 1: Google Auth Verification */}
            <button
              onClick={() => setMethod('google')}
              className="w-full p-3 rounded-2xl bg-[#201c2e] hover:bg-[#2c263e] border border-[#3b334d] hover:border-[#e8a598]/60 transition-all flex items-center justify-between text-start cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2d253b] border border-[#4d3d63] flex items-center justify-center text-sm font-bold text-[#e8a598]">
                  G
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#ede7f7] group-hover:text-[#e8a598] transition-colors">
                    {t.googleAuthVerification}
                  </h4>
                  <p className="text-[10px] text-[#9189a5]">
                    {t.googleAuthVerificationDesc}
                  </p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1c2e22] text-[#9bb39d] border border-[#9bb39d]/40">
                {instantBadge}
              </span>
            </button>

            {/* Option 2: Video Face Validation */}
            <button
              onClick={() => setMethod('video')}
              className="w-full p-3 rounded-2xl bg-[#201c2e] hover:bg-[#2c263e] border border-[#3b334d] hover:border-[#e8a598]/60 transition-all flex items-center justify-between text-start cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2d243a] border border-[#4e3a63] flex items-center justify-center text-[#e8a598]">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#ede7f7] group-hover:text-[#e8a598] transition-colors">
                    {t.videoFaceVerification}
                  </h4>
                  <p className="text-[10px] text-[#9189a5]">
                    {t.videoFaceVerificationDesc}
                  </p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#271f33] text-[#e8a598] border border-[#4e3a63]">
                {fiveSecBadge}
              </span>
            </button>
          </div>
        ) : method === 'google' ? (
          /* Google Verification Step */
          <div className="py-4 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#1f1d2e] border border-[#e8a598]/40 flex items-center justify-center mx-auto text-xl font-bold text-[#e8a598]">
              G
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#f5edf9]">
                {googleVerifyTitle}
              </h4>
              <p className="text-xs text-[#a79eb9] mt-1 max-w-[280px] mx-auto leading-relaxed">
                {googleVerifyDesc}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#1a1726] border border-[#2d273d] text-xs text-[#d3cbdf] text-start space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#8e879f]">{connectedAccountLabel}</span>
                <span className="font-semibold text-[#f0ebf7]">meitymohajeri@gmail.com</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#8e879f]">{googleAgeStatusLabel}</span>
                <span className="text-[#9bb39d] font-bold">{adultBadge}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setMethod('choose')}
                className="flex-1 py-2 rounded-xl bg-[#231f2f] text-xs text-[#a9a1bb] hover:bg-[#2c263c] cursor-pointer"
              >
                {t.back}
              </button>
              <button
                onClick={handleGoogleVerify}
                className="flex-[2] py-2 rounded-xl bg-gradient-to-r from-[#694254] to-[#c28377] text-white text-xs font-bold hover:brightness-110 cursor-pointer shadow-lg"
              >
                {instantConfirmBtn}
              </button>
            </div>
          </div>
        ) : (
          /* Video Verification Step */
          <div className="py-2 space-y-3">
            {/* Dynamic phrase prompt box */}
            <div className="p-2.5 rounded-2xl bg-[#221c2d] border border-[#443759]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#e8a598] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.speakPromptInstruction}</span>
              </div>
              <p className="text-xs text-[#e8e2f2] leading-relaxed bg-[#15131f] p-2 rounded-xl border border-[#342b45] select-all">
                «{randomPhrase}»
              </p>
            </div>

            {/* Video camera viewport */}
            <div className="relative w-full aspect-square rounded-2xl bg-[#0b0a12] border border-[#3c334f] overflow-hidden flex items-center justify-center">
              <canvas ref={canvasRef} className="hidden" />

              {recordedSnapshot ? (
                /* Show snapshot preview */
                <div className="relative w-full h-full">
                  <img
                    src={recordedSnapshot}
                    alt="Snapshot preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-3 text-center">
                    <span className="px-2.5 py-1 rounded-full bg-[#1b2b20] text-[#9bb39d] border border-[#9bb39d]/40 text-xs font-bold mb-2">
                      {videoRecordedSuccess}
                    </span>
                    <button
                      onClick={() => {
                        setRecordedSnapshot(null);
                        startCamera();
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/70 text-[11px] text-[#e8e4f2] hover:bg-black border border-white/20 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{recordAgainBtn}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Live Camera view */
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />

                  {/* Face outline oval */}
                  <div className="absolute inset-4 rounded-full border-2 border-dashed border-[#e8a598]/60 pointer-events-none flex items-center justify-center">
                    <span className="text-[10px] text-white/70 bg-black/50 px-2 py-0.5 rounded-full">
                      {faceInFrameHint}
                    </span>
                  </div>

                  {/* Recording indicator */}
                  {isRecording && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#874966]/90 text-white text-[11px] font-bold animate-pulse shadow-md">
                      <span className="w-2 h-2 rounded-full bg-white" />
                      <span>{recordingSeconds}s / 5s</span>
                    </div>
                  )}

                  {cameraError && (
                    <div className="absolute inset-0 p-4 bg-black/80 flex flex-col items-center justify-center text-center">
                      <AlertTriangle className="w-8 h-8 text-[#e8a598] mb-2" />
                      <p className="text-[11px] text-[#cfcadb] leading-relaxed mb-3">
                        {cameraError}
                      </p>
                      <button
                        onClick={handleStopRecording}
                        className="px-3 py-1.5 rounded-xl bg-[#2d243a] text-[#e8a598] text-xs font-bold border border-[#4e3a63] cursor-pointer"
                      >
                        {useProfileFaceSim}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Controls */}
            {!recordedSnapshot ? (
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    stopCamera();
                    setMethod('choose');
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#231f2f] text-xs text-[#a9a1bb] hover:bg-[#2c263c] cursor-pointer"
                >
                  {t.back}
                </button>
                <button
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`flex-[2] py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg ${
                    isRecording
                      ? 'bg-[#673b56] text-white animate-pulse'
                      : 'bg-gradient-to-r from-[#6e3e52] to-[#c78275] text-white hover:brightness-110'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-3.5 h-3.5" />
                      <span>{t.stopVideoRecording}</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-3.5 h-3.5" />
                      <span>{t.startVideoRecording}</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    setRecordedSnapshot(null);
                    startCamera();
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#231f2f] text-xs text-[#a9a1bb] hover:bg-[#2c263c] cursor-pointer"
                >
                  {recordAgainBtn}
                </button>
                <button
                  onClick={handleSubmitVideo}
                  className="flex-[2] py-2 rounded-xl bg-gradient-to-r from-[#3e6b4e] to-[#6da77d] text-white text-xs font-bold hover:brightness-110 cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{confirmVideoBtn}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
