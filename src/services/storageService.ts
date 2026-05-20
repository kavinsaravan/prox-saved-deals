import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedItem } from '../types';

const SAVED_ITEMS_KEY = '@prox_saved_items';

export const storageService = {
  async getSavedItems(): Promise<SavedItem[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(SAVED_ITEMS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading saved items:', error);
      return [];
    }
  },

  async saveItem(item: SavedItem): Promise<void> {
    try {
      const items = await this.getSavedItems();
      const updated = [...items, item];
      await AsyncStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving item:', error);
      throw error;
    }
  },

  async unsaveItem(dealId: string): Promise<void> {
    try {
      const items = await this.getSavedItems();
      const updated = items.filter(item => item.dealId !== dealId);
      await AsyncStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error unsaving item:', error);
      throw error;
    }
  },

  async isSaved(dealId: string): Promise<boolean> {
    try {
      const items = await this.getSavedItems();
      return items.some(item => item.dealId === dealId);
    } catch (error) {
      console.error('Error checking saved status:', error);
      return false;
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SAVED_ITEMS_KEY);
    } catch (error) {
      console.error('Error clearing saved items:', error);
      throw error;
    }
  }
};
