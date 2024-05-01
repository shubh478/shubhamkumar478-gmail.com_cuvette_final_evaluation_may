import React from "react";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  BrowserRouter,
  Routes,
} from "react-router-dom";
import store from "./store/store";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import BookmarkPage from "./pages/BookmarkPage";
import ShareStory from "./components/ShareStory/ShareStory";
import { ToastContainer, toast } from "react-toastify";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/bookmark" element={<BookmarkPage />} />
            <Route path="/viewStory/:storyId" element={<ShareStory />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </Provider>
    </>
  );
}

export default App;
