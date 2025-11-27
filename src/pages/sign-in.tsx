import { useAuth } from "@/hooks";
import { AuthData } from "@/types/modules/auth.types";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const BACKGROUND_URL = "https://picsum.photos/1920/1080?random=1";

const loginSchema = z.object({
  login: z
    .string()
    .min(3, "Login kamida 3 ta belgidan iborat bo‘lishi kerak")
    .max(50, "Login juda uzun"),
  password: z
    .string()
    .min(4, "Parol kamida 6 ta belgidan iborat bo‘lishi kerak")
    .max(100, "Parol juda uzun"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { mutate, isPending } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginSchema) {
    mutate(data, {
      onSuccess: (res) => {
        window.location.href = "/";
      },
    });
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden ">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-center bg-cover"
        style={{
          backgroundImage: `url(${BACKGROUND_URL})`,
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black/70 via-black/40 to-black/70" />
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl bg-white/90 backdrop-blur p-6 shadow-xl ring-1 ring-black/5">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Kirish
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Hisobingizga kirish uchun ma'lumotlarni kiriting
              </p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label
                  htmlFor="login"
                  className="block text-sm font-medium text-gray-700"
                >
                  Login
                </label>
                <input
                  id="login"
                  type="text"
                  {...register("login")}
                  placeholder="Foydalanuvchi nomi"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                />
                {errors.login && (
                  <p className="text-sm text-red-500">{errors.login.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Parol
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-gray-800 active:bg-black disabled:opacity-50"
              >
                {isPending ? "Yuklanmoqda..." : "Kirish"}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center text-xs text-white/70">
            © {new Date().getFullYear()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
