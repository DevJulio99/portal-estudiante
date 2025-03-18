import { object } from "yup";

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

export const validateForm = (form: object, optional: string[]) => {
   const alumnoStore = useAlumnoStore();
   const arraysForm = Object.entries(form);
   const noOptional = arraysForm.filter(x => !optional.includes(x[0]));
   const hiddenData = noOptional.filter(x => typeof(x[1]) == "string" ? x[1].trim().length <=0 : (typeof(x[1]) == "number" ? x[1] <= 0 : false))
   let keysHiddenData = [];
   //console.log('noHidden', noHidden);

   for(let i = 0; i < hiddenData.length; i ++){
    keysHiddenData.push(hiddenData[i][0]);
   }
   if(keysHiddenData.length){
    alumnoStore.setErrorForm(keysHiddenData);
    alumnoStore.setError(true, 'Tienes que completar los campos')
   }
   return keysHiddenData.length
}