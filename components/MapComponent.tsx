
import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { Location } from '../app/index'; // Assuming Location is exported from index

const MapComponent = forwardRef<MapView, { region: Region; selectedLocation: Location | null }>(
  ({ region, selectedLocation }, ref) => {
    return (
      <MapView ref={ref} style={styles.map} region={region}>
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation.coordinate}
            title={selectedLocation.name}
            description={selectedLocation.address}
          />
        )}
      </MapView>
    );
  }
);

const styles = StyleSheet.create({
  map: { flex: 1 },
});

export default MapComponent;