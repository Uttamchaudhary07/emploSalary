import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import './index.css'
import App from './App.jsx'

// Handle SPA redirect from 404.html
const redirect = sessionStorage.getItem('spa_redirect');
if (redirect) {
  sessionStorage.removeItem('spa_redirect');
  // Only redirect if we're at the root and have a stored path
  if (window.location.pathname === '/' && redirect !== '/') {
    window.history.replaceState(null, '', redirect);
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
