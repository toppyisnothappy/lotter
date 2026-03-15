import { z } from "zod"

export const customerFormSchema = z.object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().optional(),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    line_id: z.string().optional(),
    total_balance: z.coerce.number().min(0, "Balance cannot be negative").default(0),
})

export type CustomerFormValues = z.infer<typeof customerFormSchema>
