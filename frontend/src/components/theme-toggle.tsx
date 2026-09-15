import { Moon, Sun } from 'lucide-react';
import { useEffect, useState, type ReactElement } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { t } from '@/lib/i18n.ts';

const KEY = 'imobiliario.theme';

function readTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem(KEY);
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyTheme(theme: 'light' | 'dark'): void {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  const color = theme === 'dark' ? '#0f172a' : '#f8fafc';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
}

export function ThemeToggle(): ReactElement {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof window === 'undefined' ? 'light' : readTheme(),
  );

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={next === 'dark' ? t('themeDark') : t('themeLight')}
      onClick={() => setTheme(next)}
    >
      {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
