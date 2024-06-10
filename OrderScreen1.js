import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Image, Button } from 'react-native';
import { CartContext } from './CartContext1';
import { useNavigation } from '@react-navigation/native';

function OrderScreen1() {
  const [selectedButton, setSelectedButton] = useState('All Orders');
  const { orderHistory, setCartItems, addToCart } = useContext(CartContext);
  const navigation = useNavigation();

  useEffect(() => {
     
    setCartItems(prevItems => prevItems.map(item => ({
      ...item,
      deliveryDate: '11-06-2024',
      deliveryTime: '3:05 PM',
    })));
  }, []);

  const groupedOrders = orderHistory.reduce((acc, item) => {
    const existingOrder = acc.find(order => order.orderId === item.orderId);
    if (existingOrder) {
      existingOrder.items.push(item);
    } else {
      acc.push({ orderId: item.orderId, items: [item], status: item.status });
    }
    return acc;
  }, []);

  const filteredOrders = groupedOrders.filter(order => {
    if (selectedButton === 'All Orders') return true;
    if (selectedButton === 'Completed') return order.status === 'Completed';
    if (selectedButton === 'Order Placed') return order.status === 'Order Placed';
    if (selectedButton === 'Cancelled') return order.status === 'Cancelled';
    return false;
  });

  const handleCancelOrder = (orderId) => {
    setCartItems(prevItems => prevItems.map(item => {
      if (item.orderId === orderId) {
        return { ...item, status: 'Cancelled' };
      }
      return item;
    }));
  };

  const handleOrderAgain = (items) => {
    items.forEach(item => {
      const { id, name, price, address, image } = item;
      addToCart({ id, name, price, address, deliveryDate: item.deliveryDate, deliveryTime: item.deliveryTime, quantity: item.quantity, image });
    });
  };

  return (
    <View>
      <View style={styles.container}>
        <Image style={styles.image1} source={require('./arrow_back.png')} />
        <Text style={styles.text}>My Orders</Text>
        <Image style={styles.image2} source={require('./mdi_cart-outline.png')} />
      </View>
      <View style={styles.buttonContainer}>
        {['All Orders', 'Completed', 'Pending', 'Cancelled','Refund'].map(status => (
          <TouchableOpacity
            key={status}
            style={[styles.button, selectedButton === status && { backgroundColor: '#D89B00' }]}
            onPress={() => setSelectedButton(status)}>
            <Text>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredOrders}
        keyExtractor={(order) => order.orderId}
        renderItem={({ item: order }) => (
          <View style={styles.orderItem}>
            <TouchableOpacity
              onPress={() => navigation.navigate('OrderDetails', { item: order })}>
              <View style={styles.orderContent}>
                <View style={styles.imageColumn}>
                  {order.items.map((orderItem, index) => (
                    <Image key={index} style={styles.itemImage} source={{ uri: orderItem.image }} />
                  ))}
                </View >
                <View style={styles.detailsColumn}>
                  {order.items.map((orderItem, index) => (
                    <React.Fragment key={index}>
                      <Text style={styles.name1}>{orderItem.name}</Text>
                      <Text style={styles.quantity}>Qty: {orderItem.quantity} kgs</Text>
                    </React.Fragment>
                  ))}
                  <Text style={styles.order}>Order ID: {order.orderId}</Text>
                  <Text style={styles.date}> 11/06/2024 at 03:15 PM</Text>
                </View>
                <View style={styles.priceColumn}>
                  <Text style={styles.priceText}>
                    Rs. {order.items.reduce((total, item) => total + parseInt(item.price.replace('Rs.', '')) * item.quantity, 0)+80}
                  </Text>
                  <View style={styles.status1}>
                    <View style={[styles.statusContainer, order.status === 'Cancelled' && { borderColor: 'red' }]}>
                      <Text style={styles.statusText}>{order.status}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            {order.status === 'Completed' && (
              <View>
                <Button title="Order Again" onPress={() => handleOrderAgain(order.items)} />
                <Button title="Rate Order" onPress={() => {}} />
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

export default OrderScreen1;

const styles = StyleSheet.create({
  container: {
    width: 375,
    height: 44,
    top: 27,
    padding: 0,
    paddingRight: 3,
    paddingBottom: 0,
    paddingLeft: 3,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  text: {
    fontSize: 18,
    lineHeight: 20.7,
    textAlign: 'center'
  },
  image1: {
    width: 44,
    height: 44,
    paddingTop: 10,
    paddingRight: 17,
    paddingBottom: 15,
    paddingLeft: 14,
    opacity: 1,
  },
  image2: {
    width: 44,
    height: 44,
    opacity: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    opacity: 1,
    paddingTop: 20
  },
  button: {
    width: 90,
    height: 32,
    paddingTop: 8,
    paddingRight: 16,
    paddingBottom: 8,
    paddingLeft: 16,
    borderRadius: 20,
    backgroundColor: 'lightgray',
    opacity: 1,
  },
  name1: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16.1,
    color: '#000000',
  },
  status1: {
    marginTop: 20
  },
  quantity: {
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 11.5,
    color: '#777777',
  },
  order: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 11.5,
    color: '#c4c4c4'
  },
  date: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 11.5,
    color: '#c4c4c4'
  },
  orderItem: {
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 10,
    marginVertical: 5,
  },
  orderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageColumn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  detailsColumn: {
    flex: 2,
    flexDirection: 'column',
    marginLeft: 0,
    justifyContent: 'space-between'
  },
  priceColumn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  itemImage: {
    width: 65,
    height: 65,
    resizeMode: 'cover',
    marginBottom: 5,
    borderRadius: 4
  },
  priceText: {
    width: 50,
    height: 16,
    marginBottom: 5,
  },
  statusContainer: {
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  statusText: {
    color: '#013062'
  },
});
