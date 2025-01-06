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