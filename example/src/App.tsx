import { Text, View, StyleSheet } from 'react-native';
import { helloFunction, decompress } from '@tantan/react-native-decompress';
export default function App() {
  console.log('dwqdwqdwqdwq', helloFunction('hahahahaha'));
  console.log('dwqdwqdwqdwq___', typeof decompress);
  return (
    <View style={styles.container}>
      <Text>Resu123123213lt</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
