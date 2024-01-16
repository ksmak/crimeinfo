import { Button, Collapse } from "@material-tailwind/react"
import { Dispatch, SetStateAction } from "react"
import { BsChevronDown } from "react-icons/bs"
import { Category, Info, Site, TestType } from "../../../types/types"
import { useTranslation } from "react-i18next"

type MobileMenuItemProps = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    items: Category[] | Site[] | TestType[] | Info[] | undefined,
    title: string,
}

export default function MobileMenuItem({ open, setOpen, items, title }: MobileMenuItemProps) {
    const { i18n } = useTranslation();

    return (
        <div>
            <Button
                variant="text"
                color="blue"
                className="p-1 flex items-center gap-3 text-sm tracking-normal font-normal normal-case"
                onClick={() => setOpen(!open)}
            >
                {title}{" "}
                <BsChevronDown
                    strokeWidth={1}
                    className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""
                        }`}
                />
            </Button>
            <Collapse open={open}>
                <div className="flex flex-col px-4">
                    {items?.map((item, index) => {
                        let href: string = '';
                        switch (item.type) {
                            case 'category':
                                href = `/search?category=${item.id}`;
                                break;
                            case 'site':
                                href = item.href;
                                break;
                            case 'test_type':
                                href = `/tests/${item.id}`;
                                break;
                            case 'info':
                                href = `/info/${item.id}`;
                                break;
                        }
                        return (
                            <a
                                className="p-1 font-normal hover:underline text-blue-gray-700 hover:cursor-pointer"
                                key={index}
                                href={href}
                            >
                                {String(item[`title_${i18n.language}` as keyof typeof item])}
                            </a>
                        )
                    })}
                </div>
            </Collapse>
        </div>
    )
}