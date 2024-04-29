import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { StatusBar } from 'expo-status-bar'
import theme from '../constants/theme'
import React from 'react'
import { hp, wp } from '../helpers/common'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'

const WelcomeScreen = () => {
  const router = useRouter()
  return (
    <View style={styles.container}>
      <StatusBar style='light' />
      <Image source={require('../assets/images/welcome.png')} style={styles.bgImage} resizeMode='cover' />
      {/* linear gradient */}
      <Animated.View entering={FadeInDown.duration(600)} style={{ flex: 1 }}>
        <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)', 'white']}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
        />
        {/* content */}
        <View style={styles.contentContainer}>
          <Animated.Text entering={FadeInDown.delay(400).springify()} style={styles.title}>ERD Gallery</Animated.Text>
          <Animated.Text entering={FadeInDown.delay(500).springify()} style={styles.punchline}>Every Photo Tells a Story</Animated.Text>
          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <Pressable onPress={() => router.push('home')} style={styles.startButton}>
              <Text style={styles.startText}>Start Explore</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  bgImage: {
    width: wp(100),
    height: hp(100),
    position: 'absolute'
  },
  gradient: {
    width: wp(100),
    height: hp(65),
    position: 'absolute',
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    gap:14,
    alignItems: 'center'
  },
  title:{
    fontSize: hp(7),
    fontWeight:'700',
    color:'rgba(10,10,10,0.9)',
  },
  punchline:{
    fontSize:hp(2),
    letterSpacing:1,
    marginBottom:10,
    fontWeight:'500'
  },
  startButton:{
    marginBottom:50,
    backgroundColor:'rgba(10,10,10,0.9)',
    padding:15,
    paddingHorizontal:90,
    borderRadius:18,
    borderCurve:'continuous'
  },
  startText:{
    color:'white',
    fontWeight:'500',
    letterSpacing:1,
    fontSize:hp(3)
  }
})