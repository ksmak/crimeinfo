import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Badge, Button, Card, CardBody, CardFooter, Collapse, Input } from "@material-tailwind/react";
import { BsFilter, BsSearch } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../../../api/supabase";
import { Detail, Field, Item } from "../../../types/types";
import ItemsPanel from "../panels/ItemsPanel";
import NavigatorPanel from "../panels/NavigatorPanel";
import Loading from "../elements/Loading";
import InputField from "../elements/InputField";
import SelectField from "../elements/SelectField";
import { AuthContext, MetaDataContext } from "../../../App";

type FilterType = {
    searchText?: string | undefined,
    category?: string | undefined,
    region?: string | undefined,
    district?: string | undefined,
    punkt?: string | undefined,
    date_of_action_start?: string | undefined,
    date_of_action_end?: string | undefined,
    details?: Detail[] | undefined,
}

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const { session } = useContext(AuthContext);
    const { categories, regions, districts } = useContext(MetaDataContext);
    const { t, i18n } = useTranslation();
    const [findItems, setFindItems] = useState<Item[]>([]);
    const [filter, setFilter] = useState<FilterType>({
        searchText: searchParams.get('text'),
        category: searchParams.get('category')
    } as FilterType);
    const [loading, setLoading] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [fields, setFields] = useState<Field[]>();
    const [count, setCount] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);

    const getCount = () => {
        let count = 0;
        if (filter.region) count++;
        if (filter.district) count++;
        if (filter.punkt) count++;
        if (filter.date_of_action_start || filter.date_of_action_end) count++;
        if (filter.details) count += filter.details.length;
        setCount(count);
    }

    const handleSearchItems = async () => {
        setLoading(true);

        setOpenFilter(false);

        let query = supabase
            .from('item')
            .select()
            .or(`is_active.eq.true${session?.user.id ? ', user_id.eq.' + session.user.id : ''}`)

        if (filter.searchText) {
            query = query.or(`title_kk.ilike.%${filter.searchText}%, title_ru.ilike.%${filter.searchText}%, title_en.ilike.%${filter.searchText}%, text_kk.ilike.%${filter.searchText}%, text_ru.ilike.%${filter.searchText}%, text_en.ilike.%${filter.searchText}%`);
        }
        if (filter.category) {
            query = query.eq('category_id', filter.category);
        }
        if (filter.region) {
            query = query.eq('region_id', filter.region);
        }
        if (filter.district) {
            query = query.eq('district_id', filter.district);
        }
        if (filter.punkt) {
            query = query.ilike('punkt', `%${filter.punkt}%`);
        }
        if (filter.date_of_action_start) {
            query = query.gte('date_of_action', filter.date_of_action_start);
        }
        if (filter.date_of_action_end) {
            query = query.lte('date_of_action', filter.date_of_action_end);
        }
        query = query.order('date_of_action', { ascending: false })
        const { data, error } = await query;
        if (error) {
            setErrorMessage(error.message);
            setShowError(true);
            setLoading(false);
            return;
        }
        if (data) {
            const prunedData = data as Item[];
            if (filter.details && filter.details.length) {
                const filterDetails = filter.details;
                let filteredData: Item[] = [];
                prunedData.forEach((item) => {
                    let flag = false;
                    for (let i = 0; i < filterDetails.length; i++) {
                        flag = false;
                        if (item.data?.details && item.data.details.length) {
                            const itemDetails = item.data.details;
                            for (let j = 0; j < itemDetails.length; j++) {
                                if (itemDetails[j].field_name === filterDetails[i].field_name) {
                                    if (itemDetails[j].value.toLowerCase().includes(filterDetails[i].value.toLowerCase())) {
                                        flag = true;
                                        break;
                                    }
                                }
                            }
                        } else {
                            flag = true;
                        }
                        if (flag === false) {
                            break;
                        }
                    }
                    if (flag) {
                        filteredData.push(item);
                    }
                });
                if (filteredData) {
                    setFindItems(filteredData as Item[]);
                } else {
                    setFindItems([]);
                }
            } else {
                setFindItems(prunedData);
            }
        }
        setLoading(false);
    }

    const handleClean = () => {
        setFilter({ searchText: filter.searchText });
    }

    const handleChangeCategory = (value: string) => {
        setFilter({ ...filter, category: value, details: undefined });
    }

    useEffect(() => {
        getCount();
        const category = categories?.find(category => category.id === Number(filter.category));
        setFields(category?.fields);
        // eslint-disable-next-line
    }, [filter]);

    useEffect(() => {
        handleSearchItems();
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <NavigatorPanel />
            <div className="px-5 pt-5 h-[calc(100vh-5.75rem)] overflow-y-auto">
                <Alert className="bg-red-500 mb-4" open={showError} onClose={() => setShowError(false)}>{errorMessage}</Alert>
                <div className="w-full bg-white mb-4 flex flex-row gap-4">
                    <Input
                        placeholder={t('search')}
                        icon={<BsSearch />}
                        className="!border !border-blue-300 bg-white text-blue-500 shadow-lg shadow-blue-400/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-blue-900 focus:!border-t-blue-900 focus:ring-blue-400/10"
                        labelProps={{
                            className: "hidden",
                        }}
                        containerProps={{ className: "min-w-[100px]" }}
                        crossOrigin=""
                        value={filter.searchText ? filter.searchText : ''}
                        onChange={(e) => setFilter({ ...filter, searchText: e.target.value })}
                    />
                    <Button size="sm" className="bg-primary-500" onClick={() => handleSearchItems()}>{t('searchButton')}</Button>
                </div>
                <div className="w-full mb-4 flex flex-row flex-wrap gap-4 justify-between items-end">
                    <SelectField
                        name='category_id'
                        label={t('category')}
                        value={filter.category ? filter.category : ''}
                        onChange={(e) => handleChangeCategory(e.target.value)}
                        dict={categories}
                        required={true}
                    />
                    <Badge content={count} invisible={count === 0}>
                        <Button size="sm" variant="outlined" className="flex items-center gap-3 text-primary-500 border-primary-500" onClick={() => setOpenFilter(!openFilter)}>
                            {t('filter')}
                            <BsFilter />
                        </Button>
                    </Badge>
                </div>
                <Collapse open={openFilter}>
                    <Card className="bg-blue-gray-50 my-4">
                        <CardBody>
                            <div className="w-full mb-4">
                                <SelectField
                                    name='region_id'
                                    label={t('region')}
                                    value={filter.region ? filter.region : ''}
                                    dict={regions}
                                    onChange={(e) => setFilter({ ...filter, region: e.target.value })}
                                    required={true}
                                />
                            </div>
                            <div className="w-full mb-4">
                                <SelectField
                                    name='district_id'
                                    label={t('district')}
                                    value={filter.district ? filter.district : ''}
                                    dict={districts}
                                    onChange={(e) => setFilter({ ...filter, district: e.target.value })}
                                    required={true}
                                />
                            </div>
                            <div className="w-full mb-4">
                                <InputField
                                    type='text'
                                    name='punkt'
                                    label={t('punkt')}
                                    value={filter.punkt ? filter.punkt : ''}
                                    onChange={(e) => setFilter({ ...filter, punkt: e.target.value })}
                                    required={true}
                                />
                            </div>
                            <div className="w-44 mb-4 flex flex-row gap-4">
                                <InputField
                                    type='date'
                                    name='date_of_action_start'
                                    label={t('date_start')}
                                    value={filter.date_of_action_start ? filter.date_of_action_start : ''}
                                    onChange={(e) => setFilter({ ...filter, date_of_action_start: e.target.value })}
                                    required={true}
                                />
                                <InputField
                                    type='date'
                                    name='date_of_action_end'
                                    label={t('date_end')}
                                    value={filter.date_of_action_end ? filter.date_of_action_end : ''}
                                    onChange={(e) => setFilter({ ...filter, date_of_action_end: e.target.value })}
                                    required={true}
                                />
                            </div>
                            {fields
                                ? fields.map((field, index) => {
                                    let val = '';
                                    if (field.field_name) {
                                        const detail = filter.details?.find(det => det.field_name === field.field_name);
                                        if (detail) {
                                            val = detail.value;
                                        }
                                    }
                                    const handleChangeDetail = (val: string) => {
                                        if (field.field_name) {
                                            if (val === '') {
                                                let details = filter.details ? filter.details : [];
                                                const index = details.findIndex(det => det.field_name === field.field_name);
                                                if (index >= 0) {
                                                    details.splice(index, 1);
                                                }
                                                setFilter({ ...filter, details: details });
                                            } else {
                                                let newDetail: Detail = {
                                                    field_name: field.field_name,
                                                    value: val
                                                }
                                                let details = filter.details ? filter.details : [];
                                                const index = details.findIndex(det => det.field_name === field.field_name);
                                                if (index >= 0) {
                                                    details.splice(index, 1, newDetail);
                                                } else {
                                                    details.push(newDetail);
                                                }
                                                setFilter({ ...filter, details: details });
                                            }
                                        }
                                    }
                                    return (
                                        <div className="w-full mb-4" key={field.field_name}>
                                            <InputField
                                                type='text'
                                                name={field.field_name ? field.field_name : `field_${index + 1}`}
                                                label={String(field[`title_${i18n.language}` as keyof typeof field])}
                                                value={val}
                                                onChange={(e) => handleChangeDetail(e.target.value)}
                                                required={false}
                                            />
                                        </div>
                                    )
                                })
                                : null}
                        </CardBody>
                        <CardFooter className="pt-0 text-end">
                            <Button variant="outlined" size="sm" className="text-red-600 border-red-600 mr-4" onClick={() => handleClean()}>{t('clean')}</Button>
                            <Button variant="outlined" size="sm" className="text-primary-500 border-primary-500" onClick={() => setOpenFilter(!openFilter)}>{t('close')}</Button>
                        </CardFooter>
                    </Card>
                </Collapse>
                <div className="text-xs my-5 w-full md:w-1/2">{t('warning_text')}</div>
                {findItems.length && findItems.length > 0
                    ? <div>
                        <div className="text-primary-500 uppercase font-bold">
                            {`${t('find')}: ${findItems.length}`}
                        </div>
                        <ItemsPanel
                            items={findItems}
                            regions={regions}
                            districts={districts}
                            openItems={true}
                        />
                    </div>
                    : filter ? <p className="text-primary-500">{t('nothingResult')}</p> : ''}
                {loading ? <Loading /> : null}
            </div>
        </div>
    )
}

export default SearchPage;