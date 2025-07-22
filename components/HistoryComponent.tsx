
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Location } from '../app/index'; // Assuming Location is exported from index

interface HistoryComponentProps {
  history: Location[];
  onSelect: (location: Location) => void;
}

const HistoryComponent: React.FC<HistoryComponentProps> = ({ history, onSelect }) => {
  return (
    <View style={styles.historyContainer}>
      <Text style={styles.historyTitle}>Search History</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.historyItem} onPress={() => onSelect(item)}>
            <Text style={styles.historyItemName}>{item.name}</Text>
            <Text style={styles.historyItemAddress}>{item.address}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyHistory}>No recent searches.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  historyContainer: {
    height: '35%',
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  historyTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  historyItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  historyItemName: { fontSize: 16, fontWeight: '500' },
  historyItemAddress: { fontSize: 12, color: '#666' },
  emptyHistory: { textAlign: 'center', marginTop: 20, color: '#888' },
});

export default HistoryComponent;