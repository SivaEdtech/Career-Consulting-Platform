import { Routes, Route } from "react-router-dom"
import LandingPage from "../pages/LandingPage"
import Dashboard from "../pages/Dashboard"
import Profile from "../pages/Profile"
import ProfessionalViewProfile from "../pages/ProfessionalViewProfile"


const AppRoutes = () => {
  return (
    <Routes>

        <Route path="/" element={<LandingPage/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/user/:userId/profile" element={<Profile/>}></Route>
        <Route path="/professionals/:professionalId" element={<ProfessionalViewProfile/>}></Route>
       

    </Routes>
  )
}

export default AppRoutes