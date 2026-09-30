import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import {
  SwapLibroNavbarTheme,
  SwapLibroNavbarThemeOverride,
  mergeSwapLibroNavbarTheme,
  swapLibroNavbarTypography,
} from '../theme';

export type BookListingsLayout = 'list' | 'grid';

export type BookListingsNavbarProps = {
  categories: string[];
  layout?: BookListingsLayout;
  selectedCategory?: string | null;
  searchLabel?: string | null;
  brandLabel?: string;
  maxVisibleCategories?: number;
  theme?: SwapLibroNavbarThemeOverride;
  onSearchPress: () => void;
  onCreatePress?: () => void;
  onLayoutChange?: (layout: BookListingsLayout) => void;
  onCategoryPress: (category: string | null) => void;
};

export type BookListingsSearchBarProps = {
  label?: string | null;
  placeholder?: string;
  value?: string;
  autoFocus?: boolean;
  input?: boolean;
  theme?: SwapLibroNavbarThemeOverride;
  onPress?: () => void;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  style?: StyleProp<ViewStyle>;
};

export type BookListingsBrandBarProps = Pick<
  BookListingsNavbarProps,
  | 'brandLabel'
  | 'layout'
  | 'onSearchPress'
  | 'onCreatePress'
  | 'onLayoutChange'
  | 'theme'
>;

export type BookListingsCategoryTabsProps = Pick<
  BookListingsNavbarProps,
  | 'categories'
  | 'selectedCategory'
  | 'onCategoryPress'
  | 'maxVisibleCategories'
  | 'theme'
>;

function useTheme(theme?: SwapLibroNavbarThemeOverride) {
  return React.useMemo(() => mergeSwapLibroNavbarTheme(theme), [theme]);
}

function SearchIcon({ theme }: { theme: SwapLibroNavbarTheme }) {
  return (
    <MaterialDesignIcons
      name="magnify"
      color={theme.colors.accent}
      size={21}
      style={styles.searchIcon}
    />
  );
}

export function BookListingsSearchBar({
  label,
  placeholder = 'Search by title, author or ISBN',
  value,
  autoFocus,
  input,
  theme: themeOverride,
  onPress,
  onChangeText,
  onSubmitEditing,
  style,
}: BookListingsSearchBarProps) {
  const theme = useTheme(themeOverride);
  const Container = onPress && !input ? Pressable : View;

  return (
    <Container
      accessibilityRole={onPress && !input ? 'button' : undefined}
      accessibilityLabel={placeholder}
      onPress={onPress}
      style={[
        styles.searchBar,
        {
          backgroundColor: theme.colors.inputBackground,
          borderColor: theme.colors.border,
        },
        style,
      ]}
    >
      <SearchIcon theme={theme} />
      {input ? (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          autoFocus={autoFocus}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          returnKeyType="search"
          onSubmitEditing={onSubmitEditing}
          style={[styles.searchInput, { color: theme.colors.textPrimary }]}
        />
      ) : (
        <Text
          style={[
            styles.searchText,
            {
              color: label ? theme.colors.textPrimary : theme.colors.textMuted,
            },
          ]}
          numberOfLines={1}
        >
          {label || placeholder}
        </Text>
      )}
    </Container>
  );
}

export function BookListingsNavbar({
  categories,
  layout = 'list',
  selectedCategory,
  searchLabel: _searchLabel,
  brandLabel,
  maxVisibleCategories,
  theme,
  onSearchPress,
  onCreatePress,
  onLayoutChange,
  onCategoryPress,
}: BookListingsNavbarProps) {
  const resolvedTheme = useTheme(theme);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: resolvedTheme.colors.surface,
          borderBottomColor: resolvedTheme.colors.border,
        },
      ]}
    >
      <BookListingsBrandBar
        brandLabel={brandLabel}
        layout={layout}
        theme={resolvedTheme}
        onCreatePress={onCreatePress}
        onLayoutChange={onLayoutChange}
        onSearchPress={onSearchPress}
      />
      <BookListingsCategoryTabs
        categories={categories}
        maxVisibleCategories={maxVisibleCategories}
        selectedCategory={selectedCategory}
        theme={resolvedTheme}
        onCategoryPress={onCategoryPress}
      />
    </View>
  );
}

export function BookListingsBrandBar({
  brandLabel = 'SwapLibro',
  layout = 'list',
  theme: themeOverride,
  onSearchPress,
  onCreatePress,
  onLayoutChange,
}: BookListingsBrandBarProps) {
  const theme = useTheme(themeOverride);

  return (
    <View style={styles.brandRow}>
      <Text
        style={[styles.brandText, { color: theme.colors.textPrimary }]}
        numberOfLines={1}
      >
        {brandLabel}
      </Text>

      <View style={styles.actionRow}>
        {onLayoutChange ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              layout === 'grid' ? 'Show list layout' : 'Show grid layout'
            }
            onPress={() => onLayoutChange(layout === 'grid' ? 'list' : 'grid')}
            hitSlop={10}
            style={styles.iconButton}
          >
            <MaterialDesignIcons
              name={
                layout === 'grid' ? 'view-list-outline' : 'view-grid-outline'
              }
              color={theme.colors.accent}
              size={24}
            />
          </Pressable>
        ) : null}
        {onCreatePress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="List a book"
            onPress={onCreatePress}
            hitSlop={10}
            style={styles.iconButton}
          >
            <MaterialDesignIcons
              name="plus"
              color={theme.colors.accent}
              size={29}
            />
          </Pressable>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Search books"
          onPress={onSearchPress}
          hitSlop={10}
          style={styles.iconButton}
        >
          <MaterialDesignIcons
            name="magnify"
            color={theme.colors.accent}
            size={24}
          />
        </Pressable>
      </View>
    </View>
  );
}

export function BookListingsCategoryTabs({
  categories,
  selectedCategory,
  maxVisibleCategories = 8,
  theme: themeOverride,
  onCategoryPress,
}: BookListingsCategoryTabsProps) {
  const theme = useTheme(themeOverride);
  const visibleCategories = categories.slice(0, maxVisibleCategories);

  return (
    <View
      style={[styles.categoryHeader, { backgroundColor: theme.colors.surface }]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroller}
      >
        <CategoryPill
          label="All"
          selected={!selectedCategory}
          theme={theme}
          onPress={() => onCategoryPress(null)}
        />
        {visibleCategories.map(category => (
          <CategoryPill
            key={category}
            label={category}
            selected={selectedCategory === category}
            theme={theme}
            onPress={() => onCategoryPress(category)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export type StickyBookListingsFilterViewProps = BookListingsCategoryTabsProps &
  Partial<BookListingsBrandBarProps> & {
    showBrandBar?: boolean;
  };

export function StickyBookListingsFilterView({
  showBrandBar = true,
  brandLabel,
  layout,
  onSearchPress,
  onCreatePress,
  onLayoutChange,
  categories,
  selectedCategory,
  maxVisibleCategories,
  theme,
  onCategoryPress,
}: StickyBookListingsFilterViewProps) {
  const resolvedTheme = useTheme(theme);

  return (
    <View style={{ backgroundColor: resolvedTheme.colors.surface }}>
      {showBrandBar && onSearchPress ? (
        <BookListingsBrandBar
          brandLabel={brandLabel}
          layout={layout}
          theme={resolvedTheme}
          onSearchPress={onSearchPress}
          onCreatePress={onCreatePress}
          onLayoutChange={onLayoutChange}
        />
      ) : null}
      <BookListingsCategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        maxVisibleCategories={maxVisibleCategories}
        theme={resolvedTheme}
        onCategoryPress={onCategoryPress}
      />
    </View>
  );
}

export const BookListingsStickyNavbar = StickyBookListingsFilterView;
export const StickyBookListingsHeader = StickyBookListingsFilterView;

function CategoryPill({
  label,
  selected,
  theme,
  onPress,
}: {
  label: string;
  selected: boolean;
  theme: SwapLibroNavbarTheme;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.categoryTab,
        {
          backgroundColor: selected
            ? theme.colors.accent
            : theme.colors.surface,
          borderColor: selected ? theme.colors.accent : theme.colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.categoryTabText,
          {
            color: selected ? theme.colors.surface : theme.colors.textSecondary,
          },
          selected ? styles.categoryTabTextSelected : null,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    borderBottomWidth: 1,
  },
  brandRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  brandText: {
    minWidth: 0,
    flex: 1,
    flexShrink: 1,
    fontFamily: swapLibroNavbarTypography.display,
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '600',
    letterSpacing: -0.9,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2D8C3',
  },
  searchBar: {
    minHeight: 48,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
  },
  searchText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '500',
  },
  searchInput: {
    flex: 1,
    minHeight: 44,
    paddingVertical: 0,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '500',
  },
  searchIcon: {
    marginRight: 1,
  },
  categoryScroller: {
    gap: 8,
    paddingHorizontal: 16,
    paddingRight: 18,
    paddingBottom: 10,
  },
  categoryHeader: {
    paddingTop: 10,
  },
  categoryTab: {
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 13,
    borderRadius: 17,
    borderWidth: 1,
  },
  categoryTabText: {
    fontFamily: swapLibroNavbarTypography.body,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  categoryTabTextSelected: {
    fontWeight: '600',
  },
});
