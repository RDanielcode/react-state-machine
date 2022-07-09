import React from 'react'
import './Tickets.css'

export const Tickets = ({ send, state }) => {
  const finish = () => {
    send('FINISH')
  }

  const { passengers } = state.context

  return (
    <div className='Tickets'>
      <p className='Tickets-description description'>Gracias por volar con book a fly 💚</p>
      <div className='Tickets-ticket'>
        <div className='Tickets-country'>{state.context.selectedCountry}</div>
        <div className='Tickets-passengers'>
          {passengers.map((passenger, idx) =>
            <p key={idx}>{passenger}</p>
          )}
          <span>✈</span>
        </div>
      </div>
      <button onClick={finish} className='Tickets-finalizar button'>Finalizar</button>
    </div>
  )
}
