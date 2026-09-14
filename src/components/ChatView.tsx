import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Phone,
  Video,
  Mic,
  MicOff,
  Paperclip,
  Send,
  Play,
  Pause,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Check,
  CheckCheck,
  Sparkles,
  X,
  Search,
  Calendar,
  Clock,
} from 'lucide-react';
import { User, Message, Note, AppLanguage } from '../types';
import { StorageService } from '../services/storage';
import {
  TRANSLATIONS,
  isRTL,
  formatMessageTime,
  getMessageDayKey,
  formatChatDayBadge,
  formatMessageFullTooltip,
} from '../services/i18n';
import { NotesBar } from './NotesBar';

interface ChatViewProps {
  currentUser: User;
  allUsers: Record<string, User>;
  notes?: Note[];
  onSaveNote?: (text: string, emoji: string) => void;
  onStartCall: (targetUser: User, type: 'voice' | 'video') => void;
  onBackToFeed: () => void;
  lang?: AppLanguage;
  initialPartner?: User | null;
}

export const ChatView: React.FC<ChatViewProps> = ({
  currentUser,
  allUsers,
  notes = [],
  onSaveNote,
  onStartCall,
  onBackToFeed,
  lang = 'fa',
  initialPartner = null,
}) => {
  const t = TRANSLATIONS[lang];
  const isRtl = isRTL(lang);
  const chatPartners = (Object.values(allUsers) as User[]).filter(u => u.id !== currentUser.id);

  const [activePartner, setActivePartner] = useState<User | null>(initialPartner);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [showFileManager, setShowFileManager] = useState(false);
  const [activeDateTooltipId, setActiveDateTooltipId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordTimerRef = useRef<any>(null);

  // When initialPartner prop changes or partner is selected
  useEffect(() => {
    if (initialPartner) {
      setActivePartner(initialPartner);
    }
  }, [initialPartner]);

  // Load messages when active partner changes
  useEffect(() => {
    if (!activePartner) return;
    const chatMsgs = StorageService.getMessages(activePartner.id);
    setMessages(chatMsgs);
  }, [activePartner, currentUser]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordDuration(0);
      recordTimerRef.current = setInterval(() => {
        setRecordDuration(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(recordTimerRef.current);
    }
    return () => clearInterval(recordTimerRef.current);
  }, [isRecording]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !activePartner) return;

    const newMsg = StorageService.sendMessage({
      senderId: currentUser.id,
      receiverId: activePartner.id,
      text: inputText.trim(),
    });

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Trigger simulated supportive reply from test user after 1.2s
    setTimeout(() => {
      const replyText = StorageService.getSimulatedReply(activePartner);
      const botMsg = StorageService.sendMessage({
        senderId: activePartner.id,
        receiverId: currentUser.id,
        text: replyText,
      });
      setMessages(prev => [...prev, botMsg]);
    }, 1200);
  };

  const handleSendVoiceNote = () => {
    if (!activePartner) return;
    setIsRecording(false);

    const voiceMsg = StorageService.sendMessage({
      senderId: currentUser.id,
      receiverId: activePartner.id,
      mediaType: 'audio',
      mediaUrl: 'simulated_audio_url',
      audioDuration: recordDuration || 4,
      text: `${t.voiceMessageLabel} (${recordDuration || 4}s)`,
    });

    setMessages(prev => [...prev, voiceMsg]);

    // Simulated reply
    setTimeout(() => {
      const botMsg = StorageService.sendMessage({
        senderId: activePartner.id,
        receiverId: currentUser.id,
        text: lang === 'fa' 
          ? 'صدای مهربانت رو شنیدم 🌸 چقدر خوبه که بدون خجالت با هم حرف می‌زنیم.'
          : 'Thank you for sharing your warm voice! It feels so comforting to talk openly 🌸',
      });
      setMessages(prev => [...prev, botMsg]);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activePartner) return;

    const reader = new FileReader();
    reader.onload = () => {
      const isImage = file.type.startsWith('image/');
      const newFileMsg = StorageService.sendMessage({
        senderId: currentUser.id,
        receiverId: activePartner.id,
        mediaType: isImage ? 'image' : 'file',
        mediaUrl: reader.result as string,
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(0)} KB`,
        text: isImage ? 'Image' : file.name,
      });
      setMessages(prev => [...prev, newFileMsg]);
    };
    reader.readAsDataURL(file);
  };

  const filteredPartners = chatPartners.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sharedFiles = messages.filter(m => m.mediaType);

  return (
    <div className="flex-1 flex flex-col bg-[#100f17] overflow-hidden">
      {/* If no partner selected, show conversation list & Instagram-like Notes tray */}
      {!activePartner ? (
        <div className="flex-1 flex flex-col overflow-y-auto pb-16 w-full">
          {/* Header */}
          <div className="px-4 py-3 bg-[#151320] border-b border-[#252134] sticky top-0 z-20 w-full">
            <div className="w-full max-w-2xl lg:max-w-3xl mx-auto flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#eae5f5] flex items-center gap-2">
                <span>{t.directMessagesTitle}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#272136] text-[#e8a598] font-normal">
                  {chatPartners.length}
                </span>
              </h2>
            </div>
          </div>

          <div className="w-full max-w-2xl lg:max-w-3xl mx-auto flex-1 flex flex-col">
            {/* Instagram-style Notes Bar at the top of Direct Messages! */}
            {onSaveNote && (
              <div className="border-b border-[#231e30]">
                <NotesBar
                  notes={notes}
                  currentUser={currentUser}
                  onSaveNote={onSaveNote}
                  lang={lang}
                  onSelectNoteUser={(user) => setActivePartner(user)}
                />
              </div>
            )}

            {/* Search bar */}
            <div className="p-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#171524] border border-[#2b253b] text-xs text-[#cfcadb]">
                <Search className="w-3.5 h-3.5 text-[#857e93]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t.searchChatsPlaceholder}
                  className="w-full bg-transparent outline-none text-xs text-white placeholder:text-[#6f687e]"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="px-3 space-y-2">
              {filteredPartners.map(partner => (
                <div
                  key={partner.id}
                  onClick={() => setActivePartner(partner)}
                  className="p-3 rounded-2xl bg-[#181624] border border-[#2b253b] hover:border-[#483d63] flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={partner?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'}
                        alt={partner?.name || ''}
                        className="w-12 h-12 rounded-full object-cover border border-[#3b334f]"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#9bb39d] border-2 border-[#181624]" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#f2eef9]">{partner.name}</h3>
                      <p className="text-[11px] text-[#9b93ab] max-w-[190px] truncate">
                        {partner.bio}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#b5acc7]">
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Active Conversation Screen */
        <div className="flex-1 flex flex-col h-full overflow-hidden w-full max-w-2xl lg:max-w-3xl mx-auto">
          {/* Chat Header */}
          <div className="px-3.5 py-2.5 bg-[#161421] border-b border-[#2a2538] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePartner(null)}
                className="p-1.5 rounded-full text-[#9c95ad] hover:text-white cursor-pointer"
                title={t.back}
              >
                {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              </button>
              <div className="relative">
                <img
                  src={activePartner?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'}
                  alt={activePartner?.name || ''}
                  className="w-9 h-9 rounded-full object-cover border border-[#3f3851]"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#9bb39d] border-2 border-[#161421]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#f4eff9]">{activePartner.name}</h3>
                <p className="text-[10px] text-[#9bb39d] font-medium">Online</p>
              </div>
            </div>

            {/* Action Buttons: Voice Call, Video Call, File Manager */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onStartCall(activePartner, 'voice')}
                className="p-2 rounded-full bg-[#221e2e] text-[#9bb39d] hover:bg-[#2e293f] transition-all cursor-pointer"
                title="Voice Call"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onStartCall(activePartner, 'video')}
                className="p-2 rounded-full bg-[#221e2e] text-[#e8a598] hover:bg-[#2e293f] transition-all cursor-pointer"
                title="Video Call"
              >
                <Video className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setShowFileManager(true)}
                className="p-2 rounded-full bg-[#221e2e] text-[#b7a6cb] hover:bg-[#2e293f] transition-all cursor-pointer"
                title="Files"
              >
                <FolderOpen className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#0f0e16]">
            <div className="text-center my-1">
              <span className="px-3 py-1 rounded-full bg-[#1b1926] text-[10px] text-[#8e869e] border border-[#2d283c]">
                {t.safeSpaceActive} 🌱
              </span>
            </div>

            {messages.map((msg, index) => {
              const isMine = msg.senderId === currentUser.id;
              const msgDayKey = getMessageDayKey(msg.createdAt);
              const prevMsgDayKey = index > 0 ? getMessageDayKey(messages[index - 1].createdAt) : null;
              const isNewDay = msgDayKey !== prevMsgDayKey;
              const dayBadgeLabel = formatChatDayBadge(msgDayKey, lang);
              const formattedTime = formatMessageTime(msg.createdAt, lang);
              const fullTooltip = formatMessageFullTooltip(msg.createdAt, lang);
              const isTooltipOpen = activeDateTooltipId === msg.id;

              return (
                <React.Fragment key={msg.id}>
                  {/* Day Divider Badge / Sticky Popup */}
                  {isNewDay && (
                    <div className="flex justify-center my-3.5 sticky top-1 z-10 pointer-events-none">
                      <div className="pointer-events-auto px-3.5 py-1 rounded-full bg-[#1f1b2d]/95 backdrop-blur-md border border-[#3e3454] text-[11px] font-medium text-[#e5def2] shadow-md shadow-black/50 flex items-center gap-1.5 transition-all">
                        <Calendar className="w-3.5 h-3.5 text-[#e8a598]" />
                        <span>{dayBadgeLabel}</span>
                      </div>
                    </div>
                  )}

                  <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`relative max-w-[80%] rounded-2xl p-2.5 text-xs ${
                        isMine
                          ? 'bg-gradient-to-r from-[#4d364a] to-[#67444c] text-white rounded-tr-none border border-[#7d5663]/40'
                          : 'bg-[#1c1928] text-[#ede8f7] rounded-tl-none border border-[#372f49]'
                      }`}
                    >
                      {/* Interactive Date & Time Mini Popup */}
                      {isTooltipOpen && (
                        <div
                          className={`absolute -top-7 ${
                            isMine ? 'right-0' : 'left-0'
                          } z-20 px-2.5 py-1 rounded-xl bg-[#282138] border border-[#4e4067] text-[10px] text-[#f2eef8] whitespace-nowrap shadow-xl flex items-center gap-1.5 animate-fade-in`}
                        >
                          <Clock className="w-3 h-3 text-[#e8a598]" />
                          <span>{fullTooltip}</span>
                        </div>
                      )}

                      {/* Voice Message Player */}
                      {msg.mediaType === 'audio' ? (
                        <div className="flex items-center gap-2.5 py-1">
                          <button
                            onClick={() =>
                              setPlayingAudioId(
                                playingAudioId === msg.id ? null : msg.id
                              )
                            }
                            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-all flex-shrink-0"
                          >
                            {playingAudioId === msg.id ? (
                              <Pause className="w-3.5 h-3.5" />
                            ) : (
                              <Play className="w-3.5 h-3.5 ml-0.5" />
                            )}
                          </button>

                          {/* Animated Voice Waveform Bars */}
                          <div className="flex items-center gap-0.5 h-5 flex-1 px-1">
                            {[40, 70, 30, 90, 60, 80, 45, 95, 30, 75, 55, 85].map(
                              (h, i) => (
                                <div
                                  key={i}
                                  className={`w-0.5 rounded-full transition-all duration-200 ${
                                    playingAudioId === msg.id
                                      ? 'bg-[#e8a598] animate-pulse'
                                      : 'bg-white/40'
                                  }`}
                                  style={{
                                    height:
                                      playingAudioId === msg.id
                                        ? `${(h * (i % 2 === 0 ? 1 : 0.7)) / 3 + 4}px`
                                        : `${h / 4 + 3}px`,
                                  }}
                                />
                              )
                            )}
                          </div>

                          <span className="text-[9px] text-white/70 font-mono">
                            0:{msg.audioDuration ? msg.audioDuration.toString().padStart(2, '0') : '05'}
                          </span>
                        </div>
                      ) : msg.mediaType === 'image' && msg.mediaUrl ? (
                        <div className="space-y-1">
                          <img
                            src={msg.mediaUrl}
                            alt="shared"
                            className="max-h-48 rounded-xl object-cover"
                            referrerPolicy="no-referrer"
                          />
                          {msg.text && <p className="pt-1">{msg.text}</p>}
                        </div>
                      ) : msg.mediaType === 'file' ? (
                        <div className="flex items-center gap-2 p-1.5 bg-black/20 rounded-xl">
                          <FileText className="w-6 h-6 text-[#d6a592]" />
                          <div className="truncate">
                            <p className="font-semibold truncate">{msg.fileName}</p>
                            <span className="text-[9px] opacity-70">{msg.fileSize}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="leading-relaxed">{msg.text}</p>
                      )}

                      {/* Time and Status Indicator */}
                      <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-70 hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveDateTooltipId(prev => (prev === msg.id ? null : msg.id))
                          }
                          className="flex items-center gap-1 cursor-pointer"
                          title={fullTooltip}
                        >
                          <span>{formattedTime}</span>
                          {isMine && <CheckCheck className="w-3 h-3 text-[#9bb39d]" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Recording Banner */}
          {isRecording && (
            <div className="p-2.5 bg-[#251722] border-t border-[#643447] flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2 text-xs text-[#f28e83]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f28e83] animate-ping" />
                <span>{t.recordingVoice}</span>
                <span className="font-mono font-bold">{recordDuration}s</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRecording(false)}
                  className="px-2.5 py-1 rounded-lg bg-[#381f2b] text-[#f28e83] text-xs cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleSendVoiceNote}
                  className="px-3 py-1 rounded-lg bg-[#b85c54] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>{t.sendComment}</span>
                </button>
              </div>
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="p-2.5 bg-[#151320] border-t border-[#292336] flex items-center gap-2">
            <label className="p-2 text-[#9a91ab] hover:text-white rounded-full cursor-pointer hover:bg-[#201d2c] transition-colors">
              <Paperclip className="w-4 h-4" />
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder={t.typeMessagePlaceholder}
              className="flex-1 bg-[#0f0e16] border border-[#2b253b] focus:border-[#d6a592] rounded-2xl px-3.5 py-2 text-xs text-[#ede8f7] outline-none placeholder:text-[#6a637a]"
            />

            {inputText.trim() ? (
              <button
                onClick={handleSendMessage}
                className="p-2 rounded-full bg-gradient-to-r from-[#6e4659] to-[#b3756b] text-white cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-2 rounded-full transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-[#7a3443] text-white animate-pulse'
                    : 'bg-[#221f2f] text-[#cfcadb] hover:bg-[#2c263c]'
                }`}
                title={t.voiceMessageLabel}
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* File Manager Drawer Modal */}
      {showFileManager && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4">
          <div className="w-full max-w-sm bg-[#181624] border border-[#3b334d] rounded-3xl p-4 shadow-2xl animate-fade-in max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#2a243a]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#e8a598]">
                <FolderOpen className="w-4 h-4" />
                <span>Media & Files ({sharedFiles.length})</span>
              </div>
              <button
                onClick={() => setShowFileManager(false)}
                className="p-1 rounded-full text-[#8e879f] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              {sharedFiles.length === 0 ? (
                <p className="text-center text-xs text-[#8e879f] py-8">
                  No files shared yet in this conversation.
                </p>
              ) : (
                sharedFiles.map(file => (
                  <div
                    key={file.id}
                    className="p-2.5 rounded-2xl bg-[#111019] border border-[#2b253b] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {file.mediaType === 'image' ? (
                        <img
                          src={file.mediaUrl}
                          alt="preview"
                          className="w-10 h-10 rounded-lg object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <FileText className="w-8 h-8 text-[#d6a592]" />
                      )}
                      <div>
                        <p className="text-xs font-medium text-[#ede8f7] truncate max-w-[160px]">
                          {file.fileName || 'Image'}
                        </p>
                        <span className="text-[9px] text-[#8e879f]">
                          {file.fileSize || 'Image'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
