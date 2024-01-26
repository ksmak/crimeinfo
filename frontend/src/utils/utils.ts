import axios from "axios";
import { Media } from "../types/types";
import instance from "../api/instance";

export const uploadFiles = async (url: string, medias: Media[]) => {
    let formData = new FormData();
    medias.forEach(m => formData.append('files', m.file));
    await instance.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const getFileFromUrl = async (url: string, defaultType = 'image/jpeg') => {
    const response = await fetch(url);
    const data = await response.blob();
    const name = url.substring(url.lastIndexOf('/') + 1);
    return new File([data], name, {
        type: data.type || defaultType,
    });
}

export const truncate = (str: string, max: number) => {
    return str && str.length > max ? str.substring(0, max - 3) + "..." : str;
}

export const googleTranslate = async (toLang: string, text: string) => {
    const options = {
        method: 'POST',
        url: 'https://translation.googleapis.com/language/translate/v2',
        params: {
            q: text,
            target: toLang,
            key: process.env.REACT_APP_TRANSLATE_API_KEY,
        },
    };

    try {
        const response = await axios.request(options);
        return response.data.data.translations[0].translatedText;
    } catch (error) {
        console.error(error);
        return text;
    }
}