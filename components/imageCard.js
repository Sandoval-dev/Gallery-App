import {Pressable, StyleSheet  } from 'react-native'
import {Image} from 'expo-image'
import React from 'react'
import { getImageSize, wp } from '../helpers/common'

const ImageCard = ({item, index, columns, router}) => {

    const isLastInRow= () => {
        return (index+1) % columns === 0
    }

    const getImageHeight = () => {
      let {imageHeight: height, imageWidth: width} =item
      return {height: getImageSize(height, width)}
    }
  return (
    <Pressable onPress={() => router.push({pathname:'home/image', params:{...item}})} style={[styles.imageWrapper,!isLastInRow() && styles.spacing]}>
      <Image style={[styles.image, getImageHeight()]} source={{uri: item?.webformatURL}} transition={100}/>
    </Pressable>
  )
}

export default ImageCard

const styles = StyleSheet.create({
    image:{
      height:300,
      width:'100%'
    },
    imageWrapper:{
        backgroundColor:"#e5e5e5",
        borderRadius:18,
        borderCurve:'continuous',
        overflow:'hidden',
        marginBottom:wp(2)
     
    },
    spacing:{
        marginRight:wp(2)
    }
})