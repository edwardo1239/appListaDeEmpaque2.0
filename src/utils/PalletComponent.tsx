/* eslint-disable prettier/prettier */

/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  contenedorSeleccionadoContext,
  contenedoresContext,
  palletSeleccionadoContext,
} from '../../App';

type propsType = {
  pallet: string;
  setPalletSeleccionado: (data: number) => void;
  openPalletSettings: () => void;
};

export default function (props: propsType) {
  const palletSeleccionado = useContext(palletSeleccionadoContext);
  const numeroContenedor = useContext(contenedorSeleccionadoContext);
  const contenedores = useContext(contenedoresContext).find(
    cont => cont._id === numeroContenedor,
  );

  const longPressHandle = () => {
    props.setPalletSeleccionado(Number(props.pallet));
    props.openPalletSettings();
  };
  const palletFree = () => {
    if (contenedores && contenedores?.pallets[props.pallet]) {
      const alltrue = Object.values(
        contenedores?.pallets[props.pallet].listaLiberarPallet
      ).every(val => val === true);
      return alltrue;
    }
    return false;
  };

  return (
    <View style={styles.palletContainer}>
      <TouchableOpacity
        style={
          Number(props.pallet) === palletSeleccionado
            ? styles.palletsPress
            : (palletFree() ? styles.palletsButonsLiberado : styles.palletsButons)
        }
        onPress={() => props.setPalletSeleccionado(Number(props.pallet))}
        onLongPress={longPressHandle}>
        <View
          style={ {
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
            gap: 10,
          }}>
          <Image
            source={require('../assets/palletIMG.png')}
            style={styles.image}
          />
          <Text style={{fontSize: 20}}>
            {contenedores?.pallets[props.pallet] &&
              contenedores?.pallets[props.pallet].settings.calibre}
          </Text>
        </View>
        <View style={{marginLeft: 25}}>
          <Text style={{fontSize: 50, fontWeight: 'bold'}}>
            {contenedores?.pallets[props.pallet] &&
              contenedores.pallets[props.pallet].cajasTotal}
          </Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.fonts}>
        {contenedores?.infoContenedor.tipoEmpaque === 'Caja'
          ? 'Pallet'
          : contenedores?.infoContenedor.tipoEmpaque === 'Saco'
          ? 'Estiba'
          : null}{' '}
        {props.pallet === '0' ? 'sin pallet' : props.pallet}
      </Text>
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
  palletsButonsLiberado: {
    width: 115,
    height: 115,
    backgroundColor: '#FF22',
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
