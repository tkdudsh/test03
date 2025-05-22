import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import useRecordingsStore from '../store/recordingsStore';

export default function CalculationPage({ navigation }) {
  const task = '100에서 3을 계속 빼서 말하세요 (100, 97, 94 ...)';
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const timerRef = useRef(null);
  const recordingRef = useRef(null);
  const addRecording = useRecordingsStore((state) => state.addRecording);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('권한 오류', '마이크 접근 권한이 필요합니다.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();

      recordingRef.current = newRecording;
      setRecording(newRecording);

      timerRef.current = setTimeout(() => {
        stopRecording();
        Alert.alert('⏱️ 녹음 완료', '1분이 지나 녹음이 종료되었습니다.');
      }, 60000);
    } catch (error) {
      console.error('녹음 시작 실패:', error);
      Alert.alert('오류', '녹음 시작에 실패했습니다.');
    }
  };

  const stopRecording = async () => {
    try {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (!recordingRef.current) return;

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      setRecordingUri(uri);
      addRecording('Cal', uri);

      recordingRef.current = null;
      setRecording(null);
    } catch (error) {
      console.error('녹음 중지 실패:', error);
      Alert.alert('오류', '녹음 중지에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧮 연산 테스트</Text>
      <Text style={styles.task}>{task}</Text>

      <TouchableOpacity style={styles.recordButton} onPress={recording ? stopRecording : startRecording}>
        <Text style={styles.buttonText}>{recording ? '⏹️ 중지' : '🎙️ 녹음'}</Text>
      </TouchableOpacity>

      {recordingUri && <Text style={styles.uriText}>녹음 완료 ✔️</Text>}

      <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('Story1')}>
        <Text style={styles.buttonText}>다음으로</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF0',
    padding: 24,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#111',
  },
  task: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
  },
  recordButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  uriText: {
    fontSize: 14,
    color: 'green',
    textAlign: 'center',
    marginBottom: 12,
  },
  nextButton: {
    backgroundColor: '#5DADE2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
});
