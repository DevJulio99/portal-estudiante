export default defineNuxtRouteMiddleware(async (to) => {
    const tokenStore = useTokenStore();

    // console.log('accessToken',tokenStore.accessToken)
    // console.log('refreshToken',tokenStore.refreshToken)

    const isAuth = tokenStore.accessToken.trim().length && tokenStore.refreshToken.trim().length;

    if(!isAuth){
        return navigateTo("/login", { replace: true });
    }
});