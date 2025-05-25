import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Platform, KeyboardAvoidingView, ScrollView
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Audio } from 'expo-av';

export default function TutorialPage({ navigation }) {
  const [recording, setRecording] = useState(null);
  const [recordedURI, setRecordedURI] = useState(null);

  useEffect(() => {
    const getPermission = async () => {
      const response = await Audio.requestPermissionsAsync();
      if (!response.granted) {
        alert('마이크 접근 권한이 필요합니다!');
      }
    };
    getPermission();
  }, []);

  
  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await newRecording.startAsync();
      setRecording(newRecording);
    } catch (err) {
      console.error('녹음 시작 실패', err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordedURI(uri);
      setRecording(null);
      console.log('녹음된 파일:', uri);
    } catch (err) {
      console.error('녹음 중지 실패', err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FFFDE7' }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      {/* 🧷 화면 최상단 안내 문구 */}
      <View style={styles.header}>
        <Text style={styles.guide}>📘 연습 문제입니다</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Text style={styles.title}>🎤 예시 문장을 따라 말해보세요</Text>
        <Text style={styles.instruction}>🎧 녹음 버튼을 누른 후 예시 문장을 말하세요</Text>
        <Text style={styles.sample}>“오늘은 날씨가 맑습니다.”</Text>

        <TouchableOpacity
          style={styles.recordButton}
          onPress={recording ? stopRecording : startRecording}
        >
          <Text style={styles.buttonText}>
            {recording ? '⏹️ 녹음 중지' : '🎙️ 녹음 시작'}
          </Text>
        </TouchableOpacity>

        {recordedURI && (
          <Text style={styles.result}>✅ 녹음 완료!</Text>
        )}

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate('Repeat1')}
        >
          <Text style={styles.buttonText}>테스트 시작</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#FFFDE7',
  },
  guide: {
    fontSize: RFPercentage(4),
    fontWeight: 'bold',
    color: '#333',
  },
  container: {
    flexGrow: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },

  sample: {
    fontSize: RFPercentage(4),
    marginBottom: 40,
    color: '#333',
    textAlign: 'center',
  },

  recordButton: {
    backgroundColor: '#FFD54F',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
    marginBottom: 20,
    alignItems: 'center',
  },

  nextButton: {
    backgroundColor: '#90CAF9',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
    marginTop: 10,
    alignItems: 'center',
  },

  buttonText: {
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
    color: '#333',
  },

  result: {
    fontSize: RFPercentage(2),
    marginTop: 10,
    color: '#4CAF50',
  },
  instruction: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
});
