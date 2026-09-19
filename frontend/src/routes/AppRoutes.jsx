import { Routes, Route } from "react-router-dom"
import LandingPage from "../pages/LandingPage"
import Dashboard from "../pages/Dashboard"
import Profile from "../pages/Profile"

const AppRoutes = () => {
  return (
    <Routes>

        <Route path="/" element={<LandingPage/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/profile" element={<Profile/>}></Route>
       

    </Routes>
  )
}

export default AppRoutes