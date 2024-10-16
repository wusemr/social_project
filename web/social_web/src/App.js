import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navigation from "./navigation/Navigation"
import { UserProvider } from "./auth/UserContext"

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/*" element={<Navigation />} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App