import React, { useState } from "react";
import {
  TouchableOpacity, StyleSheet, Text, View, TextInput,
  Alert, KeyboardAvoidingView, ScrollView,KeyboardAvoidingViewBase,Platform,Keyboard
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import useUserStore from "./store/userStore";

export default function AppMainPage({ navigation }) {
  const setUser = useUserStore((state) => state.setUser);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [errGender, setErrGender] = useState(false);
  const [errAge, setErrAge] = useState(false);
  const [errName, setErrName] = useState(false);

  const handleSubmit = () => {
    let hasError = false;

    if (!name.trim()) {
      setErrName(true);
      hasError = true;
      Alert.alert("이름을 입력해주세요.");
    } else setErrName(false);

    if (!age.trim()) {
      setErrAge(true);
      hasError = true;
      Alert.alert("나이를 입력해주세요.");
    } else setErrAge(false);

    if (!gender.trim()) {
      setErrGender(true);
      hasError = true;
      Alert.alert("성별을 선택해주세요.");
    } else setErrGender(false);

    if (!hasError) {
      setUser({ name, age, gender });
      navigation.navigate('Tutorial');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} >
      <ScrollView contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
  keyboardDismissMode="on-drag">
        <View style={styles.MainView}>
          <Text style={styles.MainTitle}>기억한 데이</Text>

          <View style={styles.warningBox}>
            <Text style={styles.warningText1}>※ 검사 전 유의사항</Text>
            <Text style={styles.warningText}>- 조용한 곳에서 진행해주세요.</Text>
            <Text style={styles.warningText}>- 질문을 끝까지 들은 후 반응해주세요.</Text>
            <Text style={styles.warningText}>- 검사 중 스마트폰은 움직이지 않도록 해주세요.</Text>
          </View>

          <Text style={styles.title}>사용자 정보 입력</Text>

          <TextInput
            style={[styles.input, errName && styles.inputError]}
            placeholder="이름"
            placeholderTextColor="#999"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (text.trim()) setErrName(false);
            }}
          />

          <TextInput
            style={[styles.input, errAge && styles.inputError]}
            placeholder="나이"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={age}
            onChangeText={(text) => {
              setAge(text);
              if (text.trim()) setErrAge(false);
              if (text.trim().length === 2) Keyboard.dismiss();
            }}
          />

          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderButton, gender === '남' && styles.genderSelected]}
              onPress={() => setGender('남')}
            >
              <Text style={styles.genderText}>남자</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.genderButton, gender === '여' && styles.genderSelected]}
              onPress={() => setGender('여')}
            >
              <Text style={styles.genderText}>여자</Text>
            </TouchableOpacity>
          </View>

          {errGender && (
            <Text style={styles.errorText}>성별을 선택해주세요.</Text>
          )}

          <TouchableOpacity style={styles.testButton} onPress={handleSubmit}>
            <Text style={styles.testButtonText}>검사 시작하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 50,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: '#FFFDE7',
  },
  MainView: {
    width: '100%',
    alignItems: 'center',
  },
  MainTitle: {
    fontSize: RFPercentage(4.5),
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 6,
    borderLeftColor: '#FFC107',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 30,
  },
  warningText1: {
    fontSize: RFPercentage(2.8),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  warningText: {
    fontSize: RFPercentage(2.4),
    color: '#555',
    marginBottom: 8,
    lineHeight: RFPercentage(3.4),
  },
  title: {
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
  },
  input: {
    width: 280,
    height: RFPercentage(7),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 16,
    fontSize: RFPercentage(2.5),
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#FF0000',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  genderButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginHorizontal: 8,
    backgroundColor: '#fff',
  },
  genderSelected: {
    borderColor: '#FFA000',
    backgroundColor: '#FFF8E1',
  },
  genderText: {
    fontSize: RFPercentage(2.5),
    color: '#333',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF0000',
    fontSize: RFPercentage(2),
    marginTop: -10,
    marginBottom: 10,
  },
  testButton: {
    backgroundColor: '#FFD54F',
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 14,
    marginTop: 30,
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: RFPercentage(2.8),
    color: '#333',
    fontWeight: 'bold',
  },
  
});
