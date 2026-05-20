import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, Deal, SavedItem } from '../types';
import { DealCard } from '../components/DealCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { storageService } from '../services/storageService';
import mockDealsData from '../data/mockDeals.json';

type SavedItemsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SavedItems'
>;

interface Props {
  navigation: SavedItemsScreenNavigationProp;
}

export const SavedItemsScreen: React.FC<Props> = ({ navigation }) => {
  const [savedDeals, setSavedDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  // Reload saved items when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadSavedItems();
    }, [])
  );

  const loadSavedItems = async () => {
    try {
      setLoading(true);
      const savedItems = await storageService.getSavedItems();

      // Map saved item IDs to actual deals
      const deals = savedItems
        .map((savedItem: SavedItem) => {
          const deal = (mockDealsData as Deal[]).find(d => d.id === savedItem.dealId);
          return deal;
        })
        .filter((deal): deal is Deal => deal !== undefined)
        .sort((a, b) => {
          // Sort by saved date (most recent first)
          const aItem = savedItems.find(item => item.dealId === a.id);
          const bItem = savedItems.find(item => item.dealId === b.id);
          return (bItem?.savedAt || 0) - (aItem?.savedAt || 0);
        });

      setSavedDeals(deals);
    } catch (error) {
      console.error('Error loading saved items:', error);
      Alert.alert('Error', 'Failed to load saved items');
    } finally {
      setLoading(false);
    }
  };

  const handleDealPress = (deal: Deal) => {
    navigation.navigate('DealDetail', { deal });
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Saved Items',
      'Are you sure you want to remove all saved deals?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await storageService.clearAll();
            loadSavedItems();
          },
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Saved Deals</Text>
      </View>

      {savedDeals.length > 0 && (
        <View style={styles.actionsContainer}>
          <Text style={styles.countText}>
            {savedDeals.length} {savedDeals.length === 1 ? 'item' : 'items'}
          </Text>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={savedDeals}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <DealCard deal={item} onPress={() => handleDealPress(item)} />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="💾"
            title="No saved deals yet"
            subtitle="Tap the save button on any deal to add it here"
          />
        }
        contentContainerStyle={
          savedDeals.length === 0 ? styles.emptyContainer : styles.listContent
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#f8f8f8',
    paddingTop: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backIcon: {
    fontSize: 28,
    color: '#1a1a1a',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  countText: {
    fontSize: 14,
    color: '#666',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff4444',
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flexGrow: 1,
  },
});
