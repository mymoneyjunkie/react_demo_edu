import { Fragment } from 'react'

import { Login, Register, Pricing, Billing, ProtectedRoute } from './components';

import { Home, DMCA, EULA, Support, Terms, Privacy, Changelog, Users, Index, Success, Cancel } from './UI';

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Fragment>
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/pricing" element={<Pricing />} />
          <Route exact path="/users" element={<Users />} />
          <Route exact path="/success" element={<Success />} />
          <Route exact path="/cancel" element={<Cancel />} />
          <Route exact path="/billing" element={<Billing />} />
          <Route exact path="/dmca" element={<DMCA />} />
          <Route exact path="/eula" element={<EULA />} />
          <Route exact path="/support" element={<Support />} />
          <Route exact path="/terms" element={<Terms />} />
          <Route exact path="/privacy" element={<Privacy />} />
          <Route exact path="/changelog" element={<Changelog />} />
        </Route>
        <Route path="*" element={<Index />} />
      </Routes>
    </Fragment>
  )
}

export default App
