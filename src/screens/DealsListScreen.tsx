import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Deal } from '../types';
import { DealCard } from '../components/DealCard';
import { SearchBar } from '../components/SearchBar';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import mockDealsData from '../data/mockDeals.json';

type DealsListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'DealsList'
>;

interface Props {
  navigation: DealsListScreenNavigationProp;
}

export const DealsListScreen: React.FC<Props> = ({ navigation }) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setDeals(mockDealsData as Deal[]);
      setError(null);
    } catch (err) {
      setError('Failed to load deals. Please try again.');
      console.error('Error loading deals:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDeals = useMemo(() => {
    if (!searchQuery.trim()) {
      return deals;
    }

    const query = searchQuery.toLowerCase();
    return deals.filter(
      deal =>
        deal.productName.toLowerCase().includes(query) ||
        deal.retailer.toLowerCase().includes(query) ||
        deal.category.toLowerCase().includes(query) ||
        deal.location.toLowerCase().includes(query)
    );
  }, [deals, searchQuery]);

  const handleDealPress = (deal: Deal) => {
    navigation.navigate('DealDetail', { deal });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Grocery Deals</Text>
        <TouchableOpacity
          style={styles.savedButton}
          onPress={() => navigation.navigate('SavedItems')}
        >
          <Text style={styles.savedIcon}>💾</Text>
          <Text style={styles.savedText}>Saved</Text>
        </TouchableOpacity>
      </View>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search products, stores, or categories..."
      />
      {filteredDeals.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredDeals.length} {filteredDeals.length === 1 ? 'deal' : 'deals'} found
          </Text>
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

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon="⚠️"
          title="Oops!"
          subtitle={error}
        />
        <TouchableOpacity style={styles.retryButton} onPress={loadDeals}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={filteredDeals}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <DealCard deal={item} onPress={() => handleDealPress(item)} />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="🔍"
            title="No deals found"
            subtitle={
              searchQuery
                ? 'Try adjusting your search terms'
                : 'Check back later for new deals'
            }
          />
        }
        contentContainerStyle={
          filteredDeals.length === 0 ? styles.emptyContainer : styles.listContent
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
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  savedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  savedIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  savedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  retryButton: {
    backgroundColor: '#00a86b',
    marginHorizontal: 40,
    marginBottom: 40,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
