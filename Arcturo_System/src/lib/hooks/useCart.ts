import { useCartStore } from "@/lib/store/useCartStore";
import { useUserStore } from "@/lib/store/useUserStore";
import { Product } from "@/lib/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addItemToCartAPI, getCartAPI, removeItemFromCartAPI, updateItemQuantityAPI } from "../api/cart-service";
import { toast } from "sonner";

export const useCartSync = () => {
  const cartStore = useCartStore();
  const { isAuthenticated } = useUserStore();

  useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const data = await getCartAPI();
      const serverItems: { productId: string; quantity: number; product: Product }[] = data?.items ?? [];

      // Substituir o estado do Zustand pelo estado autoritativo do servidor
      cartStore.clearCart();
      serverItems.forEach(({ product, quantity }) => {
        for (let i = 0; i < quantity; i++) cartStore.addItem(product);
      });

      return data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60,
  });
};

export const useCart = () => {
  const cartStore = useCartStore();
  const { isAuthenticated } = useUserStore();
  const queryClient = useQueryClient();

  const addItemMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      addItemToCartAPI(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {}
  });

  const removeItemMutation = useMutation({
    mutationFn: (productId: string) => removeItemFromCartAPI(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      // Falhou — força refetch para restaurar o estado correto do servidor
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.error("Erro ao remover item do carrinho.");
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      updateItemQuantityAPI(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  });

  const addItem = (product: Product, quantity: number = 1) => {
    cartStore.addItem(product);
    toast.success("Produto adicionado ao carrinho!", {
      description: product.name ?? product.title,
      icon: undefined,
    });

    if (isAuthenticated) {
      addItemMutation.mutate({ productId: product.id, quantity });
    }
  };

  const removeItem = (productId: string) => {
    cartStore.removeItem(productId);
    if (isAuthenticated) {
      removeItemMutation.mutate(productId);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    cartStore.updateQuantity(productId, quantity);
    if (isAuthenticated) {
      updateQuantityMutation.mutate({ productId, quantity });
    }
  };

  return {
    items: cartStore.items,
    totalItems: cartStore.totalItems(),
    totalPrice: cartStore.totalPrice(),
    clearCart: cartStore.clearCart,
    addItem,
    removeItem,
    updateQuantity,
    isSyncing: addItemMutation.isPending || removeItemMutation.isPending || updateQuantityMutation.isPending,
  };
};
