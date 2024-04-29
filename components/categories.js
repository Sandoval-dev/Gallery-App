import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { wp, hp } from '../helpers/common'
import { data } from '../constants/data'
import Animated, { FadeInRight } from 'react-native-reanimated'

const Categories = ({ activeCategory, handleChangeCategory }) => {
    return (
        <FlatList horizontal contentContainerStyle={styles.flatListContainer} showsHorizontalScrollIndicator={false}
            data={data.categories} keyExtractor={item => item} renderItem={({ item, index }) => (
                <CategoryItem
                    isActive={activeCategory == item}
                    handleChangeCategory={handleChangeCategory}
                    title={item}
                    index={index} />
            )}
        />
    )
}


const CategoryItem = ({ title, index, isActive, handleChangeCategory }) => {
    let color = isActive ? "#fff" : 'rgba(10,10,10,0.8)'
    let backgroundColor = isActive ? 'rgba(10,10,10,0.8)' : '#fff'
    return (
        <Animated.View entering={FadeInRight.delay(index*200).duration(1000).springify().damping(14)} style={styles.container}>
            <Pressable onPress={() => handleChangeCategory(isActive ? null : title)} style={[styles.category, { backgroundColor }]}>
                <Text style={[styles.title, { color }]}>{title}</Text>
            </Pressable>

        </Animated.View>
    )
}


export default Categories

const styles = StyleSheet.create({

    flatListContainer: {
        paddingHorizontal: wp(4),
        gap: 8
    },
    category: {
        padding: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        //backgroundColor:'white',
        borderRadius: 16,
        borderCurve: 'continuous'
    },
    title: {
        fontSize: hp(1.8),
        fontWeight: '500',
    }

})