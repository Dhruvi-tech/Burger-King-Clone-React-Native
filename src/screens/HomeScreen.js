import React from 'react';
import {
  View, Text, ScrollView, Image,
  StyleSheet, TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import banner from '../assets/images/banner.png';

export default function HomeScreen({ navigation }) {

  const categories = [
    {
      name: 'Burgers, Wraps & Tacos',
      image: require('../assets/images/category_burgers.png'),
      type: 'burgers'
    },
    {
      name: 'Cricket Mania Combos',
      image: require('../assets/images/category_combos.png'),
      type: 'combos'
    },
    {
      name: 'Korean Spicy Fest',
      image: require('../assets/images/category_korean.png'),
      type: 'korean'
    },
    {
      name: 'Beverages',
      image: require('../assets/images/category_beverages.png'),
      type: 'drinks'
    },
    {
      name: 'Crazy App Deals',
      image: require('../assets/images/category_deals.png'),
      type: 'deals'
    },
    {
      name: '2 for Offers',
      image: require('../assets/images/category_offers.png'),
      type: 'offers'
    },
    {
      name: 'BK Cafe',
      image: require('../assets/images/category_cafe.png'),
      type: 'cafe'
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.top}>DELIVERY ● DINE-IN/TAKEAWAY</Text>

        <View style={styles.location}>
          <Text>DINE-IN AT: Gopalan Arcade, Bengaluru</Text>
        </View>
      </View>

      {/* BANNER */}
      <Image source={banner} style={styles.banner} />

      {/* TITLE */}
      <Text style={styles.title}>Our Menu</Text>

      {/* CATEGORY GRID */}
      <View style={styles.grid}>
        {categories.map((item, i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.7}
            style={styles.gridItem}
            onPress={() => navigation.navigate('Menu', { category: item.type })}
          >
            <Image source={item.image} style={styles.gridImg} />
            <Text style={styles.gridText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* REWARD */}
      <View style={styles.reward}>
        <Text style={{ fontWeight: 'bold' }}>
          Crown Rewards Balance
        </Text>

        <TouchableOpacity activeOpacity={0.7} style={styles.btn}>
          <Text style={{ color: '#fff' }}>Redeem Points Now</Text>
        </TouchableOpacity>
      </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f6f2' },
  container: { flex: 1, backgroundColor: '#f8f6f2' },

  header: {
    backgroundColor: '#5c2c06',
    padding: 15
  },

  top: { color: '#fff', fontWeight: 'bold' },

  location: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10
  },

  banner: {
    width: '95%',
    height: 180,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 10
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10
  },

  gridItem: {
    width: '30%',
    alignItems: 'center'
  },

  gridImg: {
    width: 60,
    height: 60
  },

  gridText: {
    textAlign: 'center',
    fontSize: 12
  },

  reward: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10
  },

  btn: {
    backgroundColor: '#d62300',
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center'
  }
});
