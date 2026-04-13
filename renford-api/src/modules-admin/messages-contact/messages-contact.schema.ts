import { z } from 'zod';

export const contactMessageIdParamsSchema = z.object({
  messageId: z.string().uuid(),
});
