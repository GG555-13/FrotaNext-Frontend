import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { authApi } from "../../services/api";

import imgLoginSide from "../../assets/login-bg.png";
import logoBlue from "../../assets/logo-blue.png";

interface LoginInputs {
  email: string;
  password: string;
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new URLSearchParams();
      formData.append("username", data.email);
      formData.append("password", data.password);

      const response = await authApi.post("/clientes/token", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      login(response.data.access_token);
      navigate("/dashboard");
      
    } catch (err: any) {
      console.error(err);
      
      if (err.response && err.response.data && err.response.data.detail) {
          setError(err.response.data.detail);
      } else {
          setError("Não foi possível fazer login. Verifique sua conexão.");
      }
      
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex bg-white font-sans h-screen overflow-hidden">
      <div className="hidden lg:block lg:w-1/2 relative h-full">
        <img
          src={imgLoginSide}
          alt="Viagem tranquila"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-20 bg-white h-full overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center">
            <Link to="/">
              <img
                src={logoBlue}
                alt="FrotaNext"
                className="h-32 w-auto object-contain mb-6"
                style={{ height: "100px" }}
              />
            </Link>
            <h2 className="text-4xl font-bold text-[#003366] font-futuristic">
              Bem-vindo!
            </h2>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded shadow-sm">
              <p className="font-bold">Erro</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("email", { required: "E-mail é obrigatório" })}
                  type="email"
                  className="block w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 font-semibold">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("password", { required: "Senha é obrigatória" })}
                  type="password"
                  className="block w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end mt-1">
                <a
                  href="#"
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                >
                  Esqueci minha senha
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-bold text-white bg-[#007bff] hover:bg-[#0056b3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 font-futuristic uppercase tracking-wide"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Entrando...
                </>
              ) : (
                "ENTRAR"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Não tem uma conta? </span>
            <Link
              to="/cadastro"
              className="font-bold text-[#007bff] hover:text-[#0056b3] hover:underline"
            >
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
