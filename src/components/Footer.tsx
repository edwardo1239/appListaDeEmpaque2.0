/* eslint-disable prettier/prettier */
import React, { useContext, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  cajasSinPalletContext,
  contenedorSeleccionadoContext,
  contenedoresContext,
  itemSeleccionContext,
  loteSeleccionadoContext,
  palletSeleccionadoContext,
} from '../../App';
import { contenedoresInfoType, itemType } from '../types';

type propsType = {
  agregarItem: (item: itemType) => void;
  eliminarItem: () => void;
  moverItems: (item: any) => void;
  restarItem: (item: any) => void;
};

export default function Footer(props: propsType) {
  let habilitarBotonSuma = true;
  const loteActual = useContext(loteSeleccionadoContext);
  const pallet = useContext(palletSeleccionadoContext);
  const seleccion = useContext(itemSeleccionContext);
  const cajasSinPallet = useContext(cajasSinPalletContext);
  const numeroContenedor = useContext(contenedorSeleccionadoContext);
  const contenedores = useContext(contenedoresContext);
  const contenedor: contenedoresInfoType | undefined = useContext(
    contenedoresContext,
  ).find(item => item._id === numeroContenedor);

  const [openModal, setOpenModal] = useState<boolean>(false);
  // const [showEditar, setShowEditar] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [cajas, setCajas] = useState<number>(0);
  const [entradaModalPallet, setEntradaModalPallet] = useState<string>('');
  const [entradaModalCajas, setEntradaModalCajas] = useState<string>('');
  const [cliente, setCliente] = useState<string>('Sin Pallet');
  const [contenedorID, setContenedorID] = useState<number>(-1);
  const [showCajasInput, setShowcajasInput] = useState<boolean>(true);


  const clickSumar = () => {
    if (habilitarBotonSuma) {
      habilitarBotonSuma = false;
      if (isNaN(cajas)) {
        setCajas(0);
        return Alert.alert('Ingrese el numero de cajas');
      }
      if (cajas <= 0) { return Alert.alert('Ingrese el numero de cajas'); }
      if (loteActual.enf === '') { return Alert.alert('Seleccione un lote'); }
      if (pallet === -1) { return Alert.alert('Pallet no permitido'); }
      if (
        contenedor?.infoContenedor.tipoFruta !== 'Mixto' &&
        contenedor?.infoContenedor.tipoFruta !== loteActual.tipoFruta
      ) {
        return Alert.alert('El contenedor tiene un tipo de fruta diferente');
      }
      if (contenedor.pallets[pallet].settings.tipoCaja === '') { return Alert.alert('Error configure el pallet'); }
      if (contenedor.pallets[pallet].settings.calibre === 0) { return Alert.alert('Error configure el pallet'); }
      if (contenedor.pallets[pallet].settings.calidad === 0) { return Alert.alert('Error configure el pallet'); }
      const item: itemType = {
        _id: loteActual._id,
        cajas: cajas,
        tipoCaja: contenedor?.pallets[pallet].settings.tipoCaja,
        calibre: contenedor?.pallets[pallet].settings.calibre,
        calidad: contenedor?.pallets[pallet].settings.calidad,
        fecha: new Date(),
      };
      props.agregarItem(item);
      setCajas(0);
      habilitarBotonSuma = true;

    }
  };
  const clickActualizar = () => {
    if (isNaN(cajas)) {
      setCajas(0);
      return Alert.alert('Ingrese el numero de cajas');
    }
    if (cajas <= 0) { return Alert.alert('Ingrese el numero de cajas'); }
    if (loteActual.enf === '') { return Alert.alert('Seleccione un lote'); }
    if (pallet === -1) { return Alert.alert('Pallet no permitido'); }
    const cajasActual = cajas - Number(contenedor?.pallets[pallet].EF1.reduce((acu, item) => acu + item.cajas, 0));
    if (cajasActual < 1) { return Alert.alert('Error en el numero de cajas'); }
    if (
      contenedor?.infoContenedor.tipoFruta !== 'Mixto' &&
      contenedor?.infoContenedor.tipoFruta !== loteActual.tipoFruta
    ) {
      return Alert.alert('El contenedor tiene un tipo de fruta diferente');
    }
    if (contenedor.pallets[pallet].settings.tipoCaja === '') { return Alert.alert('Error configure el pallet'); }
    if (contenedor.pallets[pallet].settings.calibre === 0) { return Alert.alert('Error configure el pallet'); }
    if (contenedor.pallets[pallet].settings.calidad === 0) { return Alert.alert('Error configure el pallet'); }

    const item: itemType = {
      _id: loteActual._id,
      cajas: cajasActual,
      tipoCaja: contenedor?.pallets[pallet].settings.tipoCaja,
      calibre: contenedor?.pallets[pallet].settings.calibre,
      calidad: contenedor?.pallets[pallet].settings.calidad,
      fecha: new Date(),
    };
    props.agregarItem(item);
    setCajas(0);
  };
  const clickEliminar = async () => {
    if (isNaN(cajas)) {
      setCajas(0);
      return Alert.alert('Ingrese el numero de cajas');
    }
    if (loteActual.enf === '') { return Alert.alert('Seleccione un lote'); }
    if (seleccion.length === 0) { return Alert.alert('Seleccione el item que desea eliminar'); }
    await props.eliminarItem();
    setCajas(0);
  };
  const ClickOpenMoverCajas = () => {
    if (seleccion.length === 0) { return Alert.alert('Seleccione un item que desee mover a otro pallet'); }
    else if (seleccion.length > 1) { setShowcajasInput(false); }
    else { setShowcajasInput(true); }
    setOpenModal(true);
  };
  const clickMover = () => {
    if (numeroContenedor === -1) { return Alert.alert('Seleccione un contenedor'); }
    if (contenedorID !== -1) {
      if (entradaModalPallet === '') { return Alert.alert('Ingrese el pallet al que desea mover las cajas'); }
    }
    if (
      contenedor &&
      contenedor.pallets &&
      Number(entradaModalPallet) > contenedor.pallets.length
    ) {
      return Alert.alert('Error en el pallet');
    }
    if (seleccion.length === 1) {
      if (entradaModalCajas === '') { return Alert.alert('Ingrese el numero de cajas que desea mover'); }
      if (pallet === -1) {
        const itemCaja = cajasSinPallet[Number(seleccion)];
        if (itemCaja) {
          if (Number(entradaModalCajas) > Number(itemCaja.cajas)) {
            return Alert.alert('Error en elnumero de cajas');
          }
        }
      } else {
        const itemCaja = contenedor?.pallets[pallet].EF1[seleccion[0]].cajas;
        if (itemCaja) {
          if (Number(entradaModalCajas) > itemCaja) {
            return Alert.alert('Error en elnumero de cajas');
          }
        }
      }
    const item = {
      type: 'item',
      contenedor: contenedorID,
      pallet:Number(entradaModalPallet) - 1,
      numeroCajas:Number(entradaModalCajas),
    };
    props.moverItems(item);

    setCajas(0);
    setEntradaModalCajas('');
    setEntradaModalPallet('');
    setOpenModal(false);
    return 0;
    }

    const item = {
      type: 'items',
      contenedor: contenedorID,
      pallet: Number(entradaModalPallet) - 1,
      numeroCajas: 0,
    };
    props.moverItems(item);

    setCajas(0);
    setEntradaModalCajas('');
    setEntradaModalPallet('');
    setOpenModal(false);
    return 0;

  };
  const clickRestar = () => {
    if (numeroContenedor === 0) { return Alert.alert('Seleccione un contenedor'); }
    if (cajas === 0) { return Alert.alert('Ingrese el numero de cajas'); }
    if (seleccion.length === 0) {return  Alert.alert('Seleccione el item al que desea restar cajas'); }
    if (seleccion.length > 1) {return Alert.alert('Seleccione solo un item'); }
    if (pallet === -1) {
      const itemCaja = cajasSinPallet[Number(seleccion[0])];
      if (itemCaja) {
        if (Number(cajas) > Number(itemCaja.cajas)) {
          return Alert.alert('Error en el numero de cajas');
        }
      }
    } else {
      const itemCaja = contenedor?.pallets[pallet].EF1[seleccion[0]].cajas;
      if (itemCaja) {
        if (Number(cajas) > itemCaja) {
          return Alert.alert('Error en el numero de cajas');
        }
      }
    }
    let item;
    item =  Number(cajas);
    props.restarItem(item);
    setCajas(0);
  };
  //funcion para editar item, pendiente a aprobacion
  // const ClickEditarItem = () => {
  //   if (seleccion.length === 0) { return Alert.alert('Seleccione el item que desea editar'); }

  // };

  return (
    <View style={styles.container}>
      <View>
        <Button title="Actualizar" onPress={clickActualizar} />
      </View>
      <View style={styles.viewTextInput}>
        <TextInput
          keyboardType="numeric"
          style={styles.textInput}
          value={String(cajas)}
          onChange={e => setCajas(Number(e.nativeEvent.text))} />
      </View>
      <View>
        <Button title="Sumar" onPress={clickSumar} />
      </View>
      <View>
        <Button title="Restar"
        onPress={clickRestar}
        />
      </View>
      <View>
        <Button title="Mover" onPress={ClickOpenMoverCajas} />
      </View>
      {/* <View>
        <Button title="Editar" onPress={ClickEditarItem} />
      </View> */}
      <View>
        <Button title="Eliminar" onPress={clickEliminar} />
      </View>

      {/* Modal mover*/}
      <Modal transparent={true} visible={openModal} animationType="fade">
        <View style={styles.centerModal}>
          <View style={showCajasInput ? styles.viewModalItem : styles.viewModalItems}>
            <View style={styles.modalHeader}>
              <Text style={styles.textModalHeader}>
                Seleccione el contenedor al que desea mover
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (contenedores.length !== 0) {
                  setModalVisible(true);
                }
              }}
              style={styles.buttonContenedores}>
              <Text>{cliente}</Text>
            </TouchableOpacity>

            <View style={styles.modalHeader}>
              <Text style={styles.textModalHeader}>
                Ingrese el numero del{' '}
                {contenedor && contenedor.infoContenedor.tipoEmpaque === 'Caja'
                  ? 'Pallet'
                  : 'Estiba'}{' '}
                al que desea mover el item
              </Text>
            </View>
            <View style={styles.modalInputView}>
              <TextInput
                onChange={e => setEntradaModalPallet(e.nativeEvent.text)}
                keyboardType="numeric"
                style={styles.modalInput} />
            </View>
            {showCajasInput && <View style={styles.modalHeader}>
              <Text style={styles.textModalHeader}>
                Ingrese el numero de{' '}
                {contenedor && contenedor.infoContenedor.tipoEmpaque === 'Caja'
                  ? 'Cajas'
                  : 'Sacos'}{' '}
                que desea mover
              </Text>
            </View>}
            {showCajasInput && <View style={styles.modalInputView}>
              <TextInput
                onChange={e => setEntradaModalCajas(e.nativeEvent.text)}
                keyboardType="numeric"
                style={styles.modalInput} />
            </View>}
            <View style={styles.viewButtonsModal}>
              <Button title="Mover" onPress={clickMover} />
              <Button title="Cancelar" onPress={() => setOpenModal(false)} />
            </View>
          </View>
        </View>
      </Modal>


      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View style={styles.centerModal}>
          <View style={showCajasInput ? styles.viewModalItem : styles.viewModalItems}>
            <TouchableOpacity
              onPress={() => {
                setCliente('Sin pallet');
                setContenedorID(-1);
                setModalVisible(false);
              }}>
              <Text style={styles.textList}>
                Sin pallet
              </Text>
            </TouchableOpacity>
            <FlatList
              data={contenedores}
              style={styles.pressableStyle}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setCliente(
                      item.numeroContenedor + '-' + item.infoContenedor.clienteInfo.CLIENTE,
                    );
                    setContenedorID(item._id);
                    setModalVisible(false);
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
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#8B9E39',
    height: '180%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 40,
  },
  buttons: {
    backgroundColor: '#390D52',
    width: 120,
    height: 60,
    borderRadius: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
  textInput: {
    width: 150,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  viewTextInput: {
    display: 'flex',
  },
  centerModal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%',
  },
  viewModalItem: {
    width: 500,
    height: 450,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 30,
    shadowColor: 'black',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewModalItems: {
    width: 500,
    height: 350,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 30,
    shadowColor: 'black',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    padding: 10,
  },
  textModalHeader: {
    fontSize: 18,
    fontWeight: '500',
  },
  modalInputView: {
    margin: 10,
    paddingRight: 10,
    paddingLeft: 10,
  },
  modalInput: {
    width: 350,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#7D9F3A',
    backgroundColor: '#F5F5F5',
  },
  viewButtonsModal: {
    display: 'flex',
    flexDirection: 'row',
    gap: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  buttonContenedores: {
    width: 350,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#7D9F3A',
    backgroundColor: '#F5F5F5',
    height: 50,
    marginHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
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
});

