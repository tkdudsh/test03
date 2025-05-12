import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';

export default function RepeatSentencePage({ navigation }) {
  const speechTasks = [
    "마당에 작은 꽃이 피었다",
    "어제는 비가 와서 집에 있었다",
    "낮말은 새가 듣고 밤말은 쥐가 듣는다"
  ];

  const [recordingIndex, setRecordingIndex] = useState(null);         // 현재 녹음 중인 인덱스
  const [recording, setRecording] = useState(null);                   // 녹음 객체
  const [recordings, setRecordings] = useState(Array(speechTasks.length).fill(null));   // 녹음 파일 uri 배열

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
      setRecordingIndex(index);   // 어떤 문항인지 저장
    } catch (err) {
      console.error('녹음 시작 오류:', err);
      Alert.alert("녹음 시작 오류");
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      // recordings 배열 복사 → 현재 문항 index 위치에 파일 uri 저장
      const newRecordings = [...recordings];
      newRecordings[recordingIndex] = uri;
      setRecordings(newRecordings);

      console.log(`문제 ${recordingIndex + 1} 녹음 파일:`, uri);

      setRecording(null);
      setRecordingIndex(null);
    } catch (err) {
      console.error('녹음 중지 오류:', err);
      Alert.alert("녹음 중지 오류");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 문장 따라 읽기</Text>

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
                  stopRecording();                       // 현재 문제 중이면 stop
                } else if (!recording) {
                  startRecording(index);                 // 녹음 중이 아니면 start
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
        onPress={() => navigation.navigate('Image')}    // ✅ 다음 페이지로 이동
      >
        <Text style={styles.buttonText}>다음으로</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF0', padding: 24, marginTop:40 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#111' },
  taskContainer: { marginBottom:30, backgroundColor: '#fff', borderRadius: 10, padding: 15, elevation: 2 },
  taskText: { fontSize: 18, marginBottom: 10, color: '#333' },
  recordButton: { backgroundColor: '#4A90E2', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  buttonText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
  uriText: { fontSize: 14, color: 'green', marginTop: 8, textAlign: 'center' },
  nextButton: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 }
});
