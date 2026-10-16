import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import {
  SwapLibroNavbarThemeOverride,
  mergeSwapLibroNavbarTheme,
  swapLibroNavbarTypography,
  swapLibroNavbarTheme,
} from '../theme';

export type BookSearchCreditRange = 'one' | 'two-to-three' | 'four-plus';

export type BookSearchFiltersValue = {
  /** @deprecated Distance filtering is no longer rendered or applied. */
  distanceKm?: number;
  /** @deprecated Use `locations`. Single barrio from the old Area/Barrio selects. */
  location?: string;
  /** @deprecated Use `locations`. */
  locationGroup?: string;
  /** Neighbourhoods chosen in the Neighbourhoods picker (any number). */
  locations?: string[];
  conditions: string[];
  genres: string[];
  creditRange?: BookSearchCreditRange;
  languages?: string[];
};

export type BookSearchFiltersLabels = {
  title: string;
  close: string;
  reset: string;
  location: string;
  area: string;
  barrio: string;
  anyLocation: string;
  selectArea: string;
  selectBarrio: string;
  selectAreaFirst: string;
  condition: string;
  genres: string;
  filterGenres: string;
  languages: string;
  creditValue: string;
  showResults: (count: number, booksLabel: string) => string;
  noResults: string;
  /** Shown above the button when nothing matches, so it is never silently disabled. */
  noResultsHint: string;
  selectedCount: (count: number) => string;
  /** Neighbourhoods mode: section title, row label and empty value. */
  where: string;
  neighbourhoods: string;
  anywhere: string;
  /** “See all 23 genres”. */
  seeAllGenres: (count: number) => string;
  /** Spoken “and N more” after the first two neighbourhoods. */
  moreLocations: (count: number) => string;
};

export type BookSearchFilterOption = {
  value: string;
  label: string;
};

export type BookSearchLocationGroup = {
  label: string;
  options: string[];
};

export type BookSearchSafeAreaInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type BookSearchFiltersModalProps = {
  visible: boolean;
  value: BookSearchFiltersValue;
  locationGroups?: BookSearchLocationGroup[];
  conditionOptions: BookSearchFilterOption[];
  genreOptions: BookSearchFilterOption[];
  languageOptions?: BookSearchFilterOption[];
  initialGenreOptionCount?: number;
  resultCount: number;
  resultCountForValue?: (value: BookSearchFiltersValue) => number;
  showCreditRange?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  renderMode?: 'modal' | 'screen';
  safeAreaInsets?: Partial<BookSearchSafeAreaInsets>;
  theme?: SwapLibroNavbarThemeOverride;
  onChange: (value: BookSearchFiltersValue) => void;
  onReset: () => void;
  onClose: () => void;
  onApply: (value: BookSearchFiltersValue) => void;
  /**
   * Shows one Neighbourhoods row instead of the Area and Barrio selects.
   * Called with the current, unapplied draft so the host can open its picker
   * and pass the result back through `value`.
   */
  onNeighbourhoodsPress?: (draft: BookSearchFiltersValue) => void;
  /**
   * Replaces the genre search with genre chips (selected, then
   * `popularGenreValues`) and a “See all N genres” button.
   */
  onAllGenresPress?: (draft: BookSearchFiltersValue) => void;
  popularGenreValues?: string[];
  labels?: Partial<BookSearchFiltersLabels>;
  testID?: string;
};

const CREDIT_OPTIONS: Array<{
  value: BookSearchCreditRange;
  label: string;
}> = [
  { value: 'one', label: '1 credit' },
  { value: 'two-to-three', label: '2–3 credits' },
  { value: 'four-plus', label: '4+ credits' },
];

const DEFAULT_SAFE_AREA_INSETS: BookSearchSafeAreaInsets = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter(item => item !== value)
    : [...values, value];
}

export function BookSearchFiltersModal({
  visible,
  value,
  locationGroups = [],
  conditionOptions,
  genreOptions,
  languageOptions = [],
  initialGenreOptionCount,
  resultCount,
  resultCountForValue,
  showCreditRange = true,
  animationType = 'slide',
  renderMode = 'modal',
  safeAreaInsets: safeAreaInsetsOverride,
  theme: themeOverride,
  onChange,
  onReset,
  onClose,
  onApply,
  onNeighbourhoodsPress,
  onAllGenresPress,
  popularGenreValues = [],
  labels: labelsOverride,
  testID = 'book-search-filters',
}: BookSearchFiltersModalProps) {
  const labels: BookSearchFiltersLabels = {
    title: 'Filters',
    close: 'Close filters',
    reset: 'Reset',
    location: 'Location',
    area: 'Area',
    barrio: 'Barrio',
    anyLocation: 'Any location',
    selectArea: 'Select an area',
    selectBarrio: 'Select a barrio',
    selectAreaFirst: 'Select an area first',
    condition: 'Condition',
    genres: 'Genre',
    filterGenres: 'Filter genres',
    languages: 'Language',
    creditValue: 'Credit value',
    showResults: (count, booksLabel) => `Show ${count} ${booksLabel}`,
    noResults: 'No books match',
    noResultsHint: 'Remove a filter to see books',
    selectedCount: count => `${count} selected`,
    where: 'Where',
    neighbourhoods: 'Neighbourhoods',
    anywhere: 'Anywhere',
    seeAllGenres: count => `See all ${count} genres`,
    moreLocations: count => `+${count}`,
    ...labelsOverride,
  };
  const [draftValue, setDraftValue] = React.useState(value);
  React.useEffect(() => {
    if (visible) setDraftValue(value);
  }, [value, visible]);
  const [openLocationMenu, setOpenLocationMenu] = React.useState<
    'group' | 'location' | null
  >(null);
  const [genreQuery, setGenreQuery] = React.useState('');
  const safeAreaInsets = {
    top: safeAreaInsetsOverride?.top ?? DEFAULT_SAFE_AREA_INSETS.top,
    right: safeAreaInsetsOverride?.right ?? DEFAULT_SAFE_AREA_INSETS.right,
    bottom: safeAreaInsetsOverride?.bottom ?? DEFAULT_SAFE_AREA_INSETS.bottom,
    left: safeAreaInsetsOverride?.left ?? DEFAULT_SAFE_AREA_INSETS.left,
  };
  const theme = React.useMemo(
    () => mergeSwapLibroNavbarTheme(themeOverride),
    [themeOverride],
  );
  const selectedLocationGroup = locationGroups.find(
    group =>
      group.label === draftValue.locationGroup ||
      Boolean(
        draftValue.location && group.options.includes(draftValue.location),
      ),
  );
  const displayResultCount = resultCountForValue?.(draftValue) ?? resultCount;
  const booksLabel = displayResultCount === 1 ? 'book' : 'books';
  const filteredGenreOptions = React.useMemo(() => {
    const query = genreQuery.trim().toLowerCase();
    const matches = query
      ? genreOptions.filter(option =>
          option.label.toLowerCase().includes(query),
        )
      : genreOptions;
    if (query || initialGenreOptionCount === undefined) return matches;

    const initiallyVisible = matches.slice(0, initialGenreOptionCount);
    const selectedOutsideInitialSet = matches.filter(
      option =>
        draftValue.genres.includes(option.value) &&
        !initiallyVisible.some(
          visibleOption => visibleOption.value === option.value,
        ),
    );
    return [...initiallyVisible, ...selectedOutsideInitialSet];
  }, [draftValue.genres, genreOptions, genreQuery, initialGenreOptionCount]);

  const genreChipOptions = React.useMemo(() => {
    if (!onAllGenresPress) return filteredGenreOptions;
    const order = [
      ...draftValue.genres,
      ...popularGenreValues.filter(genre => !draftValue.genres.includes(genre)),
    ];
    return order
      .map(genre => genreOptions.find(option => option.value === genre))
      .filter((option): option is BookSearchFilterOption => Boolean(option));
  }, [
    draftValue.genres,
    filteredGenreOptions,
    genreOptions,
    onAllGenresPress,
    popularGenreValues,
  ]);
  const draftLocations = draftValue.locations ?? [];
  const locationSummary =
    draftLocations.length <= 2
      ? draftLocations.join(', ')
      : `${draftLocations.slice(0, 2).join(', ')} ${labels.moreLocations(
          draftLocations.length - 2,
        )}`;

  const updateDraft = (next: BookSearchFiltersValue) => setDraftValue(next);
  const resetDraft = () => {
    setDraftValue({
      location: undefined,
      locationGroup: undefined,
      locations: [],
      conditions: [],
      genres: [],
      languages: [],
    });
    setOpenLocationMenu(null);
    setGenreQuery('');
    onReset();
  };

  const Root = (renderMode === 'screen' ? View : Modal) as React.ComponentType<any>;
  const rootProps =
    renderMode === 'screen'
      ? { style: styles.safeArea, testID }
      : {
          visible,
          animationType,
          presentationStyle: 'fullScreen',
          onRequestClose: onClose,
        };

  return (
    <Root {...rootProps}>
      <View
        style={[
          styles.safeArea,
          {
            backgroundColor: theme.colors.surface,
            paddingTop: safeAreaInsets.top,
            paddingRight: safeAreaInsets.right,
            paddingLeft: safeAreaInsets.left,
          },
        ]}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={labels.close}
            onPress={onClose}
            style={[
              styles.headerButton,
              {
                backgroundColor: theme.colors.inputBackground,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <MaterialDesignIcons
              name="close"
              size={20}
              color={theme.colors.textPrimary}
            />
          </Pressable>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            {labels.title}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={labels.reset}
            onPress={resetDraft}
            hitSlop={8}
            style={styles.resetButton}
          >
            <Text
              style={[styles.resetText, { color: theme.colors.textPrimary }]}
            >
              {labels.reset}
            </Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          testID={`${testID}-scroll`}
        >
          {onNeighbourhoodsPress ? (
            <View style={styles.group}>
              <GroupHeading
                title={labels.where}
                formatSelected={labels.selectedCount}
                selectedCount={draftLocations.length}
                theme={theme}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${labels.neighbourhoods}: ${
                  locationSummary || labels.anywhere
                }`}
                onPress={() => onNeighbourhoodsPress(draftValue)}
                style={[
                  styles.locationDropdown,
                  {
                    backgroundColor: theme.colors.inputBackground,
                    borderColor: theme.colors.border,
                  },
                ]}
                testID={`${testID}-neighbourhoods`}
              >
                <View style={styles.locationValueWrap}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.locationValue,
                      {
                        color: locationSummary
                          ? theme.colors.textPrimary
                          : theme.colors.textMuted,
                      },
                    ]}
                  >
                    {locationSummary || labels.anywhere}
                  </Text>
                </View>
                <MaterialDesignIcons
                  name="chevron-right"
                  size={20}
                  color={theme.colors.textMuted}
                />
              </Pressable>
            </View>
          ) : (
          <View style={[styles.group, styles.locationGroup]}>
            <View style={styles.groupHeadingRow}>
              <Text
                style={[styles.groupTitle, { color: theme.colors.textPrimary }]}
              >
                {labels.location}
              </Text>
            </View>
            <View style={styles.locationRow}>
              <LocationDropdownButton
                label={labels.area}
                value={selectedLocationGroup?.label}
                placeholder={labels.selectArea}
                open={openLocationMenu === 'group'}
                theme={theme}
                onPress={() =>
                  setOpenLocationMenu(current =>
                    current === 'group' ? null : 'group',
                  )
                }
              />
              <LocationDropdownButton
                label={labels.barrio}
                value={draftValue.location}
                placeholder={labels.barrio}
                open={openLocationMenu === 'location'}
                disabled={!selectedLocationGroup}
                theme={theme}
                onPress={() => {
                  if (selectedLocationGroup) {
                    setOpenLocationMenu(current =>
                      current === 'location' ? null : 'location',
                    );
                  }
                }}
              />
            </View>
            {openLocationMenu === 'group' ? (
              <View
                style={[
                  styles.locationMenu,
                  {
                    backgroundColor: theme.colors.inputBackground,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <LocationChoice
                  label={labels.anyLocation}
                  selected={!draftValue.locationGroup && !draftValue.location}
                  theme={theme}
                  onPress={() => {
                    updateDraft({
                      ...draftValue,
                      locationGroup: undefined,
                      location: undefined,
                    });
                    setOpenLocationMenu(null);
                  }}
                />
                {locationGroups.map(group => (
                  <LocationChoice
                    key={group.label}
                    label={group.label}
                    selected={selectedLocationGroup?.label === group.label}
                    theme={theme}
                    onPress={() => {
                      updateDraft({
                        ...draftValue,
                        locationGroup: group.label,
                        location: undefined,
                      });
                      setOpenLocationMenu(null);
                    }}
                  />
                ))}
              </View>
            ) : null}
            {openLocationMenu === 'location' && selectedLocationGroup ? (
              <View
                style={[
                  styles.locationMenu,
                  {
                    backgroundColor: theme.colors.inputBackground,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                {selectedLocationGroup.options.map(location => (
                  <LocationChoice
                    key={location}
                    label={location}
                    selected={draftValue.location === location}
                    theme={theme}
                    onPress={() => {
                      updateDraft({
                        ...draftValue,
                        locationGroup: selectedLocationGroup.label,
                        location,
                      });
                      setOpenLocationMenu(null);
                    }}
                  />
                ))}
              </View>
            ) : null}
          </View>
          )}

          <FilterGroup
            title={labels.condition}
            formatSelected={labels.selectedCount}
            options={conditionOptions}
            selectedValues={draftValue.conditions}
            theme={theme}
            onPress={condition =>
              updateDraft({
                ...draftValue,
                conditions: toggleValue(draftValue.conditions, condition),
              })
            }
          />

          {languageOptions.length ? (
            <FilterGroup
              title={labels.languages}
              formatSelected={labels.selectedCount}
              options={languageOptions}
              selectedValues={draftValue.languages ?? []}
              theme={theme}
              onPress={language =>
                updateDraft({
                  ...draftValue,
                  languages: toggleValue(draftValue.languages ?? [], language),
                })
              }
            />
          ) : null}

          <View style={styles.group}>
            <GroupHeading
              title={labels.genres}
              formatSelected={labels.selectedCount}
              selectedCount={draftValue.genres.length}
              theme={theme}
            />
            {onAllGenresPress ? null : (
            <View
              style={[
                styles.genreSearch,
                {
                  backgroundColor: theme.colors.inputBackground,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <MaterialDesignIcons
                name="magnify"
                size={20}
                color={theme.colors.textMuted}
              />
              <TextInput
                value={genreQuery}
                onChangeText={setGenreQuery}
                placeholder={labels.filterGenres}
                placeholderTextColor={theme.colors.textMuted}
                style={[
                  styles.genreSearchInput,
                  { color: theme.colors.textPrimary },
                ]}
              />
            </View>
            )}
            <FilterOptions
              options={genreChipOptions}
              selectedValues={draftValue.genres}
              theme={theme}
              onPress={genre =>
                updateDraft({
                  ...draftValue,
                  genres: toggleValue(draftValue.genres, genre),
                })
              }
            />
            {onAllGenresPress ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => onAllGenresPress(draftValue)}
                style={styles.seeAll}
                testID={`${testID}-all-genres`}
              >
                <Text
                  style={[styles.seeAllText, { color: theme.colors.textPrimary }]}
                >
                  {labels.seeAllGenres(genreOptions.length)}
                </Text>
                <MaterialDesignIcons
                  name="chevron-right"
                  size={18}
                  color={theme.colors.textPrimary}
                />
              </Pressable>
            ) : null}
          </View>

          {showCreditRange ? (
            <View style={styles.group}>
              <Text
                style={[styles.groupTitle, { color: theme.colors.textMuted }]}
              >
                {labels.creditValue}
              </Text>
              <View style={styles.optionRow}>
                {CREDIT_OPTIONS.map(option => {
                  const selected = draftValue.creditRange === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: selected }}
                      onPress={() =>
                        updateDraft({
                          ...draftValue,
                          creditRange: selected ? undefined : option.value,
                        })
                      }
                      style={[
                        styles.optionChip,
                        {
                          backgroundColor: theme.colors.inputBackground,
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
                          styles.optionText,
                          { color: theme.colors.textSecondary },
                          selected ? { color: theme.colors.surface } : null,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

        </ScrollView>

        <View
          style={[
            styles.footer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              paddingBottom: Math.max(22, safeAreaInsets.bottom),
            },
          ]}
        >
          {displayResultCount === 0 ? (
            <Text
              accessibilityLiveRegion="polite"
              style={[styles.noResultsHint, { color: theme.colors.textMuted }]}
              testID="book-search-filters-no-results-hint"
            >
              {labels.noResultsHint}
            </Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              displayResultCount === 0
                ? labels.noResults
                : labels.showResults(displayResultCount, booksLabel)
            }
            accessibilityHint={
              displayResultCount === 0 ? labels.noResultsHint : undefined
            }
            accessibilityState={{ disabled: displayResultCount === 0 }}
            disabled={displayResultCount === 0}
            onPress={() => {
              onChange(draftValue);
              onApply(draftValue);
            }}
            testID={`${testID}-apply`}
            style={[
              styles.applyButton,
              { backgroundColor: theme.colors.accent },
              displayResultCount === 0 ? styles.applyUnavailable : null,
            ]}
          >
            <Text style={[styles.applyText, { color: theme.colors.surface }]}>
              {displayResultCount === 0
                ? labels.noResults
                : labels.showResults(displayResultCount, booksLabel)}
            </Text>
          </Pressable>
        </View>
      </View>
    </Root>
  );
}

function LocationDropdownButton({
  label,
  value,
  placeholder,
  open,
  disabled = false,
  theme,
  onPress,
}: {
  label: string;
  value?: string;
  placeholder: string;
  open: boolean;
  disabled?: boolean;
  theme: ReturnType<typeof mergeSwapLibroNavbarTheme>;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value ?? placeholder}`}
      accessibilityState={{ expanded: open, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.locationDropdown,
        {
          backgroundColor: theme.colors.inputBackground,
          borderColor: theme.colors.border,
        },
        disabled ? styles.locationDisabled : null,
      ]}
    >
      <View style={styles.locationValueWrap}>
        <Text
          style={[
            styles.locationValue,
            {
              color: value ? theme.colors.textPrimary : theme.colors.textMuted,
            },
          ]}
        >
          {value ?? placeholder}
        </Text>
      </View>
      <MaterialDesignIcons
        name={open ? 'chevron-up' : 'chevron-down'}
        size={20}
        color={theme.colors.textMuted}
      />
    </Pressable>
  );
}

function LocationChoice({
  label,
  selected,
  theme,
  onPress,
}: {
  label: string;
  selected: boolean;
  theme: ReturnType<typeof mergeSwapLibroNavbarTheme>;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={styles.locationChoice}
    >
      <Text
        style={[styles.locationChoiceText, { color: theme.colors.textPrimary }]}
      >
        {label}
      </Text>
      {selected ? (
        <MaterialDesignIcons
          name="check"
          size={18}
          color={theme.colors.accent}
        />
      ) : null}
    </Pressable>
  );
}

function FilterGroup({
  title,
  options,
  selectedValues,
  formatSelected,
  theme,
  onPress,
}: {
  title: string;
  formatSelected: (count: number) => string;
  options: BookSearchFilterOption[];
  selectedValues: string[];
  theme: ReturnType<typeof mergeSwapLibroNavbarTheme>;
  onPress: (value: string) => void;
}) {
  return (
    <View style={styles.group}>
      <GroupHeading
        title={title}
        selectedCount={selectedValues.length}
        formatSelected={formatSelected}
        theme={theme}
      />
      <FilterOptions
        options={options}
        selectedValues={selectedValues}
        theme={theme}
        onPress={onPress}
      />
    </View>
  );
}

function GroupHeading({
  title,
  selectedCount,
  formatSelected,
  theme,
}: {
  title: string;
  selectedCount: number;
  formatSelected: (count: number) => string;
  theme: ReturnType<typeof mergeSwapLibroNavbarTheme>;
}) {
  return (
    <View style={styles.groupHeadingRow}>
      <Text style={[styles.groupTitle, { color: theme.colors.textPrimary }]}>
        {title}
      </Text>
      {selectedCount ? (
        <Text style={[styles.selectedCount, { color: theme.colors.textMuted }]}>
          {formatSelected(selectedCount)}
        </Text>
      ) : null}
    </View>
  );
}

function FilterOptions({
  options,
  selectedValues,
  theme,
  onPress,
}: {
  options: BookSearchFilterOption[];
  selectedValues: string[];
  theme: ReturnType<typeof mergeSwapLibroNavbarTheme>;
  onPress: (value: string) => void;
}) {
  return (
    <View style={styles.optionRow}>
      {options.map(option => {
        const selected = selectedValues.includes(option.value);
        return (
          <Pressable
            key={option.value}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: selected }}
            onPress={() => onPress(option.value)}
            style={[
              styles.optionChip,
              {
                backgroundColor: theme.colors.inputBackground,
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
                styles.optionText,
                { color: theme.colors.textSecondary },
                selected ? { color: theme.colors.surface } : null,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  title: {
    position: 'absolute',
    right: 80,
    left: 80,
    textAlign: 'center',
    fontFamily: swapLibroNavbarTypography.display,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
  },
  resetButton: { paddingVertical: 9, paddingLeft: 14 },
  resetText: {
    fontFamily: swapLibroNavbarTypography.bodySemibold,
    fontSize: 15,
    lineHeight: 20,
  },
  content: { paddingHorizontal: 20, paddingBottom: 32 },
  seeAll: {
    alignSelf: 'flex-start',
    minHeight: 44,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontFamily: swapLibroNavbarTypography.bodySemibold,
    fontSize: 15,
    lineHeight: 20,
  },
  genreSearch: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  genreSearchInput: {
    flex: 1,
    height: 46,
    paddingVertical: 0,
    fontFamily: swapLibroNavbarTypography.body,
    fontSize: 15,
    lineHeight: 20,
  },
  group: {
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: swapLibroNavbarTheme.colors.border,
  },
  locationGroup: { paddingTop: 28 },
  groupHeadingRow: {
    minHeight: 24,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupTitle: {
    fontFamily: swapLibroNavbarTypography.display,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  selectedCount: {
    fontFamily: swapLibroNavbarTypography.body,
    fontSize: 13,
    lineHeight: 18,
  },
  locationRow: { flexDirection: 'row', gap: 10 },
  locationDropdown: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationDisabled: { opacity: 0.55 },
  locationValueWrap: { flex: 1 },
  locationValue: {
    fontFamily: swapLibroNavbarTypography.body,
    fontSize: 15,
    lineHeight: 20,
  },
  locationMenu: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  locationChoice: {
    minHeight: 44,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationChoiceText: {
    fontFamily: swapLibroNavbarTypography.body,
    fontSize: 13,
    lineHeight: 18,
  },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionChip: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1,
  },
  optionText: {
    fontFamily: swapLibroNavbarTypography.body,
    fontSize: 15,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    minHeight: 96,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  applyButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  applyUnavailable: { opacity: 0.4 },
  noResultsHint: {
    marginBottom: 8,
    fontFamily: swapLibroNavbarTypography.body,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  applyText: {
    fontFamily: swapLibroNavbarTypography.bodySemibold,
    fontSize: 16,
    lineHeight: 21,
  },
});
