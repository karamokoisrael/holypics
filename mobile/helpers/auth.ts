import { Directus } from '@directus/sdk';


export const login = async (directusUrl: string, email: string, password: string)=>{
    const directus = new Directus(directusUrl)
    const authResult = await directus.auth.login({ email, password })
    return { directus, authResult };
}



    