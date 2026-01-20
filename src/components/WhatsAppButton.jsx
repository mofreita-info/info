import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus as WhatsappIcon } from "lucide-react";

export function WhatsAppButton({ product, className }) {
  const { t } = useTranslation();
  
  const handleWhatsApp = () => {
    const message = `${t("whatsapp.greeting")}\n\n` +
      `${t("whatsapp.interested")}: ${t(product.translationKey)}\n` +
      `${t("whatsapp.price")}: €${product.price}\n\n` +
      `${t("whatsapp.question")}`;
      
    window.open(`https://wa.me/+351913822833?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Button
      variant="outline"
      onClick={handleWhatsApp}
      className={`bg-green-500 text-white hover:bg-green-600 ${className}`}
    >
      <WhatsappIcon className="h-4 w-4 mr-2" />
      {t("buttons.whatsapp")}
    </Button>
  );
}