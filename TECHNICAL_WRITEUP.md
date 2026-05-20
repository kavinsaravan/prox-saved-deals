# Technical Write-up: Prox Saved Deals Feature

## Overview

This document explains the technical decisions, architecture, and implementation details of the Prox Saved Deals mobile feature prototype.

---

## Tech Stack Choice

### React Native + TypeScript + Expo

**Why React Native?**
- Cross-platform development (iOS & Android from single codebase)
- Large ecosystem and community support
- Native performance and feel
- Reusable component architecture
- Hot reloading for fast development

**Why TypeScript?**
- Type safety reduces runtime errors
- Better IDE support and autocomplete
- Self-documenting code through interfaces
- Easier refactoring and maintenance
- Catches errors at compile time

**Why Expo?**
- Simplified development workflow
- No need for Xcode/Android Studio for initial development
- Easy testing on physical devices via Expo Go
- Built-in tooling for common patterns
- Perfect for rapid prototyping and MVPs
- Simplified build and deployment process

### Alternative Considerations

**React Native CLI vs Expo:**
- Considered React Native CLI for more control
- Chose Expo for faster development and easier testing
- Can always eject from Expo if native modules are needed

**Flutter:**
- Considered for performance benefits
- Chose React Native due to larger JavaScript/React ecosystem
- Better for teams with web development background

---

## Component Structure

### Architecture Principles

1. **Separation of Concerns**
   - `/screens` - Full-screen components with navigation logic
   - `/components` - Reusable UI components
   - `/services` - Business logic and external interactions
   - `/types` - TypeScript type definitions
   - `/data` - Mock data and constants

2. **Component Reusability**
   - `DealCard` - Used in both DealsList and SavedItems screens
   - `SearchBar` - Reusable across any screen needing search
   - `EmptyState` - Configurable empty state component
   - `LoadingSpinner` - Consistent loading indicator

3. **Single Responsibility**
   - Each component has one clear purpose
   - Business logic extracted to services
   - Presentation separated from data management

### Key Components

#### DealCard Component
```typescript
interface DealCardProps {
  deal: Deal;
  onPress: () => void;
}
```

**Design Decisions:**
- Horizontal layout optimizes vertical screen space
- Shows all critical information at a glance
- Discount badge draws attention to savings
- Touch target size follows mobile best practices (48x48 minimum)
- Uses relative positioning for the discount badge overlay

#### SearchBar Component
- Debouncing could be added for API calls (not needed with local data)
- Clear button appears only when text is present
- Emoji icons reduce app bundle size (no icon library needed)
- Placeholder text provides context

#### Storage Service
```typescript
export const storageService = {
  getSavedItems(): Promise<SavedItem[]>
  saveItem(item: SavedItem): Promise<void>
  unsaveItem(dealId: string): Promise<void>
  isSaved(dealId: string): Promise<boolean>
  clearAll(): Promise<void>
}
```

**Benefits:**
- Abstraction allows easy storage backend swap
- Consistent error handling
- Type-safe operations
- Single source of truth for storage logic

---

## How Saved Deals Work

### Data Flow

```
User Action (Save Button)
    ↓
DealDetailScreen
    ↓
storageService.saveItem()
    ↓
AsyncStorage (Local Device)
    ↓
UI Update (Button State)
    ↓
SavedItemsScreen (Auto-refresh on focus)
```

### Implementation Details

1. **Saving a Deal**
   ```typescript
   const savedItem: SavedItem = {
     dealId: deal.id,
     savedAt: Date.now(),
     type: 'deal'
   };
   await storageService.saveItem(savedItem);
   ```

2. **Storage Format**
   - Key: `@prox_saved_items`
   - Value: JSON array of `SavedItem` objects
   - Stores only IDs and metadata (not full deal objects)
   - Keeps storage size minimal

3. **Retrieving Saved Deals**
   - Load saved item IDs from AsyncStorage
   - Map to full deal objects from mock data
   - Sort by `savedAt` timestamp (newest first)
   - Filter out any deals not found in data

4. **Real-time Updates**
   - `useFocusEffect` hook refreshes saved items when screen gains focus
   - Ensures consistency when navigating between screens
   - No manual refresh needed

### Why This Approach?

**Pros:**
- Lightweight storage (only IDs and metadata)
- Fast lookups and operations
- Easy to sync with backend later
- No database overhead for prototype

**Cons:**
- Doesn't scale to thousands of saved items
- No conflict resolution for multi-device scenarios
- Limited query capabilities

**Future Enhancement:**
For production, consider:
- SQLite for complex queries
- Redux or Zustand for global state
- Backend sync for multi-device support
- Optimistic UI updates

---

## State Management

### Current Approach: React Hooks

**Used Hooks:**
- `useState` - Local component state
- `useEffect` - Side effects and lifecycle
- `useMemo` - Performance optimization (search filtering)
- `useCallback` - Function memoization
- `useFocusEffect` - Navigation-aware effects

### Why Not Redux/MobX?

**Reasons:**
1. **App Complexity** - Current app is simple enough for local state
2. **Learning Curve** - Hooks are easier for team members new to React
3. **Bundle Size** - Avoid unnecessary dependencies
4. **Development Speed** - Faster to implement for prototype

**When to Add Redux/Zustand:**
- Multiple screens need same data
- Complex state interactions
- Undo/redo functionality
- Time-travel debugging
- More than 5-6 screens

### Performance Considerations

**Search Optimization:**
```typescript
const filteredDeals = useMemo(() => {
  if (!searchQuery.trim()) return deals;
  const query = searchQuery.toLowerCase();
  return deals.filter(/* search logic */);
}, [deals, searchQuery]);
```

- `useMemo` prevents re-filtering on every render
- Only re-computes when `deals` or `searchQuery` changes
- Critical for maintaining 60fps with large datasets

---

## Navigation Architecture

### React Navigation (Native Stack)

```typescript
<Stack.Navigator initialRouteName="DealsList">
  <Stack.Screen name="DealsList" component={DealsListScreen} />
  <Stack.Screen name="DealDetail" component={DealDetailScreen} />
  <Stack.Screen name="SavedItems" component={SavedItemsScreen} />
</Stack.Navigator>
```

**Why Native Stack Navigator?**
- Uses native navigation primitives (UINavigationController on iOS)
- Better performance than JS-based navigation
- Native animations and gestures
- Proper memory management

**Type Safety:**
```typescript
export type RootStackParamList = {
  DealsList: undefined;
  DealDetail: { deal: Deal };
  SavedItems: undefined;
};
```

TypeScript knows exactly what parameters each screen accepts.

**Navigation Flow:**
- Custom headers for full control over UI
- `headerShown: false` - Custom back buttons in each screen
- Modal-less navigation (all screens in stack)

---

## Mobile UX Decisions

### Touch Targets
- Minimum 44x44 points (Apple HIG guideline)
- Generous padding around interactive elements
- Visual feedback on press (`activeOpacity`)

### Visual Hierarchy
- Bold prices draw attention to value
- Discount badges use high-contrast red
- Product names are larger and bolder
- Secondary info (size, location) in muted colors

### Loading States
- Spinner for initial load
- "Processing..." text for save operations
- Prevents multiple rapid taps
- User knows something is happening

### Empty States
- Friendly emoji icons
- Clear title explaining situation
- Helpful subtitle with next steps
- Reduces user confusion

### Error Handling
- User-friendly error messages
- Retry buttons where applicable
- Graceful fallbacks
- Console logging for debugging

### Safe Areas
- `SafeAreaView` prevents content under notch/home indicator
- Works on all device sizes
- Automatically adapts to orientation

---

## Mock Data Strategy

### Structure
```json
{
  "id": "1",
  "productName": "Organic Avocados",
  "retailer": "Whole Foods",
  "price": 1.99,
  "originalPrice": 2.99,
  "size": "1 lb bag",
  "imageUrl": "https://...",
  "distance": 0.8,
  "location": "Downtown",
  "category": "Produce",
  "description": "...",
  "validUntil": "2026-05-25"
}
```

### Why This Format?

1. **Realistic** - Matches what a real API might return
2. **Complete** - All data needed for UI
3. **Extensible** - Easy to add new fields
4. **Images** - Uses Unsplash for quality product photos
5. **Variety** - 12 deals across different categories

### Transition to Real API

Current:
```typescript
import mockDealsData from '../data/mockDeals.json';
setDeals(mockDealsData as Deal[]);
```

With API:
```typescript
const response = await fetch('/api/deals');
const deals = await response.json();
setDeals(deals);
```

Only one line changes per screen.

---

## What I Would Improve with More Time

### 1. Performance Optimizations
- **FlatList optimization**
  - `getItemLayout` for faster scrolling
  - `removeClippedSubviews` for memory efficiency
  - `maxToRenderPerBatch` tuning
- **Image optimization**
  - Image caching library (react-native-fast-image)
  - Lazy loading
  - Progressive image loading
- **Code splitting**
  - Lazy load screens not immediately needed

### 2. Testing
- **Unit tests** for services and utilities
- **Component tests** with React Native Testing Library
- **E2E tests** with Detox or Maestro
- **Snapshot tests** for UI regression

### 3. Accessibility
- **Screen reader support**
  - `accessibilityLabel` on all interactive elements
  - `accessibilityHint` for context
- **Dynamic type** - Respect user font size preferences
- **High contrast mode**
- **VoiceOver/TalkBack optimization**

### 4. Advanced Features
- **Haptic feedback** on save/unsave
- **Share functionality** (React Native Share API)
- **Deep linking** to specific deals
- **App state persistence** (persist search query, scroll position)
- **Pull to refresh** functionality
- **Infinite scroll** for large datasets

### 5. Developer Experience
- **ESLint + Prettier** - Code consistency
- **Husky** - Pre-commit hooks
- **Absolute imports** - Cleaner import statements
- **Storybook** - Component documentation
- **Environment variables** - Different configs for dev/prod

### 6. Production Readiness
- **Error tracking** (Sentry)
- **Analytics** (Amplitude, Mixpanel)
- **Feature flags** (LaunchDarkly)
- **App monitoring** (New Relic, Datadog)
- **Crash reporting**
- **Performance monitoring**

---

## Integration with Real Prox App

### Technical Integration Points

1. **Authentication**
   ```typescript
   // Use Prox's auth token
   const token = await getProxAuthToken();
   const response = await fetch('/api/deals', {
     headers: { Authorization: `Bearer ${token}` }
   });
   ```

2. **API Integration**
   - Replace mock data with Prox API endpoints
   - Add error handling for network issues
   - Implement retry logic
   - Add request/response interceptors

3. **State Management**
   - If Prox uses Redux, integrate with existing store
   - Share user preferences and settings
   - Sync saved deals with user account

4. **Design System**
   ```typescript
   // Import Prox design tokens
   import { colors, typography, spacing } from '@prox/design-system';
   ```

5. **Analytics**
   ```typescript
   // Track user interactions
   analytics.track('deal_saved', {
     dealId: deal.id,
     retailer: deal.retailer,
     category: deal.category
   });
   ```

### Data Syncing Strategy

**Hybrid Approach:**
- Local-first for performance
- Background sync with backend
- Conflict resolution (last-write-wins or manual)
- Optimistic UI updates

```typescript
// Save locally immediately
await storageService.saveItem(item);
setIsSaved(true); // Optimistic update

// Sync with backend in background
try {
  await api.saveToAccount(item);
} catch (error) {
  // Retry or queue for later
  await syncQueue.add(item);
}
```

---

## Challenges and Solutions

### Challenge 1: TypeScript Navigation Types
**Problem:** Passing typed parameters between screens
**Solution:** Define `RootStackParamList` with exact parameter types
**Benefit:** Compile-time safety, autocomplete for route params

### Challenge 2: Refreshing Saved Items
**Problem:** Saved items screen not updating when deal is saved
**Solution:** `useFocusEffect` hook refreshes data on screen focus
**Benefit:** Always shows current state without manual refresh

### Challenge 3: Search Performance
**Problem:** Filtering on every keystroke could be slow
**Solution:** `useMemo` hook caches filtered results
**Benefit:** Only re-filters when data or query actually changes

### Challenge 4: Image Loading
**Problem:** Images slow to load, no placeholder
**Solution:** Used `resizeMode="cover"` and reputable CDN (Unsplash)
**Future:** Add shimmer placeholders and progressive loading

---

## Conclusion

This prototype demonstrates:
- Clean, maintainable code architecture
- Mobile-first UX thinking
- Type-safe TypeScript patterns
- Proper state management
- Production-ready code organization
- Scalability considerations

The app is ready for user testing and can easily be extended with real APIs, backend integration, and advanced features. The component structure and service layer make it straightforward to migrate to a production environment within the existing Prox app ecosystem.

---

**Total Development Time:** ~4-6 hours
**Lines of Code:** ~1,200
**Components:** 7 (3 screens, 4 reusable components)
**Dependencies:** Minimal and industry-standard
