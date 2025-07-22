
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { GooglePlaceData, GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import MapView, { LatLng, Region } from 'react-native-maps';

import HistoryComponent from '../components/HistoryComponent';
import MapComponent from '../components/MapComponent';
import SearchComponent, { SearchComponentRef } from '../components/SearchComponent';
import * as Constants from "../constants/Contants";

const ASYNC_STORAGE_KEY = Constants.ASYNC_STORAGE_KEY;
const Maps_API_KEY = Constants.GOOGLE_MAPS_API_KEY; 

export interface Location {
  id: string;
  name: string;
  address: string;
  coordinate: LatLng;
}

export default function MainScreen() {
  const [region, setRegion] = useState<Region>({
    latitude: 3.1390,
    longitude: 101.6925,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchHistory, setSearchHistory] = useState<Location[]>([]);

  const mapRef = useRef<MapView>(null);
  const searchRef = useRef<SearchComponentRef>(null);

  // Load search history from storage on initial render
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
        if (storedHistory) setSearchHistory(JSON.parse(storedHistory));
      } catch (error) {
        console.error(Constants.FAILED_TO_LOAD, error);
      }
    };
    loadHistory();
  }, []);

  // Save search history to storage whenever it changes
  useEffect(() => {
    const saveHistory = async () => {
      try {
        await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(searchHistory));
      } catch (error) {
        console.error(Constants.FAILED_TO_SAVE, error);
      }
    };
    // save even if history is empty to clear it in storage
    saveHistory();
  }, [searchHistory]);

  const selectLocation = (location: Location, addToHistory = true) => {
    setSelectedLocation(location);
    const newRegion: Region = {
      latitude: location.coordinate.latitude,
      longitude: location.coordinate.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.01,
    };
    mapRef.current?.animateToRegion(newRegion, 1000);
    if (addToHistory) {
      setSearchHistory(prev =>
        [location, ...prev.filter(item => item.id !== location.id)].slice(0, 10)
      );
    }
  };

  const handlePlaceSelect = (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
    if (!details) return;
    const { lat, lng } = details.geometry.location;
    const newLocation: Location = {
      id: data.place_id,
      name: data.structured_formatting.main_text,
      address: data.description,
      coordinate: { latitude: lat, longitude: lng },
    };
    selectLocation(newLocation);
    searchRef.current?.clear();
  };

  const handleHistorySelect = (location: Location) => {
    selectLocation(location, false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SearchComponent
        ref={searchRef}
        apiKey={Maps_API_KEY}
        onPlaceSelected={handlePlaceSelect}
      />
      <MapComponent
        ref={mapRef}
        region={region}
        selectedLocation={selectedLocation}
      />
      <HistoryComponent
        history={searchHistory}
        onSelect={handleHistorySelect}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
});