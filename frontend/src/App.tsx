import { Suspense, createContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { supabase } from './api/supabase';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

import MainPage from './components/UI/pages/MainPage';
import InfoPage from './components/UI/pages/InfoPage';
import SearchPage from './components/UI/pages/SearchPage';
import AboutPage from './components/UI/pages/AboutPage';
import TestPage from './components/UI/pages/TestPage';
import { Category, Dict, Info, TestType, WeatherType } from './types/types';
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

type AuthContextType = {
  session: Session | null,
  roles: string[],
  logout: () => void
}

type MetaDataType = {
  categories?: Category[] | undefined,
  regions?: Dict[] | undefined,
  districts?: Dict[] | undefined,
  infoItems?: Info[] | undefined,
  testItems?: TestType[] | undefined,
  weather?: WeatherType,
  setupWeather?: (lat: string, lon: string) => void,
}

export const AuthContext = createContext<AuthContextType>({ session: null, roles: [], logout: () => { } });
export const MetaDataContext = createContext<MetaDataType>({});

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>();
  const [regions, setRegions] = useState<Dict[]>();
  const [districts, setDistricts] = useState<Dict[]>();
  const [infoItems, setInfoItems] = useState<Info[]>();
  const [testItems, setTestItems] = useState<TestType[]>();
  const [weather, setWeather] = useState();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      getRole(session);
      getInfoItems(session);
      getTestItems(session);
    });

    getCategories();
    getRegions();
    getDistricts();

    // navigator.geolocation.getCurrentPosition(
    //   function (position) {
    //     const weatherURL =
    //       `https://api.openweathermap.org/data/2.5/weather?lon=${position.coords.longitude}&lat=${position.coords.latitude}&lang=ru&units=metric&APPID=a9a3a62789de80865407c0452e9d1c27`

    //     fetch(weatherURL)
    //       .then(res => res.json())
    //       .then(data => {
    //         setWeather(data);
    //       })
    //   });


    //karaganda default
    let lat = localStorage.getItem('lat');
    lat = lat ? lat : '49.83333';
    let lon = localStorage.getItem('lon');
    lon = lon ? lon : '73.1658';
    setupWeather(lat, lon);

    const { data: { subscription } } = onAuthStateChange((event: AuthChangeEvent) => {
      console.log(event)
      switch (event) {
        case 'SIGNED_OUT':
          setSession(session);
          getRole(session);
          getInfoItems(session);
          getTestItems(session);
          break;
        case 'SIGNED_IN':
          setSession(session);
          getRole(session);
          getInfoItems(session);
          getTestItems(session);
          break;
        default:
          // router.refresh()
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };

    // eslint-disable-next-line
  }, []);

  const onAuthStateChange = (callback: (event: AuthChangeEvent) => void) => {
    let currentSession: Session | null;
    return supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.id === currentSession?.user?.id) return;
      currentSession = session;
      callback(event);
    });
  }

  const getRole = async (session: Session | null) => {
    const userId = session?.user.id;
    setRoles([]);
    if (userId) {
      const { data } = await supabase
        .from('user_role')
        .select('role')
        .eq('user_id', userId)
      if (data) {
        const prunedData = data.map((item) => {
          return item.role;
        });
        setRoles(prunedData);
      }
    }
  }

  const getCategories = async () => {
    const { data } = await supabase.from('category')
      .select(`
      id,
      title_kk,
      title_ru,
      title_en,
      photo,
      data->fields
    `)
      .order('order');
    if (data) {
      const prunedData = data.map((record) => {
        return {
          id: record.id,
          title_kk: record.title_kk,
          title_ru: record.title_ru,
          title_en: record.title_en,
          photo: record.photo,
          fields: record.fields,
          type: 'category'
        } as Category
      });
      setCategories(prunedData);
    }
  };

  const getRegions = async () => {
    const { data } = await supabase.from('region').select();
    if (data) {
      const prunedData = data.map((record) => {
        return {
          id: record.id,
          title_kk: record.title_kk,
          title_ru: record.title_ru,
          title_en: record.title_en,
        } as Dict
      });
      setRegions(prunedData);
    }
  };

  const getDistricts = async () => {
    const { data } = await supabase.from('district').select();
    if (data) {
      const prunedData = data.map((record) => {
        return {
          id: record.id,
          title_kk: record.title_kk,
          title_ru: record.title_ru,
          title_en: record.title_en,
        } as Dict
      });
      setDistricts(prunedData);
    }
  }

  const getInfoItems = async (session: Session | null) => {
    const { data } = await supabase
      .from('info')
      .select()
      .or(`is_active.eq.true${session?.user.id ? ', user_id.eq.' + session.user.id : ''}`)
      .order('order', { ascending: false })
    if (data) {
      const prunedData = data.map((record) => {
        return {
          id: record.id,
          is_active: record.is_active,
          is_reward: record.is_reward,
          order: record.order,
          title_ru: record.title_ru,
          title_kk: record.title_kk,
          title_en: record.title_en,
          text_kk: record.text_kk,
          text_ru: record.text_ru,
          text_en: record.text_en,
          date_of_action: record.date_of_action,
          data: record.data,
          photo_path: record.photo_path,
          user_id: record.user_id,
          type: 'info'
        } as Info;
      });
      setInfoItems(prunedData);
    }
  }

  const getTestItems = async (session: Session | null) => {
    const { data } = await supabase
      .from('tests')
      .select()
      .or(`is_active.eq.true${session?.user.id ? ', user_id.eq.' + session.user.id : ''}`)
      .order('order', { ascending: false })
    if (data) {
      const prunedData = data.map((record) => {
        return {
          id: record.id,
          is_active: record.is_active,
          title_ru: record.title_ru,
          title_kk: record.title_kk,
          title_en: record.title_en,
          data: record.data,
          user_id: record.user_id,
          type: 'test_type'
        } as TestType;
      });
      setTestItems(prunedData);
    }
  }

  const handleLogout = () => {
    setSession(null);
    setRoles([]);
  }

  const setupWeather = (lat: string, lon: string) => {
    const weatherURL =
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=ru&units=metric&APPID=a9a3a62789de80865407c0452e9d1c27`

    fetch(weatherURL)
      .then(res => res.json())
      .then(data => {
        setWeather(data);
      })
  }

  const authCtx = {
    session: session,
    roles: roles,
    logout: handleLogout,
  }

  const metaCtx = {
    categories: categories,
    regions: regions,
    districts: districts,
    infoItems: infoItems,
    testItems: testItems,
    weather: weather,
    setupWeather: setupWeather,
  }

  return (
    <Suspense fallback="loading">
      <AuthContext.Provider value={authCtx}>
        <MetaDataContext.Provider value={metaCtx}>
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
        </MetaDataContext.Provider>
      </AuthContext.Provider>
    </Suspense>
  );
}

export default App;
