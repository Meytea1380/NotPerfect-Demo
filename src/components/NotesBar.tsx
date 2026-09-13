import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Sparkles, X, Check } from 'lucide-react';
import { Note, User, AppLanguage } from '../types';
import { TRANSLATIONS, getLocalizedNote } from '../services/i18n';

interface NotesBarProps {
  notes: Note[];
  currentUser: User;
  onSaveNote: (text: string, emoji: string) => void;
  lang?: AppLanguage;
  onSelectNoteUser?: (user: User) => void;
}

export const NotesBar: React.FC<NotesBarProps> = ({
  notes,
  currentUser,
  onSaveNote,
  lang = 'fa',
  onSelectNoteUser,
}) => {
  const currentLang: AppLanguage = (lang as AppLanguage) || 'fa';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🌸');

  const t = TRANSLATIONS[currentLang];
  const myNote = notes.find(n => n.userId === currentUser.id);
  const emojis = ['🌸', '✨', '🌱', '☕', '🤍', '💪', '🕊️', '🎨'];

  const handleSave = () => {
    if (!noteText.trim()) return;
    onSaveNote(noteText.trim(), selectedEmoji);
    setNoteText('');
    setIsModalOpen(false);
  };

  return (
    <div className="py-2.5 px-3 border-b border-[#252232]/60 bg-[#161421]/60 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-3">
        {/* Current User Note Creator */}
        <motion.div
          whileHover={{ scale: 1.04 }}
          className="flex flex-col items-center flex-shrink-0 relative group"
        >
          <div className="relative mb-1">
            {/* Note Bubble */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                setNoteText(myNote?.text || '');
                setSelectedEmoji(myNote?.moodEmoji || '🌸');
                setIsModalOpen(true);
              }}
              className="absolute -top-3.5 right-0 bg-[#252132] text-[#f2ecfc] border border-[#524866]/60 rounded-full px-2 py-0.5 text-[10px] shadow-lg flex items-center gap-1 z-10 max-w-[85px] truncate hover:border-[#e8a598] transition-all cursor-pointer"
            >
              <span>{myNote?.moodEmoji || '💭'}</span>
              <span className="truncate">
                {myNote ? getLocalizedNote(myNote.id, myNote.text, currentLang) : t.addNotePrompt}
              </span>
            </motion.button>

            {/* Avatar */}
            <div className="w-13 h-13 rounded-full p-[2px] bg-gradient-to-tr from-[#68536b] to-[#c78f82] mt-2">
              <img
                src={
                  currentUser?.avatar ||
                  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
                }
                alt={currentUser?.name || ''}
                className="w-full h-full rounded-full object-cover border border-[#14121d]"
                referrerPolicy="no-referrer"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsModalOpen(true)}
              className="absolute bottom-0 left-0 w-4 h-4 rounded-full bg-[#e8a598] text-[#1a1622] flex items-center justify-center text-xs font-bold border border-[#111018] shadow cursor-pointer transition-transform"
              title={t.yourNote}
            >
              <Plus className="w-2.5 h-2.5 stroke-[3]" />
            </motion.button>
          </div>
          <span className="text-[10px] text-[#a49cb5] font-medium">{t.yourNote}</span>
        </motion.div>

        {/* Other Users' Notes */}
        {notes
          .filter(n => n.userId !== currentUser?.id)
          .map(note => (
            <motion.div
              key={note.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectNoteUser && note.user && onSelectNoteUser(note.user)}
              className={`flex flex-col items-center flex-shrink-0 relative ${
                onSelectNoteUser ? 'cursor-pointer group' : ''
              }`}
            >
              {/* Floating Note Thought Bubble */}
              <div className="relative mb-1">
                <div className="absolute -top-3.5 right-0 bg-[#201d2c] group-hover:bg-[#2c263d] text-[#eae5f5] border border-[#403853] group-hover:border-[#d6a592]/60 rounded-full px-2 py-0.5 text-[10px] shadow-lg flex items-center gap-1 z-10 max-w-[95px] truncate transition-all">
                  <span>{note.moodEmoji}</span>
                  <span className="truncate">
                    {getLocalizedNote(note.id, note.text, currentLang)}
                  </span>
                </div>

                <div className="w-13 h-13 rounded-full p-[2px] bg-[#332e43] group-hover:bg-gradient-to-tr group-hover:from-[#6b4756] group-hover:to-[#d6a592] mt-2 transition-all">
                  <img
                    src={
                      note.user?.avatar ||
                      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={note.user?.name || ''}
                    className="w-full h-full rounded-full object-cover border border-[#14121d]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <span className="text-[10px] text-[#a49cb5] group-hover:text-[#f0ebf8] font-medium max-w-[65px] truncate transition-colors">
                {(note.user?.name || 'کاربر').split(' ')[0]}
              </span>
            </motion.div>
          ))}
      </div>

      {/* Write Note Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-full max-w-xs bg-[#191724] border border-[#3f3851] rounded-3xl p-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#2d283c]">
                <div className="flex items-center gap-1.5 text-xs text-[#d6a592] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.noteModalTitle}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-[#8b849b] hover:text-white rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-[#9a92ab] my-2 leading-relaxed">
                {t.noteExpiryNotice}
              </p>

              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder={t.noteInputPlaceholder}
                maxLength={60}
                rows={2}
                className="w-full bg-[#111019] text-xs text-[#eae6f5] rounded-xl p-2.5 border border-[#373146] focus:border-[#d6a592] outline-none resize-none placeholder:text-[#6a637a]"
              />
              <div className="text-left text-[10px] text-[#787189] mb-2 font-mono">
                {60 - noteText.length}
              </div>

              {/* Emoji picker */}
              <div className="flex items-center justify-between gap-1 mb-4 bg-[#121019] p-1.5 rounded-xl border border-[#2b2638]">
                {emojis.map(e => (
                  <motion.button
                    key={e}
                    type="button"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setSelectedEmoji(e)}
                    className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all cursor-pointer ${
                      selectedEmoji === e
                        ? 'bg-[#3e344e] scale-110 ring-1 ring-[#e8a598]'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {e}
                  </motion.button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!noteText.trim()}
                  className="flex-1 py-2 bg-gradient-to-r from-[#875b6e] to-[#c78f82] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 disabled:opacity-50 cursor-pointer shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{t.saveNoteBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 bg-[#221f2e] text-[#a9a2b9] rounded-xl text-xs hover:text-white cursor-pointer"
                >
                  {t.cancel}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
