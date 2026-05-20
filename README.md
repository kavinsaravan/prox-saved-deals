# Prox Saved Deals - Grocery Deals Mobile App

A React Native mobile application that helps users discover, view, and save grocery deals.

## Features

### 1. Deals List Screen
- Displays a comprehensive list of grocery deals from mock data
- Each deal shows:
  - Product name and image
  - Retailer name
  - Current and original price
  - Package size
  - Distance from user and location
  - Discount percentage badge
- Real-time search and filtering functionality
- Search across product names, retailers, categories, and locations
- Results counter showing the number of matching deals
- Loading, empty, and error states

### 2. Deal Detail Screen
- Detailed product information display
- High-quality product image with discount badge
- Pricing information (current and original)
- Product specifications (size, category, location, valid until date)
- Product description
- Save/Unsave functionality with visual feedback
- Smooth navigation with back buttons

### 3. Saved Items Screen
- View all saved deals in one place
- Saved items persist locally using AsyncStorage
- Sort by most recently saved
- Clear all functionality with confirmation
- Item counter
- Empty state guidance

### 4. Mobile UX Features
- Fully responsive, intuitive mobile-first design
- Smooth touch interactions and animations
- Native-feeling navigation
- Clean, consumer-friendly UI
- Loading states for all asynchronous operations
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
- `npm run web` - Run in web browser 
