import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TestPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>검사페이지</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Result')}
      >
        <Text style={styles.buttonText}>결과페이지로 이동</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#111',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
