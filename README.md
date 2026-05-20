# Prox Saved Deals - Grocery Deals Mobile App

A mobile-first React Native application that helps users discover, view, and save grocery deals. Built as part of a mobile engineering take-home assignment.

## Features

### 1. Deals List Screen
- Display a comprehensive list of grocery deals from mock data
- Each deal shows:
  - Product name and image
  - Retailer name
  - Current and original price
  - Package size
  - Distance from user and location
  - Discount percentage badge
- Real-time search and filtering functionality
- Search across product names, retailers, categories, and locations
- Results counter showing number of matching deals
- Loading, empty, and error states

### 2. Deal Detail Screen
- Detailed product information display
- High-quality product image with discount badge
- Pricing information (current and original)
- Product specifications (size, category, location, valid until date)
- Product description
- Save/Unsave functionality with visual feedback
- Call-to-action button for viewing in store
- Smooth navigation with back button

### 3. Saved Items Screen
- View all saved deals in one place
- Saved items persist locally using AsyncStorage
- Sort by most recently saved
- Clear all functionality with confirmation
- Item counter
- Empty state guidance

### 4. Mobile UX Features
- Fully responsive mobile-first design
- Smooth touch interactions and animations
- Native-feeling navigation
- Clean, consumer-friendly UI
- Proper safe area handling
- Loading states for all async operations
- Error handling with user-friendly messages
- Empty states with helpful guidance

## Tech Stack

### Core Technologies
- **React Native** (0.81.5) - Cross-platform mobile framework
- **TypeScript** - Type safety and better developer experience
- **Expo** - Development tooling and simplified build process

### Navigation
- **React Navigation** (Native Stack Navigator) - Industry-standard navigation solution

### State Management & Storage
- **React Hooks** (useState, useEffect, useMemo, useCallback) - Built-in state management
- **AsyncStorage** - Local persistence for saved deals
- **useFocusEffect** - Refresh saved items when screen comes into focus

### Data
- Mock JSON data with 12 diverse grocery deals
- Realistic product data including images from Unsplash

## Project Structure

```
prox-saved-deals/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── DealCard.tsx     # Deal list item component
│   │   ├── SearchBar.tsx    # Search input component
│   │   ├── EmptyState.tsx   # Empty state display
│   │   └── LoadingSpinner.tsx
│   ├── screens/             # Screen components
│   │   ├── DealsListScreen.tsx
│   │   ├── DealDetailScreen.tsx
│   │   └── SavedItemsScreen.tsx
│   ├── services/            # Business logic
│   │   └── storageService.ts # AsyncStorage wrapper
│   ├── types/               # TypeScript definitions
│   │   └── index.ts
│   └── data/                # Mock data
│       └── mockDeals.json
├── App.tsx                  # App entry point with navigation
├── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app (for testing on physical devices)

### Installation

1. **Clone or extract the project**
   ```bash
   cd prox-saved-deals
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your preferred platform**

   **iOS Simulator (Mac only):**
   ```bash
   npm run ios
   ```

   **Android Emulator:**
   ```bash
   npm run android
   ```

   **Physical Device:**
   - Install the "Expo Go" app from App Store or Google Play
   - Scan the QR code from the terminal with your phone camera
   - The app will open in Expo Go

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser (limited functionality)

## How It Works

### Saved Deals Persistence

The app uses AsyncStorage to persist saved deals locally on the device:

1. When a user saves a deal, a `SavedItem` object is created with:
   - Deal ID
   - Timestamp of when it was saved
   - Item type ('deal' or 'search')

2. Saved items are stored in AsyncStorage under the key `@prox_saved_items`

3. When viewing saved items, the app:
   - Loads the saved item IDs from AsyncStorage
   - Maps them to full deal objects from the mock data
   - Sorts by most recently saved
   - Displays them in the Saved Items screen

4. The saved status is checked and updated in real-time when viewing deal details

### Search & Filtering

The deals list uses client-side filtering with the following logic:
- Searches are case-insensitive
- Matches against product name, retailer, category, and location
- Results update in real-time as you type
- Uses React's `useMemo` hook for performance optimization

### Navigation Flow

```
DealsList → DealDetail → [Save Deal]
    ↓            ↓
    ↓        SavedItems
    ↓            ↓
    ↓────────────↓
```

## Design Decisions

### Why Expo?
- Faster development and iteration
- Built-in tooling for common mobile patterns
- Easy testing on physical devices
- Simplified build process
- Great for prototypes and MVPs

### Why React Navigation?
- Industry standard for React Native apps
- Native-feeling transitions
- Type-safe with TypeScript
- Easy to configure and customize

### Why AsyncStorage?
- Simple, lightweight persistence
- Perfect for small amounts of data
- No backend required for prototype
- Native iOS and Android support
- Easy to migrate to a more robust solution later

### Component Architecture
- Separation of concerns (components, screens, services)
- Reusable components for consistency
- TypeScript interfaces for type safety
- Atomic design principles

## Future Improvements

Given more time, here are enhancements I would add:

### Features
1. **User Authentication** - Allow users to sync saved deals across devices
2. **Push Notifications** - Alert users when saved deals are about to expire
3. **Categories Filter** - Quick filter by product category
4. **Sort Options** - Sort by price, distance, discount percentage
5. **Map View** - Show deal locations on a map
6. **Share Functionality** - Share deals with friends
7. **Shopping List** - Convert saved deals into a shopping list
8. **Price Alerts** - Notify when prices drop on saved items

### Technical Improvements
1. **API Integration** - Connect to real backend instead of mock data
2. **Offline Support** - Better offline handling and sync
3. **Performance** - Virtualized lists for large datasets
4. **Testing** - Unit tests, integration tests, E2E tests
5. **Analytics** - Track user behavior and engagement
6. **Accessibility** - Screen reader support, better contrast
7. **Animations** - Smooth transitions and micro-interactions
8. **Image Caching** - Optimize image loading and caching
9. **Error Boundary** - Graceful error handling at app level
10. **CI/CD** - Automated builds and deployments

### UX Enhancements
1. **Onboarding** - Tutorial for first-time users
2. **Haptic Feedback** - Tactile response for interactions
3. **Dark Mode** - Support for dark theme
4. **Skeleton Screens** - Better loading states
5. **Pull to Refresh** - Manual refresh capability
6. **Swipe Actions** - Quick save/unsave with gestures

## Integration with Real Prox App

This feature could integrate with the existing Prox app in several ways:

### Backend Integration
- Connect to Prox's existing deal/product API
- Sync saved deals with user accounts
- Real-time deal updates and notifications

### Authentication
- Use existing Prox user authentication
- Sync preferences and saved items across devices

### Analytics
- Track which deals users save most
- Understand user preferences for better recommendations
- Measure feature engagement

### Design System
- Adopt Prox's existing design tokens
- Use brand colors and typography
- Maintain consistent UI/UX patterns

### Features to Leverage
- Geolocation for accurate distance calculations
- User's shopping history for personalized deals
- Integration with Prox's store/retailer database
- Price comparison with user's usual stores

## License

This project was created as part of a take-home assignment for a mobile engineering position.

---

**Developer Notes**: This app was built with attention to mobile-first design, clean code architecture, and user experience. The codebase is organized for maintainability and scalability, making it easy to add new features or integrate with existing systems.
