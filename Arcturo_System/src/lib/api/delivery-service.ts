import { api, buildOrgUrl } from "./axios";

export interface DeliveryRegion {
  id: string;
  cidade: string;
  regiao: string;
  tipo: string;
  preco: number | string;
  createdAt: string;
}

export interface CreateDeliveryRegionPayload {
  cidade: string;
  regiao: string;
  tipo: string;
  preco: number;
}

export interface UpdateDeliveryRegionPayload extends Partial<CreateDeliveryRegionPayload> {}

export const getDeliveryRegions = async (): Promise<DeliveryRegion[]> => {
  const url = buildOrgUrl("/delivery");
  const response = await api.get(url);
  return response.data.data ?? [];
};

export const createDeliveryRegion = async (
  payload: CreateDeliveryRegionPayload
): Promise<DeliveryRegion> => {
  const url = buildOrgUrl("/delivery");
  const response = await api.post(url, payload);
  return response.data.data;
};

export const updateDeliveryRegion = async (
  id: string,
  payload: UpdateDeliveryRegionPayload
): Promise<DeliveryRegion> => {
  const url = buildOrgUrl(`/delivery/${id}`);
  const response = await api.put(url, payload);
  return response.data.data;
};

export const deleteDeliveryRegion = async (id: string): Promise<void> => {
  const url = buildOrgUrl(`/delivery/${id}`);
  await api.delete(url);
};
