import { object } from "yup";
import { useMsgPopUpStore } from "~/stores/msgPopup";

export const decryptJWT = (token: string) => {
    const parts = token.split('.');
  
    if (parts.length !== 3) {
      return {}
    }
  
    const payload = parts[1];

    const base64Url = payload.replace(/-/g, '+').replace(/_/g, '/');
    const base64 = base64Url + '='.repeat((4 - base64Url.length % 4) % 4);
    const decodedPayload = JSON.parse(atob(base64));
  
    return decodedPayload;
}

export const getUrls = (data: any[]) => {
  //console.log('data geturl', data);
  let urls: any = [];

  for(const item of data){
    const url = item.url || useGetRoute(item.etiqueta)
    if(url){
      urls.push(url);
    }

    if(item.submenu && item.submenu.length){
      urls = urls.concat(getUrls(item.submenu));
    }
  }

  return urls
}

export const stringForm = {
  correo: 'Correo',
  nombreUsuario: 'Nombre',
  apellidoPaterno: 'Apellido Paterno',
  apellidoMaterno: 'Apellido Materno',
  telefono: 'Telefono',
  numeroDocumento: 'Numero de documento',
  fechaNacimiento: 'Fecha de Nacimiento',
  direccion: 'Direccion',
  fotoPerfil: 'Foto de perfil',
  genero: 'Genero',
  tipoAlumno: 'Tipo de alumno',
  apoderado: 'Apoderado',
  idGrado: 'Grado'
}

export const getMessageError = (key: string, tipo: 'hidden' | 'valid', value = '') => {
  if(tipo == 'hidden'){
    return `${stringForm[key as keyof typeof stringForm]} es obligatorio.`
  }
  if(tipo == 'valid'){
     if(key == 'correo'){
      if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return `${stringForm[key as keyof typeof stringForm]} no es valido.`
     }
  }
}

export const convertArrayInObject = (arrays: string[][]) => {
  let newobject = {}
  for(let i = 0; i < arrays.length; i ++){
    newobject = {
      ...newobject,
      [arrays[i][0]]: arrays[i][1]
    }
  }
  return newobject
}

export const validateForm = (form: object, optional: string[]) => {
   const alumnoStore = useAlumnoStore();
   const msgPopupStore = useMsgPopUpStore();
   const arraysForm = Object.entries(form);
   const noOptional = arraysForm.filter(x => !optional.includes(x[0]));
   const valid = ['correo'];
   const validatesString = noOptional.filter(x => typeof(x[1]) == "string" && x[1].trim().length > 0 && valid.includes(x[0]));
   //console.log('validatesString', validatesString);
   
   const hiddenData = noOptional.filter(x => typeof(x[1]) == "string" ? x[1].trim().length <=0 : (typeof(x[1]) == "number" ? x[1] <= 0 : false))
   let keysErrorData = [];


   for(let i = 0; i < hiddenData.length; i ++){
    const mensaje = getMessageError(hiddenData[i][0], 'hidden');
    hiddenData[i][1] = mensaje;
    keysErrorData.push(hiddenData[i][0]);
   }

   for(let i = 0; i < validatesString.length; i ++){
    const mensaje = getMessageError(validatesString[i][0], 'valid', validatesString[i][1]);
    //console.log('mensaje', mensaje)
    validatesString[i][1] = mensaje;
    mensaje && keysErrorData.push(validatesString[i][0]);
   }
   
   if(keysErrorData.length){
    //console.log('hiddenData', hiddenData)
    //console.log('validatesString', validatesString)
    const arrayErrors = [...hiddenData, ...validatesString];
    alumnoStore.msgError = convertArrayInObject(arrayErrors);
    alumnoStore.setErrorForm(keysErrorData);
    //alumnoStore.setError(true, hiddenData.length ? 'Tiene que completar los campos' : 'Tiene que ingresar campos validos')
		msgPopupStore.setError(true, hiddenData.length ? 'Tiene que completar los campos' : 'Tiene que ingresar campos validos', 'error');
   }

   if(!keysErrorData.length){
    alumnoStore.msgError = null;
    alumnoStore.setErrorForm([]);
   }
   return Boolean(!keysErrorData.length)
}

export const toggleHiddenScroll = () => {
  const miElemento = document.querySelector('body');
  if (miElemento) {
    const valOverflow = miElemento.style.overflow;
    miElemento.style.overflow  =  (valOverflow == '' || valOverflow == 'auto') ? 'hidden' : 'auto';
  }
}