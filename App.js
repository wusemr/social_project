import { NavigationContainer } from "@react-navigation/native"
import Navigation from "./src/navigation/Navigation"
import { UserProvider } from "./src/auth/UserContext"

const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </UserProvider>
  )
}

export default App