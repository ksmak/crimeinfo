import { useContext, useEffect, useState } from "react";
import { WeatherType } from "../../../types/types";
import { MetaDataContext } from "../../../App";

type WeatherPanelProps = {
    data: WeatherType | undefined,
}

export default function WeatherPanel({ data }: WeatherPanelProps) {
    const { setupWeather } = useContext(MetaDataContext);
    const [currentCity, setCurrentCity] = useState('Karagandy');
    const plus = Math.round(Number(data?.main?.temp)) > 0 ? '+' : '';
    const cities_kz =
    {
        "Astana": {
            "lat": '51.1801',
            "lon": '71.44598',
        },
        "Almaty": {
            "lat": '43.25654',
            "lon": '76.92848',
        },
        "Shymkent": {
            "lat": '42.3',
            "lon": '69.6',
        },
        "Aktau": {
            "lat": '43.65',
            "lon": '51.16667',
        },
        "Aktobe": {
            "lat": '50.27969',
            "lon": '57.20718',
        },
        "Atyrau": {
            "lat": '47.11667',
            "lon": '51.88333',
        },
        "Karagandy": {
            "lat": '49.83333',
            "lon": '73.1658',
        },
        "Kokshetau": {
            "lat": '53.28333',
            "lon": '69.4',
        },
        "Kostanay": {
            "lat": '53.21435',
            "lon": '63.62463',
        },
        "Kyzyl-Orda": {
            "lat": '44.8479',
            "lon": '65.49989',
        },
        "Pavlodar": {
            "lat": '52.28333',
            "lon": '76.96667',
        },
        "Petropavl": {
            "lat": '54.86667',
            "lon": '69.15',
        },
        "Semey": {
            "lat": '50.42675',
            "lon": '80.26669',
        },
        "Taldyqorghan": {
            "lat": '45.0',
            "lon": '77.91667',
        },
        "Taraz": {
            "lat": '42.9',
            "lon": '71.36667',
        },
        "Turkestan": {
            "lat": '43.29733',
            "lon": '68.25175',
        },
        "Oral": {
            "lat": '51.23333',
            "lon": '51.36667',
        },
        "Oskemen": {
            "lat": '49.97143',
            "lon": '82.60586',
        },
    }

    useEffect(() => {
        let city = localStorage.getItem('city');
        if (city) {
            setCurrentCity(city);
        }
    }, [])

    const handleChangeCity = (city: string) => {
        setCurrentCity(city);
        localStorage.setItem('city', city);
        localStorage.setItem('lat', cities_kz[city as keyof typeof cities_kz].lat);
        localStorage.setItem('lon', cities_kz[city as keyof typeof cities_kz].lon);
        if (setupWeather) {
            setupWeather(
                cities_kz[city as keyof typeof cities_kz].lat,
                cities_kz[city as keyof typeof cities_kz].lon
            );
        }
    }

    return (
        <div className="flex flex-col w-20 items-center">
            <select
                className="text-xs text-primary-500 bg-white"
                onChange={(e) => handleChangeCity(e.target.value)}
                value={currentCity}
            >
                {Object.keys(cities_kz).map(item => (<option key={item}>{item}</option>))}
            </select>
            <div className="flex flex-row justify-center gap-1">
                <i className={`owf owf-${data?.weather[0].id} owf-3x text-blue-50`}></i>
                <p className="text-primary-500">{data ? `${plus}${Math.round(Number(data?.main?.temp))}` : ''}</p>
            </div>
            <p className="text-primary-500 text-xs">{data ? data.weather[0].description : ''}</p>
        </div>
    )
}