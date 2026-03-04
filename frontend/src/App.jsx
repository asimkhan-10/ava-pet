import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './features/auth/Login'
import Signup from './features/auth/Signup'
import ForgetPassword from './features/auth/ForgetPassword'
import Verification from './features/auth/Verification'
import NewPassword from './features/auth/NewPassword'
import Onboarding from './features/onboarding/Onboarding'
import Home from './features/home/Home'
import Nearby from './features/nearby/Nearby'
import AddMissingPost from './features/post/AddMissingPost'
import Missingdog from './features/missingDog/Missingdog'
import Event from './features/event/Event'
import EventDetail from './features/event/Eventdetal'
import Notification from './features/notification/Notification'
import Profile from './features/profile/Profile'

const App = () => {
  return (
    <Routes>
      {/* Redirect root domain straight to login for now */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/verify" element={<Verification />} />
      <Route path="/new-password" element={<NewPassword />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/home" element={<Home />} />
      <Route path="/nearby" element={<Nearby />} />
      <Route path="/add-missing-post" element={<AddMissingPost />} />
      <Route path="/missing-dog/:id" element={<Missingdog />} />
      <Route path="/events" element={<Event />} />
      <Route path="/event-detail" element={<EventDetail />} />
      <Route path="/notifications" element={<Notification />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

export default App