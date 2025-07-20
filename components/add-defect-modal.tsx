"use client"

import { useState } from "react"
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
import { ICTDefect } from "@/types/defect"

export function AddDefectModal({ isOpen, onClose, onAddDefect }: {
  isOpen: boolean
  onClose: () => void
  onAddDefect: (defect: Omit<ICTDefect, 'id' | 'timestamp'>) => void
}) {
  const [newDefect, setNewDefect] = useState<Omit<ICTDefect, 'id' | 'timestamp'>>({
    operator: "",
    defectType: "",
    component: "",
    partNumber: "",
    pin: "",
    testStation: "",
    boardSerial: "",
    comment: "",
    suggestion: "",
    pinExplanation: "",
    severity: "low",
    status: "open",
    testResult: "fail",
    rootCause: "",
    assignedTo: "",
  });

  const handleSubmit = () => {
    onAddDefect(newDefect);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New ICT Defect</DialogTitle>
          <DialogDescription>
            Enter the details for the new defect. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
          {Object.keys(newDefect).map((key) => (
            <div className="grid grid-cols-4 items-center gap-4" key={key}>
              <label htmlFor={key} className="text-right capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              {key === 'severity' || key === 'status' || key === 'testResult' ? (
                <Select
                  value={newDefect[key as keyof typeof newDefect]}
                  onValueChange={(value) => setNewDefect({ ...newDefect, [key]: value })}
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
                  value={newDefect[key as keyof typeof newDefect]}
                  onChange={(e) => setNewDefect({ ...newDefect, [key]: e.target.value })}
                  className="col-span-3"
                />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Save Defect</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
