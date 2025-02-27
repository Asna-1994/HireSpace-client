import { Route, Routes } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import UserRoutes from './routes/UserRoutes';
import CompanyRoutes from './routes/CompanyRoutes';
import AdminRoutes from './routes/AdminRoutes';
import Home from './User/Pages/Home/Home';
import NotFound from './Shared/Pages/NotFound';
import ErrorPage from './Shared/Pages/ErrorPage';
import NoAccess from './Shared/Pages/NoAccess';
import Contact from './Shared/Pages/Contact';
import About from './Shared/Pages/About';
import 'global';
import { useEffect } from 'react';
import { connectSocket, socket } from './services/socket';




function App() {

useEffect(() => {
        if (!socket.connected) {
          connectSocket();
        }
},[])





  const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  return (
    <>
      <ToastContainer autoClose={1500} />
      <GoogleOAuthProvider clientId={client_id}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/no-access" element={<NoAccess />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/user/*" element={<UserRoutes />} />
          <Route path="/company/*" element={<CompanyRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
