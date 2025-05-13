import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import useRecordingsStore from '../store/recordingsStore';

export default function CalculationPage({ navigation }) {
  const task = "100에서 3을 계속 빼서 말하세요 (100, 97, 94 ...)";

  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);


  const addRecording=useRecordingsStore((state)=>state.addRecording);
  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('녹음 시작 오류:', err);
      Alert.alert("녹음 시작 오류");
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordingUri(uri);
      console.log('계산 테스트 녹음 파일:', uri);

      addRecording('Cal',uri);
      setRecording(null);
    } catch (err) {
      console.error('녹음 중지 오류:', err);
      Alert.alert("녹음 중지 오류");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧮 연산 테스트</Text>

      <View style={styles.taskContainer}>
        <Text style={styles.taskText}>• {task}</Text>

        <TouchableOpacity
          style={styles.recordButton}
          onPress={() => {
            if (recording) {
              stopRecording();
            } else {
              startRecording();
            }
          }}
        >
          <Text style={styles.buttonText}>
            {recording ? '⏹️ 중지' : '🎙️ 녹음'}
          </Text>
        </TouchableOpacity>

        {recordingUri && (
          <Text style={styles.uriText}>녹음 완료 ✔️</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: '#5DADE2' }]}
        onPress={() => navigation.navigate('St')}    // ✅ 다음 페이지로 이동
      >
        <Text style={styles.buttonText}>다음으로</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF0', padding: 24, marginTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#111' },
  taskContainer: { backgroundColor: '#fff', borderRadius: 10, padding: 15, elevation: 2 },
  taskText: { fontSize: 18, marginBottom: 10, color: '#333' },
  recordButton: { backgroundColor: '#4A90E2', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  buttonText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
  uriText: { fontSize: 14, color: 'green', marginTop: 8, textAlign: 'center' },
  nextButton: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 }
});
