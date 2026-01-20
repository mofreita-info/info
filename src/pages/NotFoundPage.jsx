import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Página Não Encontrada</h2>
        <p className="text-muted-foreground mb-8">
          A página que você está procurando não existe.
        </p>
        <Button onClick={() => navigate('/')} size="lg">
          <Home className="mr-2 h-5 w-5" />
          Voltar ao Início
        </Button>
      </div>
    </div>
  );
}