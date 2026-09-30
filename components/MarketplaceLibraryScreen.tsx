import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { mergeSwapLibroNavbarTheme } from '../theme';
import {
  CatalogMarketplaceNavbar,
  type CatalogMarketplaceNavbarProps,
} from './CatalogMarketplaceNavbar';

export type MarketplaceLibraryScreenProps = {
  navbarProps: CatalogMarketplaceNavbarProps;
  children: React.ReactNode;
  footer?: React.ReactNode;
  safeAreaEdges?: Edge[];
  testID?: string;
};

/**
 * Shared marketplace-style library shell. Consumers own their data and list
 * rendering; this component keeps the safe area, navbar and content layout
 * consistent between apps and library types.
 */
export function MarketplaceLibraryScreen({
  navbarProps,
  children,
  footer,
  safeAreaEdges = ['top'],
  testID,
}: MarketplaceLibraryScreenProps) {
  const resolvedTheme = React.useMemo(
    () => mergeSwapLibroNavbarTheme(navbarProps.theme),
    [navbarProps.theme],
  );

  return (
    <SafeAreaView
      edges={safeAreaEdges}
      style={[styles.screen, { backgroundColor: resolvedTheme.colors.surface }]}
      testID={testID}
    >
      <CatalogMarketplaceNavbar {...navbarProps} />
      {footer}
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default MarketplaceLibraryScreen;
