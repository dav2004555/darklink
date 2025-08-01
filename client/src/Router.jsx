import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Contacts from "./pages/Contacts";
import Chats from "./pages/Chats";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import BottomNav from "./components/BottomNav";

function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth" />;
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/contacts"
          element={
            <RequireAuth>
              <Contacts />
            </RequireAuth>
          }
        />
        <Route
          path="/chats"
          element={
            <RequireAuth>
              <Chats />
            </RequireAuth>
          }
        />
        <Route
          path="/chat/:contact"
          element={
            <RequireAuth>
              <Chat />
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  );
}