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
    sinPallet?:any
  }

export type contenedoresInfoType = {
    numeroContenedor: number
    pallets: palletsType
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



export type palletsType = {
  [key: string]: palletType
}

export type palletType = {
  settings: settingsType
  EF1: EF1Type[]
  cajasTotal:number
  listaLiberarPallet: listaLiberacionPalletType
}

export type settingsType = {
  tipoCaja: string
  calidad: number
  calibre: number
}

export type EF1Type = {
  id:string
  nombre:string
  cajas: number
  tipoCaja: string
  calibre: number
  calidad: number
  fecha: string
  _id:string
}

export type listaLiberacionPalletType = {
  rotulado: boolean
  paletizado: boolean
  enzunchado: boolean
  estadoCajas: boolean
  pallet: boolean
}

export type itemType =  {
    id: string
    enf: string
    nombre: string;
    predioId: string
    cajas: number;
    tipoCaja: string | undefined;
    calibre: number | undefined;
    calidad: number | undefined;
    fecha: Date;
}

export type cajasSinPalletType = {
  cajas:number
  calibre: number
  calidad: number
  fecha: string
  id:string
  nombre:string
  tipoCaja:string
}
