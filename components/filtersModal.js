import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useMemo } from 'react'
import { BlurView } from 'expo-blur';
import {
    BottomSheetModal,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import Animated, { Extrapolation, FadeInDown, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { hp } from '../helpers/common';
import { ColorFilter, CommonFilterRow, SectionView } from './filterViews';
import { capitalize, filter } from 'lodash';
import { data } from '../constants/data';

const FiltersModal = ({ modalRef, onClose, onReset, onApply, filters, setFilters }) => {
    const snapPoints = useMemo(() => ['75%'], []);

    return (
        <BottomSheetModal
            ref={modalRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={CustomBackdrop}
        //onChange={handleSheetChanges}
        >
            <BottomSheetView style={styles.contentContainer}>
                <View style={styles.content}>
                    <Text style={styles.filterText}>Filters</Text>
                    {
                        Object.keys(sections).map((sectionName, index) => {
                            let sectionView = sections[sectionName]
                            let sectionData = data.filters[sectionName]
                            let title = capitalize(sectionName)
                            return (
                                <Animated.View entering={FadeInDown.delay((index*100)+100).springify().damping(11)} key={sectionName}>
                                    <SectionView title={title} content={sectionView({
                                        data: sectionData,
                                        filters,
                                        setFilters,
                                        filterName: sectionName
                                    })} />
                                </Animated.View>
                            )

                        })
                    }
                    {/* actions */}
                    <Animated.View entering={FadeInDown.delay(500).springify().damping(11)} style={styles.buttons}>
                        <Pressable style={styles.resetButton} onPress={onReset}>
                            <Text style={[styles.buttonText, {color:'rgba(0,0,0,0.9)'}]}>Reset</Text>
                        </Pressable>
                        <Pressable style={styles.applyButton} onPress={onApply}>
                            <Text style={[styles.buttonText, {color: 'white'}]}>Apply</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    )
}

const sections = {
    "order": (props) => <CommonFilterRow {...props} />,
    "orientation": (props) => <CommonFilterRow {...props} />,
    "type": (props) => <CommonFilterRow {...props} />,
    "colors": (props) => <ColorFilter {...props} />
}





const CustomBackdrop = ({ animatedIndex, style }) => {

    const containerAnimatedStyle = useAnimatedStyle(() => {
        let opacity = interpolate(animatedIndex.value, [-1, 0], [0, 1], Extrapolation.CLAMP)
        return {
            opacity
        }
    })

    const containerStyle = [
        StyleSheet.absoluteFill,
        style,
        styles.overlay,
        containerAnimatedStyle
    ]
    return (
        <Animated.View style={containerStyle}>
            <BlurView style={StyleSheet.absoluteFill} tint='dark' intensity={25} />
        </Animated.View>
    )
}

export default FiltersModal

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    content: {
        flex:1,
        //width: '100%',
        gap: 15,
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    filterText: {
        fontSize: hp(4),
        fontWeight: '600',
        color: 'rgba(10,10,10,0.8)',
        marginBottom: 5
    },
    buttons:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        gap:10
    },
    applyButton:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.8)',
        padding:12,
        alignItems:'center',
        justifyContent: 'center',
        borderRadius:14,
        borderCurve:'continuous'
    },
    resetButton:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.03)',
        padding:12,
        alignItems:'center',
        justifyContent: 'center',
        borderRadius:14,
        borderCurve:'continuous',
        borderWidth:2,
        borderColor:'#e5e5e5'
    },
    buttonText:{
        fontSize:hp(2.2),
    }
})