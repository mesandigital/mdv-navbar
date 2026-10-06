import React, { useMemo, useState } from 'react';
import type { Edge } from 'react-native-safe-area-context';

import type { SwapLibroNavbarThemeOverride } from '../theme';
import { MarketplaceLibraryScreen } from './MarketplaceLibraryScreen';

export type MarketplaceLibraryCategory = {
  key: string;
  label: string;
  badgeCount?: number;
  children?: MarketplaceLibraryCategory[];
};

export type MarketplaceLibrarySection = {
  key: string;
  label: string;
  badgeCount?: number;
  subtitle?: string;
  categories?: MarketplaceLibraryCategory[];
  categoryVariant?: 'pills' | 'segments';
  segmentSizing?: 'fill' | 'content';
  includeAllCategory?: boolean;
  allCategoryLabel?: string;
  categoryBackAccessibilityLabel?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  selectedCategoryKey?: string | null;
  focusedCategoryKey?: string | null;
  activeFilterCount?: number;
  layout?: 'list' | 'grid';
  createAccessibilityLabel?: string;
  onSearchChangeText?: (value: string) => void;
  onCategoryChange?: (key: string | null) => void;
  onCategoryFocusChange?: (key: string | null) => void;
  onFilterPress?: () => void;
  onLayoutChange?: (layout: 'list' | 'grid') => void;
  onCreatePress?: () => void;
  titleAccessory?: React.ReactNode;
  searchAccessory?: React.ReactNode;
};

export type MarketplaceLibraryRenderContext = {
  section: MarketplaceLibrarySection;
  searchValue: string;
  selectedCategoryKey: string | null;
};

export type TabbedMarketplaceLibraryScreenProps = {
  sections: MarketplaceLibrarySection[];
  initialSectionKey?: string;
  selectedSectionKey?: string;
  onSectionChange?: (key: string) => void;
  renderContent: (context: MarketplaceLibraryRenderContext) => React.ReactNode;
  renderFooter?: (context: MarketplaceLibraryRenderContext) => React.ReactNode;
  navbarTheme?: SwapLibroNavbarThemeOverride;
  safeAreaEdges?: Edge[];
  testID?: string;
};

export function TabbedMarketplaceLibraryScreen({
  sections,
  initialSectionKey,
  selectedSectionKey,
  onSectionChange,
  renderContent,
  renderFooter,
  navbarTheme,
  safeAreaEdges,
  testID,
}: TabbedMarketplaceLibraryScreenProps) {
  const fallbackKey = initialSectionKey ?? sections[0]?.key ?? '';
  const [internalSectionKey, setInternalSectionKey] = useState(fallbackKey);
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [categoryValues, setCategoryValues] = useState<
    Record<string, string | null>
  >({});
  const activeKey = selectedSectionKey ?? internalSectionKey;
  const section = sections.find(item => item.key === activeKey) ?? sections[0];

  const context = useMemo<MarketplaceLibraryRenderContext | null>(() => {
    if (!section) return null;
    return {
      section,
      searchValue: section.searchValue ?? searchValues[section.key] ?? '',
      selectedCategoryKey:
        section.selectedCategoryKey !== undefined
          ? section.selectedCategoryKey
          : categoryValues[section.key] ?? null,
    };
  }, [categoryValues, searchValues, section]);

  if (!section || !context) return null;

  const categories = section.categories ?? [];
  const focusedCategoryKey = section.focusedCategoryKey ?? null;
  const focusedCategory = categories.find(
    item => item.key === focusedCategoryKey,
  );
  const visibleCategories = focusedCategory
    ? [focusedCategory, ...(focusedCategory.children ?? [])]
    : categories;
  const selectedCategoryLabel =
    visibleCategories.find(item => item.key === context.selectedCategoryKey)
      ?.label ??
    categories.find(item => item.key === context.selectedCategoryKey)?.label ??
    null;

  return (
    <MarketplaceLibraryScreen
      testID={testID}
      safeAreaEdges={safeAreaEdges}
      navbarProps={{
        theme: navbarTheme,
        titleOptions: sections.map(item => ({
          key: item.key,
          label: item.label,
          badgeCount: item.badgeCount,
        })),
        selectedTitleOption: section.key,
        titleAccessory: section.titleAccessory,
        searchAccessory: section.searchAccessory,
        brandSubtitle: section.subtitle,
        categories: visibleCategories.map(item => item.label),
        categoryItems: categories,
        focusedCategoryKey,
        categoryBadgeCounts: Object.fromEntries(
          visibleCategories.map(item => [item.label, item.badgeCount ?? 0]),
        ),
        maxVisibleCategories: visibleCategories.length,
        categoryVariant: section.categoryVariant,
        segmentSizing: section.segmentSizing,
        includeAllCategory: section.includeAllCategory ?? true,
        allCategoryLabel: section.allCategoryLabel,
        categoryBackAccessibilityLabel: section.categoryBackAccessibilityLabel,
        selectedCategory: selectedCategoryLabel,
        showSearch: section.showSearch ?? true,
        searchInput: true,
        searchValue: context.searchValue,
        searchPlaceholder: section.searchPlaceholder,
        activeFilterCount: section.activeFilterCount,
        layout: section.layout,
        createAccessibilityLabel:
          section.createAccessibilityLabel ?? `Create ${section.label}`,
        onTitleOptionPress: key => {
          if (selectedSectionKey === undefined) setInternalSectionKey(key);
          onSectionChange?.(key);
        },
        onSearchChangeText: value => {
          if (section.searchValue === undefined) {
            setSearchValues(current => ({
              ...current,
              [section.key]: value,
            }));
          }
          section.onSearchChangeText?.(value);
        },
        onCategoryPress: value => {
          const key =
            visibleCategories.find(
              item => item.key === value || item.label === value,
            )?.key ?? null;
          const category = visibleCategories.find(item => item.key === key);
          if (section.selectedCategoryKey === undefined) {
            setCategoryValues(current => ({
              ...current,
              [section.key]: key,
            }));
          }
          if (category?.children?.length) {
            section.onCategoryFocusChange?.(category.key);
          }
          section.onCategoryChange?.(key);
        },
        onCategoryBack: () => {
          section.onCategoryFocusChange?.(null);
          section.onCategoryChange?.(null);
        },
        onFilterPress: section.onFilterPress,
        onLayoutChange: section.onLayoutChange,
        onCreatePress: section.onCreatePress,
      }}
      footer={renderFooter?.(context)}
    >
      {renderContent(context)}
    </MarketplaceLibraryScreen>
  );
}

export default TabbedMarketplaceLibraryScreen;
