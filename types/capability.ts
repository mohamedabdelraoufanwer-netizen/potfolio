export type CapabilityGroup = {
  id: string
  label: string
  description: string
  skills: string[]
  color: string
  environmentReaction: 'design' | 'code' | 'motion' | 'three-d' | 'backend' | 'cms'
}
