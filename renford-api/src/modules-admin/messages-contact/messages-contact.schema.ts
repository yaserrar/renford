import { z } from 'zod';

export const contactMessageIdParamSchema = z.object({
  params: z.object({ messageId: z.string().uuid() }),
});
