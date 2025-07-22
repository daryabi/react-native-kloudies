// components/SearchComponent.tsx
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Constants from "../constants/Contants";
interface SearchComponentProps {
  apiKey: string;
  onPlaceSelected: (data: GooglePlaceData, details: GooglePlaceDetail | null) => void;
}

export interface SearchComponentRef {
  clear: () => void;
}

const SearchComponent = forwardRef<SearchComponentRef, SearchComponentProps>(({ apiKey, onPlaceSelected }, ref) => {
  const innerRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    clear: () => {
      innerRef.current?.textInput?.clear();
    },
  }));

  return (
    <View style={styles.searchContainer}>
      <GooglePlacesAutocomplete
        ref={innerRef}
        placeholder={Constants.SEARCH_PACEHOLDER}
        fetchDetails={true}
        onPress={onPlaceSelected}
        query={{
          key: apiKey,
          language: Constants.LANGUAGE_ENG,
        }}
        styles={{
          textInput: styles.searchInput,
          listView: styles.listView,
        }}
        debounce={300}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchInput: {
    height: 48,
    borderRadius: 8,
    fontSize: 16,
  },
  listView: {
    borderRadius: 8,
  },
});

export default SearchComponent;