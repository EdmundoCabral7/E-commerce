import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDeliveryRegions,
  createDeliveryRegion,
  updateDeliveryRegion,
  deleteDeliveryRegion,
  CreateDeliveryRegionPayload,
  UpdateDeliveryRegionPayload,
} from "@/lib/api/delivery-service";

export const useDeliveryRegions = () =>
  useQuery({ queryKey: ["delivery"], queryFn: getDeliveryRegions });

export const useCreateDeliveryRegion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDeliveryRegionPayload) => createDeliveryRegion(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["delivery"] }),
  });
};

export const useUpdateDeliveryRegion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDeliveryRegionPayload }) =>
      updateDeliveryRegion(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["delivery"] }),
  });
};

export const useDeleteDeliveryRegion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDeliveryRegion(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["delivery"] }),
  });
};
