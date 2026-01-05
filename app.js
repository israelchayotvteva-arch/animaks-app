const e = React.createElement;
const { useState, useEffect } = React;

// נתוני יסוד (Initial Data) מתוך הגיבוי
const INITIAL_INSTITUTIONS = [
  { id: 1, name: "בית ספר פולה בן גוריון", location: "ירושלים", clientRate: 170, instructorRate: 90 },
  { id: 2, name: "בית ספר אדי", location: "ירושלים", clientRate: 165, instructorRate: 70 },
  { id: 3, name: "צהרונים בית שמש", location: "בית שמש", clientRate: 180, instructorRate: 60 },
  { id: 4, name: "חברת אריאל", location: "ירושלים", clientRate: 165, instructorRate: 70 },
  { id: 5, name: "מועדוניות עלי שיח", location: "ירושלים", clientRate: 165, instructorRate: 70 }
];

const ANIMALS = ["🐰 ארנבון", "🦎 לטאה", "🐍 נחש", "🐹 אוגר", "🐢 צב", "🦜 תוכי", "🦔 קיפוד", "🐭 עכבר", "🦗 חרקים", "🐓 תרנגולת"];
const EXPENSE_CATEGORIES = ["⛽ דלק", "🅿️ חניה", "📦 ציוד", "🥕 מזון לחיות", "📝 אחר"];

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [reports, setReports] = useState([]);
  const [institutions, setInstitutions] = useState(INITIAL_INSTITUTIONS);
  const [expenses, setExpenses] = useState([]);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'החתם את הגננת על דף נוכחות', assignedTo: 'ישראל סופר', status: 'pending', priority: 'high' }
  ]);

  // טעינה מ-LocalStorage
  useEffect(() => {
    const data = ['reports', 'institutions', 'expenses', 'tasks'];
    data.forEach(key => {
      const saved = localStorage.getItem(`israel_${key}`);
      if (saved) {
        if (key === 'reports') setReports(JSON.parse(saved));
        if (key === 'institutions') setInstitutions(JSON.parse(saved));
        if (key === 'expenses') setExpenses(JSON.parse(saved));
        if (key === 'tasks') setTasks(JSON.parse(saved));
      }
    });
  }, []);

  // שמירה ל-LocalStorage בכל שינוי
  useEffect(() => {
    localStorage.setItem('israel_reports', JSON.stringify(reports));
    localStorage.setItem('israel_institutions', JSON.stringify(institutions));
    localStorage.setItem('israel_expenses', JSON.stringify(expenses));
    localStorage.setItem('israel_tasks', JSON.stringify(tasks));
  }, [reports, institutions, expenses, tasks]);

  const handleLogin = (u, p) => {
    if (p === '1234') {
      if (u === 'admin') setUser({ role: 'admin', name: 'מנהל' });
      else if (u === 'secretary') setUser({ role: 'secretary', name: 'מזכירה' });
      else setUser({ role: 'instructor', name: u });
      setView('home');
    } else alert('סיסמה שגויה');
  };

  // פונקציות עזר לחישובים
  const calculateInstructorSalary = (name) => {
    const userReports = reports.filter(r => r.instructorName === name);
    const base = userReports.reduce((sum, r) => sum + Number(r.pay), 0);
    const bonuses = userReports.reduce((sum, r) => sum + Number(r.bonus || 0), 0);
    const cash = userReports.reduce((sum, r) => sum + Number(r.cash || 0), 0);
    const approvedExp = expenses.filter(e => e.instructorName === name && e.status === 'approved')
                                .reduce((sum, e) => sum + Number(e.amount), 0);
    return (base + bonuses + approvedExp) - cash;
  };

  // --- רכיבי UI ---

  const Layout = ({ children }) => e('div', { className: 'min-h-screen bg-green-50 flex flex-col', dir: 'rtl' },
    e('header', { className: 'bg-green-800 text-white p-4 shadow-lg text-center' },
      e('div', { className: 'text-4xl mb-1' }, '🐨'),
      e('h1', { className: 'text-xl font-bold' }, 'ישראל חיות וטבע'),
      user && e('div', { className: 'text-sm mt-2 flex justify-between items-center bg-green-900 p-2 rounded' },
        e('span', null, `שלום, ${user.name}`),
        e('button', { onClick: () => {setUser(null); setView('login');}, className: 'underline text-xs' }, 'התנתק')
      )
    ),
    e('main', { className: 'flex-grow p-4 max-w-md mx-auto w-full' }, children),
    e('footer', { className: 'p-4 text-center text-gray-400 text-xs' }, '© כל הזכויות שמורות לישראל חיות וטבע')
  );

  if (view === 'login') {
    return Layout({
      children: e('div', { className: 'bg-white p-6 rounded-2xl shadow-xl mt-10' },
        e('h2', { className: 'text-center font-bold mb-6' }, 'כניסת משתמש'),
        e('input', { id: 'u', placeholder: 'שם מלא (למשל: יצי קהאן)', className: 'w-full p-3 border rounded mb-4 text-right' }),
        e('input', { id: 'p', type: 'password', placeholder: 'סיסמה', className: 'w-full p-3 border rounded mb-6 text-right' }),
        e('button', { 
          onClick: () => handleLogin(document.getElementById('u').value, document.getElementById('p').value),
          className: 'w-full bg-green-700 text-white p-3 rounded-xl font-bold' 
        }, 'כניסה למערכת')
      )
    });
  }

  // תפריט מדריך
  const InstructorHome = () => e('div', { className: 'grid grid-cols-2 gap-4' },
    [
      { id: 'report', label: '📅 דיווח חדש', color: 'border-green-600' },
      { id: 'salary', label: '💰 השכר שלי', color: 'border-blue-600' },
      { id: 'tasks', label: '📋 משימות', color: 'border-yellow-600' },
      { id: 'expenses', label: '💳 הוצאות', color: 'border-orange-600' },
      { id: 'library', label: '📚 ספרייה', color: 'border-purple-600' }
    ].map(item => e('button', {
      key: item.id,
      onClick: () => setView(item.id),
      className: `bg-white p-6 rounded-2xl shadow-sm border-b-4 ${item.color} font-bold`
    }, item.label))
  );

  // מסך דיווח
  const ReportForm = () => {
    const [form, setForm] = useState({ instId: '', groups: 1, animal: '', bonus: 0, cash: 0 });
    return e('div', { className: 'bg-white p-4 rounded-xl shadow' },
      e('h2', { className: 'font-bold mb-4' }, 'דיווח פעילות'),
      e('select', { className: 'w-full p-3 border rounded mb-4', onChange: e => setForm({...form, instId: e.target.value}) },
        e('option', null, 'בחר מוסד'),
        institutions.map(i => e('option', { key: i.id, value: i.id }, i.name))
      ),
      e('label', { className: 'block mb-2' }, 'מספר קבוצות:'),
      e('div', { className: 'grid grid-cols-5 gap-2 mb-4' },
        [1,2,3,4,5].map(n => e('button', { 
          onClick: () => setForm({...form, groups: n}),
          className: `p-2 rounded border ${form.groups === n ? 'bg-green-700 text-white' : ''}`
        }, n))
      ),
      e('select', { className: 'w-full p-3 border rounded mb-4', onChange: e => setForm({...form, animal: e.target.value}) },
        e('option', null, 'בחר בעל חיים'),
        ANIMALS.map(a => e('option', { key: a, value: a }, a))
      ),
      e('input', { type: 'number', placeholder: 'בונוס (נסיעות/הצטיינות)', className: 'w-full p-3 border rounded mb-4', onChange: e => setForm({...form, bonus: e.target.value}) }),
      e('input', { type: 'number', placeholder: 'מזומן שנתקבל בשטח', className: 'w-full p-3 border rounded mb-6', onChange: e => setForm({...form, cash: e.target.value}) }),
      e('button', { 
        className: 'w-full bg-green-700 text-white p-4 rounded-xl font-bold',
        onClick: () => {
          const inst = institutions.find(i => i.id == form.instId);
          setReports([...reports, { ...form, instructorName: user.name, date: new Date().toLocaleDateString(), pay: inst.instructorRate * form.groups, instName: inst.name, id: Date.now() }]);
          alert('הדיווח נשלח!'); setView('home');
        }
      }, 'שלח דיווח')
    );
  };

  return Layout({
    children: e('div', null,
      view !== 'home' && e('button', { onClick: () => setView('home'), className: 'mb-4 text-green-800 flex items-center' }, '➡️ חזרה'),
      view === 'home' && (user.role === 'admin' ? e('div', null, 'דשבורד מנהל - סיכום שכר וניהול מוסדות') : InstructorHome()),
      view === 'report' && ReportForm(),
      view === 'salary' && e('div', { className: 'bg-green-700 text-white p-6 rounded-2xl text-center' },
        e('h2', null, 'סה"כ לתשלום'),
        e('div', { className: 'text-4xl font-bold' }, `₪${calculateInstructorSalary(user.name)}`)
      ),
      view === 'library' && e('div', { className: 'space-y-3' },
        ['מערכי שיעור', 'מידע על חיות', 'סרטונים', 'אישורים'].map(f => e('div', { key: f, className: 'p-4 bg-white rounded-lg shadow-sm flex justify-between' }, e('span', null, '📁'), e('span', null, f)))
      )
    )
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));
