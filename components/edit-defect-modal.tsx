"use client"

import { useEffect, useState } from "react"
import { ICTDefect } from '@/types/defect';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export function EditDefectModal({ defect, isOpen, onClose, onUpdateDefect }: {
  defect: ICTDefect | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateDefect: (defect: ICTDefect) => void;
}) {
  const [editedDefect, setEditedDefect] = useState<ICTDefect | null>(null);

  useEffect(() => {
    setEditedDefect(defect);
  }, [defect]);

  if (!editedDefect) return null;

  const handleSubmit = () => {
    onUpdateDefect(editedDefect);
  };

  const handleChange = (key: string, value: string) => {
    setEditedDefect(prev => prev ? { ...prev, [key]: value } : null);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit ICT Defect - {defect?.id}</DialogTitle>
          <DialogDescription>
            Update the details for this defect. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
          {Object.keys(editedDefect).map((key) => {
            if (key === 'id' || key === 'timestamp') return null;
            return (
              <div className="grid grid-cols-4 items-center gap-4" key={key}>
                <label htmlFor={key} className="text-right capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </label>
                {key === 'severity' || key === 'status' || key === 'testResult' ? (
                  <Select
                    value={editedDefect[key as keyof typeof editedDefect] as string}
                    onValueChange={(value) => handleChange(key, value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={`Select ${key}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {key === 'severity' && <><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></>}
                      {key === 'status' && <><SelectItem value="open">Open</SelectItem><SelectItem value="in-progress">In Progress</SelectItem><SelectItem value="resolved">Resolved</SelectItem><SelectItem value="verified">Verified</SelectItem></>}
                      {key === 'testResult' && <><SelectItem value="pass">Pass</SelectItem><SelectItem value="fail">Fail</SelectItem><SelectItem value="warning">Warning</SelectItem></>}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={key}
                    value={editedDefect[key as keyof typeof editedDefect] as string}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="col-span-3"
                  />
                )}
              </div>
            )
          })}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
