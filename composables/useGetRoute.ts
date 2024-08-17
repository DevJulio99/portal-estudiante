export const useGetRoute = (str: string): string => {
	const router = useRouter();
	const routesList = router.getRoutes();
	const route = routesList.find((item) => item.name === str);
	return route?.path ?? '';
};
