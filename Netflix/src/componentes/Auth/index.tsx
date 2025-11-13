'use client';

import { useState } from 'react';
import { User } from '../../types';
import './index.scss';

interface UserWithPassword extends User {
  password: string;
}

interface AuthProps {
  onLogin: (user: User) => void;
  onClose: () => void;
}

export default function Auth({ onLogin, onClose }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.email) {
      newErrors.push('Email é obrigatório');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.push('Email inválido');
    }

    if (!formData.password) {
      newErrors.push('Senha é obrigatória');
    } else if (formData.password.length < 6) {
      newErrors.push('Senha deve ter pelo menos 6 caracteres');
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.push('Nome é obrigatório');
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.push('Senhas não coincidem');
      }
    }

    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      if (isLogin) {
        // Login
        const users = JSON.parse(localStorage.getItem('moviemate-users') || '[]');
        const user = users.find((u: UserWithPassword) => 
          u.email === formData.email && u.password === formData.password
        );

        if (user) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPassword } = user;
          onLogin(userWithoutPassword);
        } else {
          setErrors(['Email ou senha incorretos']);
        }
      } else {
        // Cadastro
        const users = JSON.parse(localStorage.getItem('moviemate-users') || '[]');
        
        // Verificar se email já existe
        if (users.some((u: UserWithPassword) => u.email === formData.email)) {
          setErrors(['Este email já está cadastrado']);
          return;
        }

        // Criar novo usuário
        const newUser: UserWithPassword = {
          id: Date.now().toString(),
          name: formData.name.trim(),
          email: formData.email,
          password: formData.password,
          favorites: [],
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('moviemate-users', JSON.stringify(users));

        // Fazer login automaticamente
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = newUser;
        onLogin(userWithoutPassword);
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      setErrors(['Erro interno do sistema']);
    } finally {
      setIsLoading(false);
    }
  };

  const clearErrors = () => {
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        {!isLogin ? (
          // Novo design para cadastro
          <div className="relative py-3 sm:max-w-xl sm:mx-auto">
            <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold" onClick={onClose}>
                ✕
              </button>
              <div className="max-w-md mx-auto">
                <div className="flex items-center space-x-5 justify-center">
                  <svg
                    fill="none"
                    viewBox="0 0 397 94"
                    height="auto"
                    width="85"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="black"
                      d="M128.72 39.9429L138.387 5.10122C139.027 2.79347 141.139 1.19507 143.547 1.19507H150.18C153.843 1.19507 156.423 4.76704 155.253 8.21447L136.91 62.2543C136.175 64.417 134.134 65.8735 131.837 65.8735H122.921C120.624 65.8735 118.583 64.417 117.848 62.2543L99.5067 8.21605C98.3361 4.76861 100.917 1.19664 104.579 1.19664H111.213C113.621 1.19664 115.734 2.79504 116.373 5.10279L126.039 39.9444C126.415 41.2969 128.344 41.2969 128.72 39.9444V39.9429Z"
                    ></path>
                    <path
                      fill="url(#paint0_linear_501_142)"
                      d="M38.0481 4.82927C38.0481 2.16214 40.018 0 42.4481 0H51.2391C53.6692 0 55.6391 2.16214 55.6391 4.82927V40.1401C55.6391 48.8912 53.2343 55.6657 48.4248 60.4636C43.6153 65.2277 36.7304 67.6098 27.7701 67.6098C18.8099 67.6098 11.925 65.2953 7.11548 60.6663C2.37183 56.0036 3.8147e-06 49.2967 3.8147e-06 40.5456V4.82927C3.8147e-06 2.16213 1.96995 0 4.4 0H13.2405C15.6705 0 17.6405 2.16214 17.6405 4.82927V39.1265C17.6405 43.7892 18.4805 47.2018 20.1605 49.3642C21.8735 51.5267 24.4759 52.6079 27.9678 52.6079C31.4596 52.6079 34.0127 51.5436 35.6268 49.4149C37.241 47.2863 38.0481 43.8399 38.0481 39.0758V4.82927Z"
                    ></path>
                    <path
                      fill="url(#paint1_linear_501_142)"
                      d="M86.9 61.8682C86.9 64.5353 84.9301 66.6975 82.5 66.6975H73.6595C71.2295 66.6975 69.2595 64.5353 69.2595 61.8682V4.82927C69.2595 2.16214 71.2295 0 73.6595 0H82.5C84.9301 0 86.9 2.16214 86.9 4.82927V61.8682Z"
                    ></path>
                    <defs>
                      <linearGradient
                        gradientUnits="userSpaceOnUse"
                        y2="87.6201"
                        x2="96.1684"
                        y1="0"
                        x1="0"
                        id="paint0_linear_501_142"
                      >
                        <stop stopColor="#BF66FF"></stop>
                        <stop stopColor="#6248FF" offset="0.510417"></stop>
                        <stop stopColor="#00DDEB" offset="1"></stop>
                      </linearGradient>
                      <linearGradient
                        gradientUnits="userSpaceOnUse"
                        y2="87.6201"
                        x2="96.1684"
                        y1="0"
                        x1="0"
                        id="paint1_linear_501_142"
                      >
                        <stop stopColor="#BF66FF"></stop>
                        <stop stopColor="#6248FF" offset="0.510417"></stop>
                        <stop stopColor="#00DDEB" offset="1"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mt-5">
                    <label
                      className="font-semibold text-sm text-gray-600 pb-1 block"
                      htmlFor="name"
                    >
                      Name
                    </label>
                    <input
                      className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onClick={clearErrors}
                      disabled={isLoading}
                    />
                    <label
                      className="font-semibold text-sm text-gray-600 pb-1 block"
                      htmlFor="email"
                    >
                      E-mail
                    </label>
                    <input
                      className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onClick={clearErrors}
                      disabled={isLoading}
                    />
                    <label
                      className="font-semibold text-sm text-gray-600 pb-1 block"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onClick={clearErrors}
                      disabled={isLoading}
                    />
                    <label
                      className="font-semibold text-sm text-gray-600 pb-1 block"
                      htmlFor="confirmPassword"
                    >
                      Confirm Password
                    </label>
                    <input
                      className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onClick={clearErrors}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="text-right mb-4">
                    <a
                      className="text-xs font-display font-semibold text-gray-500 hover:text-gray-600 cursor-pointer"
                      href="#"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <div className="flex justify-center w-full items-center">
                    <div>
                      <button
                        className="flex items-center justify-center py-2 px-20 bg-white hover:bg-gray-200 focus:ring-blue-500 focus:ring-offset-blue-200 text-gray-700 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                        type="button"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          height="25"
                          width="25"
                          y="0px"
                          x="0px"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12,5c1.6167603,0,3.1012573,0.5535278,4.2863159,1.4740601l3.637146-3.4699707 C17.8087769,1.1399536,15.0406494,0,12,0C7.392395,0,3.3966675,2.5999146,1.3858032,6.4098511l4.0444336,3.1929321 C6.4099731,6.9193726,8.977478,5,12,5z"
                            fill="#F44336"
                          ></path>
                          <path
                            d="M23.8960571,13.5018311C23.9585571,13.0101929,24,12.508667,24,12 c0-0.8578491-0.093689-1.6931763-0.2647705-2.5H12v5h6.4862061c-0.5247192,1.3637695-1.4589844,2.5177612-2.6481934,3.319458 l4.0594482,3.204834C22.0493774,19.135437,23.5219727,16.4903564,23.8960571,13.5018311z"
                            fill="#2196F3"
                          ></path>
                          <path
                            d="M5,12c0-0.8434448,0.1568604-1.6483765,0.4302368-2.3972168L1.3858032,6.4098511 C0.5043335,8.0800171,0,9.9801636,0,12c0,1.9972534,0.4950562,3.8763428,1.3582153,5.532959l4.0495605-3.1970215 C5.1484375,13.6044312,5,12.8204346,5,12z"
                            fill="#FFC107"
                          ></path>
                          <path
                            d="M12,19c-3.0455322,0-5.6295776-1.9484863-6.5922241-4.6640625L1.3582153,17.532959 C3.3592529,21.3734741,7.369812,24,12,24c3.027771,0,5.7887573-1.1248169,7.8974609-2.975708l-4.0594482-3.204834 C14.7412109,18.5588989,13.4284058,19,12,19z"
                            fill="#00B060"
                          ></path>
                        </svg>
                        <span className="ml-2">Sign in with Google</span>
                      </button>
                      <button
                        className="flex items-center justify-center py-2 px-20 bg-white hover:bg-gray-200 focus:ring-blue-500 focus:ring-offset-blue-200 text-gray-700 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg mt-4"
                        type="button"
                      >
                        <svg
                          viewBox="0 0 30 30"
                          height="30"
                          width="30"
                          y="0px"
                          x="0px"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M25.565,9.785c-0.123,0.077-3.051,1.702-3.051,5.305c0.138,4.109,3.695,5.55,3.756,5.55 c-0.061,0.077-0.537,1.963-1.947,3.94C23.204,26.283,21.962,28,20.076,28c-1.794,0-2.438-1.135-4.508-1.135 c-2.223,0-2.852,1.135-4.554,1.135c-1.886,0-3.22-1.809-4.4-3.496c-1.533-2.208-2.836-5.673-2.882-9 c-0.031-1.763,0.307-3.496,1.165-4.968c1.211-2.055,3.373-3.45,5.734-3.496c1.809-0.061,3.419,1.242,4.523,1.242 c1.058,0,3.036-1.242,5.274-1.242C21.394,7.041,23.97,7.332,25.565,9.785z M15.001,6.688c-0.322-1.61,0.567-3.22,1.395-4.247 c1.058-1.242,2.729-2.085,4.17-2.085c0.092,1.61-0.491,3.189-1.533,4.339C18.098,5.937,16.488,6.872,15.001,6.688z"></path>
                        </svg>
                        <span className="ml-2">Sign in with Apple</span>
                      </button>
                    </div>
                  </div>
                  <div className="mt-5">
                    <button
                      className="py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </div>
                </form>
                <div className="flex items-center justify-between mt-4">
                  <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                  <a
                    className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline cursor-pointer"
                    onClick={() => setIsLogin(true)}
                  >
                    Already have account? Sign in
                  </a>
                  <span className="w-1/5 border-b dark:border-gray-400 md:w-1/4"></span>
                </div>
                
                {errors.length > 0 && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {errors.map((error, index) => (
                      <p key={index} className="text-sm">{error}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Design original para login
          <>
            <button className="auth-close" onClick={onClose}>
              ✕
            </button>

            <div className="auth-header">
              <h2>Entrar</h2>
              <p>Entre para acessar seus filmes favoritos</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onClick={clearErrors}
                  placeholder="seu@email.com"
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onClick={clearErrors}
                  placeholder="Sua senha"
                  disabled={isLoading}
                />
              </div>

              {errors.length > 0 && (
                <div className="error-messages">
                  {errors.map((error, index) => (
                    <p key={index} className="error-message">{error}</p>
                  ))}
                </div>
              )}

              <button 
                type="submit" 
                className="auth-submit"
                disabled={isLoading}
              >
                {isLoading ? 'Carregando...' : 'Entrar'}
              </button>
            </form>

            <div className="auth-switch">
              <p>
                Não tem uma conta?
                <button 
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                    setErrors([]);
                  }}
                  className="switch-button"
                  disabled={isLoading}
                >
                  Criar conta
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}