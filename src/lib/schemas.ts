import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const categoriaSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "Máximo 100 caracteres"),
  descripcion: z.string().optional(),
});
export type CategoriaInput = z.infer<typeof categoriaSchema>;

export const productoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(200, "Máximo 200 caracteres"),
  descripcion: z.string().optional(),
  precio: z
    .number({ error: "Debe ser un número" })
    .positive("Debe ser mayor a 0"),
  stock: z
    .number({ error: "Debe ser un número" })
    .int()
    .min(0, "No puede ser negativo"),
  categoriaId: z
    .number({ error: "Selecciona una categoría" })
    .int()
    .positive("Selecciona una categoría"),
});
export type ProductoInput = z.infer<typeof productoSchema>;
