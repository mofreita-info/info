import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function CategoryCard({ category, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="bg-card p-6 border border-primary/20 hover:border-primary/40 transition-all">
        <h3 className="text-xl font-bold mb-2 golden-gradient">{category.title}</h3>
        <p className="text-muted-foreground">{category.description}</p>
      </Card>
    </motion.div>
  );
}