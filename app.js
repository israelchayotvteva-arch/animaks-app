const e = React.createElement;
const { useState, useEffect } = React;

// נתוני יסוד מובנים - כדי שהאפליקציה לא תהיה ריקה
const INITIAL_DATA = {
  instructors: [
    { id: 1, name: "יצי קהאן", password: "1234" },
    { id: 2, name: "יונתן כהן", password: "1234" },
    { id: 3, name: "שלמה אליאך", password: "1234" },
    { id: 4, name: "ישראל סופר", password: "1234" }
  ],
  institutions: [
    { id: 1, name: "בית ספר פולה בן גוריון", location: "ירושלים", clientRate: 170, instructorRate: 90 },
    { id: 2, name: "בית ספר אדי", location: "ירושלים", clientRate: 165, instructorRate: 70 },
    { id: 3, name: "צהרונים בית שמש", location: "בית שמש", clientRate: 180, instructorRate: 60 },
    { id: 4, name: "חברת אריאל", location: "ירושלים", clientRate: 165, instructorRate: 70 },
    { id: 5, name: "מועדוניות עלי שיח", location: "ירושלים", clientRate: 165, instructorRate: 70 }
  ],
  animals: ["🐰 ארנבון", "🦎 לטאה", "🐍 נחש", "🐹 אוגר", "🐢 צב", "🦜 תוכי", "🦔 קיפוד", "🐭 עכבר", "🦗 חרקים", "🐓 תרנגולת"],
  categories: ["⛽ דלק", "🅿️ חניה", "📦 ציוד", "🥕 מזון לחיות", "📝 אחר"]
};

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [reports, setReports] = useState([]);
  const [institutions, setInstitutions] = useState(INITIAL_DATA.institutions);
  const [expenses, setExpenses] = useState([]);
  const [tasks, setTasks] = useState([]);

  // טעינה ושמירה אוטומטית
  useEffect(() => {
    const saved = localStorage.getItem('israel_app_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      setReports(parsed.reports || []);
      setInstitutions(parsed.institutions || INITIAL_DATA.institutions);
      setExpenses(parsed.expenses || []);
      setTasks(parsed.tasks || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('israel_app_data', JSON.stringify({ reports, institutions, expenses, tasks }));
  }, [reports, institutions, expenses, tasks]);

  const handleLogin = (u, p) => {
    if (p === '1234') {
      if (u === 'admin') setUser({ role: 'admin', name: 'מנהל' });
      else {
        const inst = INITIAL_DATA.instructors.find(i => i.name === u);
        setUser({ role: 'instructor', name: u || 'מדריך' });
      }
      setView('home');
    } else alert('סיסמה שגויה');
  };

  // --- רכיבי עיצוב ---
  const Card = ({ title, children, icon }) => e('div', { className: 'bg-white p-4 rounded-2xl shadow-sm mb-4 border border-green-100' },
    e('div', { className: 'flex justify-between items-center mb-3 border-b pb-2' },
      e('span', { className: 'text-xl' }, icon),
      e('h3', { className: 'font-bold text-green-800' }, title)
    ),
    children
  );

  // --- מסכי המנהל ---
  const AdminSettings = () => e('div', { className: 'space-y-4' },
    e('h2', { className: 'text-xl font-bold mb-4 flex items-center gap-2' }, '⚙️ הגדרות מערכת'),
    e(Card, { title: 'ניהול מוסדות ותעריפים', icon: '🏢' },
      institutions.map(inst => e('div', { key: inst.id, className: 'flex justify-between p-2 border-b text-sm' },
        e('span', { className: 'font-bold' }, `₪${inst.instructorRate}`),
        e('span', null, inst.name)
      )),
      e('button', { className: 'w-full mt-3 p-2 bg-green-600 text-white rounded-lg text-sm' }, '+ הוסף מוסד')
    ),
    e(Card, { title: 'רשימת מדריכים פעילים', icon: '👥' },
      INITIAL_DATA.instructors.map(i => e('div', { key: i.id, className: 'p-2 border-b text-right' }, i.name))
    )
  );

  const AdminDashboard = () => e('div', null,
    e('div', { className: 'grid grid-cols-2 gap-4 mb-6' },
      e('div', { className: 'bg-green-700 text-white p-4 rounded-2xl text-center' },
        e('div', { className: 'text-xs opacity-80' }, 'דיווחים החודש'),
        e('div', { className: 'text-2xl font-bold' }, reports.length)
      ),
      e('div', { className: 'bg-blue-700 text-white p-4 rounded-2xl text-center' },
        e('div', { className: 'text-xs opacity-80' }, 'הוצאות לאישור'),
        e('div', { className: 'text-2xl font-bold' }, expenses.filter(ex => ex.status === 'pending').length)
      )
    ),
    e(Card, { title: 'סיכום שכר מהיר', icon: '💰' },
      INITIAL_DATA.instructors.map(ins => {
        const total = reports.filter(r => r.instructorName === ins.name).reduce((sum, r) => sum + r.pay, 0);
        return e('div', { key: ins.id, className: 'flex justify-between py-2 border-b' },
          e('span', { className: 'font-bold text-green-700' }, `₪${total}`),
          e('span', null, ins.name)
        );
      })
    )
  );

  // --- גוף האפליקציה ---
  return e('div', { className: 'min-h-screen bg-green-50 font-sans pb-10', dir: 'rtl' },
    // Header
    e('header', { className: 'bg-green-800 text-white p-4 shadow-lg flex justify-between items-center sticky top-0 z-50' },
      user && user.role === 'admin' ? 
        e('button', { onClick: () => setView(view === 'settings' ? 'home' : 'settings'), className: 'p-2 hover:bg-green-700 rounded-full transition' }, '⚙️') : 
        e('div', { className: 'w-8' }),
      e('div', { className: 'text-center' },
        e('span', { className: 'block text-xs opacity-75' }, 'ישראל חיות וטבע'),
        e('span', { className: 'font-bold' }, 'ניהול תפעולי')
      ),
      e('div', { className: 'text-xl' }, '🐨')
    ),

    view === 'login' ? 
      e('div', { className: 'p-6 max-w-md mx-auto mt-20 bg-white rounded-3xl shadow-xl' },
        e('h2', { className: 'text-center font-bold text-xl mb-6' }, 'כניסה למערכת'),
        e('input', { id: 'u', placeholder: 'שם משתמש', className: 'w-full p-4 border rounded-2xl mb-4 text-right' }),
        e('input', { id: 'p', type: 'password', placeholder: 'סיסמה', className: 'w-full p-4 border rounded-2xl mb-6 text-right' }),
        e('button', { 
          onClick: () => handleLogin(document.getElementById('u').value, document.getElementById('p').value),
          className: 'w-full bg-green-700 text-white p-4 rounded-2xl font-bold' 
        }, 'כניסה')
      ) :
      e('div', { className: 'max-w-md mx-auto p-4' },
        view === 'settings' ? AdminSettings() : 
        user.role === 'admin' ? AdminDashboard() : 
        // תצוגת מדריך
        e('div', { className: 'space-y-4' },
          e('button', { onClick: () => setView('report'), className: 'w-full bg-white p-6 rounded-2xl shadow-sm border-r-8 border-green-600 flex justify-between items-center' },
            e('span', { className: 'text-2xl' }, '📝'),
            e('span', { className: 'font-bold text-lg' }, 'דיווח פעילות חדש')
          ),
          e('button', { className: 'w-full bg-white p-6 rounded-2xl shadow-sm border-r-8 border-blue-600 flex justify-between items-center' },
            e('span', { className: 'text-2xl' }, '💰'),
            e('span', { className: 'font-bold text-lg' }, 'צפייה בדו"ח שכר')
          ),
          e(Card, { title: 'משימות פתוחות', icon: '📋' },
            tasks.length === 0 ? e('p', { className: 'text-gray-400 text-center py-4' }, 'אין משימות כרגע') : null
          )
        )
      ),

    // Bottom Navigation (למדריך)
    user && user.role !== 'admin' && e('div', { className: 'fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 shadow-2xl' },
      e('button', { onClick: () => setView('home'), className: 'flex flex-col items-center text-green-800' }, e('span', null, '🏠'), e('span', { className: 'text-xs' }, 'בית')),
      e('button', { className: 'flex flex-col items-center text-gray-400' }, e('span', null, '📚'), e('span', { className: 'text-xs' }, 'ספריה')),
      e('button', { className: 'flex flex-col items-center text-gray-400' }, e('span', null, '💳'), e('span', { className: 'text-xs' }, 'הוצאות'))
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));
