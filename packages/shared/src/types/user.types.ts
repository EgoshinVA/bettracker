import { UserRole } from '../enums/user-role.enum'
import { SubscriptionStatus } from '../enums/subscription-status.enum'

/** Public user profile — never contains password */
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  isEmailVerified: boolean
  subscriptionStatus: SubscriptionStatus
  subscriptionExpiresAt: string | null
  createdAt: string
  updatedAt: string
}
