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