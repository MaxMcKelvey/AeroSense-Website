import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function useRouteGuard(redirect_url: string) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const { data: sessionData, status: status } = useSession();
    // const userId = sessionData?.user?.id ? sessionData.user.id : "";

    useEffect(() => {
        // on initial load - run auth check 
        authCheck(router.asPath);

        // on route change start - hide page content by setting authorized to false  
        const hideContent = () => setAuthorized(false);
        router.events.on('routeChangeStart', hideContent);

        // on route change complete - run auth check 
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }
        // react-hooks/rules-of-hooks
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    function authCheck(url: string) {
        // redirect to login page if accessing a private page and not logged in 
        const publicPaths = ['/purchase', '/'];
        const path = url.split('?')[0];
        if (!path || status == 'loading') return;
        if (!sessionData?.user?.status && !publicPaths.includes(path)) {
            setAuthorized(false);
            void router.push({
                pathname: redirect_url,
                query: { returnUrl: router.asPath }
            });
        } else {
            setAuthorized(true);
        }
    }

    return [authorized];
}