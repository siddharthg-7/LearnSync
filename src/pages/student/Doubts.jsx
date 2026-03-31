import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HelpCircle, MessageCircle, CheckCircle, Plus, X, Clock, BookOpen } from 'lucide-react';

const Doubts = () => {
  const { appData, currentUser, addDoubt } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ subject: '', topic: '', question: '' });

  const student = appData.students.find(s => s.id === currentUser?.id) || appData.students[0];
  const myDoubts = appData.doubts.filter(d => d.studentId === student.id);

  const handleSubmit = async () => {
    if (!formData.subject || !formData.topic || !formData.question) return;
    setSubmitting(true);
    try {
      const result = await addDoubt({
        studentId: student.id,
        studentName: student.name,
        mentorId: student.mentorId || null,
        subject: formData.subject,
        topic: formData.topic,
        level: student.level,
        question: formData.question,
        status: 'open',
        replies: [],
        date: new Date().toISOString().split('T')[0],
      });
      if (result.success) {
        setFormData({ subject: '', topic: '', question: '' });
        setShowModal(false);
      } else {
        alert('Failed to submit doubt. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const statusStyles = {
    resolved: { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, iconColor: 'text-emerald-600' },
    open:     { bg: 'bg-amber-50',   border: 'border-amber-200',   badge: 'bg-amber-100 text-amber-700',     icon: Clock,        iconColor: 'text-amber-600'   },
  };

  const subjectColors = ['bg-blue-100 text-blue-700','bg-emerald-100 text-emerald-700','bg-amber-100 text-amber-700','bg-rose-100 text-rose-700'];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">My Doubts</h1>
          <p className="text-slate-500 text-sm mt-1">Ask questions and get help from your mentor</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
          <Plus className="w-4 h-4" /> Raise Doubt
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total',    value: myDoubts.length, color: 'text-slate-900', bg: 'bg-white' },
          { label: 'Open',     value: myDoubts.filter(d => d.status !== 'resolved').length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Resolved', value: myDoubts.filter(d => d.status === 'resolved').length,  color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border border-slate-200 rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Doubt list */}
      {myDoubts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-700 text-lg">No doubts yet</h3>
          <p className="text-slate-400 text-sm mt-1 mb-5">Have a question? Raise your first doubt!</p>
          <button onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
            Ask a Question
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {myDoubts.map((doubt) => {
            const s = statusStyles[doubt.status] || statusStyles.open;
            const StatusIcon = s.icon;
            return (
              <div key={doubt.id} className={`${s.bg} border ${s.border} rounded-2xl p-5`}>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center border ${s.border} flex-shrink-0`}>
                      <StatusIcon className={`w-5 h-5 ${s.iconColor}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{doubt.subject}</span>
                        <span className="text-slate-400 text-xs">·</span>
                        <span className="text-slate-600 text-sm">{doubt.topic}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{doubt.date}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${s.badge}`}>
                    {doubt.status === 'resolved' ? 'Resolved' : 'Open'}
                  </span>
                </div>

                {/* Question */}
                <p className="text-sm text-slate-700 leading-relaxed bg-white/60 rounded-xl p-3 border border-slate-200/60">
                  {doubt.question}
                </p>

                {/* Replies */}
                {doubt.replies?.length > 0 && (
                  <div className="mt-4 space-y-3 pt-3 border-t border-slate-200/60">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Mentor Replies</p>
                    {doubt.replies.map((reply, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {reply.mentorName?.[0] || 'M'}
                        </div>
                        <div className="flex-1 bg-white rounded-xl p-3 border border-slate-200">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-slate-900">{reply.mentorName}</p>
                            <p className="text-xs text-slate-400">{reply.date}</p>
                          </div>
                          <p className="text-sm text-slate-700">{reply.reply}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg fade-in max-h-[92vh] flex flex-col">

            {/* Drag handle — mobile only */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
              <div className="w-10 h-1 bg-slate-300 rounded-full" />
            </div>

            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Raise a Doubt</h3>
                  <p className="text-xs text-slate-500">Your mentor will reply soon</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Modal body — scrollable */}
            <div className="px-5 py-4 space-y-4 overflow-y-auto flex-1">
              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full pl-9 pr-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors appearance-none bg-white text-slate-800"
                  >
                    <option value="">Select a subject…</option>
                    {(student.subjects || []).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Topic</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={e => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g., Integration by Parts"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Question */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Question</label>
                <textarea
                  rows={4}
                  value={formData.question}
                  onChange={e => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Describe your doubt in detail. The more specific you are, the better the answer!"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-5 py-4 border-t border-slate-100 flex gap-3 flex-shrink-0 pb-safe">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 border-2 border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !formData.subject || !formData.topic || !formData.question}
                className="flex-1 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700
                  disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {submitting
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</>
                  : 'Submit Doubt'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doubts;
