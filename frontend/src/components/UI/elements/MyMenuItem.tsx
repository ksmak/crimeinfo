import { Button, Menu, MenuHandler, MenuItem, MenuList, Typography } from "@material-tailwind/react";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { BsChevronDown } from "react-icons/bs";
import { Category, Info, Site, TestType } from "../../../types/types";
import { Link } from "react-router-dom";

type MyMenuItemProps = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    items: Category[] | Site[] | TestType[] | Info[] | undefined,
    title: string,
}

export default function MyMenuItem({ open, setOpen, items, title }: MyMenuItemProps) {
    const { i18n } = useTranslation();

    return (
        <Menu open={open} handler={setOpen} allowHover>
            <MenuHandler>
                <Button
                    className="flex items-center gap-3 text-sm tracking-normal font-normal normal-case text-primary-500 hover:bg-blue-400 hover:text-white"
                    variant="text"
                >
                    {title}{" "}
                    <BsChevronDown
                        strokeWidth={1}
                        className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                </Button>
            </MenuHandler>
            {items
                ? <MenuList className="hidden w-[36rem] overflow-visible lg:grid" color="light-blue">
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
                            <Link key={index} to={href} target={item.type === "site" ? "_blank" : ""} rel="noopener noreferrer">
                                <MenuItem className="hover:bg-blue-50">
                                    <Typography variant="paragraph" color="light-blue" className="mb-1 text-blue-gray-700">
                                        {String(item[`title_${i18n.language}` as keyof typeof item])}
                                    </Typography>
                                </MenuItem>
                            </Link>
                        )
                    })}
                </MenuList>
                : null}
        </Menu>
    )
}