import ImageTemplatePage from './ImageTemplatePage';
export default function Image2Page({ navigation }) {
  return (
    <ImageTemplatePage
      sentence="그림 설명하기 (cookie-theft)"
      imageSource={require('../assets/Family.jpg')}
      nextScreen="Fluency"
      navigation={navigation}
    />
  );
}
