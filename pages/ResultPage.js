import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ResultPage({ navigation }) {
  const result = '주의가 필요합니다 ⚠️'; // 추후 API 응답 기반으로 변경

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>📂 녹음 파일 모음</Text>
      {Object.entries(recordings).map(([page, uris]) => (
        <View key={page}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{page}</Text>
          {uris.map((uri, idx) => (
            <Text key={idx} style={{ color: 'gray' }}>{uri}</Text>

            
          ))}
        </View>
        
      ))}
    </ScrollView>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#111',
  },
  resultBox: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 20,
    marginBottom: 40,
  },
  resultText: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
