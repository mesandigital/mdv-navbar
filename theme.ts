import { swapLibroSemanticFonts } from 'mdv-typography';

export type SwapLibroNavbarTheme = {
  fontFamily?: string;
  colors: {
    accent: string;
    highlight: string;
    border: string;
    inputBackground: string;
    surface: string;
    surfaceMuted: string;
    surfaceSelected: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    success: string;
  };
};

export type SwapLibroNavbarThemeOverride = {
  fontFamily?: string;
  colors?: Partial<SwapLibroNavbarTheme['colors']>;
};

export const swapLibroNavbarTypography = {
  display: swapLibroSemanticFonts.heading,
  body: swapLibroSemanticFonts.body,
  bodyMedium: swapLibroSemanticFonts.bodyMedium,
  bodySemibold: swapLibroSemanticFonts.bodySemibold,
  catalog: 'IBMPlexMono-SemiBold',
} as const;

export const swapLibroNavbarTheme: SwapLibroNavbarTheme = {
  colors: {
    accent: '#16302B',
    highlight: '#B5863A',
    border: '#E2D8C3',
    inputBackground: '#FFFFFF',
    surface: '#FAF6EE',
    surfaceMuted: '#F1E9D8',
    surfaceSelected: '#E4D3AC',
    textPrimary: '#221E19',
    textSecondary: '#7A7166',
    textMuted: '#A79D8D',
    success: '#0F766E',
  },
};

export const swapLibroTypography = swapLibroNavbarTypography;

export const catalogTheme = {
  colors: {
    background: swapLibroNavbarTheme.colors.surface,
    surface: swapLibroNavbarTheme.colors.inputBackground,
    border: swapLibroNavbarTheme.colors.border,
    textPrimary: swapLibroNavbarTheme.colors.textPrimary,
    textSecondary: swapLibroNavbarTheme.colors.textSecondary,
    textMuted: swapLibroNavbarTheme.colors.textMuted,
    textInverse: swapLibroNavbarTheme.colors.surface,
    accent: swapLibroNavbarTheme.colors.accent,
    inputBackground: swapLibroNavbarTheme.colors.inputBackground,
  },
} as const;

export function mergeSwapLibroNavbarTheme(
  theme?: SwapLibroNavbarThemeOverride,
): SwapLibroNavbarTheme {
  return {
    fontFamily: theme?.fontFamily,
    colors: {
      ...swapLibroNavbarTheme.colors,
      ...(theme?.colors ?? {}),
    },
  };
}
