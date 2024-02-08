/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  cajasSinPalletContext,
  contenedorSeleccionadoContext,
  contenedoresContext,
  itemSeleccionContext,
  palletSeleccionadoContext,
} from '../../App';

type propsType = {
  setSeleccion: (data: string) => void;
};

function Informacion(props: propsType) {
  const numeroContenedor = useContext(contenedorSeleccionadoContext);
  const pallet = useContext(palletSeleccionadoContext);
  const contenedor = useContext(contenedoresContext).find(item => item._id === numeroContenedor);
  const seleccion = useContext(itemSeleccionContext);
  const cajasSinPallet = useContext(cajasSinPalletContext);

  return (
    <>
      {pallet === 0 ? (
        <ScrollView style={styles.scrollStyle} nestedScrollEnabled={true}>
          {Array.isArray(cajasSinPallet) && (pallet === 0) === true
            ? cajasSinPallet.map((item, index) => (
                <View style={styles.container} key={index}>
                  <View style={styles.containerHeader}>
                    <View key={item + 'view2'}>
                      <Text style={styles.textHeaders}>{item.id}</Text>
                    </View>
                    <View key={item + 'view3'}>
                      <View style={{display: 'flex', flexDirection: 'row'}} key={item + 'view4'}>
                        <Text key={item + 'nombrPredioHeader'} style={styles.textHeaders}>
                          Nombre Predio:{' '}
                        </Text>
                        <Text key={item + 'nombrPredio'} style={styles.textHeaders}>
                          {item.nombre}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={seleccion === String(index) ? styles.touchablePress : styles.touchable}
                    onPress={() => props.setSeleccion(String(index))}>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                      <Text>
                        {contenedor && contenedor.infoContenedor.tipoEmpaque === 'Caja' ? 'No. Cajas:' : 'No. Sacos'}{' '}
                      </Text>
                      <Text>{item.cajas}</Text>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row', gap: 20}}>
                      <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Text>
                          {contenedor && contenedor.infoContenedor.tipoEmpaque === 'Caja' ? 'Tipo Caja:' : 'Tipo Saco:'}{' '}
                        </Text>
                        <Text>{item.tipoCaja}</Text>
                      </View>
                      <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Text>Calibre: </Text>
                        <Text>{item.calibre}</Text>
                      </View>
                      <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Text>Calidad: </Text>
                        <Text>{item.calidad}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ))
            : null}
        </ScrollView>
      ) : (
        <ScrollView style={styles.scrollStyle} nestedScrollEnabled={true}>
          {contenedor && (pallet !== 0) === true
            ? contenedor.pallets[pallet].EF1.map(item => (
                <View style={styles.container} key={item._id}>
                  <View style={styles.containerHeader}>
                    <View key={item + 'view2'}>
                      <Text style={styles.textHeaders}>{item.id}</Text>
                    </View>
                    <View key={item + 'view3'}>
                      <View style={{display: 'flex', flexDirection: 'row'}} key={item + 'view4'}>
                        <Text key={item + 'nombrPredioHeader'} style={styles.textHeaders}>
                          Nombre Predio:{' '}
                        </Text>
                        <Text key={item + 'nombrPredio'} style={styles.textHeaders}>
                          {item.nombre}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={seleccion === item._id ? styles.touchablePress : styles.touchable}
                    onPress={() => props.setSeleccion(item._id)}>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                      <Text>{contenedor.infoContenedor.tipoEmpaque === 'Caja' ? 'No. Cajas:' : 'No. Sacos'} </Text>
                      <Text>{item.cajas}</Text>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row', gap: 20}}>
                      <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Text>{contenedor.infoContenedor.tipoEmpaque === 'Caja' ? 'Tipo Caja:' : 'Tipo Saco:'} </Text>
                        <Text>{item.tipoCaja}</Text>
                      </View>
                      <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Text>Calibre: </Text>
                        <Text>{item.calibre}</Text>
                      </View>
                      <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Text>Calidad: </Text>
                        <Text>{item.calidad}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ))
            : null}
        </ScrollView>
      )}
    </>
  );
}

export default Informacion;

const styles = StyleSheet.create({
  scrollStyle: {
    backgroundColor: '#FFE6FF',
    padding: 5,
    elevation: 10,
    shadowColor: '#52006A',
  },
  container: {
    margin: 5,
  },
  containerHeader: {
    display: 'flex',
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderColor: '#4D4D4D',
    overflow: 'scroll',
  },
  textHeaders: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  touchable: {
    backgroundColor: 'white',
    marginTop: 8,
    padding: 5,
    borderRadius: 8,
  },
  touchablePress: {
    backgroundColor: 'white',
    marginTop: 8,
    padding: 5,
    borderRadius: 8,
    borderColor: 'red',
    borderWidth: 2,
  },
});
