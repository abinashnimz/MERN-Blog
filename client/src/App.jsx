import {Routes, Route, BrowserRouter} from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Project } from "./pages/Project";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Dashboard } from "./pages/Dashboard";
import { Header } from "./components/Header";
import { FooterComp } from "./components/Footer";
import { PrivateRoute } from "./components/PrivateRoute";



export const App = ()=>{
  return(
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/project" element={<Project />} />
        <Route element={<PrivateRoute/>}>
          <Route path="/dashboard" element={<Dashboard />}/>
        </Route>
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
      </Routes>
      <FooterComp/>
    </BrowserRouter>
  )
}