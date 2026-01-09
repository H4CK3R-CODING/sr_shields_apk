import { SafeAreaProvider } from "react-native-safe-area-context";
import ThemeProvider from "./theme/ThemeProvider";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigation/StackNavigator";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
        
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
