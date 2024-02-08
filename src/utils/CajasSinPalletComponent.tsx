/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  cajasSinPalletContext,
  palletSeleccionadoContext,
} from '../../App';

type propsType = {
  setPalletSeleccionado: (data: number) => void;
  setOpenModalSinPallet: (data: boolean) => void;
};

export default function CajasSinPalletComponent(props: propsType) {
  const cajasSinPallet = useContext(cajasSinPalletContext);
  const palletSeleccionado = useContext(palletSeleccionadoContext);

  return (
    <View style={styles.palletContainer}>
      <TouchableOpacity
        style={palletSeleccionado === 0 ? styles.palletsPress : styles.palletsButons}
        onPress={() => props.setPalletSeleccionado(0)}
        onLongPress={() => props.setOpenModalSinPallet(true)}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
            gap: 10,
          }}
        />
        <View style={{marginLeft: 25}}>
          <Text style={{fontSize: 50, fontWeight: 'bold'}}>
            {Array.isArray(cajasSinPallet) && cajasSinPallet.reduce((acu, item) => (acu += item.cajas), 0)}
          </Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.fonts}>Cajas sin pallet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  palletContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  palletsButons: {
    width: 115,
    height: 115,
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 10,
    elevation: 20,
    shadowColor: '#52006A',
  },
  image: {
    width: 50,
    height: 50,
  },
  palletsPress: {
    width: 115,
    height: 115,
    backgroundColor: '#D53B29',
    margin: 5,
    borderRadius: 10,
    elevation: 20,
    shadowColor: '#52006A',
  },
  fonts: {
    color: 'white',
    fontSize: 15,
  },
});
