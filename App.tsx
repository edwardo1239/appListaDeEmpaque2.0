/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {createContext, useEffect, useState} from 'react';
import {Alert, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {io} from 'socket.io-client';
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

const socket = io('http://192.168.0.172:3004/');

export const contenedoresContext = createContext<contenedoresInfoType[]>([
  {
    _id: 0,
    numeroContenedor: 0,
    pallets: {},
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
export const palletSeleccionadoContext = createContext<number>(0);
export const contenedorSeleccionadoContext = createContext<number>(0);
export const itemSeleccionContext = createContext<string>('');
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
  const [numeroContenedor, setNumeroContenedor] = useState<number>(0);
  const [loteSeleccionado, setLoteSeleccionado] = useState<LoteType>({
    enf: '',
    nombrePredio: '',
    tipoFruta: 'Limon',
    _id: '',
    predio: '',
  });
  const [palletSeleccionado, setPalletSeleccionado] = useState<number>(0);
  const [seleccion, setSeleccion] = useState<string>('');
  const [cajasSinPallet, setCajasSinPallet] = useState([]);

  useEffect(() => {
    const funcionAsyncrona = async () => {
      socket.on('connect_error', function (err) {
        Alert.alert(`connect_error due to ${err.message}`);
        console.log(`connect_error due to ${err.message}`);
      });

      // se obtienen los contendores
      const request = {
        data: {
          query: {},
          select: {numeroContenedor: 1, infoContenedor: 1, pallets: 1},
          sort: {'infoContenedor.fechaCreacion': -1},
          limit: 50,
          populate: {
            path: 'infoContenedor.clienteInfo',
            select: 'CLIENTE',
          },
        },
        collection: 'contenedores',
        action: 'getContenedores',
        query: 'proceso',
      };

      socket.emit('listaEmpaque', {data: request}, (serverResponse: serverResponseType): void => {
        // console.log(serverResponse.data);
        if (serverResponse.status === 200) {
          setContenedoresProvider(serverResponse.data);
          // setCajasSinPallet(serverResponse.data.cajasSinPallet);
        } else {
          Alert.alert(`Error obteniendo contenedores: ${serverResponse.data}`);
        }
      });

      //OBTENER ENF
      const requestENF = {data: {collection: 'variablesListaEmpaque', action: 'obtenerEF1ListaEmpaque'}};

      socket.emit('listaEmpaque', requestENF, (responseServer: LoteType) => {
        setLoteVaciando({
          enf: responseServer.enf,
          nombrePredio: responseServer.nombrePredio,
          tipoFruta: responseServer.tipoFruta,
          _id: responseServer._id,
          predio: responseServer.predio,
        });
      });

      //obtener cajas sin pallet
      const requestCajas = {data: {collection: 'variablesListaEmpaque', action: 'obtenerCajasSinPallet'}};

      socket.emit('listaEmpaque', requestCajas, (responseServer: []) => {
        setCajasSinPallet(responseServer);
      });

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

      //
      socket.on('listaEmpaqueDB', (data: any) => {
        if (data.status === 200) {
          setContenedoresProvider(() => [...data.data.contenedores]);
          setCajasSinPallet(data.data.sinPallet);
        } else {
          Alert.alert(`Error obteniendo contenedores: ${data.data}`);
        }
      });
    };
    funcionAsyncrona();
  }, []);

  useEffect(() => {
    setSeleccion('');
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

  const guardarPalletSettings = (nContenedor: number, nPallet: number, settings: settingsType) => {
    const request = {
      data: {
        data: {contenedor: nContenedor, pallet: nPallet, settings: settings},
        action: 'guardarSettingsPallet',
      },
      id: socket.id,
    };
    socket.emit('listaDeEmpaque', request, (serverResponse: serverResponseType) => {
      if (serverResponse.status !== 200) {
        Alert.alert(`Error obteniendo contenedores: ${serverResponse.data}`);
      } else {
        Alert.alert('Guardado con exito');
      }
    });
  };
  const agregarItem = (item: itemType) => {
    const request = {
      data: {
        data: {
          contenedor: numeroContenedor,
          pallet: palletSeleccionado,
          item: item,
        },
        action: 'guardarItem',
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
  };
  const eliminarItem = (item: string) => {
    const request = {
      data: {
        data: {
          contenedor: numeroContenedor,
          pallet: palletSeleccionado,
          item: item,
        },
        action: 'eliminarItem',
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
  };
  const moverItems = (item: any) => {
    const request = {
      data: {
        data: {
          contenedor: numeroContenedor,
          pallet: palletSeleccionado,
          item: item,
        },
        action: 'moverItem',
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
  };
  const restarItem = (item: any) => {
    const request = {
      data: {
        data: {
          contenedor: numeroContenedor,
          pallet: palletSeleccionado,
          item: item,
        },
        action: 'restarItem',
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
  };
  const liberacionPallet = (item: any) => {
    const request = {
      data: {
        data: {
          contenedor: numeroContenedor,
          pallet: palletSeleccionado,
          item: item,
        },
        action: 'liberacionPallet',
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
    console.log(todosVerdaderos);
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
                      <View style={{height: 600, minWidth: 400}}>
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
