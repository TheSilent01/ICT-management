"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, FileSpreadsheet, FileJson } from 'lucide-react';

export type ExportFormat = 'csv' | 'xlsx' | 'pdf';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: ExportFormat) => void;
}

export function ExportModal({ isOpen, onClose, onExport }: ExportModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Defect Data</DialogTitle>
          <DialogDescription>
            Select the format you want to export the data in.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          <Button variant="outline" onClick={() => onExport('csv')}>
            <FileText className="h-5 w-5 mr-2" />
            CSV
          </Button>
          <Button variant="outline" onClick={() => onExport('xlsx')}>
            <FileSpreadsheet className="h-5 w-5 mr-2" />
            Excel (XLSX)
          </Button>
          <Button variant="outline" onClick={() => onExport('pdf')}>
            <FileJson className="h-5 w-5 mr-2" />
            PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
