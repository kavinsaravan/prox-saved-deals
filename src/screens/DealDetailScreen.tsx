import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, SavedItem } from '../types';
import { storageService } from '../services/storageService';

type DealDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'DealDetail'
>;

type DealDetailScreenRouteProp = RouteProp<RootStackParamList, 'DealDetail'>;

interface Props {
  navigation: DealDetailScreenNavigationProp;
  route: DealDetailScreenRouteProp;
}

export const DealDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { deal } = route.params;
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkSavedStatus();
  }, []);

  const checkSavedStatus = async () => {
    const saved = await storageService.isSaved(deal.id);
    setIsSaved(saved);
  };

  const handleSaveToggle = async () => {
    try {
      setLoading(true);

      if (isSaved) {
        await storageService.unsaveItem(deal.id);
        setIsSaved(false);
        Alert.alert('Removed', 'Deal removed from saved items');
      } else {
        const savedItem: SavedItem = {
          dealId: deal.id,
          savedAt: Date.now(),
          type: 'deal',
        };
        await storageService.saveItem(savedItem);
        setIsSaved(true);
        Alert.alert('Saved!', 'Deal saved successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update saved status');
      console.error('Error toggling save:', error);
    } finally {
      setLoading(false);
    }
  };

  const discount = deal.originalPrice
    ? Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Deal Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: deal.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% OFF</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.productName}>{deal.productName}</Text>

          <View style={styles.retailerContainer}>
            <Text style={styles.retailerLabel}>Available at</Text>
            <Text style={styles.retailer}>{deal.retailer}</Text>
          </View>

          <View style={styles.priceSection}>
            <View>
              <Text style={styles.priceLabel}>Current Price</Text>
              <Text style={styles.price}>${deal.price.toFixed(2)}</Text>
            </View>
            {deal.originalPrice && (
              <View>
                <Text style={styles.priceLabel}>Regular Price</Text>
                <Text style={styles.originalPrice}>
                  ${deal.originalPrice.toFixed(2)}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Size</Text>
              <Text style={styles.detailValue}>{deal.size}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{deal.category}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>
                {deal.location} • {deal.distance.toFixed(1)} mi away
              </Text>
            </View>

            {deal.validUntil && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Valid Until</Text>
                <Text style={styles.detailValue}>
                  {new Date(deal.validUntil).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>

          {deal.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{deal.description}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.saveButton, isSaved && styles.savedButton]}
            onPress={handleSaveToggle}
            disabled={loading}
          >
            <Text style={styles.saveIcon}>{isSaved ? '✓' : '💾'}</Text>
            <Text style={styles.saveButtonText}>
              {loading ? 'Processing...' : isSaved ? 'Saved' : 'Save This Deal'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.viewStoreButton}>
            <Text style={styles.viewStoreButtonText}>View in Store</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: '#1a1a1a',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    padding: 20,
  },
  productName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  retailerContainer: {
    marginBottom: 20,
  },
  retailerLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  retailer: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f9f4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: '#00a86b',
  },
  originalPrice: {
    fontSize: 24,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 15,
    color: '#666',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00a86b',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  savedButton: {
    backgroundColor: '#4CAF50',
  },
  saveIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  viewStoreButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00a86b',
    alignItems: 'center',
  },
  viewStoreButtonText: {
    color: '#00a86b',
    fontSize: 18,
    fontWeight: '600',
  },
});
