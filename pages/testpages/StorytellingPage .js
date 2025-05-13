import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import useRecordingsStore from '../store/recordingsStore';

export default function StorytellingPage({ navigation }) {
  const speechTasks = [
    "기뻤던 일을 이야기하세요",
    "슬펐던 일을 이야기하세요",
    "어제 있었던 일을 이야기하세요"
  ];

  
  const [recordingIndex, setRecordingIndex] = useState(null);
  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState(Array(speechTasks.length).fill(null));

  const addRecording=useRecordingsStore((state)=>state.addRecording);
  const startRecording = async (index) => {
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
      setRecordingIndex(index);
    } catch (err) {
      console.error('녹음 시작 오류:', err);
      Alert.alert("녹음 시작 오류");
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const newRecordings = [...recordings];
      newRecordings[recordingIndex] = uri;
      setRecordings(newRecordings);

      console.log(`문제 ${recordingIndex + 1} 녹음 파일:`, uri);

      addRecording('Story',uri);
      setRecording(null);
      setRecordingIndex(null);
    } catch (err) {
      console.error('녹음 중지 오류:', err);
      Alert.alert("녹음 중지 오류");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📖 이야기하기</Text>

      <FlatList
        data={speechTasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskText}>• {item}</Text>
            <TouchableOpacity
              style={styles.recordButton}
              onPress={() => {
                if (recording && recordingIndex === index) {
                  stopRecording();
                } else if (!recording) {
                  startRecording(index);
                } else {
                  Alert.alert("알림", "다른 문제 녹음 중입니다.");
                }
              }}
            >
              <Text style={styles.buttonText}>
                {recording && recordingIndex === index ? '⏹️ 중지' : '🎙️ 녹음'}
              </Text>
            </TouchableOpacity>

            {recordings[index] && (
              <Text style={styles.uriText}>녹음 완료 ✔️</Text>
            )}
          </View>
        )}
      />

      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: '#5DADE2' }]}
        onPress={() => navigation.navigate('Result')}    // ✅ 결과 페이지로 이동
      >
        <Text style={styles.buttonText}>결과 보기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF0', padding: 24, marginTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#111' },
  taskContainer: { marginBottom: 30, backgroundColor: '#fff', borderRadius: 10, padding: 15, elevation: 2 },
  taskText: { fontSize: 18, marginBottom: 10, color: '#333' },
  recordButton: { backgroundColor: '#4A90E2', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  buttonText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
  uriText: { fontSize: 14, color: 'green', marginTop: 8, textAlign: 'center' },
  nextButton: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 }
});
