import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useTypography } from 'mdv-typography';

export type CatalogCategoryIcon =
  | 'all'
  | 'cafes'
  | 'bakeries'
  | 'books'
  | 'fitness'
  | 'beauty';

export type CatalogCategory = {
  id: string;
  label: string;
  icon?: CatalogCategoryIcon;
};

export type CatalogCategoryCarouselProps = {
  categories: CatalogCategory[];
  selectedCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
  viewportWidth: number;
  colors?: {
    ink?: string;
    surface?: string;
  };
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function CatalogCategoryCarousel({
  categories,
  selectedCategoryId,
  onCategoryChange,
  viewportWidth,
  colors,
  style,
  contentContainerStyle,
}: CatalogCategoryCarouselProps) {
  const { fonts } = useTypography();
  const ink = colors?.ink ?? '#0B0B0F';
  const surface = colors?.surface ?? '#F4F4F6';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.edgeCarousel, { width: viewportWidth }, style]}
      contentContainerStyle={[styles.categories, contentContainerStyle]}
    >
      {categories.map(category => {
        const active = category.id === selectedCategoryId;
        return (
          <Pressable
            key={category.id}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onCategoryChange(category.id)}
            style={({ pressed }) => [
              styles.category,
              pressed && styles.pressed,
            ]}
          >
            <View
              style={[
                styles.categoryIcon,
                { backgroundColor: active ? ink : surface },
              ]}
            >
              <CategoryIcon
                name={category.icon ?? 'all'}
                color={active ? '#FFFFFF' : ink}
              />
            </View>
            <Text
              style={[
                styles.categoryLabel,
                { color: ink, fontFamily: fonts.semibold },
              ]}
            >
              {category.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function CategoryIcon({
  name,
  color,
}: {
  name: CatalogCategoryIcon;
  color: string;
}) {
  const common = {
    fill: 'none',
    stroke: color,
    strokeWidth: 1.9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      {name === 'all' ? (
        <>
          <Rect x={4} y={4} width={6} height={6} rx={1.5} {...common} />
          <Rect x={14} y={4} width={6} height={6} rx={1.5} {...common} />
          <Rect x={4} y={14} width={6} height={6} rx={1.5} {...common} />
          <Rect x={14} y={14} width={6} height={6} rx={1.5} {...common} />
        </>
      ) : name === 'cafes' ? (
        <>
          <Path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5Z" {...common} />
          <Path d="M16 10h2a2 2 0 0 1 0 4h-2M8 3v3M12 3v3" {...common} />
        </>
      ) : name === 'bakeries' ? (
        <Path d="M4 14a8 6 0 0 1 16 0v4H4Z" {...common} />
      ) : name === 'books' ? (
        <>
          <Path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3Z" {...common} />
          <Path d="M5 17a3 3 0 0 1 3-3h11" {...common} />
        </>
      ) : name === 'fitness' ? (
        <Path d="M6 8v8m12-8v8M3 10v4m18-4v4M6 12h12" {...common} />
      ) : (
        <Path d="m12 3 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" {...common} />
      )}
    </Svg>
  );
}

const styles = StyleSheet.create({
  edgeCarousel: { marginLeft: -24 },
  categories: { gap: 12, paddingHorizontal: 24 },
  category: { width: 64, alignItems: 'center', gap: 8 },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: { fontSize: 12 },
  pressed: { opacity: 0.66 },
});
