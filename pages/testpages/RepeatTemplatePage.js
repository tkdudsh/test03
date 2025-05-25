import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import useRecordingsStore from '../store/recordingsStore';

export default function RepeatTemplatePage({ sentence, nextScreen, navigation }) {
  const recordingRef = useRef(null);
  const timerRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const addRecording = useRecordingsStore((state) => state.addRecording);

  const startRecording = async () => {
      try {
        const permission = await Audio.requestPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("마이크 권한이 필요합니다");
          return;
        }
  
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
  
        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await newRecording.startAsync();
  
        recordingRef.current = newRecording;
        setIsRecording(true);
  
        timerRef.current = setTimeout(() => {
          stopRecording();
          setTimeout(() => {
            Alert.alert("⏱️ 녹음 완료", "1분이 지나 자동으로 녹음이 종료되었습니다.");
          }, 100);
        }, 60000);
      } catch (err) {
        console.error("녹음 시작 오류:", err);
        Alert.alert("녹음 시작 오류");
      }
    };
  
    const stopRecording = async () => {
      try {
        if (!recordingRef.current) return;
  
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
  
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        addRecording("Image", uri);
        setRecorded(true);
        setIsRecording(false);
        
        recordingRef.current = null;
      } catch (err) {
        console.error("녹음 중지 오류:", err);
        Alert.alert("녹음 중지 오류");
      }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 문장 따라 읽기</Text>

      <View style={styles.taskContainer}>
        <Text style={styles.instruction}>🎧 녹음 버튼을 누른 후 아래 문장을 따라 읽으세요</Text>
        <View style={styles.hr} />
        <Text style={styles.taskText}>{sentence}</Text>

        <TouchableOpacity
          style={styles.recordButton}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text style={styles.buttonText}>
            {isRecording ? "⏹️ 중지" : "🎙️ 녹음"}
          </Text>
        </TouchableOpacity>

        {recorded && <Text style={styles.uriText}>녹음 완료 ✔️</Text>}
      </View>

      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: '#90CAF9' }]}
        onPress={() => {
          if (!recorded) {
            Alert.alert("녹음 후 진행 가능합니다");
            return;
          }
          navigation.navigate(nextScreen);
        }}
      >
        <Text style={styles.buttonText}>다음</Text>
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
    textAlign: 'center',
    color: '#111',
  },
  instruction: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  taskContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  taskText: {
    fontSize: 23,
    marginBottom: 20,
    textAlign:'center',
    color: '#333',
  },
  recordButton: {
    backgroundColor: '#FFD54F',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  uriText: {
    fontSize: 14,
    color: 'green',
    marginTop: 10,
    textAlign: 'center',
  },
  nextButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  hr: {
  height: 1,
  backgroundColor: '#CCC',
  marginVertical: 12,
  width: '80%',
  alignSelf: 'center',
  borderRadius: 1,
},
});
