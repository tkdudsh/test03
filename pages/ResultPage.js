import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ResultPage({ navigation }) {
  const result = '주의가 필요합니다 ⚠️'; // 추후 API 응답 기반으로 변경

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 검사 결과</Text>

      <View style={styles.resultBox}>
        <Text style={styles.resultText}>{result}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Main')}
      >
        <Text style={styles.buttonText}>홈으로 돌아가기</Text>
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
