import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from "./lib/auth";
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
import ActivatePage from './components/UI/pages/ActivatePage';
import SuccessResetPassword from './components/UI/pages/SuccessReset';
import ConfirmResetPasswordPage from './components/UI/pages/ConfirmResetPassword';
import SuccessConfirm from './components/UI/pages/SuccessConfirm';

function App() {
  return (
    <Suspense fallback="loading">
      <BrowserRouter>
        <Routes>
          <Route path='/activate/:code' element={<ActivatePage />} />
          <Route path='/confirm_reset_password/:code' element={
            <ConfirmResetPasswordPage />
          } />
          <Route path='/' element={
            <AuthProvider>
              <MetaProvider>
                <MainPage />
              </MetaProvider>
            </AuthProvider>
          } />
          <Route path='/items'>
            <Route path=':itemId' element={
              <AuthProvider>
                <MetaProvider>
                  <ItemPage isEdit={false} />
                </MetaProvider>
              </AuthProvider>
            } />
            <Route path='edit/:itemId' element={
              <AuthProvider>
                <MetaProvider>
                  <ItemPage isEdit={true} />
                </MetaProvider>
              </AuthProvider>
            } />
            <Route path='new' element={
              <AuthProvider>
                <MetaProvider>
                  <ItemPage isEdit={true} />
                </MetaProvider>
              </AuthProvider>
            } />
          </Route>
          <Route path='/info'>
            <Route path=':infoId' element={
              <AuthProvider>
                <MetaProvider>
                  <InfoPage isEdit={false} />
                </MetaProvider>
              </AuthProvider>
            } />
            <Route path='edit/:infoId' element={
              <AuthProvider>
                <MetaProvider>
                  <InfoPage isEdit={true} />
                </MetaProvider>
              </AuthProvider>
            } />
            <Route path='new' element={
              <AuthProvider>
                <MetaProvider>
                  <InfoPage isEdit={true} />
                </MetaProvider>
              </AuthProvider>
            } />
          </Route>
          <Route path='/tests'>
            <Route path=':testId' element={
              <AuthProvider>
                <MetaProvider>
                  <TestPage isEdit={false} />
                </MetaProvider>
              </AuthProvider>
            } />
            <Route path='edit/:testId' element={
              <AuthProvider>
                <MetaProvider>
                  <TestPage isEdit={true} />
                </MetaProvider>
              </AuthProvider>
            } />
            <Route path='new' element={
              <AuthProvider>
                <MetaProvider>
                  <TestPage isEdit={true} />
                </MetaProvider>
              </AuthProvider>
            } />
          </Route>
          <Route path='/login' element={
            <AuthProvider>
              <LoginPage />
            </AuthProvider>
          } />
          <Route path='/search' element={
            <AuthProvider>
              <MetaProvider>
                <SearchPage />
              </MetaProvider>
            </AuthProvider>
          } />
          <Route path='/about' element={
            <AuthProvider>
              <MetaProvider>
                <AboutPage />
              </MetaProvider>
            </AuthProvider>
          } />
          <Route path='/profile' element={
            <AuthProvider>
              <MetaProvider>
                <Profile />
              </MetaProvider>
            </AuthProvider>
          } />
          <Route path='/categories' element={
            <AuthProvider>
              <MetaProvider>
                <CategoriesPage />
              </MetaProvider>
            </AuthProvider>
          } />
          <Route path='/register_success' element={<SuccessRegister />} />
          <Route path='/test_success' element={<SuccessTest />} />
          <Route path='/test_result/:testId' element={
            <AuthProvider>
              <MetaProvider>
                <TestResultPage />
              </MetaProvider>
            </AuthProvider>
          } />
          <Route path='/reset_password' element={<ResetPasswordPage />} />
          <Route path='/reset_success' element={<SuccessResetPassword />} />
          <Route path='/confirm_success' element={<SuccessConfirm />} />
          <Route path='/profile/change_password' element={
            <AuthProvider>
              <MetaProvider>
                <ChangePasswordPage />
              </MetaProvider>
            </AuthProvider>
          } />
        </Routes>
      </BrowserRouter >
    </Suspense >
  );
}

export default App;
