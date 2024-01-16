import { useTranslation } from "react-i18next";
import SingleMenuItem from "../elements/SingleMenuItem";
import { Collapse, IconButton } from "@material-tailwind/react";
import { useState } from "react";
import ModileSingleItem from "../elements/MobileSingleItem";

export default function BottomNavigation() {
    const { i18n } = useTranslation();
    const [openNav, setOpenNav] = useState(false);
    const outerLinks = [
        {
            href: "https://www.gov.kz/memleket/entities/qriim?lang=ru",
            title_kk: "ҚР ІІМ сайты",
            title_ru: "Сайт МВД РК",
            title_en: "Website of the MIA of the RK",
            icon: 'mvd.png'
        },
        {
            href: "https://polisia.kz/ru/",
            title_kk: "",
            title_ru: "",
            title_en: "",
            icon: 'media-portal.png'
        },
        {
            href: "https://t.me/s/POLICE_of_KZ",
            title_kk: "POLISIA.KZ",
            title_ru: "POLISIA.KZ",
            title_en: "POLISIA.KZ",
            icon: 'telegram.png'
        },
        {
            href: "https://www.instagram.com/policeofkaraganda/",
            title_kk: "Қарағанды полициясы",
            title_ru: "Полиция Караганды",
            title_en: "Police of Karaganda",
            icon: 'instagram.png'
        },
        {
            href: "https://www.instagram.com/cyberpol_up_krg/",
            title_kk: "Қарағанды Cyberpol",
            title_ru: "Cyberpol Караганды",
            title_en: "Cyberpol of Karaganda",
            icon: 'instagram.png'
        },
    ];

    return (
        <div className="w-full">
            <div
                className="flex flex-row justify-center items-center px-5 py-3"
            >
                <div className="hidden lg:block">
                    <div className="flex flex-row justify-center items-center">
                        <ul className="h-full flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:flex-wrap bg-blue-50 rounded-md">
                            {outerLinks.map((item, index) => {
                                const title = String(item[`title_${i18n.language}` as keyof typeof item]);
                                return (
                                    <li key={index}>
                                        <SingleMenuItem link={item.href} title={title} icon={item.icon} />
                                    </li>
                                );
                            })}
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
            <Collapse open={openNav}>
                <div className="container mx-auto p-2">
                    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-4">
                        {outerLinks.map((item, index) => {
                            const title = String(item[`title_${i18n.language}` as keyof typeof item]);
                            return (
                                <li key={index}>
                                    <ModileSingleItem link={item.href} title={title} icon={item.icon} />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </Collapse>
        </div>
    )
}