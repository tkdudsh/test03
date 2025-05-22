import ImageTemplatePage from './ImageTemplatePage';
export default function Image1Page({ navigation }) {
  return (
    <ImageTemplatePage
      sentence="동물 이름 말하기: 호랑이, 코끼리, 기린"
      imageSource={require('../assets/Family.jpg')}
      nextScreen="Image2"
      navigation={navigation}
    />
  );
}
