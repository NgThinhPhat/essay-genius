import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api'; // adjust this import path based on your project structure
import { essayDetailSchema } from '@/constracts/essay.constract';

export function useGetEssay(id: string, enabled = true) {
  return useQuery({
    queryKey: ['essay', id],
    queryFn: async () => {
      const { status, body } = await api.essay.getEssay({ params: { id } });
      if (status !== 200) {
        throw new Error('Failed to fetch essay');
      }
      return essayDetailSchema.parse(body);
    },
    enabled: !!id && enabled,
  });
}
