/* eslint-disable prettier/prettier */

import { Socket } from 'socket.io-client';
import { itemType, serverResponseType, settingsType } from '../types';


const requestContenedores = {
    data: {
      query: {'infoContenedor.cerrado': false},
      select: {numeroContenedor: 1, infoContenedor: 1, pallets: 1},
      sort: {'infoContenedor.fechaCreacion': -1},
      limit: 50,
      populate: [
        {
          path: 'infoContenedor.clienteInfo',
          select: 'CLIENTE',
        },
      ],
    },
    collection: 'contenedores',
    action: 'getContenedores',
    query: 'proceso',
  };

export const request_lista_empaque = async (socket: Socket): Promise<serverResponseType> => {
    return new Promise((resolve, reject) => {
        try {
            socket.emit('listaEmpaque', {data: requestContenedores}, (serverResponse: serverResponseType) => {
                resolve(serverResponse);
            });
        } catch (e) {
            reject('Error obteniendo los datos');
        }
    });
};

export const guardar_pallets_settings = async (socket: Socket, idContenedor: number, nPallet: number, settings: settingsType): Promise<number> => {
    const request: any = {
      query: 'proceso',
      collection: 'contenedores',
      action: 'agregarSettingsPallet',
      data: {
        contenedor: {
          _id: idContenedor,
          pallet: nPallet,
          item: settings,
        },
      },
    };
    return new Promise((resolve, reject) => {
      try {
          socket.emit('listaEmpaque', {data: request}, (serverResponse: serverResponseType) => {
              resolve(serverResponse.status);
          });
      } catch (e) {
          reject(401);
      }
  });

};

export const agregar_item = async (socket: Socket, item: itemType, numeroContenedor:number, palletSeleccionado:number ): Promise<number> => {
  const itemPush = {
    lote: item._id,
    cajas: Number(item.cajas),
    tipoCaja: item.tipoCaja ? item.tipoCaja : '',
    calibre: Number(item.calibre),
    calidad: Number(item.calidad),
    fecha: item.fecha.toISOString(),
  };
  let element = 'addPallet';
  if (palletSeleccionado === -1){
    element = 'addSinPallet';
  }
  const request: any = {
    query: 'proceso',
    collection: 'contenedores',
    action: element,
    data: {
      contenedor: {
        _id: numeroContenedor,
        item: itemPush,
        pallet: palletSeleccionado,
      },
    },
  };
  return new Promise((resolve, reject) => {
    try {
        socket.emit('listaEmpaque', {data: request}, (serverResponse: serverResponseType) => {
            resolve(serverResponse.status);
        });
    } catch (e) {
        reject(401);
    }
});
};

export const eliminar_item = async (socket: Socket, numeroContenedor:number, palletSeleccionado:number, seleccion:number[]) => {
  let element = 'eliminarItem';
  if (palletSeleccionado === -1){
    element = 'eliminatItemSinPallet';
  }

  const request: any = {
    query: 'proceso',
    collection: 'contenedores',
    action: element,
    data: {
      contenedor: {
        _id: numeroContenedor,
        item: seleccion,
        pallet: palletSeleccionado,
      },
    },
  };
  return new Promise((resolve, reject) => {
    try {
        socket.emit('listaEmpaque', {data: request}, (serverResponse: serverResponseType) => {
            resolve(serverResponse.status);
        });
    } catch (e) {
        reject(401);
    }
});
};

export const mover_item = async (socket: Socket, item:any, numeroContenedor: number, palletSeleccionado:number, seleccion:number[]) => {
  let action;
  // console.log(numeroContenedor);
  // console.log(palletSeleccionado);
  //Request para mover un item desde un pallet contenedor a otro pallet contenedor
  if (item.type === 'item' && palletSeleccionado !== -1 && item.pallet !== -1 && item.contenedor !== -1){
    action = 'moverItemEntreContenedores';
  } else {
    action = '';
  }
  const request = {
    query: 'proceso',
    collection: 'contenedores',
    action: action,
    data: {
      contenedor1: {
        _id: numeroContenedor,
        index: seleccion[0],
        pallet: palletSeleccionado,
      },
      contenedor2: {
        _id: item.contenedor,
        pallet: item.pallet,
        cajas: item.numeroCajas,
      },
    },
  };
  console.log(request);

  return new Promise((resolve, reject) => {
    try {
        socket.emit('listaEmpaque', {data: request}, (serverResponse: serverResponseType) => {
            resolve(serverResponse.status);
        });
    } catch (e) {
        reject(401);
    }
});
};
