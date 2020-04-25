const { google } = require('googleapis')

// Require oAuth2 from our google instance.
const { OAuth2 } = google.auth

// Create a new instance of oAuth and set our Client ID & Client Secret.
const oAuth2Client = new OAuth2(
  '542882267948-2mjaofr8lejftuamsind1kgda9hvf5hj.apps.googleusercontent.com',
  'nWQr5npqRq59fwae6QFV_3AO'
)

// Call the setCredentials method on our oAuth2Client instance and set our refresh token.
oAuth2Client.setCredentials({
  refresh_token: '1//04IeOwlxGi57yCgYIARAAGAQSNwF-L9IrBFaPri9I_k2Ty09OuQ3iaSuev5flW0-xRsrzUGZQhGHDeps9L2CQiQU91N7PQpAQzB8',
})


// Create a new calender instance.
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

// Create a new event start date instance for temp uses in our calendar.
async function addtoCalendar(email, eventdata) {
  const event = {
    'id': eventdata.id,
    'summary': eventdata.tilte,
    'location': eventdata.location,
    'description': eventdata.content,
    'start': {
      'dateTime': eventdata.startDate,
      'timeZone': 'Vietnam/Ha_Noi',
    },
    'end': {
      'dateTime': eventdata.dueDate,
      'timeZone': 'Vietnam/Ha_Noi',
    },
    'reminders': {
      'useDefault': true,
      'overrides': [
        { 'method': 'email', 'minutes': 24 * 60 },
        { 'method': 'popup', 'minutes': 3 * 60 },
      ],
    },
  };

  calendar.events.insert({
    calendarId: 'primary',
    resource: event,
  }, (err, res) => {
    if (res) {
      console.log(res);
    };
    if (err) {
      console.log(err);
    };
  })
}

async function updateCalendar(guestemail, eventdata) {

  calendar.events.get(
    {
      calendarId: 'primary',
      eventId: eventdata.id,
    }
  )
    .then(res => {
      let attendeesdataget = null;
      if (!res.data.attendees) {
        attendeesdataget = [{ 'email': guestemail }]
      } else {
        attendeesdataget = [...res.data.attendees, { 'email': guestemail }]
      }

      return attendeesdataget;
    })
    .then(attendees => {
      console.log('add attendees');
      const join = {
        'start': eventdata.startDate,
        'end': eventdata.dueDate,
        attendees
      };
      return calendar.events.update(
        {
          calendarId: 'primary',
          eventId: eventdata.id,
          resource: join
        }
      )
    })
    .then(console.log)
    .catch(console.log);

}


let event = {
  'id': '5e946a2a0b9dd53eb8f5f51a',
  'startDate': {
    'dateTime': '2020-04-28T09:00:00-07:00',
    'timeZone': 'America/Los_Angeles',
  },
  'dueDate': {
    'dateTime': '2020-04-28T17:00:00-07:00',
    'timeZone': 'America/Los_Angeles',
  },
}

updateCalendar('duc20022009@gmail.com', event).catch(console.log)
