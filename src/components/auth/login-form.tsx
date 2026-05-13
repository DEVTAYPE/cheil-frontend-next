"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "@/lib/auth";
import { loginSchema, type LoginInput } from "@/lib/schemas";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@cheil.pe",
      password: "Admin123!",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    const result = await login(data.email, data.password);
    if (result.success) {
      router.push("/productos");
      router.refresh();
    } else {
      setServerError(result.message ?? "Error al iniciar sesión");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Email"
        type="email"
        placeholder="admin@cheil.pe"
        error={errors.email?.message}
        autoComplete="email"
        {...register("email")}
      />
      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        autoComplete="current-password"
        {...register("password")}
      />
      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {serverError}
        </p>
      )}
      <Button type="submit" loading={isSubmitting} className="w-full">
        Iniciar sesión
      </Button>
    </form>
  );
}
