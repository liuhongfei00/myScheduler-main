import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Note from "./note";
import Button from "@mui/material/Button";
import Calendar from "./Calendar";
import Signup from "./Signup";
import EditProfileForm from "./EditProfileForm";
import Login from "./Login";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./index.css";
import TaskList from "./TaskLists";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/tasklist" element={<TaskList />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/edit-profile" element={<EditProfileForm />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
