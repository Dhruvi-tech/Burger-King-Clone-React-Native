import { colors, darkColors, lightColors } from './colors';

const createTheme = themeColors => ({
  colors: themeColors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999,
  },
  typography: {
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: themeColors.text,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '600',
      color: themeColors.text,
    },
    body: {
      fontSize: 14,
      color: themeColors.textSecondary,
    },
    label: {
      fontSize: 12,
      fontWeight: '500',
      color: themeColors.textSecondary,
    },
  },
  shadows: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },
});

export const lightTheme = createTheme(lightColors);
export const darkTheme = createTheme(darkColors);
export const theme = createTheme(colors);