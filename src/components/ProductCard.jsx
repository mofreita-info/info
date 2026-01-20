import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus as WhatsappIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ProductCard({ product }) {
  const handleWhatsApp = () => {
    const message = `Olá! Gostaria de saber mais sobre o produto: ${product.name}`;
    window.open(`https://wa.me/+351913822833?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden bg-card border border-primary/20">
        <div className="relative">
          <img  
            className="w-full h-64 object-cover"
            alt={product.name}
           src="https://images.unsplash.com/photo-1675023112817-52b789fd2ef0" />
          <span className="absolute top-4 right-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm">
            Garantia 30 dias
          </span>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
          <p className="text-muted-foreground mb-4">{product.description}</p>
          <div className="space-y-2 mb-4">
            {product.details.map((detail, index) => (
              <p key={index} className="text-sm text-muted-foreground">• {detail}</p>
            ))}
          </div>
          <Button
            onClick={handleWhatsApp}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            <WhatsappIcon className="mr-2 h-4 w-4" />
            Consultar Disponibilidade
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}