import { z } from 'zod';

export const contactLeadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  message: z.string().min(10).max(2000),
});
