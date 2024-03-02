import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GUEST_ROUTE, HOME_ROUTE } from "../constants/route";
import { AuthContext } from "./auth";
const GUEST_ROUTES = [GUEST_ROUTE];

const useAuthentication = () => {
    const {user}:any = AuthContext();
    const userInfo = user?.user || null;
    const router = useRouter();
    const currentRoute = window.location.pathname;

    useEffect(()=>{
        if(!userInfo && !GUEST_ROUTES.includes(currentRoute)){
            router.push(GUEST_ROUTE)
        }

        if(userInfo && GUEST_ROUTES.includes(currentRoute)){
            router.push(HOME_ROUTE);
        }
    },[currentRoute, router, userInfo]);

}

export default useAuthentication;