import { View, Text, StyleSheet, Pressable } from "react-native"
import { hp } from "../helpers/common"
import { capitalize } from "lodash"

export const SectionView = ({ title, content }) => {
    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View>
                {content}
            </View>

        </View>
    )
}

export const CommonFilterRow = ({ data, filterName, filters, setFilters }) => {

    const onSelect = (item) => {
        setFilters({ ...filters, [filterName]: item })
    }

    return (
        <View style={styles.flexRowWrap}>
            {
                data && data.map((item, index) => {
                    let isActive = filters && filters[filterName] == item
                    let backgroundColor = isActive ? 'rgba(0,0,0,0.7)' : "white"
                    let color = isActive ? 'white' : 'rgba(0,0,0,0.7)'
                    return (
                        <Pressable
                            onPress={() => onSelect(item)}
                            style={[styles.outlinedButton, { backgroundColor }]}
                            key={item}
                        >
                            <Text style={[styles.outlinedButtonText, { color }]}>
                                {capitalize(item)}
                            </Text>
                        </Pressable>
                    )
                })
            }
        </View>
    )
}

export const ColorFilter = ({ data, filterName, filters, setFilters }) => {

    const onSelect = (item) => {
        setFilters({ ...filters, [filterName]: item })
    }

    return (
        <View style={styles.flexRowWrap}>
            {
                data && data.map((item, index) => {
                    let isActive = filters && filters[filterName] == item
                    let borderColor= isActive ? 'rgba(0,0,0,0.4)' : 'white'

                    return (
                        <Pressable
                            onPress={() => onSelect(item)}
                            key={item}
                        >
                            <View style={[styles.colorWrapper, {borderColor}]}>
                                <View style={[styles.color, {backgroundColor:item}]} />
                            </View>
                        </Pressable>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({


    sectionContainer: {
        gap: 8
    },
    sectionTitle: {
        fontSize: hp(4),
        fontWeight: '500',
        color: 'rgba(0,0,0,0.8)'
    },
    outlinedButton: {
        padding: 8,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: "#e5e5e5",
        borderRadius: 10,
        borderCurve: 'continuous'
    },
    flexRowWrap: {
        gap: 10,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    colorWrapper:{
        padding:3,
        borderRadius:10,
        borderWidth:2,
        borderCurve:'continuous'
    },
    color:{
        height:30,
        width:40,
        borderRadius:10-3,
        borderCurve:'continuous',
    }
})