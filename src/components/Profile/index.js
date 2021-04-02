import React, { Component } from 'react'
import stravaButton from '../../assets/btn_strava_connectwith_orange.svg'
import { Link } from 'react-router-dom'
import api from '../../utils/api'

const oauthUrl = "https://www.strava.com/oauth/authorize?client_id=62285&response_type=code&redirect_uri=https://amazing-jang-8a41ee.netlify.app/.netlify/functions/oauth-complete&approval_prompt=force&scope=activity:read_all"


class AuthButton extends Component {
  render() {
    if (this.props.isAuthenticated) {
      return (
        <button onClick={this.props.signout}>Sign out</button>
      )
    } else {
      return (
        <button onClick={this.props.authenticate}>Log in</button>
      )
    }
  }
}


export default class Profile extends Component {
    state = {
      groups: null
    }
    componentDidMount() {
      this.props.user.jwt().then((jwt) =>  {
        return api.readGroups(jwt)
      }).then((groups) => {
        this.setState({
          groups: groups
        })
      })
    }
    renderGroups() {
      const { groups } = this.state
      if(groups) {
        console.log(groups.data)
      }
      return (
        <div>
          {groups && (
             groups.data.map((group) => {
               const groupId = group.ref["@ref"].id
               return (
                 <Link to={`/${groupId}`}>
                   {group.data.name} - {group.data.weekly_target_km} km
                 </Link>
               )
             })
          )}
        </div>
      )
    }
    renderProfile() {
      const { profile } = this.props
      const stravaLinked = profile != null && profile.strava != null
      if (!profile) {
        return null
      }
      if (this.props.isAuthenticated) {
        if (stravaLinked) {
            return (
              <p>{"You have connected your Strava account "}
                <span className="strava-name">{profile.strava.data.athlete.firstname} {profile.strava.data.athlete.lastname}</span>
              </p>
            )
        } else {
            return (
              <a href={`${oauthUrl}&state=${this.props.user.email}`}>
                <img src={stravaButton} alt='log in with strava'/>
              </a>
            )
        }
      } else {
        return (null)
      }
    }
    render() {
      return (
        <div className="profile-card">
          <div>
            <br/>
            {this.props.user ? <h1>My Running Groups</h1> : null}
            <br/>
              {this.renderGroups()}
            <br/>
            <div>
              {this.renderProfile()}
            </div>
          </div>
          <div>
            {this.props.user ? <p>You are signed in as {this.props.user?.email}</p> : null}
            <AuthButton isAuthenticated={this.props.isAuthenticated} authenticate={this.props.authenticate} signout={this.props.signout}/>
          </div>
        </div>
    )
  }
}
