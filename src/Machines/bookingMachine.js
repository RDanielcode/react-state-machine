import { assign, createMachine } from 'xstate'
import { fetchCountries } from '../Utils/api'

const fillCountries = {
  initial: 'loading',
  states: {
    loading: {
      invoke: {
        id: 'getCountries',
        src: () => fetchCountries,
        onDone: {
          target: 'success',
          actions: assign({
            countries: (context, event) => event.data
          })
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: 'No se pudo realizar request'
          })
        }
      }
    },
    success: {},
    failure: {
      on: {
        RETRY: { target: 'loading' }
      }
    }
  }
}

const bookingMachine = createMachine({
  id: 'buy plane tickets',
  initial: 'initial',
  context: {
    passengers: [],
    selectedCountry: '',
    countries: [],
    error: ''
  },
  states: {
    initial: {
      on: {
        START: {
          target: 'search',
          actions: 'printStart'
        }
      }
    },
    search: {
      entry: 'printEntrySearch',
      exit: 'printExitSearch',
      on: {
        CONTINUE: {
          target: 'passengers',
          actions: assign({
            selectedCountry: (context, event) => event.selectedCountry
          })
        },
        CANCEL: 'initial'
      },
      ...fillCountries
    },
    passengers: {
      on: {
        DONE: {
          target: 'tickets',
          cond: 'atLeastOne'
        },
        CANCEL: {
          target: 'initial',
          actions: 'reset'
        },
        ADD: {
          target: 'passengers',
          actions: assign(
            (context, event) => context.passengers.push(event.newPassenger)
          )
        }
      }
    },
    tickets: {
      after: {
        5000: {
          target: 'initial',
          actions: 'reset'
        }
      },
      on: {
        FINISH: 'initial'
      }
    }
  }
},
{
  actions: {
    printStart: () => console.log('printStart'),
    printEntrySearch: () => console.log('printEntrySearch'),
    printExitSearch: () => console.log('printExitSearch'),
    reset: assign({
      selectedCountry: '',
      passengers: []
    })
  },
  guards: {
    atLeastOne: (context) => {
      return context.passengers.length > 0
    }
  }
}
)

export default bookingMachine
