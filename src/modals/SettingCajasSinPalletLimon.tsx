/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
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
import {loteSeleccionadoContext, palletSeleccionadoContext} from '../../App';
import { itemType } from '../types';

type modalTypes = {
  openModalSinPallet: boolean;
  setOpenModalSinPallet: (data:boolean) => void;
  agregarItem: (item:itemType) => void
};

export default function SettingsCajasSinPallet(props: modalTypes) {
  const loteSeleccionado = useContext(loteSeleccionadoContext);
  const pallet = useContext(palletSeleccionadoContext);
  const [radioButtonTipoCaja, setRadioButtonTipoCaja] = useState<string>('');
  const [radioButtonCalidad, setRadioButtonCalidad] = useState<number>(0);
  const [radioButtonCalibre, setRadioButtonCalibre] = useState<number>(0);
  const [cajas, setCajas] = useState<string>('');

  const getInput = (
    e: NativeSyntheticEvent<TextInputChangeEventData>,
  ): void => {
    setCajas(e.nativeEvent.text);
  };

  const clickGuardar = (): void => {
    if (loteSeleccionado.enf === '')
      {return Alert.alert('No ha seleccionado predio');}

    if (cajas !== '') {
      if (
        !(
          radioButtonTipoCaja === '' ||
          radioButtonCalidad === 0 ||
          radioButtonCalibre === 0 ||
          loteSeleccionado.enf === ''
        )
      ) {

        const item: itemType = {
            id: loteSeleccionado.enf,
            nombre: loteSeleccionado.nombrePredio,
            cajas: Number(cajas),
            tipoCaja: radioButtonTipoCaja,
            calibre: Number(radioButtonCalibre),
            calidad: Number(radioButtonCalidad),
            fecha: new Date(),
          };
        props.agregarItem(item);

        setCajas('');
        setRadioButtonTipoCaja('');
        setRadioButtonCalidad(0);
        setRadioButtonCalibre(0);
        //props.closeModalSinPallet(false);
      } else {
        Alert.alert('No ha seleccionado ninguna configuracion');
      }
    } else {Alert.alert('Ingrese las cajas');}
  };

  return (
    <Modal
      transparent={true}
      visible={props.openModalSinPallet}
      animationType="fade">
      <View style={styles.centerModal}>
        <View style={styles.viewModal}>
          <View style={styles.modal}>
            <Text style={styles.tituloModal}>Configurar Pallet {pallet}</Text>
            <View style={styles.containerConfigurarPallet}>
              <Text>Tipo de caja</Text>
              <View style={{display: 'flex', flexDirection: 'row', gap: 20}}>
                <TouchableOpacity
                  onPress={() => setRadioButtonTipoCaja('G-37')}>
                  <View style={styles.radioButton}>
                    <View style={styles.radio}>
                      {radioButtonTipoCaja === 'G-37' ? (
                        <View style={styles.radioBg} />
                      ) : null}
                    </View>
                    <Text>G-37</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setRadioButtonTipoCaja('G-4.5')}>
                  <View style={styles.radioButton}>
                    <View style={styles.radio}>
                      {radioButtonTipoCaja === 'G-4.5' ? (
                        <View style={styles.radioBg} />
                      ) : null}
                    </View>
                    <Text>G-4.5</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setRadioButtonTipoCaja('B-37')}>
                  <View style={styles.radioButton}>
                    <View style={styles.radio}>
                      {radioButtonTipoCaja === 'B-37' ? (
                        <View style={styles.radioBg} />
                      ) : null}
                    </View>
                    <Text>B-37</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.containerConfigurarPallet}>
              <Text>Calidad</Text>
              <View style={{display: 'flex', flexDirection: 'row', gap: 20}}>
                <TouchableOpacity onPress={() => setRadioButtonCalidad(1)}>
                  <View style={styles.radioButton}>
                    <View style={styles.radio}>
                      {radioButtonCalidad === 1 ? (
                        <View style={styles.radioBg} />
                      ) : null}
                    </View>
                    <Text>1</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setRadioButtonCalidad(1.5)}>
                  <View style={styles.radioButton}>
                    <View style={styles.radio}>
                      {radioButtonCalidad === 1.5 ? (
                        <View style={styles.radioBg} />
                      ) : null}
                    </View>
                    <Text>1.5</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.containerConfigurarPallet}>
              <Text>Calibre</Text>
              {radioButtonTipoCaja === 'G-4.5' ? (
                <View style={styles.optionsContainer}>
                  <TouchableOpacity onPress={() => setRadioButtonCalibre(63)}>
                    <View style={styles.radioButton}>
                      <View style={styles.radio}>
                        {radioButtonCalibre === 63 ? (
                          <View style={styles.radioBg} />
                        ) : null}
                      </View>
                      <Text>63</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setRadioButtonCalibre(54)}>
                    <View style={styles.radioButton}>
                      <View style={styles.radio}>
                        {radioButtonCalibre === 54 ? (
                          <View style={styles.radioBg} />
                        ) : null}
                      </View>
                      <Text>54</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setRadioButtonCalibre(48)}>
                    <View style={styles.radioButton}>
                      <View style={styles.radio}>
                        {radioButtonCalibre === 48 ? (
                          <View style={styles.radioBg} />
                        ) : null}
                      </View>
                      <Text>48</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setRadioButtonCalibre(42)}>
                    <View style={styles.radioButton}>
                      <View style={styles.radio}>
                        {radioButtonCalibre === 42 ? (
                          <View style={styles.radioBg} />
                        ) : null}
                      </View>
                      <Text>42</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setRadioButtonCalibre(36)}>
                    <View style={styles.radioButton}>
                      <View style={styles.radio}>
                        {radioButtonCalibre === 36 ? (
                          <View style={styles.radioBg} />
                        ) : null}
                      </View>
                      <Text>36</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.optionsContainer}>
                  <TouchableOpacity onPress={() => setRadioButtonCalibre(250)}>
                    <View style={styles.radioButton}>
                      <View style={styles.radio}>
                        {radioButtonCalibre === 250 ? (
                          <View style={styles.radioBg} />
                        ) : null}
                      </View>
                      <Text>250</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setRadioButtonCalibre(230)}>
                    <View style={styles.radioButton}>
                      <View style={styles.radio}>
                        {radioButtonCalibre === 230 ? (
                          <View style={styles.radioBg} />
                        ) : null}
                      </View>
                      <Text>230</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setRadioButtonCalibre(200)}>
                    <View style={styles.radioButton}>
                      <View style={styles.radio}>
                        {radioButtonCalibre === 200 ? (
                          <View style={styles.radioBg} />
                        ) : null}
                      </View>
                      <Text>200</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setRadioButtonCalibre(175)}>
                    <View style={styles.radioButton}>
                      <View style={styles.radio}>
                        {radioButtonCalibre === 175 ? (
                          <View style={styles.radioBg} />
                        ) : null}
                      </View>
                      <Text>175</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setRadioButtonCalibre(150)}>
                    <View style={styles.radioButton}>
                      <View style={styles.radio}>
                        {radioButtonCalibre === 150 ? (
                          <View style={styles.radioBg} />
                        ) : null}
                      </View>
                      <Text>150</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setRadioButtonCalibre(110)}>
                    <View style={styles.radioButton}>
                      <View style={styles.radio}>
                        {radioButtonCalibre === 110 ? (
                          <View style={styles.radioBg} />
                        ) : null}
                      </View>
                      <Text>110</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          <View style={styles.modalCajas}>
            <View style={styles.modal}>
              <Text style={styles.tituloModal}>
                Ingresar El numero de cajas{' '}
              </Text>
            </View>
            <View style={{marginLeft: 15, marginTop: 20}}>
              <TextInput
                style={styles.inputCajas}
                onChange={e => getInput(e)}
                keyboardType="numeric"
                value={cajas} />
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 15,
                marginTop: 40,
                justifyContent: 'center',
                marginRight: 45,
              }}>
              <Button title="Guardar" onPress={clickGuardar} />
              <Button
                title="Cancelar"
                onPress={() => props.setOpenModalSinPallet(false)}
              />
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
});
