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

      <View style={styles.taskContainer}>
        <Text style={styles.instruction}>🎧 녹음 버튼을 누른 후 아래 문장을 따라 계산을 말하세요</Text>
        <View style={styles.hr} />

        <Text style={styles.task}>{task}</Text>

        <TouchableOpacity
          style={styles.recordButton}
          onPress={recording ? stopRecording : startRecording}
        >
          <Text style={styles.buttonText}>{recording ? '⏹️ 중지' : '🎙️ 녹음'}</Text>
        </TouchableOpacity>

        {recordingUri && <Text style={styles.uriText}>녹음 완료 ✔️</Text>}
      </View>

      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: '#90CAF9' }]}
        onPress={() => navigation.navigate('Story1')}
      >
        <Text style={styles.buttonText}>다음으로</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDE7',
    padding: 24,
    marginTop: 40,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#111',
  },
  taskContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  instruction: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  hr: {
    height: 1,
    backgroundColor: '#CCC',
    marginVertical: 12,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 1,
  },
  task: {
    fontSize: 20,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  recordButton: {
    backgroundColor: '#FFD54F',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  uriText: {
    fontSize: 14,
    color: 'green',
    textAlign: 'center',
    marginBottom: 12,
  },
  nextButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
});
