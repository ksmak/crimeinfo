import axios from "axios";
import { supabase } from "../api/supabase";
import { Media } from "../types/types";

export const uploadFiles = async (bucket: string, path: string, photos: Media[]) => {
    const { data: list } = await supabase.storage.from(bucket).list(`${path}`);
    const filesToRemove = list?.map((x) => `${path}/${x.name}`);
    if (filesToRemove?.length) {
        const { error } = await supabase.storage.from(bucket).remove(filesToRemove);
        if (error) {
            return { uploadError: error, urls: null };
        }
    }
    for (const photo of photos) {
        const { error } = await supabase
            .storage
            .from(bucket)
            .upload(`${path}/${photo.id}`, photo.file, {
                cacheControl: '3600',
                upsert: false
            })
        if (error) {
            return { uploadError: error, urls: null };
        }
    }
    let urls: string[] = [];
    const { data: list2 } = await supabase.storage.from(bucket).list(`${path}`);
    const filesToUrl = list2?.map((x) => `${path}/${x.name}`);
    if (filesToUrl?.length) {
        const { data, error } = await supabase
            .storage
            .from(bucket)
            .createSignedUrls(filesToUrl, 365 * 24 * 60 * 60);
        if (error) {
            return { uploadError: error, urls: null };
        }
        if (data) {
            urls = data.map((x) => x.signedUrl);
        }
    }
    return { uploadError: null, urls: urls };
}

export const getFileFromUrl = async (url: string, name: string, defaultType = 'image/jpeg') => {
    const response = await fetch(url);
    const data = await response.blob();
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