import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider, ProtectedRouter } from "./lib/auth";
import { MetaProvider } from './lib/meta';
import MainPage from './components/UI/pages/MainPage';
import InfoPage from './components/UI/pages/InfoPage';
import SearchPage from './components/UI/pages/SearchPage';
import AboutPage from './components/UI/pages/AboutPage';
import TestPage from './components/UI/pages/TestPage';
import Profile from './components/UI/pages/Profile';
import CategoriesPage from './components/UI/pages/CategoriesPage';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import './owfont/css/owfont-regular.css';
import SuccessRegister from './components/UI/pages/SuccessRegister';
import SuccessTest from './components/UI/pages/SuccessTest';
import TestResultPage from './components/UI/pages/TestResultPage';
import ItemPage from './components/UI/pages/ItemPage';
import ResetPasswordPage from './components/UI/pages/ResetPasswordPage';
import ChangePasswordPage from './components/UI/pages/ChangePasswordPage';
import LoginPage from './components/UI/pages/LoginPage';

function App() {
  return (
    <Suspense fallback="loading">
      <AuthProvider>
        <MetaProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<MainPage />} />
              <Route path='/items'>
                <Route path=':itemId' element={
                  <ItemPage isEdit={false} />
                } />
                <Route path='edit/:itemId' element={
                  <ItemPage isEdit={true} />
                } />
                <Route path='new' element={
                  <ItemPage isEdit={true} />
                } />
              </Route>
              <Route path='/info'>
                <Route path=':infoId' element={
                  <InfoPage isEdit={false} />
                } />
                <Route path='edit/:infoId' element={
                  <InfoPage isEdit={true} />
                } />
                <Route path='new' element={
                  <InfoPage isEdit={true} />
                } />
              </Route>
              <Route path='/tests'>
                <Route path=':testId' element={
                  <TestPage isEdit={false} />
                } />
                <Route path='edit/:testId' element={
                  <TestPage isEdit={true} />
                } />
                <Route path='new' element={
                  <TestPage isEdit={true} />
                } />
              </Route>
              <Route path='/login' element={<LoginPage />} />
              <Route path='/search' element={<SearchPage />} />
              <Route path='/about' element={<AboutPage />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/categories' element={<CategoriesPage />} />
              <Route path='/register_success' element={<SuccessRegister />} />
              <Route path='/test_success' element={<SuccessTest />} />
              <Route path='/test_result/:testId' element={<TestResultPage />} />
              <Route path='/reset_password' element={<ResetPasswordPage />} />
              <Route path='/profile/change_password' element={<ChangePasswordPage />} />
            </Routes>
          </BrowserRouter>
        </MetaProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
