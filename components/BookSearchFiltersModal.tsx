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
  location?: string;
  locationGroup?: string;
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
  resultCount: number;
  resultCountForValue?: (value: BookSearchFiltersValue) => number;
  showCreditRange?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  safeAreaInsets?: Partial<BookSearchSafeAreaInsets>;
  theme?: SwapLibroNavbarThemeOverride;
  onChange: (value: BookSearchFiltersValue) => void;
  onReset: () => void;
  onClose: () => void;
  onApply: () => void;
  labels?: Partial<BookSearchFiltersLabels>;
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
  resultCount,
  resultCountForValue,
  showCreditRange = true,
  animationType = 'slide',
  safeAreaInsets: safeAreaInsetsOverride,
  theme: themeOverride,
  onChange,
  onReset,
  onClose,
  onApply,
  labels: labelsOverride,
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
  const filteredGenreOptions = genreOptions.filter(option =>
    option.label.toLowerCase().includes(genreQuery.trim().toLowerCase()),
  );

  const updateDraft = (next: BookSearchFiltersValue) => setDraftValue(next);
  const resetDraft = () => {
    setDraftValue({
      location: undefined,
      locationGroup: undefined,
      conditions: [],
      genres: [],
      languages: [],
    });
    setOpenLocationMenu(null);
    setGenreQuery('');
    onReset();
  };

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
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
            <Text style={[styles.resetText, { color: theme.colors.textMuted }]}>
              {labels.reset}
            </Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
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

          <FilterGroup
            title={labels.condition}
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

          <View style={styles.group}>
            <GroupHeading
              title={labels.genres}
              selectedCount={draftValue.genres.length}
              theme={theme}
            />
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
            <FilterOptions
              options={filteredGenreOptions}
              selectedValues={draftValue.genres}
              theme={theme}
              onPress={genre =>
                updateDraft({
                  ...draftValue,
                  genres: toggleValue(draftValue.genres, genre),
                })
              }
            />
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

          {languageOptions.length ? (
            <FilterGroup
              title={labels.languages}
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
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={labels.showResults(
              displayResultCount,
              booksLabel,
            )}
            accessibilityState={{ disabled: displayResultCount === 0 }}
            disabled={displayResultCount === 0}
            onPress={() => {
              onChange(draftValue);
              onApply();
            }}
            style={[
              styles.applyButton,
              { backgroundColor: theme.colors.accent },
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
    </Modal>
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
  theme,
  onPress,
}: {
  title: string;
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
  theme,
}: {
  title: string;
  selectedCount: number;
  theme: ReturnType<typeof mergeSwapLibroNavbarTheme>;
}) {
  return (
    <View style={styles.groupHeadingRow}>
      <Text style={[styles.groupTitle, { color: theme.colors.textPrimary }]}>
        {title}
      </Text>
      {selectedCount ? (
        <Text style={[styles.selectedCount, { color: theme.colors.textMuted }]}>
          {selectedCount} selected
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
  content: { paddingBottom: 32 },
  genreSearch: {
    height: 48,
    borderRadius: 12,
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: swapLibroNavbarTheme.colors.border,
  },
  locationGroup: { paddingTop: 8 },
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
    borderRadius: 12,
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
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip: {
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  optionText: {
    fontFamily: swapLibroNavbarTypography.bodyMedium,
    fontSize: 14,
    lineHeight: 19,
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
  applyText: {
    fontFamily: swapLibroNavbarTypography.bodySemibold,
    fontSize: 16,
    lineHeight: 21,
  },
});
