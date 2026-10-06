import React from 'react';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
  ViewStyle,
} from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import {
  SwapLibroNavbarTheme,
  SwapLibroNavbarThemeOverride,
  mergeSwapLibroNavbarTheme,
  swapLibroTypography,
} from '../theme';

export type CatalogMarketplaceTitleOption = {
  key: string;
  label: string;
  badgeCount?: number;
};

export type CatalogMarketplaceCategory = {
  key: string;
  label: string;
  badgeCount?: number;
  children?: CatalogMarketplaceCategory[];
};

export type CatalogMarketplaceNavbarProps = {
  categories: string[];
  categoryItems?: CatalogMarketplaceCategory[];
  categoryBadgeCounts?: Record<string, number>;
  maxVisibleCategories?: number;
  categoryVariant?: 'pills' | 'segments';
  segmentSizing?: 'fill' | 'content';
  includeAllCategory?: boolean;
  allCategoryLabel?: string;
  categoryBackAccessibilityLabel?: string;
  brandLabel?: string;
  brandSubtitle?: string;
  showBrandBar?: boolean;
  titleOptions?: CatalogMarketplaceTitleOption[];
  selectedTitleOption?: string;
  titleAccessory?: React.ReactNode;
  searchAccessory?: React.ReactNode;
  layout?: 'list' | 'grid';
  selectedCategory?: string | null;
  focusedCategoryKey?: string | null;
  searchLabel?: string | null;
  searchPlaceholder?: string;
  searchInput?: boolean;
  showSearch?: boolean;
  searchValue?: string;
  createAccessibilityLabel?: string;
  activeFilterCount?: number;
  theme?: SwapLibroNavbarThemeOverride;
  onSearchPress?: () => void;
  onSearchChangeText?: (text: string) => void;
  onFilterPress?: () => void;
  onCreatePress?: () => void;
  onLayoutChange?: (layout: 'list' | 'grid') => void;
  onTitleOptionPress?: (key: string) => void;
  onCategoryPress: (category: string | null) => void;
  onCategoryBack?: () => void;
};

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

export type CatalogMarketplaceSearchBarProps = {
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

export function CatalogMarketplaceSearchBar({
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
}: CatalogMarketplaceSearchBarProps) {
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

type CatalogMarketplaceActionsProps = Pick<
  CatalogMarketplaceNavbarProps,
  | 'activeFilterCount'
  | 'createAccessibilityLabel'
  | 'layout'
  | 'onCreatePress'
  | 'onFilterPress'
  | 'onLayoutChange'
  | 'theme'
>;

function CatalogMarketplaceActions({
  activeFilterCount = 0,
  createAccessibilityLabel = 'List a book',
  layout = 'list',
  onCreatePress,
  onFilterPress,
  onLayoutChange,
  theme: themeOverride,
}: CatalogMarketplaceActionsProps) {
  const theme = useTheme(themeOverride);
  const buttonStyle = [
    styles.roundButton,
    {
      backgroundColor: theme.colors.inputBackground,
      borderColor: theme.colors.border,
    },
  ];

  if (!onLayoutChange && !onFilterPress && !onCreatePress) return null;

  return (
    <View style={styles.navActions}>
      {onLayoutChange ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            layout === 'grid' ? 'Show list layout' : 'Show grid layout'
          }
          onPress={() => onLayoutChange(layout === 'grid' ? 'list' : 'grid')}
          style={buttonStyle}
        >
          <MaterialDesignIcons
            name={layout === 'grid' ? 'view-list-outline' : 'view-grid-outline'}
            color={theme.colors.accent}
            size={20}
          />
        </Pressable>
      ) : null}
      {onFilterPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Filter results"
          onPress={onFilterPress}
          style={buttonStyle}
        >
          <MaterialDesignIcons
            name="tune-variant"
            color={theme.colors.accent}
            size={20}
          />
          {activeFilterCount > 0 ? (
            <View
              style={[
                styles.filterBadge,
                { backgroundColor: theme.colors.accent },
              ]}
            >
              <Text
                style={[
                  styles.filterBadgeText,
                  { color: theme.colors.surface },
                ]}
              >
                {activeFilterCount}
              </Text>
            </View>
          ) : null}
        </Pressable>
      ) : null}
      {onCreatePress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={createAccessibilityLabel}
          onPress={onCreatePress}
          style={buttonStyle}
        >
          <MaterialDesignIcons
            name="plus"
            color={theme.colors.accent}
            size={24}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

export function CatalogMarketplaceNavbar({
  categories,
  categoryBadgeCounts,
  maxVisibleCategories,
  categoryVariant = 'pills',
  segmentSizing = 'fill',
  includeAllCategory = true,
  allCategoryLabel = 'All',
  categoryBackAccessibilityLabel = 'Back to categories',
  brandLabel,
  brandSubtitle,
  showBrandBar = true,
  titleOptions,
  selectedTitleOption,
  titleAccessory,
  searchAccessory,
  layout = 'list',
  selectedCategory,
  categoryItems,
  focusedCategoryKey,
  searchLabel,
  searchPlaceholder = 'Search titles, authors…',
  searchInput = false,
  showSearch = true,
  searchValue,
  createAccessibilityLabel = 'List a book',
  activeFilterCount = 0,
  theme: themeOverride,
  onSearchPress,
  onSearchChangeText,
  onFilterPress,
  onCreatePress,
  onLayoutChange,
  onTitleOptionPress,
  onCategoryPress,
  onCategoryBack,
}: CatalogMarketplaceNavbarProps) {
  const theme = useTheme(themeOverride);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {showBrandBar ? (
        <CatalogMarketplaceBrandBar
          brandLabel={brandLabel}
          brandSubtitle={brandSubtitle}
          titleOptions={titleOptions}
          selectedTitleOption={selectedTitleOption}
          titleAccessory={titleAccessory}
          onTitleOptionPress={onTitleOptionPress}
          layout={layout}
          onCreatePress={onCreatePress}
          onLayoutChange={onLayoutChange}
          onSearchPress={onSearchPress}
          showActions={!showSearch}
          onFilterPress={onFilterPress}
          activeFilterCount={activeFilterCount}
          createAccessibilityLabel={createAccessibilityLabel}
          theme={theme}
        />
      ) : null}
      {showSearch ? (
        <View style={styles.searchRow}>
          <CatalogMarketplaceSearchBar
            input={searchInput}
            label={searchLabel}
            value={searchValue}
            placeholder={searchPlaceholder}
            onPress={onSearchPress}
            onChangeText={onSearchChangeText}
            theme={theme}
            style={styles.headerSearch}
          />
          {searchAccessory ? (
            <View style={styles.searchAccessory}>{searchAccessory}</View>
          ) : null}
          <CatalogMarketplaceActions
            activeFilterCount={activeFilterCount}
            createAccessibilityLabel={createAccessibilityLabel}
            layout={layout}
            onCreatePress={onCreatePress}
            onFilterPress={onFilterPress}
            onLayoutChange={onLayoutChange}
            theme={theme}
          />
        </View>
      ) : null}
      {categoryVariant === 'segments' ? (
        <CatalogMarketplaceSegmentTabs
          categories={categories}
          categoryBadgeCounts={categoryBadgeCounts}
          maxVisibleCategories={maxVisibleCategories}
          segmentSizing={segmentSizing}
          includeAllCategory={includeAllCategory}
          allCategoryLabel={allCategoryLabel}
          selectedCategory={selectedCategory}
          onCategoryPress={onCategoryPress}
          theme={theme}
        />
      ) : (
        <CatalogMarketplaceCategoryTabs
          categories={categories}
          categoryBadgeCounts={categoryBadgeCounts}
          maxVisibleCategories={maxVisibleCategories}
          includeAllCategory={includeAllCategory}
          allCategoryLabel={allCategoryLabel}
          categoryBackAccessibilityLabel={categoryBackAccessibilityLabel}
          selectedCategory={selectedCategory}
          categoryItems={categoryItems}
          focusedCategoryKey={focusedCategoryKey}
          onCategoryPress={onCategoryPress}
          onCategoryBack={onCategoryBack}
          theme={theme}
        />
      )}
    </View>
  );
}

type CatalogMarketplaceBrandBarProps = Pick<
  CatalogMarketplaceNavbarProps,
  | 'activeFilterCount'
  | 'brandLabel'
  | 'brandSubtitle'
  | 'createAccessibilityLabel'
  | 'layout'
  | 'onCreatePress'
  | 'onFilterPress'
  | 'onLayoutChange'
  | 'onSearchPress'
  | 'onTitleOptionPress'
  | 'selectedTitleOption'
  | 'theme'
  | 'titleAccessory'
  | 'titleOptions'
> & { showActions?: boolean };

export function CatalogMarketplaceBrandBar(
  props: CatalogMarketplaceBrandBarProps,
) {
  const theme = useTheme(props.theme);

  return (
    <View style={styles.brandRow}>
      <View style={styles.brandWrap}>
        {props.titleOptions?.length ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.titleOptions}
          >
            {props.titleOptions.map(option => {
              const selected = option.key === props.selectedTitleOption;
              return (
                <Pressable
                  key={option.key}
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  accessibilityLabel={
                    option.badgeCount
                      ? `${option.label}, ${option.badgeCount} unread`
                      : option.label
                  }
                  onPress={() => props.onTitleOptionPress?.(option.key)}
                  style={styles.titleOption}
                >
                  <View style={styles.titleOptionLabelRow}>
                    <Text
                      style={[
                        styles.brandText,
                        {
                          color: selected
                            ? theme.colors.accent
                            : theme.colors.textPrimary,
                        },
                        !selected && styles.titleOptionTextInactive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {option.badgeCount ? (
                      <View
                        style={[
                          styles.titleOptionBadge,
                          { backgroundColor: theme.colors.accent },
                        ]}
                      >
                        <Text
                          style={[
                            styles.titleOptionBadgeText,
                            { color: theme.colors.success },
                          ]}
                        >
                          {option.badgeCount > 99 ? '99+' : option.badgeCount}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : (
          <Text style={[styles.brandText, { color: theme.colors.accent }]}>
            {props.brandLabel || 'SwapLibro'}
          </Text>
        )}
        {props.brandSubtitle ? (
          <Text
            style={[styles.brandSubtitle, { color: theme.colors.textMuted }]}
          >
            {props.brandSubtitle}
          </Text>
        ) : null}
      </View>
      {props.titleAccessory || props.showActions ? (
        <View style={styles.brandActions}>
          {props.titleAccessory}
          {props.showActions ? (
            <CatalogMarketplaceActions
              activeFilterCount={props.activeFilterCount}
              createAccessibilityLabel={props.createAccessibilityLabel}
              layout={props.layout}
              onCreatePress={props.onCreatePress}
              onFilterPress={props.onFilterPress}
              onLayoutChange={props.onLayoutChange}
              theme={theme}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export function CatalogMarketplaceCategoryTabs({
  categories,
  categoryItems,
  categoryBadgeCounts,
  maxVisibleCategories = 8,
  includeAllCategory = true,
  allCategoryLabel = 'All',
  categoryBackAccessibilityLabel = 'Back to categories',
  selectedCategory,
  focusedCategoryKey,
  onCategoryPress,
  onCategoryBack,
  theme: themeOverride,
}: Pick<
  CatalogMarketplaceNavbarProps,
  | 'categories'
  | 'categoryItems'
  | 'categoryBadgeCounts'
  | 'includeAllCategory'
  | 'allCategoryLabel'
  | 'categoryBackAccessibilityLabel'
  | 'maxVisibleCategories'
  | 'selectedCategory'
  | 'focusedCategoryKey'
  | 'onCategoryPress'
  | 'onCategoryBack'
  | 'theme'
>) {
  const theme = useTheme(themeOverride);
  const focusedCategory = categoryItems?.find(
    category => category.key === focusedCategoryKey,
  );
  const visibleItems = focusedCategory
    ? [focusedCategory, ...(focusedCategory.children ?? [])]
    : categoryItems?.length
    ? categoryItems
    : categories.slice(0, maxVisibleCategories).map(label => ({
        key: label,
        label,
        badgeCount: categoryBadgeCounts?.[label],
      }));
  const visibleCategories = visibleItems.slice(0, maxVisibleCategories + 1);

  React.useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    if (focusedCategoryKey !== undefined) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  }, [focusedCategoryKey]);

  if (!includeAllCategory && visibleCategories.length === 0) return null;

  return (
    <View
      style={[styles.categoryHeader, { backgroundColor: theme.colors.surface }]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroller}
      >
        {focusedCategory ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={categoryBackAccessibilityLabel}
            onPress={() => onCategoryBack?.()}
            hitSlop={8}
            style={[
              styles.categoryBackButton,
              {
                backgroundColor: theme.colors.inputBackground,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <MaterialDesignIcons
              name="close"
              size={20}
              color={theme.colors.textSecondary}
            />
          </Pressable>
        ) : includeAllCategory ? (
          <CatalogMarketplacePill
            label={allCategoryLabel}
            selected={!selectedCategory}
            onPress={() => onCategoryPress(null)}
            theme={theme}
          />
        ) : null}
        {visibleCategories.map(category => (
          <CatalogMarketplacePill
            key={category.key}
            label={category.label}
            badgeCount={
              category.badgeCount ?? categoryBadgeCounts?.[category.label]
            }
            selected={
              selectedCategory === category.key ||
              selectedCategory === category.label ||
              focusedCategoryKey === category.key
            }
            onPress={() => onCategoryPress(category.key)}
            theme={theme}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export function CatalogMarketplaceSegmentTabs({
  categories,
  categoryBadgeCounts,
  maxVisibleCategories = 8,
  segmentSizing = 'fill',
  includeAllCategory = true,
  allCategoryLabel = 'All',
  selectedCategory,
  onCategoryPress,
  theme: themeOverride,
}: Pick<
  CatalogMarketplaceNavbarProps,
  | 'categories'
  | 'categoryBadgeCounts'
  | 'includeAllCategory'
  | 'allCategoryLabel'
  | 'maxVisibleCategories'
  | 'segmentSizing'
  | 'selectedCategory'
  | 'onCategoryPress'
  | 'theme'
>) {
  const theme = useTheme(themeOverride);
  const visibleCategories = categories.slice(0, maxVisibleCategories);
  const segments: Array<{ label: string; value: string | null }> = [
    ...(includeAllCategory ? [{ label: allCategoryLabel, value: null }] : []),
    ...visibleCategories.map(category => ({
      label: category,
      value: category,
    })),
  ];

  if (segments.length === 0) return null;

  const renderedSegments = segments.map(segment => {
    const selected = segment.value
      ? selectedCategory === segment.value
      : !selectedCategory;

    return (
      <Pressable
        key={segment.value ?? 'all'}
        accessibilityRole="tab"
        accessibilityState={{ selected }}
        onPress={() => onCategoryPress(segment.value)}
        style={[
          styles.segment,
          segmentSizing === 'content' && styles.segmentContentItem,
          { borderBottomColor: theme.colors.accent },
          !selected && styles.segmentInactive,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.segmentText,
            {
              color: selected
                ? theme.colors.textPrimary
                : theme.colors.textMuted,
            },
          ]}
        >
          {segment.label}
        </Text>
        {categoryBadgeCounts?.[segment.label] ? (
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: theme.colors.accent },
            ]}
          >
            <Text
              style={[
                styles.categoryBadgeText,
                { color: theme.colors.surface },
              ]}
            >
              {categoryBadgeCounts[segment.label] > 99
                ? '99+'
                : categoryBadgeCounts[segment.label]}
            </Text>
          </View>
        ) : null}
      </Pressable>
    );
  });
  const colors = {
    backgroundColor: theme.colors.surface,
    borderBottomColor: theme.colors.border,
  };

  if (segmentSizing === 'content') {
    return (
      <ScrollView
        horizontal
        accessibilityRole="tablist"
        showsHorizontalScrollIndicator={false}
        style={[styles.segmentScroll, colors]}
        contentContainerStyle={styles.segmentContent}
      >
        {renderedSegments}
      </ScrollView>
    );
  }

  return (
    <View accessibilityRole="tablist" style={[styles.segmentHeader, colors]}>
      {renderedSegments}
    </View>
  );
}

export function CatalogMarketplacePill({
  label,
  badgeCount,
  selected,
  onPress,
  theme: themeOverride,
}: {
  label: string;
  badgeCount?: number;
  selected: boolean;
  onPress: () => void;
  theme?: SwapLibroNavbarThemeOverride;
}) {
  const theme = useTheme(themeOverride);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={badgeCount ? `${label}, ${badgeCount} unread` : label}
      onPress={onPress}
      style={[styles.categoryTab, { borderColor: theme.colors.border }]}
    >
      <Text
        style={[
          styles.categoryTabText,
          {
            color: selected ? theme.colors.surface : theme.colors.textSecondary,
          },
        ]}
      >
        {label}
      </Text>
      {badgeCount ? (
        <View
          style={[
            styles.categoryBadge,
            {
              backgroundColor: selected
                ? theme.colors.surface
                : theme.colors.accent,
            },
          ]}
        >
          <Text
            style={[
              styles.categoryBadgeText,
              {
                color: selected ? theme.colors.accent : theme.colors.surface,
              },
            ]}
          >
            {badgeCount > 99 ? '99+' : badgeCount}
          </Text>
        </View>
      ) : null}
      {selected ? (
        <View
          style={[
            styles.categoryUnderline,
            { backgroundColor: theme.colors.accent },
          ]}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  brandRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
  },
  brandWrap: {
    minWidth: 0,
    flex: 1,
  },
  brandMark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    flexShrink: 1,
    fontFamily: swapLibroTypography.display,
    fontSize: 21,
    lineHeight: 26,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  brandSubtitle: {
    fontFamily: swapLibroTypography.body,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
  },
  titleOptions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  titleOption: {
    minHeight: 34,
    justifyContent: 'center',
  },
  titleOptionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  titleOptionBadge: {
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderRadius: 9,
  },
  titleOptionBadgeText: {
    fontFamily: swapLibroTypography.catalog,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '600',
  },
  titleOptionTextInactive: {
    opacity: 0.42,
  },
  brandActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerSearch: { flex: 1 },
  searchAccessory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roundButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  filterBadge: {
    position: 'absolute',
    right: -3,
    top: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    minHeight: 38,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
  },
  searchText: {
    flex: 1,
    fontFamily: swapLibroTypography.body,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '400',
  },
  searchInput: {
    flex: 1,
    minHeight: 36,
    paddingVertical: 0,
    fontFamily: swapLibroTypography.body,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '400',
  },
  searchIcon: {
    marginRight: 1,
  },
  categoryScroller: {
    gap: 8,
    paddingHorizontal: 16,
    paddingRight: 16,
  },
  categoryBackButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryHeader: {
    paddingBottom: 8,
  },
  segmentHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  segmentScroll: {
    flexGrow: 0,
    borderBottomWidth: 1,
  },
  segmentContent: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  segment: {
    minHeight: 44,
    minWidth: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    flexDirection: 'row',
    gap: 6,
  },
  segmentContentItem: {
    flex: 0,
    paddingHorizontal: 16,
  },
  segmentInactive: {
    borderBottomColor: 'transparent',
  },
  segmentText: {
    fontFamily: swapLibroTypography.body,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  categoryTab: {
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
  },
  categoryTabText: {
    fontFamily: swapLibroTypography.body,
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '500',
  },
  categoryBadge: {
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderRadius: 9,
  },
  categoryBadgeText: {
    fontFamily: swapLibroTypography.catalog,
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '600',
  },
  categoryUnderline: {
    ...StyleSheet.absoluteFill,
    zIndex: -1,
    borderRadius: 20,
  },
});
