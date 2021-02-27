import React, { Component } from 'react'
import AppHeader from './components/AppHeader'
import api from './utils/api'
import isLocalHost from './utils/isLocalHost'
import './App.css'

export default class App extends Component {
  state = {
    activities: []
  }
  componentDidMount() {

    // Fetch all activities
    api.readAll().then((activities) => {
      if (activities.message === 'unauthorized') {
        if (isLocalHost()) {
          alert('FaunaDB key is not unauthorized. Make sure you set it in terminal session where you ran `npm start`. Visit http://bit.ly/set-fauna-key for more info')
        } else {
          alert('FaunaDB key is not unauthorized. Verify the key `FAUNADB_SERVER_SECRET` set in Netlify enviroment variables is correct')
        }
        return false
      }

      console.log('all activities', activities)
      this.setState({
        activities: activities
      })
    })
    api.readLeaderboard().then((leaderboard) => {
      console.log('leaderboard', leaderboard)
      this.setState({
        leaderboard: leaderboard
      })
    })
  }
  renderActivities() {
    const { activities } = this.state

    if (!activities || !activities.length) {
      // Loading State here
      return null
    }

    return activities.map((activity, i) => {
      const { data } = activity
      return (
        <div key={i} className='activity-item'>
          <label className="activity">
            <div className='activity-list-title'>
	      {data.name}
            </div>
          </label>
        </div>
      )
    })
  }
  renderLeaderboard() {
    const { leaderboard } = this.state

    if (!leaderboard || !leaderboard.length) {
      // Loading State here
      return null
    }
    return leaderboard.map((athlete, i) => {
      const content = athlete.name + " (" + athlete.points + ")"
      return (
        <div key={i} className='leaderboard-row'>
          <label className="athlete-row">
            <div className='athlete-list-name'>
              {content}
            </div>
          </label>
        </div>
      )
    })
  renderWeeklyLeaderboardTable() {
    const { leaderboard } = this.state

    if (!leaderboard || !leaderboard.length) {
      // Loading State here
      return null
    }

    return leaderboard.map((athlete, index) => {
       return (
         <tr key={id}>
            <td>{id}</td>
            <td>{name}</td>
            <td>{distance}</td>
            <td>{city}</td>
         </tr>
       )
    })
    return leaderboard.map((athlete, i) => {
      const content = athlete.name + " (" + athlete.points + ")"
      return (
        <div key={i} className='leaderboard-row'>
          <label className="athlete-row">
            <div className='athlete-list-name'>
              {content}
            </div>
          </label>
        </div>
      )
    })
	  
  }
	  
  renderWeeklyLeaderboard() {
    return (
      <table id='weekly-leaderboard'>
        <tbody>
          {this.renderWeeklyLeaderboardTable()}
        </tbody>
      </table>
    )
  }	
  render() {
    return (
      <div className='app'>
        <AppHeader />
	<div>
	  <h1 classname='weekly-leaderboard-title'>THIS WEEK</h1> 
          <div className='leaderboard-list'>
            {this.renderWeeklyLeaderboard()}
          </div>
        </div>
        <div>
	  <h1 classname='leaderboard-title'>Recent Activities</h1> 
          <div className='activity-list'>
            {this.renderActivities()}
          </div>
        </div>
	<div>	    
	  <h1 classname='leaderboard-title'>Leaderboard</h1>
          <div className='leaderboard'>
            {this.renderLeaderboard()}
          </div>
        </div>	    
      </div>
    )
  }
}

