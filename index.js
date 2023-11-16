const express = require('express')
const app = express()
const port = 3000
const AWS = require('aws-sdk');

AWS.config.update({ region: 'eu-central-1' })


const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' });




app.put('/newuser', (req, res) => {
    const body = req.body
    console.log("Body", body)

    docClient.put({
        TableName: 'test',
        Item: {
            id: "999",
            user_id: 'first',
            //timestamp is the primary key
            timestamp: 3,
            title: 'The Secret',
            content: 'Book'
        }
    }, (err, data) => {
        if (err) {
            console.log(err);
            res.send('Error Hello world')
        } else {
            console.log(data);
            res.send('Hello World!')
        }
    });

})

app.get('/profile', (req, res) => {
    const userId = req.query.id
    docClient.get({
        TableName: 'test',
        Key: {
            'id': String(userId)
        }
    }, (err, data) => {
        if (err) {
            console.log(err);
            res.send('Error Hello world')
        } else {
            console.log(data);
            res.json(data)
        }
    });
})

app.get('/shopping', (req, res) => {
    res.json({ user: { name: "Max" } })
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})