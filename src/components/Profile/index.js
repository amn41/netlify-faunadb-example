import React, { Component } from 'react'
import stravaButton from '../../assets/btn_strava_connectwith_orange.svg'
import { Link } from 'react-router-dom'
import { Typography, TextField, Input, Table, TableBody, TableRow, TableCell, IconButton } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import { withStyles } from '@material-ui/core/styles'
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

const MuiTableCell = withStyles({
  root: {
    borderBottom: "none",
  }
})(TableCell)



export default class Profile extends Component {
    state = {
      groups: null,
      newGroupName: "Running Buds",
      newGroupTarget: 10,
    }
    constructor(props) {
      super(props)
      this.handleChangeName = this.handleChangeName.bind(this)
      this.handleChangeTarget = this.handleChangeTarget.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
    }
    renderGroups() {
      const { groups } = this.props
      if(groups) {
        console.log(groups.data)
      }
      return (
      	<Table>
      	  <TableBody>
            {groups && (
               groups.data.map((group, index) => {
                 const groupId = group.ref["@ref"].id
                 return (
                   <TableRow key={index}>
                     <MuiTableCell>
                       <Link to={`/${groupId}`}>
                         <Typography variant="h2">
                           {group.data.name} - {group.data.weekly_target_km} km
                         </Typography>
                       </Link>
		     </MuiTableCell>
		     <MuiTableCell>
                       <IconButton onClick={() => this.handleRequestDelete(groupId, group.data.name)} aria-label="delete">
                         <DeleteIcon />
                       </IconButton>
		     </MuiTableCell>
                   </TableRow>
                 )
               })
            )}
          </TableBody>
        </Table>
      )
    }
    handleRequestDelete(groupId, name) {
      const shouldDelete = confirm(`Do you really want to delete the group ${name}? This cannot be undone`) // eslint-disable-line
      if (shouldDelete) {
      	this.props.user.jwt().then((jwt) =>  {
      	  return api.deleteGroup(jwt, groupId)
      	})
      }
    }
    handleChangeName(event) {
      this.setState({newGroupName: event.target.value}) 
    }
    handleChangeTarget(event) {
      this.setState({newGroupTarget: event.target.value})
    }
    handleSubmit() {
      const { newGroupName, newGroupTarget } = this.state
      event.preventDefault() // eslint-disable-line
      this.props.user.jwt().then((jwt) =>  {
        return api.createGroup(jwt, newGroupName, newGroupTarget)
      })
    }
    renderCreateGroup() {
      if (this.props.isAuthenticated) {
      	return (
      	 <>
      	 	 {"Create a new group"}
      	   <br/>
      	   <br/>
      	 	 <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
      	 	   <TextField value={this.state.newGroupName} onChange={this.handleChangeName} label="group name" />
      	 	   <TextField value={this.state.newGroupTarget} onChange={this.handleChangeTarget} label="weekly target km" />
      	     <Input type="submit" value="Create Group"/>
      	 	 </form>
      	  </>
      	)      
      } else {
        return null
      }
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
            {this.props.user ? <Typography variant="h1">{"I'm Running With"}</Typography> : null}
            <br/>
              {this.renderGroups()}
              {this.renderCreateGroup()}
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
