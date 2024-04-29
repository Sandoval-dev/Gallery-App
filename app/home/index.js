import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { hp, wp } from '../../helpers/common'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons'
import theme from '../../constants/theme'
import Categories from '../../components/categories'
import { apiCall } from '../../api'
import { debounce, filter } from 'lodash'
import ImageGrid from '../../components/imageGrid'
import FiltersModal from '../../components/filtersModal'
import { useRouter } from 'expo-router'

var page = 1
const Home = () => {
    const { top } = useSafeAreaInsets()
    const paddingTop = top > 0 ? top + 10 : 30
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState(null)
    const [activeCategory, setActiveCategory] = useState(null)
    const [images, setImages] = useState([])
    const searchInputRef = useRef(null)
    const modalRef = useRef(null)
    const router=useRouter()
    const scrollRef=useRef(null)
    const [isEndReached, setIsEndReached] = useState(false)

    useEffect(() => {
        fetchImages()
    }, [])

    //append true ise diziye yeni eleman eklenebilir
    const fetchImages = async (params = { page: 1 }, append = true) => {

        let res = await apiCall(params)
        if (res.success && res?.data?.hits) {
            if (append)
                setImages([...images, ...res.data.hits])
            else
                setImages([...res.data.hits])

        }
    }

    const handleChangeCategory = (cat) => {
        setActiveCategory(cat)
        clearSearch()
        setImages([])
        page = 1
        let params = {
            page,
            ...filters
        }
        if (cat) params.category = cat
        fetchImages(params, false)
    }

    const handleSearch = (text) => {
        setSearch(text)
        if (text.length > 2) {
            page = 2
            setImages([])
            setActiveCategory(null)
            fetchImages({ page, q: text, ...filters }, false)
        }
        if (text == "") {
            page = 1
            searchInputRef?.current?.clear()
            setImages([])
            setActiveCategory(null) //clear category when searching
            fetchImages({ page, ...filters }, false)
        }
    }

    const openFiltersModal = () => {
        modalRef?.current?.present()
    }

    const closeFiltersModal = () => {
        modalRef?.current?.close()
    }

    const applyFilters = () => {
        if (filters) {
            page = 1
            setImages([])
            let params = {
                page,
                ...filters
            }
            if (activeCategory) params.category = activeCategory
            if (search) params.q = search
            fetchImages(params, false)
        }
        closeFiltersModal()
    }

    const clearThisFilter = (filterName) => {
        let filterz = { ...filters }
        delete filterz[filterName]
        setFilters({ ...filterz })
        page = 1,
            setImages([])
        let params = {
            page,
            ...filterz
        }
        if (activeCategory) params.category = activeCategory
        if (search) params.q = search
        fetchImages(params, false)
    }

    const handleScroll = (event) => {

        const contentHeight=event.nativeEvent.contentSize.height
        const scrollViewHeight=event.nativeEvent.layoutMeasurement.height
        const scrollOffset=event.nativeEvent.contentOffset.y
        const bottomPosition=contentHeight - scrollViewHeight

        if (scrollOffset>= bottomPosition-1) {
            
            if (!isEndReached) {
                setIsEndReached(true)
                ++page;
                let params = {
                    page,
                   ...filters
                }
                if (activeCategory) params.category = activeCategory
                if (search) params.q = search
                fetchImages(params)
            }
        }else if(isEndReached){
            setIsEndReached(false)
        }
    }

    const resetFilters = () => {
        if (filters) {
            page = 1
            setFilters(null)
            setImages([])
            let params = {
                page,
            }
            if (activeCategory) params.category = activeCategory
            if (search) params.q = search
            fetchImages(params, false)
        }
        closeFiltersModal()
    }

    const clearSearch = () => {
        setSearch("")
        searchInputRef?.current?.clear()
    }

    const handleScrollUp = () => {
        scrollRef?.current?.scrollTo({ x: 0, y: 0, animated: true })
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 400), [])

    return (
        <View style={[styles.container, { paddingTop }]}>
            <View style={styles.header}>
                <Pressable onPress={handleScrollUp}>
                    <Text style={styles.title}>
                        Erd Gallery
                    </Text>
                </Pressable>
                <Pressable onPress={openFiltersModal}>
                    <FontAwesome6 name="bars-staggered" size={22} color='rgba(10,10,10,0.7)' />
                </Pressable>
            </View>

            <ScrollView onScroll={handleScroll} scrollEventThrottle={5} ref={scrollRef} contentContainerStyle={{ gap: 15 }}>
                <View style={styles.searchBar}>
                    <View style={styles.searchIcon}>
                        <Feather name='search' size={24} color='rgba(10,10,10,0.4)' />
                    </View>
                    <TextInput ref={searchInputRef} //value={search} 
                        onChangeText={handleTextDebounce} style={styles.searchInput} placeholder='Search for photos...' />
                    {
                        search && (
                            <Pressable onPress={() => handleSearch("")} style={styles.closeIcon}>
                                <Ionicons name='close' size={24} color='rgba(10,10,10,0.6)' />
                            </Pressable>
                        )
                    }

                </View>
                <View style={styles.categories}>
                    <Categories activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
                </View>

                {
                    filters && (
                        <View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
                                {
                                    Object.keys(filters).map((key, index) => {
                                        return (
                                            <View key={key} style={styles.filterItem}>
                                                {
                                                    key == 'colors' ? (

                                                        <View style={{ height: 20, width: 30, borderRadius: 7, backgroundColor: filters[key] }} />
                                                    ) : (
                                                        <Text style={styles.filterItemText}>{filters[key]}</Text>
                                                    )
                                                }


                                                <Pressable style={styles.filterCloseIcon} onPress={() => clearThisFilter(key)}>
                                                    <Ionicons name='close' size={14} color='rgba(0,0,0,09)' />
                                                </Pressable>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    )
                }


                {/* images */}
                <View>
                    {
                        images.length > 0 && <ImageGrid images={images} router={router} />
                    }
                </View>
                <View style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}>
                    <ActivityIndicator size="large" />
                </View>


            </ScrollView >
            {/* filters modal */}
            < FiltersModal
                filters={filters}
                onReset={resetFilters}
                setFilters={setFilters}
                onClose={closeFiltersModal}
                onApply={applyFilters}
                modalRef={modalRef} />
        </View >
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 15
    },
    header: {
        marginHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: hp(4),
        fontWeight: '600',
        color: 'rgba(10,10,10,0.9)'
    },
    searchBar: {
        marginHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        backgroundColor: '#fff',
        padding: 6,
        paddingLeft: 10,
        borderRadius: 16
    },
    searchIcon: {
        padding: 8
    },
    searchInput: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 10,
        fontSize: hp(1.8)
    },
    closeIcon: {
        backgroundColor: 'rgba(10,10,10,0.13)',
        padding: 8,
        borderRadius: 12,
    },
    filters: {
        paddingHorizontal: wp(4),
        gap: 10,
    },
    filterItem: {
        backgroundColor: '#e5e5e5',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 10,
        padding: 8,
        gap: 10,
        paddingHorizontal: 10
    },
    filterItemText: {
        fontSize: hp(1.9)
    },
    filterCloseIcon: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 4,
        borderRadius: 7
    }
})