import { createSlice } from '@reduxjs/toolkit';

const themes = {
  light: {
    id: 'light',
    name: 'Light',
    colors: {
      primary: '#4F46E5',
      secondary: '#6B7280',
      background: '#F3F4F6',
      surface: '#FFFFFF',
      text: '#111827',
      border: '#E5E7EB'
    }
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    colors: {
      primary: '#6366F1',
      secondary: '#9CA3AF',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
      border: '#374151'
    }
  },
  coffee: {
    id: 'coffee',
    name: 'Coffee',
    colors: {
      primary: '#C4A484',
      secondary: '#8B7355',
      background: '#FAF3E0',
      surface: '#FFFFFF',
      text: '#4A3728',
      border: '#D2B48C'
    }
  }
};

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme && themes[savedTheme]) {
    return themes[savedTheme];
  }
  return themes.light;
};

const initialState = {
  currentTheme: getInitialTheme(),
  availableThemes: themes,
  customTheme: null,
  logo: {
    url: '/logo.png',
    width: 'auto',
    height: '32px'
  },
  brandColors: {
    primary: themes.light.colors.primary,
    secondary: themes.light.colors.secondary
  }
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      const theme = themes[action.payload];
      if (theme) {
        state.currentTheme = theme;
        localStorage.setItem('theme', theme.id);
      }
    },
    setCustomTheme: (state, action) => {
      state.customTheme = {
        id: 'custom',
        name: 'Custom',
        colors: {
          ...state.currentTheme.colors,
          ...action.payload
        }
      };
      state.currentTheme = state.customTheme;
    },
    setLogo: (state, action) => {
      state.logo = {
        ...state.logo,
        ...action.payload
      };
    },
    setBrandColors: (state, action) => {
      state.brandColors = {
        ...state.brandColors,
        ...action.payload
      };
      if (state.customTheme) {
        state.customTheme.colors = {
          ...state.customTheme.colors,
          primary: action.payload.primary || state.customTheme.colors.primary,
          secondary: action.payload.secondary || state.customTheme.colors.secondary
        };
      }
    }
  }
});

export const { setTheme, setCustomTheme, setLogo, setBrandColors } = themeSlice.actions;

export default themeSlice.reducer; 