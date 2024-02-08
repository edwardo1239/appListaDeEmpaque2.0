/* eslint-disable prettier/prettier */
import React, {useContext, useState} from 'react';
import {
  Alert,
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
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
import {contenedoresInfoType, itemType} from '../types';

type propsType = {
  agregarItem: (item: itemType) => void;
  eliminarItem: (item: string) => void;
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
  const contenedor: contenedoresInfoType | undefined = useContext(
    contenedoresContext,
  ).find(item => item._id === numeroContenedor);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [cajas, setCajas] = useState<number>(0);
  const [entradaModalPallet, setEntradaModalPallet] = useState<string>('');
  const [entradaModalCajas, setEntradaModalCajas] = useState<string>('');

  const clickSumar = () => {
    if (habilitarBotonSuma){
      habilitarBotonSuma = false;
      if (isNaN(cajas)) {
        setCajas(0);
        return Alert.alert('Ingrese el numero de cajas');
      }
      if (cajas <= 0) {return Alert.alert('Ingrese el numero de cajas');}
      if (loteActual.enf === '') {return Alert.alert('Seleccione un lote');}
      if (pallet === 0) {return Alert.alert('Pallet no permitido');}
      if (
        contenedor?.infoContenedor.tipoFruta !== 'Mixto' &&
         contenedor?.infoContenedor.tipoFruta !== loteActual.tipoFruta
      ) {
        return Alert.alert('El contenedor tiene un tipo de fruta diferente');
      }
      if (contenedor.pallets[pallet].settings.tipoCaja === '') {return Alert.alert('Error configure el pallet');}
      if (contenedor.pallets[pallet].settings.calibre === 0) {return Alert.alert('Error configure el pallet');}
      if (contenedor.pallets[pallet].settings.calidad === 0) {return Alert.alert('Error configure el pallet');}
      const item: itemType = {
        id: loteActual.enf,
        nombre: loteActual.nombrePredio,
        predioId: loteActual._id,
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
    if (cajas <= 0) {return Alert.alert('Ingrese el numero de cajas');}
    if (loteActual.enf === '') {return Alert.alert('Seleccione un lote');}
    if (pallet === 0) {return Alert.alert('Pallet no permitido');}
    const cajasActual = cajas - Number(contenedor?.pallets[pallet].cajasTotal);
    if (cajasActual < 1) {return Alert.alert('Error en el numero de cajas');}
    if (
      contenedor?.infoContenedor.tipoFruta !== 'Mixto' &&
       contenedor?.infoContenedor.tipoFruta !== loteActual.tipoFruta
    ) {
      return Alert.alert('El contenedor tiene un tipo de fruta diferente');
    }
    if (contenedor.pallets[pallet].settings.tipoCaja === '') {return Alert.alert('Error configure el pallet');}
    if (contenedor.pallets[pallet].settings.calibre === 0) {return Alert.alert('Error configure el pallet');}
    if (contenedor.pallets[pallet].settings.calidad === 0) {return Alert.alert('Error configure el pallet');}

    const item: itemType = {
      id: loteActual.enf,
      nombre: loteActual.nombrePredio,
      predioId: loteActual._id,
      cajas: cajasActual,
      tipoCaja: contenedor?.pallets[pallet].settings.tipoCaja,
      calibre: contenedor?.pallets[pallet].settings.calibre,
      calidad: contenedor?.pallets[pallet].settings.calidad,
      fecha: new Date(),
    };
    props.agregarItem(item);
    setCajas(0);
  };
  const clickEliminar = () => {
    if (isNaN(cajas)) {
      setCajas(0);
      return Alert.alert('Ingrese el numero de cajas');
    }
    if (loteActual.enf === '') {return Alert.alert('Seleccione un lote');}
    if (seleccion === '')
      {return Alert.alert('Seleccione el item que desea eliminar');}
    props.eliminarItem(seleccion);
    setCajas(0);
  };
  const ClickOpenMoverCajas = () => {
    if (seleccion === '')
      {return Alert.alert('Seleccione un item que desee mover a otro pallet');}
    setOpenModal(true);
  };
  const clickMover = () => {
    if (numeroContenedor === 0) {return Alert.alert('Seleccione un contenedor');}
    if (entradaModalPallet === '')
      {return Alert.alert('Ingrese el pallet al que desea mover las cajas');}
    if (entradaModalCajas === '')
      {return Alert.alert('Ingrese el numero de cajas que desea mover');}
    if (
      contenedor &&
      contenedor.pallets &&
      Number(entradaModalPallet) > Object.keys(contenedor.pallets).length
    ) {
      return Alert.alert('Error en el pallet');
    }
    if (pallet === 0) {
      const itemCaja = cajasSinPallet[Number(seleccion)];
      if (itemCaja) {
        if (Number(entradaModalCajas) > Number(itemCaja)) {
          return Alert.alert('Error en elnumero de cajas');
        }
      }
    } else {
      const itemCaja = contenedor?.pallets[pallet].EF1.find(
        item => item._id === seleccion,
      )?.cajas;
      if (itemCaja) {
        if (Number(entradaModalCajas) > itemCaja) {
          return Alert.alert('Error en elnumero de cajas');
        }
      }
    }

    const item = {
      id: seleccion,
      nuevoPallet: entradaModalPallet,
      cajasMover: entradaModalCajas,
    };

    props.moverItems(item);
    setCajas(0);
    setEntradaModalCajas('');
    setEntradaModalPallet('');
    setOpenModal(false);
  };
  const clickRestar = () => {
    if (numeroContenedor === 0) {return Alert.alert('Seleccione un contenedor');}
    if (cajas === 0) {return Alert.alert('Ingrese el numero de cajas');}
    if (seleccion === '')
      {Alert.alert('Seleccione el item al que desea restar cajas');}
    if (pallet === 0) {
      const itemCaja = cajasSinPallet[Number(seleccion)];
      if (itemCaja) {
        if (Number(cajas) > Number(itemCaja.cajas)) {
          return Alert.alert('Error en el numero de cajas');
        }
      }
    } else {
      const itemCaja = contenedor?.pallets[pallet].EF1.find(
        item => item._id === seleccion,
      )?.cajas;
      if (itemCaja) {
        if (Number(cajas) > itemCaja) {
          return Alert.alert('Error en el numero de cajas');
        }
      }
    }
    let item;
    item = {
      seleccion: seleccion,
      cajas: Number(cajas),
    };
    props.restarItem(item);
    setCajas(0);
  };

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
        <Button title="Restar" onPress={clickRestar} />
      </View>
      <View>
        <Button title="Mover" onPress={ClickOpenMoverCajas} />
      </View>
      <View>
        <Button title="Eliminar" onPress={clickEliminar} />
      </View>

      {/* Modal */}
      <Modal transparent={true} visible={openModal} animationType="fade">
        <View style={styles.centerModal}>
          <View style={styles.viewModal}>
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
            <View style={styles.modalHeader}>
              <Text style={styles.textModalHeader}>
                Ingrese el numero de{' '}
                {contenedor && contenedor.infoContenedor.tipoEmpaque === 'Caja'
                  ? 'Cajas'
                  : 'Sacos'}{' '}
                que desea mover
              </Text>
            </View>
            <View style={styles.modalInputView}>
              <TextInput
                onChange={e => setEntradaModalCajas(e.nativeEvent.text)}
                keyboardType="numeric"
                style={styles.modalInput} />
            </View>
            <View style={styles.viewButtonsModal}>
              <Button title="Mover" onPress={clickMover} />
              <Button title="Cancelar" onPress={() => setOpenModal(false)} />
            </View>
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
  viewModal: {
    width: 500,
    height: 350,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 30,
    shadowColor: 'black',
    padding: 10,
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
    paddingRight: 50,
    paddingLeft: 10,
  },
  modalInput: {
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
});
