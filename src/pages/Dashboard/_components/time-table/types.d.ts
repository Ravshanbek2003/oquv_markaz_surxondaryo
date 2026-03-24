import {Group} from '@/types/group'
import {Room} from '@/types/room'

export type Props = {
  groups?: Group[]
  rooms?: Room[]
  isLoading?: boolean
  isStudentGroups?: boolean
}

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6