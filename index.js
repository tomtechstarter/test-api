const express = require('express')
const app = express()
const AWS = require('aws-sdk');
const winston = require('winston')
const WinstonCloudWatch = require('winston-cloudwatch');
const cors = require('cors')

const port = 5000

// Use for development
app.use(cors())



// Read env variables
const { AWS_REGION, LOG_GROUP, LOG_STREAM, DYNAMODB_TABLE } = process.env
AWS.config.update({ region: AWS_REGION })

// Init CloudWatch for Metrics
const cloudwatch = new AWS.CloudWatch();

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

// Helper Functions
const publishNewUserMetric = (userId) => {
    try {
        const params = {
            MetricData: [
                {
                    MetricName: 'NewUser',
                    Dimensions: [
                        {
                            Name: 'UserId',
                            Value: userId
                        }
                    ],
                    Timestamp: new Date(),
                    Unit: 'Count',
                    Value: 1
                },
            ],
            Namespace: 'UserNamespace' // Example namespace
        };

        cloudwatch.putMetricData(params, (err, data) => {
            if (err) {
                console.error('Error putting metric data:', err);
            } else {
                console.log('Successfully put metric data:', data);
            }
        });
    } catch (e) {
        logger.error('Failed to Publish CloudWatch Metrics', e)
    }
}


// GET Requests
app.get('/profile', async (req, res) => {

    try {
        const userId = req.query?.id
        const input = {
            TableName: DYNAMODB_TABLE,
            Key: {
                'id': String(userId)
            }
        }
        const data = await docClient.get(input).promise()

        res.json(data)

    } catch (e) {
        logger.error('Failed to get Profile', e)
        res.send(e)
    }

})

app.get('/test', (req, res) => {
    try {
        res.json({ user: { name: "Max" } })
    } catch (e) {
        console.log(e)
    }
})

// PUT
app.put('/newuser', async (req, res) => {
    try {
        const body = JSON.parse(req.body)

        const input = {
            TableName: DYNAMODB_TABLE,
            Item: body
        }

        const data = await docClient.put(input).promise();

        
        res.json(data)
    } catch (e) {
        logger.error(e)
        res.send(e)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})