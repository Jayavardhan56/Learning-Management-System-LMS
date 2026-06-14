import { useState, useEffect } from "react";
import { FaSun, FaMoon, FaDesktop } from "react-icons/fa";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.setAttribute("data-theme", systemTheme);
    } else {
      root.setAttribute("data-theme", theme);
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn-secondary"
      style={{
        padding: '10px',
        borderRadius: '50%',
        width: '42px',
        height: '42px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-card)',
        color: 'var(--primary)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)'
      }}
      title={`Switch to ${theme === "light" ? "Dark" : theme === "dark" ? "System" : "Light"} mode`}
    >
      {theme === "light" && <FaSun />}
      {theme === "dark" && <FaMoon />}
      {theme === "system" && <FaDesktop />}
    </button>
  );
};

export default ThemeToggle;
