Title: Inspiration Cloud

URL: /messages

Method:
GET | POST | DELETE | PATCH

Data Params:

{
  "message": "New message"
}

Success Response:
Code: 200
Content: { 
  id: 12,
  message: "New message"
}

Error Response: 
Code: 400 
Content: { error: "Missing Message In Request Body }

Code: 404
Content: { error: "Message Not Found }

Sample Call:
const options = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    }
  fetch(https://fierce-coast-06372.herokuapp.com/api/messages, options)
      .then(res => {
        if(!res.ok) {
          return res.json().then(error => {
            throw error
          })
        }
        return res.json()
      })
      .then(messages => {
        this.setState({
          messages: messages
        })
      })
      .catch(error => {
        console.error(error)
      })


Routes: 

Technology Used:
NODE.js, Express.js, Postgresql, Chai, Supertest
