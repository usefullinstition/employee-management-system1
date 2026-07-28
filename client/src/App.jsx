import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import ProtectedRoute from "./components/ProtectedRoute";

import "./styles/Layout.css";


function App() {

  return (

    <div className="layout">

      <Sidebar />


      <div className="main">


        <Navbar />


        <div className="content">


          <Routes>


            {/* Public Routes */}

            <Route
              path="/login"
              element={<Login />}
            />


            <Route
              path="/register"
              element={<Register />}
            />
<Route
 path="/profile"
 element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
 }
/>

<Route
  path="/change-password"
  element={
    <ProtectedRoute>
      <ChangePassword />
    </ProtectedRoute>
  }
/>
            {/* Protected Routes */}


            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />



            <Route
              path="/employees"
              element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              }
            />



            <Route
              path="/add-employee"
              element={
                <ProtectedRoute>
                  <AddEmployee />
                </ProtectedRoute>
              }
            />



            <Route
              path="/edit-employee/:id"
              element={
                <ProtectedRoute>
                  <EditEmployee />
                </ProtectedRoute>
              }
            />


          </Routes>


        </div>


      </div>


    </div>

  );

}


export default App;