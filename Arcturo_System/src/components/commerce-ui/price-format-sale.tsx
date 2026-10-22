import { cn } from "@/lib/utils";

interface PriceFormatSaleProps {
  className?: string;
  classNameOriginalPrice?: string;
  classNameSalePrice?: string;
  classNameSalePercentage?: string;
  originalPrice: number;
  salePrice?: number;
  showSavePercentage?: boolean;
}

const PriceFormat_Sale = ({
  className,
  classNameOriginalPrice,
  classNameSalePrice,
  classNameSalePercentage,
  originalPrice,
  salePrice,
  showSavePercentage = false,
}: PriceFormatSaleProps) => {
  const isOnSale = salePrice !== undefined && salePrice < originalPrice;
  const savePercentage = isOnSale
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {isOnSale ? (
        <>
          <div className={cn("text-slate-500 line-through", classNameOriginalPrice)}>
            R$ {originalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
          <div className={cn("font-bold text-slate-900", classNameSalePrice)}>
            R$ {salePrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
          {showSavePercentage && savePercentage > 0 && (
            <div className={cn("bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs font-bold", classNameSalePercentage)}>
              {savePercentage}% OFF
            </div>
          )}
        </>
      ) : (
        <div className={cn("font-bold text-slate-900", classNameSalePrice)}>
          R$ {originalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </div>
      )}
    </div>
  );
};

export default PriceFormat_Sale;
