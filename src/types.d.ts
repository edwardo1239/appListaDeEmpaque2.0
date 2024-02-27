/* eslint-disable prettier/prettier */
export type LoteType ={
    enf: string;
    nombrePredio: string;
    tipoFruta: 'Naranja' | 'Limon' | 'Mixto';
    _id: string
    predio: string
  }

  export type serverResponseType = {
    status:number
    data:any
  }

export type contenedoresInfoType = {
    numeroContenedor: number
    pallets: palletType[]
    infoContenedor: infoContenedorType
    _id:number
}

type infoContenedorType = {
    clienteInfo: {
      CLIENTE: string
      _id:string
    }
    tipoFruta: 'Limon' | 'Naranja' | 'Mixto'
    tipoEmpaque: 'Caja' | 'Saco'
    cerrado:boolean
    desverdizado:boolean
}




export type palletType = {
  settings: settingsType
  EF1: EF1Type[]
  listaLiberarPallet: listaLiberacionPalletType
}

export type settingsType = {
  tipoCaja: string
  calidad: number
  calibre: number
}

export type EF1Type = {
  lote: {
    _id: string
    enf: string
    predio:string
  } | string
  cajas: number
  tipoCaja: string
  calibre: number
  calidad: number
  fecha: string
}

export type listaLiberacionPalletType = {
  rotulado: boolean
  paletizado: boolean
  enzunchado: boolean
  estadoCajas: boolean
  pallet: boolean
}

export type itemType =  {
    _id: string
    cajas: number;
    tipoCaja: string | undefined;
    calibre: number | undefined;
    calidad: number | undefined;
    fecha: Date;
}

export type cajasSinPalletType = {
  lote: {
    _id: string
    enf: string
    predio:string
  }
  cajas: number
  tipoCaja: string
  calibre: number
  calidad: number
  fecha: string
}
