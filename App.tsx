/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { createContext, useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { io } from 'socket.io-client';
import {
  LoteType,
  cajasSinPalletType,
  contenedoresInfoType,
  itemType,
  serverResponseType,
  settingsType,
} from './src/types';
import Header from './src/components/Header';
import Pallets from './src/components/Pallets';
import Footer from './src/components/Footer';
import Informacion from './src/components/Informacion';
import PushNotification from 'react-native-push-notification';
import {
  agregar_item, eliminar_item, guardar_pallets_settings, liberacion_pallet, mover_item, request_lista_empaque, restar_item,
} from './src/functions/request';

const socket = io('http://192.168.0.172:3003/');

export const contenedoresContext = createContext<contenedoresInfoType[]>([
  {
    _id: 0,
    numeroContenedor: 0,
    pallets: [],
    infoContenedor: {
      clienteInfo: {
        CLIENTE: '',
        _id: '',
      },
      tipoFruta: 'Limon',
      tipoEmpaque: 'Caja',
      cerrado: false,
      desverdizado: false,
    },
  },
]);
export const loteSeleccionadoContext = createContext<LoteType>({
  enf: '',
  nombrePredio: '',
  tipoFruta: 'Limon' as 'Limon' | 'Naranja',
  _id: '',
  predio: '',
});
export const palletSeleccionadoContext = createContext<number>(-1);
export const contenedorSeleccionadoContext = createContext<number>(-1);
export const itemSeleccionContext = createContext<number[]>([]);
export const cajasSinPalletContext = createContext<cajasSinPalletType[]>([]);

function App(): React.JSX.Element {
  const [loteVaciando, setLoteVaciando] = useState<LoteType>({
    enf: '',
    nombrePredio: '',
    tipoFruta: 'Limon' as 'Limon' | 'Naranja',
    _id: '',
    predio: '',
  });
  const [contenedoresProvider, setContenedoresProvider] = useState<contenedoresInfoType[]>([]);
  const [numeroContenedor, setNumeroContenedor] = useState<number>(-1);
  const [loteSeleccionado, setLoteSeleccionado] = useState<LoteType>({
    enf: '',
    nombrePredio: '',
    tipoFruta: 'Limon',
    _id: '',
    predio: '',
  });
  const [palletSeleccionado, setPalletSeleccionado] = useState<number>(-1);
  const [seleccion, setSeleccion] = useState<number[]>([]);
  const [cajasSinPallet, setCajasSinPallet] = useState([]);

  useEffect(() => {
    const funcionAsyncrona = async () => {
      socket.on('connect_error', function (err) {
        Alert.alert(`connect_error due to ${err.message}`);
        console.log(`connect_error due to ${err.message}`);
      });
      // se obtienen los contendores
      await obtener_data_servidor_contenedores();
      //OBTENER ENF
      await obtener_data_enf();
      //obtener cajas sin pallet
      await obtener_cajas_sin_pallet();

      //Escucha si se vacia un lote
      socket.on('vaciarLote', (data: any) => {
        createChannel();
        PushNotification.localNotification({
          channelId: 'channel-id-1',
          title: 'Nuevo predio vaciado', // (optional)
          message: 'Se vaceo el predio ' + data.nombrePredio + '--' + data.enf, // (required)
        });

        setLoteVaciando({
          enf: data.enf,
          nombrePredio: data.nombrePredio,
          tipoFruta: data.tipoFruta,
          _id: data._id,
          predio: data.predio,
        });
      });
      socket.on('listaEmpaque', async () => {
        try {
          const listaEmpaque: serverResponseType = await request_lista_empaque(socket);
          if (listaEmpaque && listaEmpaque.status === 200) {
            setContenedoresProvider(listaEmpaque.data);
          } else {
            throw new Error(`Error obteniendo contenedores: ${listaEmpaque.data}`);
          }
        } catch (e:unknown) {
          if (e instanceof Error){
            Alert.alert(`${e.message}`);
          }
        }
      });
      socket.on('cajasSinPallet', async () => {
        try {
          await obtener_cajas_sin_pallet();
        } catch (e:unknown) {
          if (e instanceof Error){
            Alert.alert(`${e.message}`);
          }
        }
      });

    };
    funcionAsyncrona();
  }, []);

  useEffect(() => {
    setSeleccion([]);
  }, [palletSeleccionado]);

  const createChannel = () => {
    PushNotification.createChannel(
      {
        channelId: 'channel-id-1', // (requerido)
        channelName: 'Mi canal', // (requerido)
      },
      created => console.log(`createChannel returned '${created}'`), // (opcional) callback devuelve si el canal fue creado, false significa que ya existía.
    );
  };
  const obtener_data_servidor_contenedores = async () => {
    try {
      const listaEmpaque: serverResponseType = await request_lista_empaque(socket);
      if (listaEmpaque && listaEmpaque.status === 200) {
        setContenedoresProvider(listaEmpaque.data);
      } else {
        Alert.alert(`Error obteniendo contenedores: ${listaEmpaque.data}`);
      }
    } catch {
      Alert.alert('Error obteniendo datos del servidor');
    }
  };
  const obtener_data_enf = async () => {
    try {
      const requestENF = { data: { collection: 'variablesListaEmpaque', action: 'obtenerEF1ListaEmpaque' } };
      socket.emit('listaEmpaque', requestENF, (responseServer: LoteType) => {
        if (responseServer.status === 200) {
          setLoteVaciando({
            enf: responseServer.enf,
            nombrePredio: responseServer.nombrePredio,
            tipoFruta: responseServer.tipoFruta,
            _id: responseServer._id,
            predio: responseServer.predio,
          });
        } else {
          Alert.alert(`Error obteniendo el predio vaciado: Code ${responseServer.status}, error: ${responseServer.message}`);
        }
      });
    } catch (e) {
      Alert.alert('Error obteniendo datos de cajas sin pallet');
    }
  };
  const obtener_cajas_sin_pallet = async () => {
    try {
      const requestCajas = { data: { collection: 'variablesListaEmpaque', action: 'obtenerCajasSinPallet' } };
      socket.emit('listaEmpaque', requestCajas, (responseServer: { status: number, message: string, data: [] }) => {
        if (responseServer.status === 200) {
          console.log(responseServer.data);
          setCajasSinPallet(responseServer.data);
        } else {
          Alert.alert(`Error obteniendo las cajas sin pallet, code: ${responseServer.status} error: ${responseServer.message}`);
        }
      });
    } catch (e) {
      Alert.alert('Error obteniendo las cajas sin pallet');
    }
  };
  const guardarPalletSettings = async (settings: settingsType) => {
    try {
      const palletSettings = await guardar_pallets_settings(socket, numeroContenedor, palletSeleccionado, settings);
      if (palletSettings === 200) {
          Alert.alert('Guardado con exito');
        }
    } catch (e: any) {
      Alert.alert(`Error guardando la configuracion de pallet ${e.status}: ${e.message}`);
    }
  };
  const agregarItem = async (item: itemType) => {
    try {
      const response = await agregar_item(socket, item, numeroContenedor, palletSeleccionado);
      if (response === 200) { Alert.alert('Guardado con exito'); }
    } catch (e: any) {
      Alert.alert(`Error agregando el item code ${e.status}: ${e.message}`);
    }
  };
  const eliminarItem = async () => {
    try {
      const response = await eliminar_item(socket, numeroContenedor, palletSeleccionado, seleccion);
      setSeleccion([]);
      if (response === 200) {
        Alert.alert('Eliminado con exito');
      }
    } catch (e: any) {
      Alert.alert(`Error eliminando el item code ${e.status}: ${e.message}`);
    }
  };
  const moverItems = async (item: any) => {
    try {
      const response = await mover_item(socket, item, numeroContenedor, palletSeleccionado, seleccion);
      await obtener_data_servidor_contenedores();
      await obtener_cajas_sin_pallet();
      setSeleccion([]);
      if (response === 200) {
        Alert.alert('Datos movidos con exito');
      }
    } catch (e: any) {
      Alert.alert(`Error moviendo los items code ${e.status}: ${e.message}`);
    }
  };
  const restarItem = async (item: any) => {
    try {
      const response = await restar_item(socket, item, numeroContenedor, palletSeleccionado, seleccion);
      if (response === 200) {
        Alert.alert('Cajas restadas con exito');
      }
      setSeleccion([]);
    } catch (e: any) {
      Alert.alert(`Error restando item code ${e.status}: ${e.message}`);
    }
  };
  const liberacionPallet = async (item: any) => {
    try {
      const palletSettings = await liberacion_pallet(socket, numeroContenedor, palletSeleccionado, item);
      if (palletSettings === 200) { Alert.alert('Guardado con exito'); }
    } catch (e: any) {
      Alert.alert(`Error liberando pallet ${e.status}: ${e.message}`);
    }
  };
  const cerrarContenedor = () => {
    if (numeroContenedor === 0) {
      return Alert.alert('Seleccione un contenedor');
    }
    const contenedor = contenedoresProvider.find(item => item._id === numeroContenedor);
    if (!contenedor) {
      return Alert.alert('Error');
    }

    let todosVerdaderos = Object.values(contenedor?.pallets).every(pallet =>
      Object.values(pallet.listaLiberarPallet).every(val => val === true),
    );

    if (todosVerdaderos) {
      const request = {
        data: {
          data: {
            contenedor: numeroContenedor,
          },
          action: 'cerrarContenedor',
        },
        id: socket.id,
      };
      socket.emit('listaDeEmpaque', request, (serverResponse: serverResponseType) => {
        if (serverResponse.status !== 200) {
          Alert.alert(`Error al guardar los datos: ${serverResponse.data}`);
        } else {
          Alert.alert('Guardado con exito');
        }
      });
    } else {
      Alert.alert('Debe liberar todos los pallets');
    }
  };
  const seleccionarLote = (item: LoteType): void => {
    setLoteSeleccionado(item);
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <contenedoresContext.Provider value={contenedoresProvider}>
          <loteSeleccionadoContext.Provider value={loteSeleccionado}>
            <contenedorSeleccionadoContext.Provider value={numeroContenedor}>
              <palletSeleccionadoContext.Provider value={palletSeleccionado}>
                <itemSeleccionContext.Provider value={seleccion}>
                  <cajasSinPalletContext.Provider value={cajasSinPallet}>
                    <Header
                      setNumeroContenedor={setNumeroContenedor}
                      loteVaciando={loteVaciando}
                      cerrarContenedor={cerrarContenedor}
                      seleccionarLote={seleccionarLote}
                    />
                    <View style={styles.viewPallets}>
                      <View>
                        <Pallets
                          setPalletSeleccionado={setPalletSeleccionado}
                          guardarPalletSettings={guardarPalletSettings}
                          agregarItem={agregarItem}
                          liberacionPallet={liberacionPallet}
                        />
                      </View>
                      <View style={{ height: 600, minWidth: 400 }}>
                        <Informacion setSeleccion={setSeleccion} />
                      </View>
                    </View>
                    <Footer
                      agregarItem={agregarItem}
                      eliminarItem={eliminarItem}
                      moverItems={moverItems}
                      restarItem={restarItem}
                    />
                  </cajasSinPalletContext.Provider>
                </itemSeleccionContext.Provider>
              </palletSeleccionadoContext.Provider>
            </contenedorSeleccionadoContext.Provider>
          </loteSeleccionadoContext.Provider>
        </contenedoresContext.Provider>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#719DF5',
  },
  viewPallets: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export default App;
