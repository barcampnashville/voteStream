vote
====

OS voting system

## meeting0
200 attendees
24 sessions total capacity
morning and afternoon sessions - this should be functional, not UI
iBeacon - pop schedule with room; track no. of people
## session characteristics
  session title
  speaker
  description
  categories x 2
##categories: 2 each session; 15 total
  all
  code
  content
  creative enterprise
  design
  gear
  infrastructure
  life hacks
  marketing
  mobile
  social
  social enterprise
  start up
  ux/ia
  other
##5 votes total
  1 per session
  ranking/positioning
  chose all 5, submit at once
  cart?
  real time graphs
  revoke a vote
##rooms??
  large
  medium
  2 small
##group members
  Peter Hiemmelreich
  Chuck Bryant
  Bart Renner
  Thomas Vaughn
  Ben Stucki
  Hakan Tunc
  Erin Page
  Beat Zenerino
  Calvin Froedge
##event
  create event, add sessions
  same instance = multiple events
##start with a config file
  name
  number of votes
  list of sessions: title speaker description
##path to logo
  filter
##components
  interface
  backend
  programming
##interface
  organize screens
  presentation
##backend
  store votes
  rest api
  hook in drupal site
##programming
  integrate interface - angularJS
  frontend framework
  CSV file export - sessions
  hosting - c panel, unix
##realtime display of votes as they appear
##display schedule in application??
  add room/time
##rooms are assigned manually
  size
  number of votes
  time
input size of rooms
  no. of rooms
##wrap iOS app around web app
node, python, php
mock Json for session data
graph-d3 over sockets


## Run voting app

node app.js


## Start front end for development

cd public/

python -m SimpleHTTPServer 3001 (any http server will work)

Go to http://locahost:3001

## REST API

### Post New Item: ./api/items/new
curl -X POST -H "Content-Type: application/json" -d '{
  "id": "vsa",
  "title": "Voting System App",
  "people": ["Calvin Froedge", "Ben Stucki", "Hakan", "Thomas", "Beat", "Paul"],
  "description": "Sometimes Colors Dance in Realtime"
  }' http://localhost:9000/api/items/new