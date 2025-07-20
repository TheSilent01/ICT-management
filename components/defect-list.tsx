'use client'

import { useEffect, useState } from 'react'

export default function DefectList() {
  const [defects, setDefects] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/defects')
      .then(res => res.json())
      .then(data => setDefects(data.data))
  }, [])

  return (
    <div className="space-y-2">
      {defects.map(defect => (
        <div key={defect.id} className="p-3 border rounded-lg">
          <div className="flex justify-between">
            <span className="font-medium">{defect.id}</span>
            <span className={`px-2 py-1 text-xs rounded-full ${defect.status === 'open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {defect.status}
            </span>
          </div>
          <p className="text-sm">{defect.defectType}</p>
          <p className="text-xs text-gray-500">{new Date(defect.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}
