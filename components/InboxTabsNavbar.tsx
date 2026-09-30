import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import {
  SwapLibroNavbarThemeOverride,
  mergeSwapLibroNavbarTheme,
  swapLibroNavbarTypography,
} from '../theme';

export type InboxPrimaryTab = 'requests' | 'notifications';
export type InboxSecondaryTabKey = string;

export type InboxNavbarPrimaryTab<PrimaryTab extends string = InboxPrimaryTab> =
  {
    key: PrimaryTab;
    label: string;
    badgeCount?: number;
  };

export type InboxNavbarSecondaryTab<SecondaryTab extends string = string> = {
  key: SecondaryTab;
  label: string;
};

export type InboxTabsNavbarProps<
  PrimaryTab extends string = InboxPrimaryTab,
  SecondaryTab extends string = string,
> = {
  displayName?: string | null;
  activeTab: PrimaryTab;
  primaryTabs?: InboxNavbarPrimaryTab<PrimaryTab>[];
  secondaryTabs: InboxNavbarSecondaryTab<SecondaryTab>[];
  selectedSecondaryTab: SecondaryTab;
  markAllReadLabel?: string;
  markAllReadPendingLabel?: string;
  showMarkAllRead?: boolean;
  markAllReadPending?: boolean;
  settingsAccessibilityLabel?: string;
  theme?: SwapLibroNavbarThemeOverride;
  onTabPress: (tab: PrimaryTab) => void;
  onSecondaryTabPress: (tab: SecondaryTab) => void;
  onSettingsPress?: () => void;
  onMarkAllReadPress?: () => void;
};

const DEFAULT_PRIMARY_TABS: InboxNavbarPrimaryTab<InboxPrimaryTab>[] = [
  { key: 'requests', label: 'Requests' },
  { key: 'notifications', label: 'Notifications' },
];

function useTheme(theme?: SwapLibroNavbarThemeOverride) {
  return React.useMemo(() => mergeSwapLibroNavbarTheme(theme), [theme]);
}

export function InboxTabsNavbar<
  PrimaryTab extends string = InboxPrimaryTab,
  SecondaryTab extends string = string,
>({
  activeTab,
  primaryTabs = DEFAULT_PRIMARY_TABS as InboxNavbarPrimaryTab<PrimaryTab>[],
  secondaryTabs,
  selectedSecondaryTab,
  markAllReadLabel = 'Mark all read',
  markAllReadPendingLabel = 'Marking...',
  showMarkAllRead = false,
  markAllReadPending = false,
  settingsAccessibilityLabel = 'Open notification preferences',
  theme: themeOverride,
  onTabPress,
  onSecondaryTabPress,
  onSettingsPress,
  onMarkAllReadPress,
}: InboxTabsNavbarProps<PrimaryTab, SecondaryTab>) {
  const theme = useTheme(themeOverride);

  return (
    <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.topRow}>
        <View style={styles.headerSideSpacer} />

        <View style={styles.primaryTabs}>
          {primaryTabs.map(tab => {
            const selected = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => onTabPress(tab.key)}
                style={styles.primaryTab}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                accessibilityLabel={
                  tab.badgeCount
                    ? `${tab.label}, ${tab.badgeCount} unread`
                    : tab.label
                }
              >
                <View style={styles.primaryTabLabelRow}>
                  <Text
                    style={[
                      styles.primaryTabText,
                      { color: theme.colors.textPrimary },
                      selected ? styles.primaryTabTextSelected : null,
                    ]}
                  >
                    {tab.label}
                  </Text>
                  {tab.badgeCount ? (
                    <View
                      style={[
                        styles.primaryBadge,
                        { backgroundColor: theme.colors.accent },
                      ]}
                    >
                      <Text
                        style={[
                          styles.primaryBadgeText,
                          { color: theme.colors.success },
                        ]}
                      >
                        {tab.badgeCount > 99 ? '99+' : tab.badgeCount}
                      </Text>
                    </View>
                  ) : null}
                </View>
                {selected ? (
                  <View
                    style={[
                      styles.primaryUnderline,
                      { backgroundColor: theme.colors.textPrimary },
                    ]}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {onSettingsPress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={settingsAccessibilityLabel}
            onPress={onSettingsPress}
            hitSlop={10}
            style={styles.settingsButton}
          >
            <MaterialDesignIcons
              name="cog-outline"
              size={24}
              color={theme.colors.textPrimary}
            />
          </Pressable>
        ) : (
          <View style={styles.settingsButton} />
        )}
      </View>

      <View style={styles.secondaryTabs}>
        <View style={styles.secondaryPillGroup}>
          {secondaryTabs.map(tab => {
            const selected = selectedSecondaryTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => onSecondaryTabPress(tab.key)}
                style={[
                  styles.secondaryPill,
                  { backgroundColor: theme.colors.surfaceMuted },
                  selected
                    ? { backgroundColor: theme.colors.surfaceSelected }
                    : null,
                ]}
              >
                <Text
                  style={[
                    styles.secondaryPillText,
                    { color: theme.colors.textSecondary },
                    selected ? { color: theme.colors.success } : null,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {showMarkAllRead && onMarkAllReadPress ? (
          <Pressable
            disabled={markAllReadPending}
            onPress={onMarkAllReadPress}
            style={[
              styles.markAllPill,
              {
                backgroundColor: theme.colors.inputBackground,
                borderColor: theme.colors.border,
              },
              markAllReadPending ? styles.disabledButton : null,
            ]}
          >
            <Text
              style={[
                styles.markAllPillText,
                { color: theme.colors.textPrimary },
              ]}
            >
              {markAllReadPending ? markAllReadPendingLabel : markAllReadLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export const InboxNavbar = InboxTabsNavbar;

const styles = StyleSheet.create({
  header: {
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 16,
  },
  topRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerSideSpacer: {
    width: 34,
    height: 34,
  },
  primaryTabs: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  primaryTab: {
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryTabText: {
    fontFamily: swapLibroNavbarTypography.display,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
  },
  primaryTabTextSelected: {
    fontWeight: '600',
  },
  primaryTabLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  primaryBadge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBadgeText: {
    fontFamily: swapLibroNavbarTypography.body,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
  },
  primaryUnderline: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 3,
    borderRadius: 999,
  },
  settingsButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  secondaryPillGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  secondaryPill: {
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  secondaryPillText: {
    fontFamily: swapLibroNavbarTypography.body,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '600',
  },
  markAllPill: {
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 13,
    borderWidth: 1,
  },
  markAllPillText: {
    fontFamily: swapLibroNavbarTypography.body,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.55,
  },
});
