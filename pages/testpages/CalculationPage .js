import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import useRecordingsStore from '../store/recordingsStore';

const { height } = Dimensions.get('window');

export default function RepeatSentencePage({ navigation }) {
  const speechTasks = [
    "마당에 작은 꽃이 피었다",
    "어제는 비가 와서 집에 있었다",
    "낮말은 새가 듣고 밤말은 쥐가 듣는다"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordings, setRecordings] = useState(Array(speechTasks.length).fill(null));
  const recordingRef = useRef(null);
  const timerRef = useRef(null);
  const addRecording = useRecordingsStore((state) => state.addRecording);

  const startRecording = async () => {
    try {
      if (recordingRef.current) return;

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();

      recordingRef.current = newRecording;

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

      const newRecordings = [...recordings];
      newRecordings[currentIndex] = uri;
      setRecordings(newRecordings);

      addRecording('Repeat', uri);
      recordingRef.current = null;

      console.log('✅ repeat 저장됨:', uri);
    } catch (err) {
      console.error("녹음 중지 오류:", err);
      Alert.alert("녹음 중지 오류");
    }
  };

  const handleNext = () => {
    if (!recordings[currentIndex]) {
      Alert.alert("녹음 필요", "녹음을 완료한 후 다음 문제로 넘어갈 수 있습니다.");
      return;
    }

    if (currentIndex < speechTasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('Image');
    }
  };

  return (
    <View style={[styles.pageContainer]}>
      <Text style={styles.title}>📋 문장 따라 읽기</Text>

      <View style={styles.taskContainer}>
        <Text style={styles.taskText}>• {speechTasks[currentIndex]}</Text>
        <TouchableOpacity
          style={styles.recordButton}
          onPress={() => {
            if (recordingRef.current) {
              stopRecording();
            } else {
              startRecording();
            }
          }}
        >
          <Text style={styles.buttonText}>
            {recordingRef.current ? '⏹️ 중지' : '🎙️ 녹음'}
          </Text>
        </TouchableOpacity>

        {recordings[currentIndex] && (
          <Text style={styles.uriText}>녹음 완료 ✔️</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: '#5DADE2' }]}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>
          {currentIndex < speechTasks.length - 1 ? '다음 문제' : '다음 페이지'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#FAFAF0',
    padding: 24,
    justifyContent: 'space-between',
    height: height
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 40,
    textAlign: 'center',
    color: '#111'
  },
  taskContainer: {
    marginVertical: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 2
  },
  taskText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333'
  },
  recordButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold'
  },
  uriText: {
    fontSize: 14,
    color: 'green',
    marginTop: 10,
    textAlign: 'center'
  },
  nextButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20
  }
});
