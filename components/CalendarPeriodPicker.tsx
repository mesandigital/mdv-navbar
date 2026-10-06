import React, { useMemo } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export type CalendarPeriodPickerMode = 'monthly' | 'weekly';
export type CalendarPeriodPickerTheme = {
  background: string;
  surface: string;
  tile: string;
  text: string;
  muted: string;
  border: string;
  selectedSurface: string;
  selectedText: string;
  accent: string;
};
export type CalendarPeriodPickerThemeOverride =
  Partial<CalendarPeriodPickerTheme>;
export const calendarPeriodPickerTheme: CalendarPeriodPickerTheme = {
  background: '#F5F7F3',
  surface: '#FFFFFF',
  tile: '#EEF1EC',
  text: '#12211C',
  muted: '#66756E',
  border: '#E1E7E1',
  selectedSurface: '#12211C',
  selectedText: '#EEF1EC',
  accent: '#0E5A4A',
};
export type CalendarPeriodPickerProps = {
  visible: boolean;
  inline?: boolean;
  renderHeader?: (props: {
    title: string;
    description?: string;
    onClose: () => void;
  }) => React.ReactNode;
  mode?: CalendarPeriodPickerMode;
  modeOptions?: CalendarPeriodPickerMode[];
  onModeChange?: (mode: CalendarPeriodPickerMode) => void;
  title?: string;
  description?: string;
  selectedOffset?: number;
  initialDate?: Date;
  monthlyStartDay?: number;
  weeksToShow?: number;
  monthsToShow?: number;
  disabledOffsets?: number[];
  onBlockedSelect?: (offset: number) => void;
  theme?: CalendarPeriodPickerThemeOverride;
  onClose: () => void;
  onSelect: (offset: number) => void;
};

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const displayDate = (date: Date, includeYear = false) =>
  date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(includeYear ? { year: 'numeric' as const } : {}),
  });
const monthName = (date: Date) =>
  date.toLocaleDateString('en-GB', { month: 'short' });
const mondayOf = (date: Date) => {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = result.getDay() || 7;
  result.setDate(result.getDate() - day + 1);
  return result;
};
const cycleStart = (date: Date, startDay: number) =>
  new Date(
    date.getFullYear(),
    date.getMonth() - (date.getDate() < startDay ? 1 : 0),
    startDay,
  );

export function CalendarPeriodPicker({
  visible,
  inline = false,
  renderHeader,
  mode = 'monthly',
  modeOptions,
  onModeChange,
  title = 'Choose period',
  description,
  selectedOffset = 0,
  initialDate = new Date(),
  monthlyStartDay = 1,
  weeksToShow = 12,
  monthsToShow = 15,
  disabledOffsets = [],
  onBlockedSelect,
  theme: themeOverride,
  onClose,
  onSelect,
}: CalendarPeriodPickerProps) {
  const theme = { ...calendarPeriodPickerTheme, ...themeOverride };
  const anchor = useMemo(
    () =>
      mode === 'weekly'
        ? mondayOf(initialDate)
        : cycleStart(initialDate, monthlyStartDay),
    [initialDate, mode, monthlyStartDay],
  );
  const periodCount = mode === 'weekly' ? weeksToShow : monthsToShow;
  const pastCount = Math.min(
    mode === 'weekly' ? 8 : 12,
    Math.max(periodCount - 1, 0),
  );
  const futureCount = Math.max(periodCount - pastCount - 1, 0);
  const offsets = [
    0,
    ...Array.from({ length: pastCount }, (_, index) => -(index + 1)),
    ...Array.from({ length: futureCount }, (_, index) => index + 1),
  ];
  const pickerContent = (
    <SafeAreaProvider>
      <SafeAreaView
        edges={['top', 'bottom', 'left', 'right']}
        style={[styles.safeArea, { backgroundColor: theme.background }]}
      >
        {renderHeader ? (
          renderHeader({ title, description, onClose })
        ) : (
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            {description ? (
              <Text style={[styles.description, { color: theme.muted }]}>
                {description}
              </Text>
            ) : null}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close period picker"
            onPress={onClose}
            style={[styles.doneButton, { backgroundColor: theme.accent }]}
          >
            <Text style={[styles.doneText, { color: theme.selectedText }]}>
              Close
            </Text>
          </Pressable>
        </View>
        )}
        {modeOptions && modeOptions.length > 1 && onModeChange ? (
          <View style={styles.modePicker}>
            {modeOptions.map(option => (
              <Pressable
                key={option}
                accessibilityRole="tab"
                accessibilityState={{ selected: option === mode }}
                onPress={() => onModeChange(option)}
                style={[
                  styles.modeOption,
                  option === mode && {
                    backgroundColor: theme.selectedSurface,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.modeOptionText,
                    {
                      color: option === mode ? theme.selectedText : theme.muted,
                    },
                  ]}
                >
                  {option === 'weekly' ? 'Week' : 'Month'}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.weekdayRow}>
            {DAY_LABELS.map((day, index) => (
              <Text
                key={`${day}-${index}`}
                style={[styles.weekday, { color: theme.muted }]}
              >
                {day}
              </Text>
            ))}
          </View>
          {offsets.map(offset => (
            <PeriodCard
              key={offset}
              mode={mode}
              offset={offset}
              anchor={anchor}
              monthlyStartDay={monthlyStartDay}
              selected={offset === selectedOffset}
              disabled={disabledOffsets.includes(offset)}
              theme={theme}
              onPress={() => {
                if (disabledOffsets.includes(offset)) {
                  onBlockedSelect?.(offset);
                  return;
                }
                onSelect(offset);
              }}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );

  if (inline) return pickerContent;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      {pickerContent}
    </Modal>
  );
}

function PeriodCard({
  mode,
  offset,
  anchor,
  monthlyStartDay,
  selected,
  disabled,
  theme,
  onPress,
}: {
  mode: CalendarPeriodPickerMode;
  offset: number;
  anchor: Date;
  monthlyStartDay: number;
  selected: boolean;
  theme: CalendarPeriodPickerTheme;
  onPress: () => void;
  disabled: boolean;
}) {
  const isCurrent = offset === 0;
  const isFuture = offset > 0;
  const isSelected = selected && !isFuture && !disabled;
  const start =
    mode === 'weekly'
      ? new Date(
          anchor.getFullYear(),
          anchor.getMonth(),
          anchor.getDate() + offset * 7,
        )
      : new Date(
          anchor.getFullYear(),
          anchor.getMonth() + offset,
          monthlyStartDay,
        );
  const end =
    mode === 'weekly'
      ? new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6)
      : new Date(
          start.getFullYear(),
          start.getMonth() + 1,
          monthlyStartDay - 1,
        );
  const cells: Array<Date | null> =
    mode === 'weekly'
      ? Array.from(
          { length: 7 },
          (_, index) =>
            new Date(
              start.getFullYear(),
              start.getMonth(),
              start.getDate() + index,
            ),
        )
      : [
          start,
          new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1),
          new Date(start.getFullYear(), start.getMonth(), start.getDate() + 2),
          null,
          new Date(end.getFullYear(), end.getMonth(), end.getDate() - 2),
          new Date(end.getFullYear(), end.getMonth(), end.getDate() - 1),
          end,
        ];
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{
        selected: isSelected,
        disabled: isFuture || disabled,
      }}
      disabled={isFuture}
      onPress={isFuture ? undefined : onPress}
      style={[
        styles.card,
        {
          backgroundColor: isSelected
            ? theme.selectedSurface
            : isFuture
            ? theme.background
            : theme.surface,
          borderColor: isSelected ? theme.selectedSurface : theme.border,
          opacity: isFuture ? 0.55 : disabled ? 0.7 : 1,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleWrap}>
          <Text
            style={[
              styles.cardTitle,
              { color: isSelected ? theme.selectedText : theme.text },
            ]}
          >
            {mode === 'weekly'
              ? `${displayDate(start)} → ${displayDate(end)}`
              : `${monthName(start)} → ${monthName(end)}`}
          </Text>
          <Text
            style={[
              styles.cardCaption,
              { color: isSelected ? theme.selectedText : theme.muted },
            ]}
          >
            {displayDate(start, mode === 'monthly')} –{' '}
            {displayDate(end, mode === 'monthly')}
          </Text>
        </View>
        {disabled ? (
          <Text style={[styles.selected, { color: theme.muted }]}>Pro</Text>
        ) : isCurrent || isSelected ? (
          <Text
            style={[
              styles.selected,
              { color: isSelected ? theme.selectedText : theme.accent },
            ]}
          >
            {isCurrent ? 'Live' : 'Selected'}
          </Text>
        ) : isFuture ? (
          <Text style={[styles.selected, { color: theme.muted }]}>
            Upcoming
          </Text>
        ) : null}
      </View>
      <View style={styles.dateRow}>
        {cells.map((cell, index) => (
          <View
            key={`${offset}-${index}`}
            style={[
              styles.dateCell,
              { backgroundColor: isSelected ? theme.background : theme.tile },
            ]}
          >
            <Text style={[styles.dateText, { color: theme.text }]}>
              {cell ? cell.getDate() : '…'}
            </Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  modePicker: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: 12,
  },
  modeOption: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  modeOptionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  headerText: { flex: 1 },
  title: { fontSize: 22, fontWeight: '600' },
  description: { fontSize: 13, fontWeight: '600', marginTop: 3 },
  doneButton: {
    minHeight: 38,
    borderRadius: 20,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  doneText: { fontSize: 13, fontWeight: '600' },
  content: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 40 },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  weekday: { width: 32, fontSize: 11, fontWeight: '600', textAlign: 'center' },
  card: { borderWidth: 1, borderRadius: 18, padding: 14, marginBottom: 10 },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitleWrap: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardCaption: { fontSize: 12, marginTop: 2 },
  selected: { fontSize: 12, fontWeight: '600' },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
    marginTop: 12,
  },
  dateCell: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: { fontSize: 12, fontWeight: '600' },
});

export default CalendarPeriodPicker;
