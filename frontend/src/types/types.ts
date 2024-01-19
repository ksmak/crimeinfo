export interface IToken {
    user_id: number,
    email: string
}

export interface IUser {
    id: number,
    email: string,
    fullName?: string,
}

export interface IAuthContext {
    user: IUser | null,
    isAuthenticated: boolean,
    roles: IUserRole[],
    login: (accessToken: string, refreshToken: string) => void,
    logout: () => void,
    getUserRole: () => void,
}

export interface IMetaContext {
    categories?: ICategory[] | undefined,
    regions?: IDict[] | undefined,
    districts?: IDict[] | undefined,
    infoItems?: IInfo[] | undefined,
    testItems?: ITest[] | undefined,
    weather?: IWeather,
    getWeather?: (lat: string, lon: string) => void,
}

export interface IUserRole {
    role: string,
}

export enum UserRole {
    admin = 'admin',
    item_edit = 'item_edit',
    info_edit = 'info_edit',
    test_edit = 'test_edit',
}

export interface Menu {
    label: string,
    link: string,
}

export interface ICategory {
    id: number,
    title_kk: string,
    title_ru: string,
    title_en: string,
    photo: string | null,
    fields: Field[],
    type: 'category'
}

export interface IDetail {
    field_name: string,
    value: string,
}

export interface IItem {
    id: number | null,
    is_active: boolean,
    is_reward: boolean,
    category: number | null,
    title_kk: string | null,
    title_ru: string | null,
    title_en: string | null,
    text_kk: string | null,
    text_ru: string | null,
    text_en: string | null,
    region: number | null,
    district: number | null,
    punkt_kk: string | null,
    punkt_ru: string | null,
    punkt_en: string | null,
    date_of_action: string,
    time_of_action: string,
    details: IDetail[] | null,
    photo_path: string | null,
    created_user: number | null,
    change_user: number | null,
    show_danger_label: boolean,
    files: {
        file: string
    }[] | [],
}

export interface IDict {
    id: number,
    title_kk: string,
    title_ru: string,
    title_en: string,
}

export enum CardType {
    gallery = 'gallery',
    list = 'list',
    grid = 'grid',
}

export interface IAction {
    label: string,
    onclick: () => void,
    icon: JSX.Element,
    role: string,
}

export type Field = {
    field_name?: string,
    type: string,
    title_ru: string,
    title_kk: string,
    title_en: string
}

export type Media = {
    file: File,
}

export interface IComment {
    id?: number | null,
    text?: string | null,
    item_id?: number | null,
    user_id?: string | null,
    create_at?: string | null,
    email?: string | null,
    about?: boolean
}

export interface IProfile {
    id?: number | null,
    username?: string | null,
    full_name?: string | null,
    avatar_url?: string | null,
}

export interface ICategoryInfo {
    category: number,
    cnt: number,
}

export interface IInfo {
    id: number | null,
    is_active: boolean,
    order: number | null,
    title_ru: string | null,
    title_kk: string | null,
    title_en: string | null,
    text_kk: string | null,
    text_ru: string | null,
    text_en: string | null,
    date_of_action: string,
    files: {
        file: string
    }[] | [],
    photo_path: string | null,
    user_id: string | null,
    type: 'info'
}

export interface IQuestion {
    title: string,
    multyple: boolean,
    own_answer: boolean,
    answers: string[],
}

export interface ITest {
    id: number | null,
    is_active: boolean,
    title_ru: string | null,
    title_kk: string | null,
    title_en: string | null,
    data: {
        test_kk: IQuestion[] | null,
        test_ru: IQuestion[] | null,
        test_en: IQuestion[] | null,
    } | null,
    user_id: string | null,
    type: 'test_type'
}

export interface IResultTest {
    question: string,
    answers: boolean[],
    own_answer?: string,
}

export interface ITestResults {
    test_id: number | null,
    data: {
        results: IResultTest[]
    } | null,
}

export interface ITestDataRow {
    title: string,
    labels: string[],
    data: number[],
    own_answers: string[]
}

export interface ISite {
    href: string,
    title_kk: string,
    title_ru: string,
    title_en: string,
    type: 'site'
}

export interface IWeather {
    coord?: {
        lon?: number,
        lat?: number
    },
    weather: [
        {
            id?: number,
            main?: string,
            description?: string,
            icon?: string
        }
    ],
    base?: string,
    main?: {
        temp?: number,
        feels_like?: number,
        temp_min?: number,
        temp_max?: number,
        pressure?: number,
        humidity?: number,
        sea_level?: number,
        grnd_level?: number,
    },
    visibility?: number,
    wind?: {
        speed?: number,
        deg?: number,
        gust?: number,
    },
    clouds?: {
        all?: number,
    },
    dt?: number,
    sys?: {
        type?: number,
        id?: number,
        country?: string,
        sunrise?: number,
        sunset?: number,
    },
    timezone?: number,
    id?: number,
    name?: string,
    cod?: number,
}

export interface IApiError {
    message: string
    status: number
}