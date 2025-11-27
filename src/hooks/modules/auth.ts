import { useMutation } from "@tanstack/react-query"
import { auth } from "../../server/modules"
import { AuthData } from "../../types/modules/auth.types"

export const useAuth = () => {
    return useMutation({
        mutationKey: ['auth'],
        mutationFn: async (payload: AuthData) => {
            const { data } = await auth(payload)
            return data
        },
        onSuccess: (data) => {
            localStorage.setItem("user", JSON.stringify(data.data));
        }
    })
}