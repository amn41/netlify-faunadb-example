/* Import faunaDB sdk */
const faunadb = require('faunadb')
const getGroupAthletes = require('./utils/getGroupAthletes')
const q = faunadb.query
const formatISO = require('date-fns/formatISO')
const startOfWeek = require('date-fns/startOfWeek')


exports.handler = (event, context) => {
  const groupId = event.queryStringParameters.groupId
  console.log('Function `activities-read-group` invoked for group with id', groupId)
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  }) 
  const startTime = formatISO(startOfWeek(new Date(), {weekStartsOn: 1}))
  return getGroupAthletes(context, groupId)
    .then((athleteIds) => { 
      return (
      	client.query(
      	  q.Map(
      	    q.Filter(
      	      q.Paginate(q.Match(q.Index("all_activities_by_time"))),
      	      q.Lambda(
      	        ["date", "ref"],
      	        q.And(
      	          q.GTE(
      	            q.ToTime( q.Select(["data", "start_date"], q.Get(q.Var("ref")))),
      	            q.Time(startTime)
      	          ),
      	          q.ContainsValue(
      	            q.Select(["data", "athlete", "id"], q.Get(q.Var("ref"))),
      	            athleteIds
      	          )
      	        )
      	      )
      	    ),
      	    q.Lambda(["date", "ref"], q.Get(q.Var("ref")))
      	  ) 
        )
      )
    }).then((response) => {
        return {
          statusCode: 200,
          body: JSON.stringify(response)
        }
    }).catch((error) => {
      console.log('error', error)
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      }
    })
}
