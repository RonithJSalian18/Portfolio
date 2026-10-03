import type { ReactNode } from 'react'
import { ZoneLife } from './ZoneLife'

export type Zone = 'reef' | 'open' | 'twilight' | 'deep'

/** One depth band of the ocean. Sections inside inherit its water colour and text tokens. */
export function OceanZone({ zone, children }: { zone: Zone; children: ReactNode }) {
  return (
    <div className={`zone zone-${zone}`} data-zone={zone}>
      <ZoneLife zone={zone} />
      {children}
    </div>
  )
}
