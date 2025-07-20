export interface ICTDefect {
  id: string;
  timestamp: string;
  operator: string;
  defectType: string;
  component: string;
  partNumber: string;
  pin: string;
  testStation: string;
  boardSerial: string;
  status: 'open' | 'in-progress' | 'resolved' | 'verified';
  severity: 'low' | 'medium' | 'high';
  rootCause: string;
  assignedTo: string;
  comment?: string;
  suggestion?: string;
  resolvedDate?: string;
  department?: string; // Added department field
  pinExplanation?: string;
  testResult?: 'pass' | 'fail' | 'warning';
}
