import { AuthData } from "../../types/modules/auth.types";
import server from "../server";


export const auth = async (data:AuthData) => {
    return await server(`v1/auth/login`, `post`,data);
}