import React, { useState } from 'react';
import { DBService } from '../services/dbService';
import { BookMarked, Bookmark as BookmarkIcon, RotateCcw, CheckCircle2, Clock, Calendar, BookOpen, Sparkles } from 'lucide-react';

interface RevisionViewProps {
  onPracticeItem: (question: any) => void;
}

export const RevisionView: React.FC<RevisionViewProps> = ({ onPracticeItem }) => {
  const [activeTab, setActiveTab] = useState<'revision' | 'bookmarks'>('revision');
  
  const [revisionItems, setRevisionItems] = useState(DBService.getRevisionItems());
  const [bookmarks, setBookmarks] = useState(DBService.getBookmarks());

  const handleResolveRevision = (id: string) => {
    DBService.markRevisionResolved(id);
    setRevisionItems(DBService.getRevisionItems());
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <BookMarked className="w-3.5 h-3.5 text-purple-400" /> Memory Retention System
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Revision & Bookmarks Hub</h1>
        <p className="text-slate-400 text-sm mt-1">
          Review past mistakes using spaced repetition intervals (1-day, 3-day, 7-day) and study your bookmarked notes.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/60 rounded-xl px-4 p-1 max-w-md">
        <button
          onClick={() => setActiveTab('revision')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition ${
            activeTab === 'revision'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          My Revision Queue ({revisionItems.filter((r) => !r.is_resolved).length})
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition ${
            activeTab === 'bookmarks'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          My Bookmarks ({bookmarks.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'revision' ? (
        <div className="space-y-4">
          {revisionItems.filter((r) => !r.is_resolved).length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">All Caught Up!</h3>
              <p className="text-xs text-slate-400 mt-1">
                You have resolved all questions in your revision schedule. High accuracy keeps your revision queue clean!
              </p>
            </div>
          ) : (
            revisionItems
              .filter((r) => !r.is_resolved)
              .map((rev) => {
                const q = rev.question;
                if (!q) return null;
                const isAiGen = 'is_ai_generated' in q ? q.is_ai_generated : false;

                return (
                  <div
                    key={rev.id}
                    className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4 hover:border-purple-500/40 transition"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {rev.wrong_count} Failed Attempts
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Stage {rev.revision_stage} (1-3-7 Schedule)
                        </span>
                        {isAiGen ? (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300">AI Generated</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300">Previous Year</span>
                        )}
                      </div>

                      <button
                        onClick={() => handleResolveRevision(rev.id)}
                        className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
                      </button>
                    </div>

                    <p className="text-sm font-medium text-slate-100 whitespace-pre-line">{q.question_text}</p>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-1">
                      <p><strong className="text-emerald-400">Correct Answer:</strong> {q.correct_answer}</p>
                      <p><strong className="text-indigo-400">Solution:</strong> {q.explanation}</p>
                      {q.shortcut && <p><strong className="text-amber-400">Shortcut:</strong> {q.shortcut}</p>}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => onPracticeItem(q)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow"
                      >
                        Practice This Question Again
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      ) : (
        /* Bookmarks Tab */
        <div className="space-y-4">
          {bookmarks.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
              <BookmarkIcon className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No Saved Bookmarks</h3>
              <p className="text-xs text-slate-400 mt-1">
                Click the Bookmark icon on any question during practice to save important questions and custom notes.
              </p>
            </div>
          ) : (
            bookmarks.map((bm) => {
              const q = bm.question;
              if (!q) return null;
              return (
                <div
                  key={bm.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4 hover:border-amber-500/40 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <BookmarkIcon className="w-3 h-3 text-amber-400" /> Bookmarked Question
                    </span>
                    <span className="text-xs text-slate-400">{new Date(bm.created_at).toLocaleDateString()}</span>
                  </div>

                  <p className="text-sm font-medium text-slate-100 whitespace-pre-line">{q.question_text}</p>

                  {bm.user_notes && (
                    <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-200">
                      📝 <strong>Your Notes:</strong> {bm.user_notes}
                    </div>
                  )}

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-1">
                    <p><strong className="text-emerald-400">Correct Answer:</strong> {q.correct_answer}</p>
                    <p><strong className="text-indigo-400">Solution:</strong> {q.explanation}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
