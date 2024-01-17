import { createContext, useContext, useEffect, useState } from "react";
import { ICategory, IDict, IMetaContext, IInfo, ITest, IWeather } from "../types/types";
import axios from "axios";

const MetaContext = createContext<IMetaContext>({});

export function useMeta() {
    return useContext(MetaContext);
}

export function MetaProvider({ children }: any) {
    const [categories, setCategories] = useState<ICategory[]>();
    const [regions, setRegions] = useState<IDict[]>();
    const [districts, setDistricts] = useState<IDict[]>();
    const [infoItems, setInfoItems] = useState<IInfo[]>();
    const [testItems, setTestItems] = useState<ITest[]>();
    const [weather, setWeather] = useState<IWeather>();

    useEffect(() => {
        getCategories();
        getRegions();
        getDistricts();
        getInfoItems();
        getTestItems();
        //karaganda default
        let lat = localStorage.getItem('lat');
        lat = lat ? lat : '49.83333';
        let lon = localStorage.getItem('lon');
        lon = lon ? lon : '73.1658';
        getWeather(lat, lon);
    }, [])

    const getCategories = () => {
        axios.get<ICategory[]>(`${process.env.REACT_APP_API_HOST}/api/categories/`)
            .then(res => {
                setCategories(res.data)
            })
            .catch(err => {
                console.log(err);
            })
    };

    const getRegions = () => {
        axios.get<IDict[]>(`${process.env.REACT_APP_API_HOST}/api/regions/`)
            .then(res => {
                setRegions(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    };

    const getDistricts = () => {
        axios.get<IDict[]>(`${process.env.REACT_APP_API_HOST}/api/districts/`)
            .then(res => {
                setDistricts(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const getInfoItems = () => {
        axios.get<IInfo[]>(`${process.env.REACT_APP_API_HOST}/api/info/`)
            .then(res => {
                setInfoItems(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const getTestItems = () => {
        axios.get<IInfo[]>(`${process.env.REACT_APP_API_HOST}/api/tests/`)
            .then(res => {
                setInfoItems(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const getWeather = (lat: string, lon: string) => {
        const weatherURL =
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=ru&units=metric&APPID=a9a3a62789de80865407c0452e9d1c27`

        fetch(weatherURL)
            .then(res => res.json())
            .then(data => {
                setWeather(data);
            })
    }

    const meta: IMetaContext = {
        categories: categories,
        regions: regions,
        districts: districts,
        infoItems: infoItems,
        testItems: testItems,
        weather: weather,
        getWeather: getWeather,
    }

    return (
        <MetaContext.Provider value={meta}>
            {children}
        </MetaContext.Provider>
    )
}