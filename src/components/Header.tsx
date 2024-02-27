/* eslint-disable prettier/prettier */
import React, {useContext, useState} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
} from 'react-native';
import {
  contenedorSeleccionadoContext,
  contenedoresContext,
  loteSeleccionadoContext,
} from '../../App';
import {LoteType} from '../types';

type propsType = {
  setNumeroContenedor: (data: number) => void;
  cerrarContenedor: () => void;
  loteVaciando: LoteType;
  seleccionarLote: (item: LoteType) => void;
};

export default function Header(props: propsType): JSX.Element {
  const contenedores = useContext(contenedoresContext);
  const loteSeleccionado = useContext(loteSeleccionadoContext);
  const numeroContenedor = useContext(contenedorSeleccionadoContext);
  const contenedor = contenedores.find(item => item._id === numeroContenedor);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [cliente, setCliente] = useState<string>('Contenedores');

  const [confirmacionModal, setConfirmacionModal] = useState<boolean>(false);
  const confirmacion = '';

  const obtenerLoteInfo = () => {
    props.seleccionarLote(props.loteVaciando);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity>
        <Image
          source={require('../assets/CELIFRUT.png')}
          style={styles.image}
        />
      </TouchableOpacity>

      <View>
        <Button title="Cerrar Contenedor" onPress={props.cerrarContenedor} />
      </View>

      <View>
        <Text>Predio Vaciando:</Text>
        <Text>
          {props.loteVaciando.enf + ' ' + props.loteVaciando.nombrePredio}
        </Text>
      </View>

      <View>
        <Image
          source={
            props.loteVaciando.tipoFruta === 'Limon'
              ? require('../assets/limon.jpg')
              : require('../assets/naranja.jpg')
          }
          style={styles.image}
        />
      </View>

      <View>
        <Text>Predio Actual:</Text>
        <Text>{loteSeleccionado.enf + ' ' + loteSeleccionado.nombrePredio}</Text>
      </View>

      <View>
        <Image
          source={
            loteSeleccionado.tipoFruta === 'Limon'
              ? require('../assets/limon.jpg')
              : require('../assets/naranja.jpg')
          }
          style={styles.image}
        />
      </View>

      {
        <View>
          <Text>Cajas Total:</Text>
          <Text>
            {contenedor &&
              contenedor.pallets.reduce(
                (acu, pallet) => acu + pallet.EF1.reduce((acu2, lote) => acu2 + lote.cajas, 0),
                0,
              )}
          </Text>
        </View>
      }

      <TouchableOpacity
        style={styles.buttonContenedores}
        onPress={obtenerLoteInfo}>
        <Text>Obtener Lote</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonContenedores}
        onPress={() => {
          if (contenedores.length !== 0) {
            setModalVisible(true);
          }
        }}>
        <Text>{cliente}</Text>
      </TouchableOpacity>

      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View style={styles.centerModal}>
          <View style={styles.viewModal}>
            <FlatList
              data={contenedores}
              style={styles.pressableStyle}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    setCliente(
                      item.numeroContenedor + '-' + item.infoContenedor.clienteInfo.CLIENTE,
                    );
                    setModalVisible(false);
                    props.setNumeroContenedor(item._id);
                  }}>
                  <Text style={styles.textList}>
                    {item.numeroContenedor + '-' + item.infoContenedor.clienteInfo.CLIENTE}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item._id.toString()}
            />
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={confirmacionModal}
        animationType="fade">
        <TouchableOpacity
          style={styles.centerConfimarcionModal}
          onPress={() => setModalVisible(false)}>
          <View style={styles.viewModalConfirmacion}>
            <Text style={styles.titleModalConfirmacion}>{confirmacion}</Text>
            <View style={styles.modalButtonsConfirmacion}>
              <Button title="aceptar" />
              <Button
                title="Cancelar"
                onPress={() => setConfirmacionModal(false)}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    top: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,

    paddingRight: 10,
    elevation: 40,
    shadowColor: '#52006A',
  },

  image: {
    width: 60,
    height: 60,
  },

  buttonContenedores: {
    backgroundColor: 'white',
    width: 150,
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#7D9F3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerModal: {
    flex: 1,
    alignItems: 'center',
    marginTop: '6%',
    backgroundColor: 'rgba(0,0,0,0.25',
  },
  viewModal: {
    display: 'flex',
    backgroundColor: 'white',
    width: 350,
    flexDirection: 'row',
    borderRadius: 20,
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 10,
    marginLeft: '65%',
    gap: 50,
  },
  pressableStyle: {
    marginTop: 10,
    marginBottom: 10,
  },
  textList: {
    color: 'black',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    fontSize: 20,
  },
  centerConfimarcionModal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%',
  },
  viewModalConfirmacion: {
    width: 450,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 50,
    textAlign: 'center',
  },
  titleModalConfirmacion: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 60,
  },
  modalButtonsConfirmacion: {
    display: 'flex',
    flexDirection: 'row',
    gap: 25,
    justifyContent: 'center',
  },
});
