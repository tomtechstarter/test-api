const express = require('express')
const app = express()
const port = 3000
const AWS = require('aws-sdk');
const winston = require('winston')
const WinstonCloudWatch = require('winston-cloudwatch');

// Read env variables
const { AWS_REGION, LOG_GROUP, LOG_STREAM, DYNAMODB_TABLE } = process.env
AWS.config.update({ region: AWS_REGION })

// Logger
const logger = new winston.createLogger({
    format: winston.format.json(),
    transports: [
        new (winston.transports.Console)({
            timestamp: true,
            colorize: true,
        })
    ]
});

logger.add(new WinstonCloudWatch({
    awsRegion: AWS_REGION,
    cloudWatchLogs: new AWS.CloudWatchLogs(),
    logGroupName: LOG_GROUP,
    logStreamName: LOG_STREAM
}));
app.use((req, res, next) => {
    logger.log('info', `Requesting ${req.method} ${req.originalUrl}`, { tags: 'http', additionalInfo: { body: req.body, headers: req.headers } });
    next()
})

// Initialize DB Client
const docClient = new AWS.DynamoDB.DocumentClient({ region: AWS_REGION });


// GET Requests
app.get('/profile', (req, res) => {
    const userId = req.query.id
    docClient.get({
        TableName: DYNAMODB_TABLE,
        Key: {
            'id': String(userId)
        }
    }, (err, data) => {
        if (err) {
            logger.error(err);
            res.send(`Failed to fetch data with id ${userId}`)
        } else {
            res.json(data)
        }
    });
})

app.get('/shopping', (req, res) => {
    res.json({ user: { name: "Max" } })
})

// PUT
app.put('/newuser', (req, res) => {
    const body = JSON.parse(req.body)

    docClient.put({
        TableName: DYNAMODB_TABLE,
        Item: body
    }, (err, data) => {
        if (err) {
            logger.error(err)
            res.send('Failed to add Item')
        } else {
            res.json(body)
        }
    });

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})