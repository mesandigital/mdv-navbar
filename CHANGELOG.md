# Changelog

## 0.1.10 — 2026-11-17

- `CatalogMarketplaceNavbar`: with `insetFilter`, the actions inside the search field are centred vertically whatever the field's height (hosts can use a compact field). The search row's bottom padding is 10 (was 14), so filter pills sit closer under the search.

## 0.1.9 — 2026-10-28

- `BookSearchFiltersModal`: `expandGenresInline` shows every genre as chips in place ("See all N genres" / "Show fewer genres") instead of opening a separate picker. New label `showFewerGenres`.
- `BookSearchFiltersModal`: `showHeader={false}` hides the built-in close / title / Reset header for hosts that use a native navigation header.
- Catalog search bar styling is exposed for hosts.
