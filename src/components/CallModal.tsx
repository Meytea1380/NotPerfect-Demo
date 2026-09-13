import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Camera,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { CallState } from '../types';

interface CallModalProps {
  callState: CallState;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  callState,
  onEndCall,
  onToggleMute,
  onToggleVideo,
}) => {
  const [duration, setDuration] = useState(0);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [cozyFilterActive, setCozyFilterActive] = useState(true);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Call timer
  useEffect(() => {
    let interval: any;
    if (callState.isOpen) {
      setDuration(0);
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState.isOpen]);

  // Request actual camera stream if in video mode
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (callState.isOpen && callState.type === 'video' && !callState.isVideoOff) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: true })
        .then(stream => {
          activeStream = stream;
          setCameraStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.log('Camera access optional or not allowed:', err);
        });
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [callState.isOpen, callState.type, callState.isVideoOff]);

  if (!callState.isOpen || !callState.user) return null;

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#09080e] flex flex-col justify-between overflow-hidden select-none animate-fadeIn">
      {/* Top Header */}
      <div className="pt-8 pb-4 px-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#9bb39d] animate-ping" />
          <span className="text-xs font-semibold text-[#c5bed4]">
            {callState.type === 'video' ? 'ویدیوکال امن' : 'وویس کال امن'}
          </span>
        </div>
        <div className="px-3 py-1 rounded-full bg-[#1b1926]/90 border border-[#373048] text-xs font-mono text-[#e8a598]">
          {formatTimer(duration)}
        </div>
      </div>

      {/* Main Stage */}
      {callState.type === 'video' ? (
        /* Video Call Stage */
        <div className="relative flex-1 w-full h-full flex items-center justify-center bg-zinc-950 overflow-hidden">
          {/* Main Remote Video (Simulated Test Partner) */}
          <div className="relative w-full h-full">
            <img
              src={callState.user?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'}
              alt={callState.user?.name || ''}
              className={`w-full h-full object-cover transition-all duration-300 ${
                cozyFilterActive
                  ? 'brightness-95 contrast-95 sepia-[0.15] saturate-90'
                  : ''
              }`}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Remote User Label */}
            <div className="absolute top-20 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white flex items-center gap-2 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-[#9bb39d]" />
              <span>{callState.user.name}</span>
            </div>
          </div>

          {/* Local User Picture-in-Picture (Real WebCam Stream or Fallback) */}
          <div className="absolute bottom-28 right-4 w-28 h-40 rounded-2xl overflow-hidden border-2 border-[#e8a598]/60 shadow-2xl bg-[#171522] z-30">
            {!callState.isVideoOff ? (
              cameraStream ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover -scale-x-100 ${
                    cozyFilterActive ? 'sepia-[0.1] contrast-95' : ''
                  }`}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-gradient-to-tr from-[#312536] to-[#483344] text-white">
                  <Camera className="w-6 h-6 text-[#d6a592] mb-1 animate-pulse" />
                  <span className="text-[9px] text-[#ded8ea]">تصویر شما</span>
                </div>
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#1c1a29] text-[#8e87a0] text-center p-2">
                <VideoOff className="w-5 h-5 mb-1" />
                <span className="text-[9px]">دوربین خاموش</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Voice Call Stage */
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center z-10">
          {/* Animated Pulsing Rings */}
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-[#d6a592]/20 animate-ping" />
            <div className="absolute -inset-4 rounded-full bg-[#875b6e]/25 animate-pulse" />
            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-[#875b6e] via-[#b3756b] to-[#e8a598] relative z-10 shadow-2xl">
              <img
                src={callState.user?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'}
                alt={callState.user?.name || ''}
                className="w-full h-full rounded-full object-cover border-4 border-[#12111a]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-1">
            {callState.user?.name || ''}
          </h3>
          <p className="text-xs text-[#9bb39d] font-medium mb-4">
            در حال گفتگو در بستر امن و خصوصی
          </p>

          {/* Voice Wave Animation */}
          <div className="flex items-center gap-1.5 h-10 px-4 py-2 bg-[#1b1828]/80 rounded-full border border-[#352c44]">
            {[30, 60, 95, 45, 80, 50, 90, 40, 75, 55].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-[#e8a598] animate-pulse"
                style={{
                  height: `${h * 0.3 + 6}px`,
                  animationDuration: `${0.4 + (i % 4) * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Safety Notice Badge */}
      <div className="px-6 py-2 flex items-center justify-center gap-1.5 text-[11px] text-[#a49cb5] z-20">
        <ShieldCheck className="w-3.5 h-3.5 text-[#9bb39d]" />
        <span>تماس رمزگذاری شده و امن برای پذیرش و گفتگوی صادقانه</span>
      </div>

      {/* Bottom Controls Bar */}
      <div className="pb-8 pt-4 px-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20 flex items-center justify-around">
        {/* Toggle Mute Mic */}
        <button
          onClick={onToggleMute}
          className={`p-3.5 rounded-full transition-all cursor-pointer shadow-lg ${
            callState.isMuted
              ? 'bg-[#3d1a24] text-[#f28e83] border border-[#f28e83]/40'
              : 'bg-[#221f30] text-white hover:bg-[#302a42]'
          }`}
          title={callState.isMuted ? 'روشن کردن میکروفون' : 'بی‌صدا کردن'}
        >
          {callState.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Video Call Specific: Toggle Camera */}
        {callState.type === 'video' && (
          <button
            onClick={onToggleVideo}
            className={`p-3.5 rounded-full transition-all cursor-pointer shadow-lg ${
              callState.isVideoOff
                ? 'bg-[#3d1a24] text-[#f28e83] border border-[#f28e83]/40'
                : 'bg-[#221f30] text-white hover:bg-[#302a42]'
            }`}
            title={callState.isVideoOff ? 'روشن کردن دوربین' : 'خاموش کردن دوربین'}
          >
            {callState.isVideoOff ? (
              <VideoOff className="w-5 h-5" />
            ) : (
              <Video className="w-5 h-5" />
            )}
          </button>
        )}

        {/* Cozy Warm Painterly Filter Toggle */}
        {callState.type === 'video' && (
          <button
            onClick={() => setCozyFilterActive(!cozyFilterActive)}
            className={`p-3.5 rounded-full transition-all cursor-pointer shadow-lg ${
              cozyFilterActive
                ? 'bg-[#4a3447] text-[#e8a598] border border-[#e8a598]/50'
                : 'bg-[#221f30] text-[#a49cb5]'
            }`}
            title="فیلتر نقاشی‌گونه و گرم"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        )}

        {/* Speakerphone Toggle */}
        <button
          onClick={() => setIsSpeakerOn(!isSpeakerOn)}
          className={`p-3.5 rounded-full transition-all cursor-pointer shadow-lg ${
            isSpeakerOn
              ? 'bg-[#221f30] text-white'
              : 'bg-[#181622] text-[#8e879f]'
          }`}
          title="بلندگو"
        >
          {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        {/* End Call (Red button) */}
        <button
          onClick={onEndCall}
          className="p-4 rounded-full bg-[#d64036] text-white hover:bg-[#eb463a] active:scale-95 shadow-[0_4px_20px_rgba(214,64,54,0.4)] transition-all cursor-pointer"
          title="قطع تماس"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
