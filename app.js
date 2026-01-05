const e = React.createElement;
const { useState } = React;

function App() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    if (user === 'admin' && pass === '1234') {
      setLoggedIn(true);
    } else {
      alert('שם משתמש או סיסמה שגויים');
    }
  };

  if (!loggedIn) {
    return e('div', { 
      style: { 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, #f0fdf4, #dcfce7)',
        fontFamily: 'sans-serif',
        direction: 'rtl'
      }
    },
      e('div', { 
        style: { 
          background: 'white', 
          padding: '40px', 
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '100%'
        }
      },
        e('div', { style: { textAlign: 'center', marginBottom: '30px' } },
          e('div', { style: { fontSize: '64px', marginBottom: '10px' } }, '🐨'),
          e('h1', { style: { fontSize: '28px', color: '#15803d', marginBottom: '10px' } }, 'ישראל חיות וטבע'),
          e('p', { style: { color: '#166534' } }, 'מערכת ניהול')
        ),
        e('div', { style: { marginBottom: '20px' } },
          e('label', { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#374151' } }, 'שם משתמש'),
          e('input', {
            type: 'text',
            value: user,
            onChange: (ev) => setUser(ev.target.value),
            style: { width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }
          })
        ),
        e('div', { style: { marginBottom: '20px' } },
          e('label', { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#374151' } }, 'סיסמה'),
          e('input', {
            type: 'password',
            value: pass,
            onChange: (ev) => setPass(ev.target.value),
            onKeyPress: (ev) => ev.key === 'Enter' && handleLogin(),
            style: { width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }
          })
        ),
        e('button', {
          onClick: handleLogin,
          style: { width: '100%', padding: '16px', background: '#15803d', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }
        }, 'כניסה'),
        e('div', { style: { marginTop: '20px', padding: '16px', background: '#dbeafe', borderRadius: '8px', fontSize: '14px' } },
          e('p', { style: { fontWeight: 'bold', marginBottom: '8px' } }, '💡 נסה:'),
          e('p', null, 'admin / 1234')
        )
      )
    );
  }

  return e('div', { style: { minHeight: '100vh', background: '#f0fdf4', padding: '20px', direction: 'rtl' } },
    e('div', { style: { textAlign: 'center', paddingTop: '100px' } },
      e('h1', { style: { fontSize: '48px', color: '#15803d' } }, '🎉'),
      e('h2', { style: { fontSize: '32px', color: '#15803d', marginTop: '20px' } }, 'התחברת בהצלחה!'),
      e('p', { style: { fontSize: '18px', color: '#166534', marginTop: '20px' } }, 'ברוך הבא למערכת'),
      e('button', {
        onClick: () => setLoggedIn(false),
        style: { marginTop: '30px', padding: '12px 24px', background: '#15803d', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }
      }, 'התנתק')
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(e(App));
