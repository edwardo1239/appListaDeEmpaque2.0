/* eslint-disable prettier/prettier */
import React, {useContext, useState} from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  Alert,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';
import {
  loteSeleccionadoContext,
} from '../../App';
import {itemType} from '../types';

type modalTypes = {
  openModalSinPallet: boolean;
  setOpenModalSinPallet: (data:boolean) => void;
  agregarItem: (item:itemType) => void
};
export default function SettingSacosSinEstibaLimon(props: modalTypes) {
  const loteSeleccionado = useContext(loteSeleccionadoContext);

  const [radioButtonTipoCaja, setRadioButtonTipoCaja] = useState<string>('');
  const [radioButtonCalidad, setRadioButtonCalidad] = useState<number>(0);
  const [radioButtonCalibre, setRadioButtonCalibre] = useState<number>(0);
  const [cajas, setCajas] = useState<string>('');

  const getInput = (e: NativeSyntheticEvent<TextInputChangeEventData>): void => {
    setCajas(e.nativeEvent.text);
  };

  const clickGuardar = (): void => {
    if (loteSeleccionado._id === '') {
      return Alert.alert('No ha seleccionado predio');
    }
    if (cajas !== '') {
      if (
        !(radioButtonTipoCaja === '' ||
          radioButtonCalidad === 0 ||
          radioButtonCalibre === 0 ||
          loteSeleccionado._id === '')
      ) {
        const item: itemType = {
          _id: loteSeleccionado._id,
          cajas: Number(cajas),
          tipoCaja: radioButtonTipoCaja,
          calibre: Number(radioButtonCalibre),
          calidad: Number(radioButtonCalidad),
          fecha: new Date(),
        };
        console.log("limon")
        props.agregarItem(item);

        setCajas('');
        setRadioButtonTipoCaja('');
        setRadioButtonCalidad(0);
        setRadioButtonCalibre(0);
        //props.closeModalSinPallet(false);
      } else {
        Alert.alert('No ha seleccionado ninguna configuracion');
      }
    } else {
      Alert.alert('Ingrese las cajas');
    }
  };

  return (
    <Modal transparent={true} visible={props.openModalSinPallet} animationType="fade">
      <View style={styles.centerModal}>
        <View style={styles.viewModal}>
          <View style={styles.modal}>
            <Text style={styles.tituloModal}>Configurar Saco sin estiba</Text>
            <View style={styles.containerConfigurarPallet}>
              <Text>Tipo de Saco</Text>
              <View style={styles.viewStyles1}>
                <TouchableOpacity onPress={() => setRadioButtonTipoCaja('Rojo')}>
                  <View style={styles.radioButton}>
                    <View style={styles.radio}>
                      {radioButtonTipoCaja === 'Rojo' ? <View style={styles.radioBg} /> : null}
                    </View>
                    <Text>Rojo</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setRadioButtonTipoCaja('Verde')}>
                  <View style={styles.radioButton}>
                    <View style={styles.radio}>
                      {radioButtonTipoCaja === 'Verde' ? <View style={styles.radioBg} /> : null}
                    </View>
                    <Text>Verde</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.containerConfigurarPallet}>
              <Text>Calidad</Text>
              <View style={styles.viewStyles1}>
                <TouchableOpacity onPress={() => setRadioButtonCalidad(1)}>
                  <View style={styles.radioButton}>
                    <View style={styles.radio}>{radioButtonCalidad === 1 ? <View style={styles.radioBg} /> : null}</View>
                    <Text>1</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setRadioButtonCalidad(2)}>
                  <View style={styles.radioButton}>
                    <View style={styles.radio}>{radioButtonCalidad === 2 ? <View style={styles.radioBg} /> : null}</View>
                    <Text>2</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.containerConfigurarPallet}>
              <Text>Calibre</Text>
              <View style={styles.inputText}>
                <TextInput
                  keyboardType="numeric"
                  value={String(radioButtonCalibre)}
                  onChange={e => setRadioButtonCalibre(Number(e.nativeEvent.text))}
                />
              </View>
            </View>
          </View>
          <View style={styles.modalCajas}>
            <View style={styles.modal}>
              <Text style={styles.tituloModal}>Ingresar el numero de sacos </Text>
            </View>
            <View style={styles.styleIngresarSacos}>
              <TextInput style={styles.inputCajas} onChange={e => getInput(e)} keyboardType="numeric" value={cajas} />
            </View>
            <View
              style={styles.botonesStyles}>
              <Button title="Guardar" onPress={clickGuardar} />
              <Button title="Cancelar" onPress={() => props.setOpenModalSinPallet(false)} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centerModal: {
    flex: 1,
    alignItems: 'flex-start',
    marginTop: '10%',
  },
  viewModal: {
    display: 'flex',
    backgroundColor: 'white',
    width: 850,
    flexDirection: 'row',
    borderRadius: 20,
    alignItems: 'flex-start',
    paddingBottom: 20,
    paddingTop: 10,
    marginLeft: '10%',
    gap: 50,
    shadowColor: '#52006A',
    elevation: 20,
  },
  modal: {
    display: 'flex',
    flexDirection: 'column',
    width: 400,
    padding: 20,
    borderRightColor: '#999999',
    borderRightWidth: 1,
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    marginLeft: 10,
  },
  viewStyles1:{display: 'flex', flexDirection: 'row', gap: 20},
  styleIngresarSacos:{marginLeft: 15, marginTop: 20},
  botonesStyles:{
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
    marginTop: 40,
    justifyContent: 'center',
    marginRight: 45,
  },
  containerConfigurarPallet: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginTop: 10,
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
  },
  radioButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  radio: {
    width: 30,
    height: 30,
    borderColor: '#0074D9',
    borderRadius: 15,
    borderWidth: 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioBg: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0074D9',
  },
  containerButtonsModal: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 15,
  },
  inputCajas: {
    borderWidth: 1,
    borderRadius: 15,
    width: '80%',
  },
  modalCajas: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
  },
  inputText: {
    backgroundColor: '#E2F0FF',
    borderRadius: 15,
    marginBottom: 5,
  },
});
