import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from './ui/button.jsx';

export function MaterialLink({ material }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full justify-start"
      onClick={() => window.open(material.dropbox_url, '_blank')}
    >
      <FileText className="mr-2 h-4 w-4" />
      <span className="flex-grow text-left">{material.title}</span>
      <span className="text-xs text-muted-foreground ml-2">{material.type}</span>
      <Download className="ml-2 h-4 w-4" />
    </Button>
  );
}