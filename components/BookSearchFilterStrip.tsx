import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import {
  SwapLibroNavbarThemeOverride,
  mergeSwapLibroNavbarTheme,
  swapLibroNavbarTypography,
} from '../theme';

export type BookSearchFilter<Key extends string = string> = {
  key: Key;
  label: string;
  accessibilityLabel?: string;
  selected?: boolean;
  hasMenu?: boolean;
};

export type BookSearchFilterStripProps<Key extends string = string> = {
  filters: BookSearchFilter<Key>[];
  visible?: boolean;
  theme?: SwapLibroNavbarThemeOverride;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onFilterPress: (key: Key) => void;
};

export function BookSearchFilterStrip<Key extends string = string>({
  filters,
  visible = true,
  theme: themeOverride,
  style,
  contentContainerStyle,
  onFilterPress,
}: BookSearchFilterStripProps<Key>) {
  const theme = React.useMemo(
    () => mergeSwapLibroNavbarTheme(themeOverride),
    [themeOverride],
  );

  if (!visible || filters.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.strip, { backgroundColor: theme.colors.surface }, style]}
      contentContainerStyle={[styles.scroller, contentContainerStyle]}
    >
      {filters.map(filter => {
        const selected = Boolean(filter.selected);
        return (
          <Pressable
            key={filter.key}
            accessibilityRole="button"
            accessibilityLabel={filter.accessibilityLabel ?? filter.label}
            accessibilityState={{ selected }}
            onPress={() => onFilterPress(filter.key)}
            style={[
              styles.button,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
              selected
                ? {
                    backgroundColor: theme.colors.accent,
                    borderColor: theme.colors.accent,
                  }
                : null,
            ]}
          >
            <Text
              style={[
                styles.text,
                { color: theme.colors.textSecondary },
                selected ? { color: theme.colors.surface } : null,
              ]}
            >
              {filter.label}
            </Text>
            {filter.hasMenu ? (
              <MaterialDesignIcons
                name="chevron-down"
                size={14}
                color={
                  selected ? theme.colors.surface : theme.colors.textSecondary
                }
              />
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export const CatalogSearchFilterStrip = BookSearchFilterStrip;

const styles = StyleSheet.create({
  strip: {
    flexGrow: 0,
    maxHeight: 48,
  },
  scroller: {
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  button: {
    minHeight: 34,
    borderRadius: 20,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
  },
  text: {
    fontFamily: swapLibroNavbarTypography.body,
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '600',
  },
});
