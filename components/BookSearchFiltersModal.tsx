import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons/static";
import {
  SwapLibroNavbarThemeOverride,
  mergeSwapLibroNavbarTheme,
  swapLibroNavbarTypography,
} from "../theme";

export type BookSearchCreditRange = "one" | "two-to-three" | "four-plus";

export type BookSearchFiltersValue = {
  /** @deprecated Distance filtering is no longer rendered or applied. */
  distanceKm?: number;
  location?: string;
  locationGroup?: string;
  conditions: string[];
  genres: string[];
  creditRange?: BookSearchCreditRange;
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
  resultCount: number;
  safeAreaInsets?: Partial<BookSearchSafeAreaInsets>;
  theme?: SwapLibroNavbarThemeOverride;
  onChange: (value: BookSearchFiltersValue) => void;
  onReset: () => void;
  onClose: () => void;
  onApply: () => void;
};

const CREDIT_OPTIONS: Array<{
  value: BookSearchCreditRange;
  label: string;
}> = [
  { value: "one", label: "1 credit" },
  { value: "two-to-three", label: "2–3 credits" },
  { value: "four-plus", label: "4+ credits" },
];

const DEFAULT_SAFE_AREA_INSETS: BookSearchSafeAreaInsets = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function BookSearchFiltersModal({
  visible,
  value,
  locationGroups = [],
  conditionOptions,
  genreOptions,
  resultCount,
  safeAreaInsets: safeAreaInsetsOverride,
  theme: themeOverride,
  onChange,
  onReset,
  onClose,
  onApply,
}: BookSearchFiltersModalProps) {
  const [openLocationMenu, setOpenLocationMenu] = React.useState<
    "group" | "location" | null
  >(null);
  const safeAreaInsets = {
    top: safeAreaInsetsOverride?.top ?? DEFAULT_SAFE_AREA_INSETS.top,
    right: safeAreaInsetsOverride?.right ?? DEFAULT_SAFE_AREA_INSETS.right,
    bottom: safeAreaInsetsOverride?.bottom ?? DEFAULT_SAFE_AREA_INSETS.bottom,
    left: safeAreaInsetsOverride?.left ?? DEFAULT_SAFE_AREA_INSETS.left,
  };
  const theme = React.useMemo(
    () => mergeSwapLibroNavbarTheme(themeOverride),
    [themeOverride]
  );
  const selectedLocationGroup = locationGroups.find(
    (group) =>
      group.label === value.locationGroup ||
      Boolean(value.location && group.options.includes(value.location))
  );
  const booksLabel = resultCount === 1 ? "book" : "books";

  return (
    <Modal
      visible={visible}
      animationType="slide"
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
            accessibilityLabel="Close filters"
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
            Filters
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reset filters"
            onPress={onReset}
            hitSlop={8}
            style={styles.resetButton}
          >
            <Text style={[styles.resetText, { color: theme.colors.textMuted }]}>
              Reset
            </Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.group}>
            <Text
              style={[styles.groupTitle, { color: theme.colors.textMuted }]}
            >
              Location
            </Text>
            <Text style={[styles.groupHint, { color: theme.colors.textMuted }]}>
              Pick an area first, then a barrio.
            </Text>
            <View style={styles.locationStack}>
              <LocationDropdownButton
                label="Area"
                value={selectedLocationGroup?.label}
                placeholder="Select an area"
                open={openLocationMenu === "group"}
                theme={theme}
                onPress={() =>
                  setOpenLocationMenu((current) =>
                    current === "group" ? null : "group"
                  )
                }
              />
              {openLocationMenu === "group" ? (
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
                    label="Any location"
                    selected={!value.locationGroup && !value.location}
                    theme={theme}
                    onPress={() => {
                      onChange({
                        ...value,
                        locationGroup: undefined,
                        location: undefined,
                      });
                      setOpenLocationMenu(null);
                    }}
                  />
                  {locationGroups.map((group) => (
                    <LocationChoice
                      key={group.label}
                      label={group.label}
                      selected={selectedLocationGroup?.label === group.label}
                      theme={theme}
                      onPress={() => {
                        onChange({
                          ...value,
                          locationGroup: group.label,
                          location: undefined,
                        });
                        setOpenLocationMenu(null);
                      }}
                    />
                  ))}
                </View>
              ) : null}

              <LocationDropdownButton
                label="Barrio"
                value={value.location}
                placeholder={
                  selectedLocationGroup
                    ? "Select a barrio"
                    : "Select an area first"
                }
                open={openLocationMenu === "location"}
                disabled={!selectedLocationGroup}
                theme={theme}
                onPress={() => {
                  if (selectedLocationGroup) {
                    setOpenLocationMenu((current) =>
                      current === "location" ? null : "location"
                    );
                  }
                }}
              />
              {openLocationMenu === "location" && selectedLocationGroup ? (
                <View
                  style={[
                    styles.locationMenu,
                    {
                      backgroundColor: theme.colors.inputBackground,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  {selectedLocationGroup.options.map((location) => (
                    <LocationChoice
                      key={location}
                      label={location}
                      selected={value.location === location}
                      theme={theme}
                      onPress={() => {
                        onChange({
                          ...value,
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
          </View>

          <View
            style={[
              styles.dividerBand,
              { backgroundColor: theme.colors.surfaceMuted },
            ]}
          />

          <FilterGroup
            title="Condition"
            options={conditionOptions}
            selectedValues={value.conditions}
            theme={theme}
            onPress={(condition) =>
              onChange({
                ...value,
                conditions: toggleValue(value.conditions, condition),
              })
            }
          />

          <FilterGroup
            title="Genre"
            options={genreOptions}
            selectedValues={value.genres}
            theme={theme}
            onPress={(genre) =>
              onChange({
                ...value,
                genres: toggleValue(value.genres, genre),
              })
            }
          />

          <View style={styles.group}>
            <Text
              style={[styles.groupTitle, { color: theme.colors.textMuted }]}
            >
              Credit value
            </Text>
            <View style={styles.optionRow}>
              {CREDIT_OPTIONS.map((option) => {
                const selected = value.creditRange === option.value;
                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selected }}
                    onPress={() =>
                      onChange({
                        ...value,
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
        </ScrollView>

        <View
          style={[
            styles.footer,
            {
              backgroundColor: theme.colors.inputBackground,
              borderColor: theme.colors.border,
              paddingBottom: Math.max(22, safeAreaInsets.bottom),
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Show ${resultCount} ${booksLabel}`}
            onPress={onApply}
            style={[
              styles.applyButton,
              { backgroundColor: theme.colors.accent },
            ]}
          >
            <Text style={[styles.applyText, { color: theme.colors.surface }]}>
              Show {resultCount} {booksLabel}
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
      <View>
        <Text style={[styles.locationLabel, { color: theme.colors.textMuted }]}>
          {label}
        </Text>
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
        name={open ? "chevron-up" : "chevron-down"}
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
      <Text style={[styles.groupTitle, { color: theme.colors.textMuted }]}>
        {title}
      </Text>
      <View style={styles.optionRow}>
        {options.map((option) => {
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
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  title: {
    position: "absolute",
    right: 80,
    left: 80,
    textAlign: "center",
    fontFamily: swapLibroNavbarTypography.display,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
  },
  resetButton: { paddingVertical: 9, paddingLeft: 14 },
  resetText: {
    fontFamily: swapLibroNavbarTypography.body,
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: "600",
  },
  content: { paddingBottom: 28 },
  group: { paddingHorizontal: 20, paddingTop: 22 },
  groupTitle: {
    marginBottom: 10,
    fontFamily: swapLibroNavbarTypography.catalog,
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  groupHint: {
    fontFamily: swapLibroNavbarTypography.catalog,
    fontSize: 12,
    lineHeight: 17,
    marginTop: -4,
    marginBottom: 12,
  },
  locationStack: { gap: 8 },
  locationDropdown: {
    minHeight: 58,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationDisabled: { opacity: 0.55 },
  locationLabel: {
    fontFamily: swapLibroNavbarTypography.catalog,
    fontSize: 9.5,
    lineHeight: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  locationValue: {
    fontFamily: swapLibroNavbarTypography.body,
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: "600",
  },
  locationMenu: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  locationChoice: {
    minHeight: 44,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationChoiceText: {
    fontFamily: swapLibroNavbarTypography.body,
    fontSize: 13,
    lineHeight: 18,
  },
  dividerBand: { height: 8, marginTop: 22 },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  optionChip: {
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  optionText: {
    fontFamily: swapLibroNavbarTypography.body,
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  applyButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  applyText: {
    fontFamily: swapLibroNavbarTypography.body,
    fontSize: 14.5,
    lineHeight: 19,
    fontWeight: "600",
  },
});
