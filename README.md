# mdv-swaplibro-navbar

Reusable React Native navbars extracted from SwapLibro:

- `BookListingsNavbar` for the book listings screen brand row, search action, layout toggle, create action, and category filter tabs.
- `BookListingsSearchBar` for the matching listing/search input UI.
- `CatalogMarketplaceNavbar` for reusable marketplace-style headers with brand/title options, search, actions, pill filters, and filled/content-sized segment tabs.
- `MarketplaceLibraryScreen` for a full safe-area screen shell that renders `CatalogMarketplaceNavbar` above caller-owned content.
- `TabbedMarketplaceLibraryScreen` for multi-section marketplace/library screens with title tabs, per-section search, and category state.
- `InboxTabsNavbar` for the inbox top tabs, secondary filter pills, settings action, and optional mark-all-read action.
- `StickyBookListingsFilterView` / `BookListingsStickyNavbar` for sticky brand + category tabs in list screens.
- `BookSearchFilterStrip` for the search modal's horizontal selected filter chips.
- `BookSearchFiltersModal` for the complete reusable location, condition, genre, and credit-value filter view.

## Install

From a local app during development:

```sh
npm install /Users/mosesesan/Documents/Projects/MesanDigitalVentures/projects/mdv-trackers-master/src/modules/swaplibro-navbar
```

Or publish/install as `mdv-swaplibro-navbar` when the module is available from your registry or Git remote.

## Peer dependencies

The consuming app must provide:

- `react`
- `react-native`
- `@react-native-vector-icons/material-design-icons`

## Book listings navbar

```tsx
import {
  BookListingsNavbar,
  BookListingsSearchBar,
} from 'mdv-swaplibro-navbar';

<BookListingsNavbar
  categories={['Fiction', 'Business', 'History']}
  layout={layout}
  selectedCategory={category}
  onSearchPress={openSearch}
  onCreatePress={openCreateListing}
  onLayoutChange={setLayout}
  onCategoryPress={setCategory}
/>;

<BookListingsSearchBar label={query} onPress={openSearch} />;
```

`BookListingsNavbar` is an alias of `CatalogMarketplaceNavbar`. Compatibility aliases are also exported for the original SwapLibro names:

- `CatalogMarketplaceNavbar`
- `CatalogMarketplaceBrandBar`
- `CatalogMarketplaceCategoryTabs`
- `CatalogMarketplaceSearchBar`

## Catalog marketplace navbar

Use `CatalogMarketplaceNavbar` directly when a screen already owns its safe area, list, and content layout but should share the marketplace header chrome.

```tsx
import { CatalogMarketplaceNavbar } from 'mdv-swaplibro-navbar';

<CatalogMarketplaceNavbar
  brandLabel="Inbox"
  categories={['Messages', 'Activity']}
  categoryVariant="segments"
  segmentSizing="fill"
  includeAllCategory={false}
  selectedCategory={section === 'messages' ? 'Messages' : 'Activity'}
  showSearch={false}
  onCategoryPress={category => {
    setSection(category === 'Messages' ? 'messages' : 'activity');
  }}
/>;
```

Category rendering modes:

- `categoryVariant="pills"` renders horizontal rounded filter pills. This is the default.
- `categoryVariant="segments"` renders tab-like text segments with an underline.
- `segmentSizing="fill"` makes segment tabs divide all available width evenly.
- `segmentSizing="content"` makes segment tabs size to their label and scroll horizontally.
- `includeAllCategory={false}` removes the generated `All` option when your categories already represent the full state.

Useful supporting props:

- `showSearch={false}` keeps only the brand/action row and category/segment row.
- `searchBarStyle` lets a host app tune the search field dimensions without
  forking the shared navbar (for example, `{ minHeight: 44, borderRadius: 10 }`).
- `titleOptions` and `selectedTitleOption` replace `brandLabel` with top-level tabs.
- `titleAccessory` renders custom controls beside the brand/title row.
- `theme={{ colors: { ... } }}` lets host apps adapt the navbar to their app theme.

## Marketplace library screen

Use `MarketplaceLibraryScreen` when the shared navbar should own the safe-area shell and the consuming screen only needs to render content underneath it.

```tsx
import { MarketplaceLibraryScreen } from 'mdv-swaplibro-navbar';

<MarketplaceLibraryScreen
  navbarProps={{
    brandLabel: 'Training',
    categories: ['Programs', 'Exercises'],
    selectedCategory,
    categoryVariant: 'segments',
    segmentSizing: 'fill',
    showSearch: false,
    onCategoryPress: setSelectedCategory,
  }}
>
  <TrainingLibraryList />
</MarketplaceLibraryScreen>;
```

Do not nest `MarketplaceLibraryScreen` inside another screen header. If your feature already owns the safe area and list layout, use `CatalogMarketplaceNavbar` directly.

## Tabbed marketplace library screen

Use `TabbedMarketplaceLibraryScreen` for screens with multiple top-level sections where each section has its own search/category/filter state.

```tsx
import { TabbedMarketplaceLibraryScreen } from 'mdv-swaplibro-navbar';

<TabbedMarketplaceLibraryScreen
  sections={[
    {
      key: 'programs',
      label: 'Programs',
      categories: [
        { key: 'all', label: 'All' },
        { key: 'strength', label: 'Strength' },
      ],
      searchPlaceholder: 'Search programs',
    },
    {
      key: 'exercises',
      label: 'Exercises',
      categories: [
        { key: 'upper', label: 'Upper' },
        { key: 'lower', label: 'Lower' },
      ],
      searchPlaceholder: 'Search exercises',
    },
  ]}
  renderContent={({ section, searchValue, selectedCategoryKey }) => (
    <LibrarySection
      sectionKey={section.key}
      query={searchValue}
      category={selectedCategoryKey}
    />
  )}
/>;
```

Each section can independently configure `showSearch`, `categoryVariant`,
`segmentSizing`, and `includeAllCategory`. Use `badgeCount` for unread or
pending totals and `titleAccessory` for a compact section-specific action.

## Sticky listings header

Use `BookListingsStickyNavbar` when the book listings screen should keep both the brand row and category filters sticky in a `SectionList`.

```tsx
import { BookListingsStickyNavbar } from 'mdv-swaplibro-navbar';

<SectionList
  sections={[{ title: 'books', data: rows }]}
  stickySectionHeadersEnabled
  renderSectionHeader={() => (
    <BookListingsStickyNavbar
      layout={layout}
      categories={categories}
      selectedCategory={selectedCategory}
      onSearchPress={openSearch}
      onCreatePress={openCreateListing}
      onLayoutChange={setLayout}
      onCategoryPress={setCategory}
    />
  )}
  renderItem={renderBookRow}
/>;
```

If a screen only needs the category tabs without the brand row, set `showBrandBar={false}`.

```tsx
<BookListingsStickyNavbar
  showBrandBar={false}
  categories={categories}
  selectedCategory={selectedCategory}
  onCategoryPress={setCategory}
/>
```

## Search filter strip

Use `BookSearchFilterStrip` for the horizontal filter chips in search/modal screens.

```tsx
import { BookSearchFilterStrip } from 'mdv-swaplibro-navbar';

type SearchFilterKey = 'all' | 'location' | 'condition' | 'genres' | 'credits';

const filterButtons = [
  { key: 'all' as const, label: 'All', selected: !hasActiveFilters },
  { key: 'location' as const, label: 'Location', selected: Boolean(location) },
  {
    key: 'condition' as const,
    label: conditionLabel,
    selected: conditions.length > 0,
  },
  {
    key: 'genres' as const,
    label: 'Genres',
    selected: genres.length > 0,
  },
  {
    key: 'credits' as const,
    label: creditLabel,
    selected: Boolean(creditRange),
  },
];

<BookSearchFilterStrip<SearchFilterKey>
  visible={hasSearchIntent}
  filters={filterButtons}
  onFilterPress={setOptionSheet}
/>;
```

## Full search filters

`BookSearchFiltersModal` is controlled: the consuming app owns the filter state and applies it to its own data source. Conditions and genres support multiple selections.

```tsx
import {
  BookSearchFiltersModal,
  type BookSearchFiltersValue,
} from 'mdv-swaplibro-navbar';

const [filters, setFilters] = React.useState<BookSearchFiltersValue>({
  locationGroup: undefined,
  location: undefined,
  conditions: [],
  genres: [],
  creditRange: undefined,
});

<BookSearchFiltersModal
  visible={filtersVisible}
  value={filters}
  locationGroups={[
    { label: 'Ciutat Vella', options: ['El Raval', 'Barri Gòtic'] },
    { label: 'Eixample', options: ['Dreta de l’Eixample', 'Sant Antoni'] },
  ]}
  conditionOptions={[
    { value: 'fair', label: 'Fair' },
    { value: 'good', label: 'Good' },
    { value: 'like-new', label: 'Like new' },
  ]}
  genreOptions={categories.map(value => ({ value, label: value }))}
  resultCount={filteredBooks.length}
  safeAreaInsets={safeAreaInsets}
  onChange={setFilters}
  onReset={() =>
    setFilters({
      locationGroup: undefined,
      location: undefined,
      conditions: [],
      genres: [],
      creditRange: undefined,
    })
  }
  onClose={() => setFiltersVisible(false)}
  onApply={() => setFiltersVisible(false)}
/>;
```

Genre chips and the header are optional:

- `expandGenresInline` shows the selected genres, then `popularGenreValues`, as chips with a “See all N genres” button that expands every genre as chips in place (“Show fewer genres” collapses them). Use it instead of `onAllGenresPress` when you don't want a separate genre picker.
- `showHeader={false}` hides the built-in close / title / Reset header, for a host screen that shows a native navigation header with those actions. The host's Reset should set `value` to an empty filter; the view resets its draft from `value`.

## Inbox tabs navbar

```tsx
import { InboxTabsNavbar } from 'mdv-swaplibro-navbar';

<InboxTabsNavbar
  displayName={displayName}
  activeTab={activeTab}
  secondaryTabs={
    activeTab === 'requests'
      ? [
          { key: 'all', label: 'All' },
          { key: 'incoming', label: 'Received' },
          { key: 'outgoing', label: 'Sent' },
        ]
      : [
          { key: 'unread', label: 'Unread' },
          { key: 'all', label: 'All' },
        ]
  }
  selectedSecondaryTab={
    activeTab === 'requests' ? requestFilter : notificationFilter
  }
  showMarkAllRead={activeTab === 'notifications' && unreadCount > 0}
  markAllReadPending={markAllReadPending}
  onTabPress={setActiveTab}
  onSecondaryTabPress={setFilterForActiveTab}
  onSettingsPress={openSettings}
  onMarkAllReadPress={markAllRead}
/>;
```

## Theming

Pass a partial `theme` to override colors while keeping defaults:

```tsx
<BookListingsNavbar theme={{ colors: { accent: '#2563EB' } }} {...props} />
```

## Calendar period picker

`CalendarPeriodPicker` is a reusable calendar-style selector for monthly cycles
and weekly planning periods. It owns its modal and safe-area layout, and accepts
a partial theme so each host screen can keep its own visual language.

```tsx
import { CalendarPeriodPicker } from 'mdv-swaplibro-navbar';

<CalendarPeriodPicker
  visible={pickerOpen}
  mode="monthly"
  title="Choose cycle"
  monthlyStartDay={25}
  selectedOffset={selectedOffset}
  theme={{
    background: '#F5F7F3',
    selectedSurface: '#12211C',
    selectedText: '#EEF1EC',
    accent: '#0E5A4A',
  }}
  onClose={() => setPickerOpen(false)}
  onSelect={setSelectedOffset}
/>
```

Set `mode="weekly"` to show Monday-to-Sunday periods instead. Use
`weeksToShow` or `monthsToShow` to control how many periods are available.
