import { Routes, Route } from "react-router-dom"
import LandingPage from "../pages/LandingPage"
import Dashboard from "../pages/Dashboard"

const AppRoutes = () => {
  return (
    <Routes>

        <Route path="/" element={<LandingPage/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>

    </Routes>
  )
}

export default AppRoutes