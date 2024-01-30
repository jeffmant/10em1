import { createContext, useContext, useReducer } from "react"


type Action = { type: 'update', updatedDate: Date}
type Dispatch = (action: Action) => void
type State = { currentDate: Date }
type CurrentDateProviderProps = {children: React.ReactNode}

const CurrentDateStateContext = createContext<
  {state: State; dispatch: Dispatch} | undefined
>(undefined)

function currentDateReducer(state: State, action: Action) {
  switch (action.type) {
    case 'update': {
      return { currentDate: action.updatedDate }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function CurrentDateProvider({ children }: CurrentDateProviderProps) {
  const [state, dispatch] = useReducer(currentDateReducer, { currentDate: new Date() })

  const value = {state, dispatch}
  return (
    <CurrentDateStateContext.Provider value={value}>
      {children}
    </CurrentDateStateContext.Provider>
  )
}

function useCurrentDate() {
  const context = useContext(CurrentDateStateContext)
  if (context === undefined) {
    throw new Error('useCurrentDate must be used within a CurrentDateProvider')
  }
  return context
}

export { CurrentDateProvider, useCurrentDate }