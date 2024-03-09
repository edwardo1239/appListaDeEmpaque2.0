/* eslint-disable prettier/prettier */

/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  contenedorSeleccionadoContext,
  contenedoresContext,
  loteSeleccionadoContext,
} from '../../App';
import {contenedoresInfoType, itemType, settingsType} from '../types';
import PalletComponent from '../utils/PalletComponent';
import SettingPalletLimon from '../modals/SettingPalletLimon';
import CajasSinPalletComponent from '../utils/CajasSinPalletComponent';
import SettingsCajasSinPalletLimon from '../modals/SettingCajasSinPalletLimon';
import SettingPalletNaranja from '../modals/SettingPalletNaranja';
import SettingsEstibaNaranja from '../modals/SettingEstibaNaranja';
import SettingsEstibaLimon from '../modals/SettingEstibaLimon';
import SettingSacosSinEstibaLimon from '../modals/SettingSacoSinEstibaLimon';
import SettingsCajasSinPalletNaranja from '../modals/SettingCajasSinPalletNaranja';
import SettingSacosSinEstibaNaranja from '../modals/SettingSacoSinEstibaNaranja';

type propsType = {
  setPalletSeleccionado: (data: number) => void;
  guardarPalletSettings: (
    settings: settingsType,
  ) => Promise<void>;
  agregarItem: (item: itemType) => void;
  liberacionPallet: (item:any) => void

};

export default function Pallets(props: propsType) {
  const loteActual = useContext(loteSeleccionadoContext);
  const contenedores = useContext(contenedoresContext);
  const numeroContenedor = useContext(contenedorSeleccionadoContext);

  const [contenedorSeleccionado, setContenedorSeleccionado] =
    useState<contenedoresInfoType>({
      _id: 0,
      numeroContenedor:0,
      pallets: [],
      infoContenedor: {
        clienteInfo:{
          CLIENTE:'',
          _id:'',
        },
        tipoFruta: 'Limon',
        tipoEmpaque: 'Caja',
        cerrado: false,
        desverdizado: false,
      },
    });
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalSinPallet, setOpenModalSinPallet] = useState<boolean>(false);

  useEffect(() => {
    const item = contenedores.find(cont => cont._id === numeroContenedor);
    if (item) {
      setContenedorSeleccionado(() => item);
    }
  }, [numeroContenedor, contenedores]);
  const openPalletSettings = () => {
    setOpenModal(true);
  };
  const closeModal = (): void => {
    setOpenModal(false);
  };
  return (
    <View
      style={
        numeroContenedor === -1 ? {minHeight: 525, width: 925} : styles.container
      }>
      {contenedorSeleccionado.pallets.map((pallet, index) => (
        <PalletComponent
          pallet={index}
          key={String(index )}
          setPalletSeleccionado={props.setPalletSeleccionado}
          openPalletSettings={openPalletSettings}
        />
      ))}
      <CajasSinPalletComponent
        setPalletSeleccionado={props.setPalletSeleccionado}
        setOpenModalSinPallet={setOpenModalSinPallet}
      />

      {loteActual.tipoFruta === 'Limon' ? (
        contenedorSeleccionado.infoContenedor.tipoEmpaque === 'Caja' ? (
          <SettingPalletLimon
            openModal={openModal}
            closeModal={closeModal}
            guardarPalletSettings={props.guardarPalletSettings}
            liberacionPallet={props.liberacionPallet}
          />
        ) : (
          <SettingsEstibaLimon
            openModal={openModal}
            closeModal={closeModal}
            guardarPalletSettings={props.guardarPalletSettings}
            liberacionPallet={props.liberacionPallet}

          />
        )
      ) : contenedorSeleccionado.infoContenedor.tipoEmpaque === 'Caja' ? (
        <SettingPalletNaranja
          openModal={openModal}
          closeModal={closeModal}
          guardarPalletSettings={props.guardarPalletSettings}
          liberacionPallet={props.liberacionPallet}

        />
      ) : (
        <SettingsEstibaNaranja
          openModal={openModal}
          closeModal={closeModal}
          guardarPalletSettings={props.guardarPalletSettings}
          liberacionPallet={props.liberacionPallet}

        />
      )}

      {loteActual.tipoFruta === 'Limon' ? (
        contenedorSeleccionado.infoContenedor.tipoEmpaque === 'Caja' ? (
          <SettingsCajasSinPalletLimon
            openModalSinPallet={openModalSinPallet}
            setOpenModalSinPallet={setOpenModalSinPallet}
            agregarItem={props.agregarItem}
          />
        ) : (
          <SettingSacosSinEstibaLimon
            openModalSinPallet={openModalSinPallet}
            setOpenModalSinPallet={setOpenModalSinPallet}
            agregarItem={props.agregarItem}
          />
        )
      ) :  contenedorSeleccionado.infoContenedor.tipoEmpaque === 'Caja' ?
      <SettingsCajasSinPalletNaranja
      openModalSinPallet={openModalSinPallet}
      setOpenModalSinPallet={setOpenModalSinPallet}
      agregarItem={props.agregarItem}
    />
    :
    <SettingSacosSinEstibaNaranja
    openModalSinPallet={openModalSinPallet}
    setOpenModalSinPallet={setOpenModalSinPallet}
    agregarItem={props.agregarItem}
  />
    }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: 900,
    flexWrap: 'wrap',
    margin: 30,
    minHeight: 155,
  },
});
