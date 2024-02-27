/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  Alert,
  TextInput,
} from 'react-native';
import { contenedorSeleccionadoContext, contenedoresContext, loteSeleccionadoContext, palletSeleccionadoContext } from '../../App';
import { settingsType } from '../types';


type modalLimonTypes = {
    openModal: boolean;
    closeModal: () => void;
    guardarPalletSettings: (
      nContenedor: number,
      nPallet: number,
      settings: settingsType,
    ) => void;
  liberacionPallet: (item:any) => void

};

export default function SettingsEstibaLimon(props: modalLimonTypes) {

    const pallet = useContext(palletSeleccionadoContext);
    const numeroContenedor = useContext(contenedorSeleccionadoContext);
    const contenedores = useContext(contenedoresContext);
    const contenedor = contenedores.find(item => item._id === numeroContenedor);
    const loteSeleccionado = useContext(loteSeleccionadoContext);

  useEffect(() => {
    if (pallet !== -1 && contenedor) {

        const infoLiberacion = contenedor.pallets[pallet].listaLiberarPallet;

        setRotulado(infoLiberacion.rotulado);
        setPaletizado(infoLiberacion.paletizado);
        setEnzunchado(infoLiberacion.enzunchado);
        setEstadoCajas(infoLiberacion.estadoCajas);
        setEstiba(infoLiberacion.pallet);
      } else {
        setRotulado(false);
        setPaletizado(false);
        setEnzunchado(false);
        setEstadoCajas(false);
        setEstiba(false);
      }
    }, [props.openModal, contenedor, pallet]);



  const [radioButtonTipoCaja, setRadioButtonTipoCaja] = useState<string>('');
  const [radioButtonCalidad, setRadioButtonCalidad] = useState<number>(0);
  const [radioButtonCalibre, setRadioButtonCalibre] = useState<number>(0);

  const [rotulado, setRotulado] = useState<boolean>(false);
  const [paletizado, setPaletizado] = useState<boolean>(false);
  const [enzunchado, setEnzunchado] = useState<boolean>(false);
  const [estadoCajas, setEstadoCajas] = useState<boolean>(false);
  const [estiba, setEstiba] = useState<boolean>(false);

  const clickGuardar = (): void => {
    if (
      contenedor?.infoContenedor.tipoFruta !== 'Mixto' &&
       contenedor?.infoContenedor.tipoFruta !== loteSeleccionado.tipoFruta
    ) {
      props.closeModal();
      return Alert.alert('El contenedor tiene un tipo de fruta diferente');
    }
    if (
      !(
        radioButtonTipoCaja === '' &&
        radioButtonCalidad === 0 &&
        radioButtonCalibre === 0
      )
    ) {
      props.guardarPalletSettings(numeroContenedor, pallet, {
        tipoCaja: radioButtonTipoCaja,
        calidad: radioButtonCalidad,
        calibre: radioButtonCalibre,
      });
    } else {
      Alert.alert('No ha seleccionado ninguna configuracion');
    }
    props.closeModal();
    setRadioButtonCalibre(0);
    setRadioButtonTipoCaja('');
    setRadioButtonCalidad(0);

  };

  const clickGuardarLiberacion = (): void => {

    const item = {
      rotulado: rotulado,
      paletizado:paletizado,
      enzunchado:enzunchado,
      estadoCajas: estadoCajas,
      estiba:estiba,
    };

    props.liberacionPallet(item);

    setRotulado(false);
    setPaletizado(false);
    setEnzunchado(false);
    setEstadoCajas(false);
    setEstiba(false);

    props.closeModal();

  };



  return (
    <Modal transparent={true} visible={props.openModal} animationType="fade">
      <View style={styles.centerModal}>
        <View style={styles.viewModal}>
          <View style={styles.modal}>
            <Text style={styles.tituloModal}>Configurar Estiba {pallet}</Text>
            <View style={styles.containerConfigurarPallet}>
              <Text>Tipo de Saco</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  onPress={() => setRadioButtonTipoCaja('Verde')}>
                  <View style={styles.radioButton}>
                    <View style={styles.radio}>
                      {radioButtonTipoCaja === 'Verde' ? (
                        <View style={styles.radioBg} />
                      ) : null}
                    </View>
                    <Text>Verde</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setRadioButtonTipoCaja('Rojo')}>
                  <View style={styles.radioButton}>
                    <View style={styles.radio}>
                      {radioButtonTipoCaja === 'Rojo' ? (
                        <View style={styles.radioBg} />
                      ) : null}
                    </View>
                    <Text>Rojo</Text>
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
                <TouchableOpacity onPress={() => setRadioButtonCalidad(2)}>
                  <View style={styles.radioButton}>
                    <View style={styles.radio}>
                      {radioButtonCalidad === 2 ? (
                        <View style={styles.radioBg} />
                      ) : null}
                    </View>
                    <Text>2</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.containerConfigurarPallet}>
              <Text>Calibre</Text>

                <View style={styles.inputText}>
                  <TextInput keyboardType="numeric"
                    value={String(radioButtonCalibre)}
                    onChange={(e) => setRadioButtonCalibre(Number(e.nativeEvent.text))} />
                </View>

            </View>
            <View style={styles.containerButtonsModal}>
              <Button title="Guardar" onPress={clickGuardar} />
              <Button
                title="Cancelar"
                onPress={props.closeModal}
              />
            </View>
          </View>

          <View>
            <View style={styles.modal}>
              <Text style={styles.tituloModal}>Liberacion estiba</Text>
            </View>
            <View style={styles.contenedorLiberacionPallet}>
              <TouchableOpacity onPress={() => setRotulado(!rotulado)}>
                <View style={styles.radioButton}>
                  <View style={styles.radio}>
                    {rotulado ? <View style={styles.radioBg} /> : null}
                  </View>
                  <Text>Rotulado</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPaletizado(!paletizado)}>
                <View style={styles.radioButton}>
                  <View style={styles.radio}>
                    {paletizado ? <View style={styles.radioBg} /> : null}
                  </View>
                  <Text>Paletizado</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEnzunchado(!enzunchado)}>
                <View style={styles.radioButton}>
                  <View style={styles.radio}>
                    {enzunchado ? <View style={styles.radioBg} /> : null}
                  </View>
                  <Text>Enzunchado</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEstadoCajas(!estadoCajas)}>
                <View style={styles.radioButton}>
                  <View style={styles.radio}>
                    {estadoCajas ? <View style={styles.radioBg} /> : null}
                  </View>
                  <Text>Estado cajas</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEstiba(!estiba)}>
                <View style={styles.radioButton}>
                  <View style={styles.radio}>
                    {estiba ? <View style={styles.radioBg} /> : null}
                  </View>
                  <Text>Estiba tipo exportación</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.viewButtonsLiberacionPallet}>
              <Button title="Guardar" onPress={clickGuardarLiberacion} />
              <Button
                title="Cancelar"
                onPress={props.closeModal}
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
  contenedorLiberacionPallet: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  viewButtonsLiberacionPallet: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    paddingTop: 35,
  },
  inputText:{
    backgroundColor:'#E2F0FF',
    borderRadius:15,
    marginBottom:5,
  },
});
