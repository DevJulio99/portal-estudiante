import type { $Fetch, FetchOptions } from 'ofetch';
class FetchFactory<T> {
	private $fetch: $Fetch;

	constructor(fetcher: $Fetch) {
		this.$fetch = fetcher;
	}

	/**
	 * The HTTP client is utilized to control the process of making API requests.
	 * @param method the HTTP method (GET, POST, ...)
	 * @param url the endpoint url
	 * @param data the body data
	 * @param fetchOptions fetch options
	 * @returns
	 */
	async call(
		method: string,
		url: string,
		data?: any,
		fetchOptions?: FetchOptions<'json'>,
	): Promise<T> {
		const tokenStore = useTokenStore();
		
		// Determinar si es una ruta pública que no requiere token
		const publicRoutes = [
			'/api/auth/login',
			'/api/auth/generar-captcha',
			'/api/auth/validar-captcha',
			'/api/auth/refresh-token',
			'/swagger'
		];
		
		const isPublicRoute = publicRoutes.some(route => url.includes(route));
		
		// Construir headers
		const headers: Record<string, string> = {
			...fetchOptions?.headers as Record<string, string> || {},
		};
		
		// Agregar token solo si no es ruta pública y hay token disponible
		if (!isPublicRoute && tokenStore.accessToken) {
			// Asegurar que el token tenga el prefijo "Bearer "
			const bearerToken = tokenStore.accessToken.startsWith('Bearer ') 
				? tokenStore.accessToken 
				: `Bearer ${tokenStore.accessToken}`;
			headers['Authorization'] = bearerToken;
		}
		
		try {
			const $res = await this.$fetch<T>(url, {
				method,
				body: data,
				...fetchOptions,
				headers,
			});
			return $res;
		} catch (error: any) {
			// Manejar errores 401 específicamente
			if (error?.status === 401 || error?.statusCode === 401) {
				const tokenStore = useTokenStore();
				
				console.warn('[FetchFactory] Error 401: No autorizado. Token inválido o expirado.');
				
				// Limpiar tokens y redirigir al login
				if (typeof window !== 'undefined' && !tokenStore.isLoggingOut) {
					tokenStore.setIsLoggingOut(true);
					tokenStore.clearTokens();
				}
			}
			
			// Re-lanzar el error para que el código que llama pueda manejarlo
			throw error;
		}
	}
}

export default FetchFactory;
