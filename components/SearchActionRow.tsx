import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export type SearchActionRowProps = {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchPress?: () => void;
  onActionPress?: () => void;
  actionIcon: React.ReactNode;
  actionAccessibilityLabel: string;
  searchIcon?: React.ReactNode;
  colors?: {
    inputBackground?: string;
    inputIcon?: string;
    inputText?: string;
    placeholder?: string;
    actionBackground?: string;
  };
  fontFamily?: string;
  style?: StyleProp<ViewStyle>;
  searchBoxStyle?: StyleProp<ViewStyle>;
  actionButtonStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  placeholderStyle?: StyleProp<TextStyle>;
};

export function SearchActionRow({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onSearchPress,
  onActionPress,
  actionIcon,
  actionAccessibilityLabel,
  searchIcon,
  colors,
  fontFamily = 'PlusJakartaSans_500Medium',
  style,
  searchBoxStyle,
  actionButtonStyle,
  inputStyle,
  placeholderStyle,
}: SearchActionRowProps) {
  const inputBackground = colors?.inputBackground ?? '#F4F4F6';
  const inputIcon = colors?.inputIcon ?? '#6B6B76';
  const inputText = colors?.inputText ?? '#0B0B0F';
  const placeholder = colors?.placeholder ?? inputIcon;
  const actionBackground = colors?.actionBackground ?? inputText;

  return (
    <View style={[styles.row, style]}>
      {onSearchPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={searchPlaceholder}
          onPress={onSearchPress}
          style={({ pressed }) => [
            styles.searchBox,
            { backgroundColor: inputBackground },
            searchBoxStyle,
            pressed && styles.pressed,
          ]}
        >
          {searchIcon ?? <SearchIcon color={inputIcon} />}
          <Text
            style={[
              styles.searchPlaceholder,
              { color: placeholder, fontFamily },
              placeholderStyle,
            ]}
          >
            {searchPlaceholder}
          </Text>
        </Pressable>
      ) : (
        <View
          style={[
            styles.searchBox,
            { backgroundColor: inputBackground },
            searchBoxStyle,
          ]}
        >
          {searchIcon ?? <SearchIcon color={inputIcon} />}
          <TextInput
            accessibilityLabel={searchPlaceholder}
            placeholder={searchPlaceholder}
            placeholderTextColor={placeholder}
            value={searchValue}
            onChangeText={onSearchChange}
            style={[
              styles.searchInput,
              { color: inputText, fontFamily },
              inputStyle,
            ]}
          />
        </View>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={actionAccessibilityLabel}
        disabled={!onActionPress}
        onPress={onActionPress}
        style={({ pressed }) => [
          styles.actionButton,
          { backgroundColor: actionBackground },
          actionButtonStyle,
          pressed && styles.pressed,
        ]}
      >
        {actionIcon}
      </Pressable>
    </View>
  );
}

function SearchIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Circle
        cx={11}
        cy={11}
        r={6.5}
        fill="none"
        stroke={color}
        strokeWidth={1.9}
      />
      <Path
        d="m16 16 4 4"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  searchBox: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
  },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 0 },
  searchPlaceholder: { flex: 1, fontSize: 15 },
  actionButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.66 },
});
