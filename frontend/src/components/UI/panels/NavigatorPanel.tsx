import { useContext, useEffect, useState } from "react";
import { Collapse, IconButton } from "@material-tailwind/react";
import { supabase } from "../../../api/supabase";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Site } from "../../../types/types";
import { AuthContext, MetaDataContext } from '../../../App';
import Logo from "../elements/Logo";
import LanguagePanel from "./LanguagePanel";
import WeatherPanel from "./WeatherPanel";
import MyMenuItem from "../elements/MyMenuItem";
import MobileMenuItem from "../elements/MobileMenuItem";
import SingleMenuItem from "../elements/SingleMenuItem";
import ModileSingleItem from "../elements/MobileSingleItem";

const NavigatorPanel = () => {
    const { t } = useTranslation();
    const auth = useContext(AuthContext);
    const [openNav, setOpenNav] = useState(false);
    const { categories, infoItems, testItems, weather } = useContext(MetaDataContext);
    const [openCategoryMenu, setOpenCategoryMenu] = useState(false);
    const [openInfoMenu, setOpenInfoMenu] = useState(false);
    const [openTestMenu, setOpenTestMenu] = useState(false);
    const [openSiteMenu, setOpenSiteMenu] = useState(false);
    const [openCategoryMenuMobile, setOpenCategoryMenuMobile] = useState(false);
    const [openInfoMenuMobile, setOpenInfoMenuMobile] = useState(false);
    const [openTestMenuMobile, setOpenTestMenuMobile] = useState(false);
    const [openSiteMenuMobile, setOpenSiteMenuMobile] = useState(false);

    useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenNav(false),
        );
    }, []);

    const siteItems: Site[] = [
        {
            href: "https://qamqor.gov.kz/missing",
            title_kk: "Хабар-ошарсыз жоғалғандарды іздестіру - Құқықтық статистика және арнайы есепке алу органдарының порталы ",
            title_ru: "Розыск без вести пропавших - Портал органов правовой статистики и специальных учетов",
            title_en: "Search for missing persons - Portal of legal statistics and special accounts",
            type: 'site'
        },
        {
            href: "https://aisoip.adilet.gov.kz/debtors",
            title_kk: "Борышкерлердің бірыңғай тізілімі - Қазақстан Республикасының Әділет министрлігі ",
            title_ru: "Единый реестр должников - Министерство юстиции Республики Казахстан",
            title_en: "Unified Register of Debtors - Ministry of Justice of the Republic of Kazakhstan",
            type: 'site'
        },
        {
            href: "https://iszh.gov.kz/#/inz-search",
            title_kk: "«Ауыл шаруашылығы жануарларын бірдейлендіру» дерекқорын пайдаланып жануарды іздеу - Қазақстан Республикасы Ауыл шаруашылығы министрлігі ",
            title_ru: "Поиск животного по базе «Идентификация сельскохозяйственных животных» - Министерство сельского хозяйства Республики Казахстан​",
            title_en: "Search for an animal using the “Farm Animal Identification” database - Ministry of Agriculture of the Republic of Kazakhstan​",
            type: 'site'
        }
    ]

    const handleLogout = async () => {
        await supabase.auth.signOut();
        auth.logout();
    }

    return (
        <div className="w-full">
            <div
                className="w-full flex flex-row justify-between items-center gap-2 border-b-2 px-4 py-5"
            >
                <img className="shrink-0 hidden h-12 lg:block" src="/logo_karaganda.png" alt="karaganda_logo" />
                <div className="shrink-0 h-14">
                    <Logo />
                </div>
                <div className="flex flex-row">
                    <div className="hidden lg:block">
                        <div className="flex flex-row justify-center items-center">
                            <ul className="h-full flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:flex-wrap bg-blue-50 rounded-md">
                                <li>
                                    <SingleMenuItem link="/" title={t('main')} />
                                </li>
                                <li>
                                    <MyMenuItem open={openCategoryMenu} setOpen={setOpenCategoryMenu} items={categories} title={t('categories')} />
                                </li>
                                <li>
                                    <MyMenuItem open={openSiteMenu} setOpen={setOpenSiteMenu} items={siteItems} title={t('siteMenu')} />
                                </li>
                                <li>
                                    <MyMenuItem open={openTestMenu} setOpen={setOpenTestMenu} items={testItems} title={t('testMenu')} />
                                </li>
                                <li>
                                    <MyMenuItem open={openInfoMenu} setOpen={setOpenInfoMenu} items={infoItems} title={t('infoMenu')} />
                                </li>
                                <li>
                                    <SingleMenuItem link="/about" title={t('feedbackMenu')} />
                                </li>
                                {auth.session?.user
                                    ? <li className="text-end text-primary-500 text-sm px-5">
                                        <div className="">{auth.session.user.email}</div>
                                        <div>
                                            <Link to="/profile" className="underline cursor-pointer mr-1 lowercase">{t('profile')}</Link>
                                            <span className="underline cursor-pointer lowercase" onClick={handleLogout}>{t('exit')}</span>
                                        </div>
                                    </li>
                                    : <li>
                                        <SingleMenuItem link="/login" title={t('enterOrRegister')} />
                                    </li>}
                            </ul>
                        </div>
                    </div>
                    <IconButton
                        variant="text"
                        className="mr-5 self-end ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
                        ripple={false}
                        onClick={() => setOpenNav(!openNav)}
                    >
                        {openNav ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                className="h-6 w-6"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </IconButton>
                </div>
                <div className="shrink-0 hidden lg:block">
                    <WeatherPanel data={weather} />
                </div>
                <div className="shrink-0">
                    <LanguagePanel />
                </div>
            </div >
            <Collapse open={openNav}>
                <div className="container mx-auto p-2">
                    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-4">
                        <li>
                            <ModileSingleItem link="/" title={t('main')} />
                        </li>
                        <li>
                            <MobileMenuItem open={openCategoryMenuMobile} setOpen={setOpenCategoryMenuMobile} items={categories} title={t('categories')} />
                        </li>
                        <li>
                            <MobileMenuItem open={openSiteMenuMobile} setOpen={setOpenSiteMenuMobile} items={siteItems} title={t('siteMenu')} />
                        </li>
                        <li>
                            <MobileMenuItem open={openTestMenuMobile} setOpen={setOpenTestMenuMobile} items={testItems} title={t('testMenu')} />
                        </li>
                        <li>
                            <MobileMenuItem open={openInfoMenuMobile} setOpen={setOpenInfoMenuMobile} items={infoItems} title={t('infoMenu')} />
                        </li>
                        <ModileSingleItem link="/about" title={t('feedbackMenu')} />
                        {auth.session?.user
                            ? <div className="text-primary-500 text-sm p-1">
                                <div className="">{auth.session.user.email}</div>
                                <div>
                                    <Link to="/profile" className="underline cursor-pointer mr-1 lowercase">{t('profile')}</Link>
                                    <span className="underline cursor-pointer lowercase" onClick={handleLogout}>{t('exit')}</span>
                                </div>
                            </div>
                            : <ModileSingleItem link="/login" title={t('enterOrRegister')} />}
                    </ul>
                </div>
            </Collapse>
        </div>
    )
}

export default NavigatorPanel;