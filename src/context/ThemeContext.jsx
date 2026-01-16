import React, { createContext, useContext, useState, useEffect } from 'react';

const themes = {
    light: {
        name: 'Light',
        bg: 'bg-gradient-to-br from-gray-50 to-blue-50',
        sidebar: 'bg-white/95 backdrop-blur-sm',
        card: 'bg-white shadow-sm',
        text: 'text-gray-900',
        textMuted: 'text-gray-600',
        accent: 'bg-blue-600',
        accentHover: 'hover:bg-blue-700',
        border: 'border-gray-200',
        green: 'text-green-600',
        red: 'text-red-600',
        shadow: 'shadow-lg'
    },
    dark: {
        name: 'Dark',
        bg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
        sidebar: 'bg-slate-900/40 backdrop-blur-xl',
        card: 'bg-slate-800/50 backdrop-blur-sm',
        text: 'text-white',
        textMuted: 'text-slate-300',
        accent: 'bg-blue-600',
        accentHover: 'hover:bg-blue-700',
        border: 'border-slate-700/50',
        green: 'text-green-400',
        red: 'text-red-400',
        shadow: 'shadow-2xl shadow-black/50'
    },
    neon: {
        name: 'Neon',
        bg: 'bg-gradient-to-br from-black via-purple-950 to-black',
        sidebar: 'bg-black/30 backdrop-blur-xl border-l border-cyan-500/20',
        card: 'bg-slate-900/40 backdrop-blur-sm border border-cyan-500/20',
        text: 'text-cyan-50',
        textMuted: 'text-cyan-200',
        accent: 'bg-gradient-to-r from-cyan-500 to-purple-600',
        accentHover: 'hover:from-cyan-400 hover:to-purple-500',
        border: 'border-cyan-500/30',
        green: 'text-green-400',
        red: 'text-rose-400',
        shadow: 'shadow-2xl shadow-cyan-500/20',
        glow: 'shadow-lg shadow-cyan-500/50'
    },
    matrix: {
        name: 'Matrix',
        bg: 'bg-gradient-to-br from-black via-emerald-950 to-black',
        sidebar: 'bg-black/40 backdrop-blur-xl border-l border-emerald-500/20',
        card: 'bg-slate-900/30 backdrop-blur-sm border border-emerald-500/20',
        text: 'text-emerald-50',
        textMuted: 'text-emerald-200',
        accent: 'bg-gradient-to-r from-emerald-500 to-green-600',
        accentHover: 'hover:from-emerald-400 hover:to-green-500',
        border: 'border-emerald-500/30',
        green: 'text-green-400',
        red: 'text-red-400',
        shadow: 'shadow-2xl shadow-emerald-500/20',
        glow: 'shadow-lg shadow-emerald-500/50'
    }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState('matrix'); // Default to matrix as per user request

    const theme = themes[currentTheme];

    return (
        <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, theme, themes }}>
            <div className={`${theme.bg} min-h-screen transition-all duration-300`}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
