# Driver Analysis API
All API requests are made to `https://driver-analysis.herokuapp.com/`

## Available endpoints

### /drivers
**[GET] to /**
```
Reponse: [
    "ROS",
    "HAM",
    "RIC",
    ...
]
```
### /events
**[POST] to /direct**
```
Request: {
    "target": "HAM",
    "competitor": "ROS",
    "year": "2015",
    "session": "Race"
}
Response: {
    "03_15Mel": 0,
    "03_29Sep": 1,
    "04_12Sha": 0,
    ...
}
```
**[POST] to /teammate**
```
Request: {
    "target": "HAM",
    "year": "2017",
    "session": "Race"
}
Response: {
    "03_26Mel": 0,
    "04_09Sha": 0,
    "04_16Bah": -1,
    ...
}
```
### /yearly
**[POST] to /direct**
```
Request: {
    "target": "HAM",
	  "competitor": "ROS"
}
{
    "2015": 8,
    "2016": 18,
    "2017": 0,
    "2018": 0,
    "2019": 0
}
```
**[POST] to /teammate**
```
Request: {
    "target": "HAM",
}
Response: {
    "2015": 8,
    "2016": 18,
    "2017": -29,
    "2018": -20,
    "2019": -47
}
```

## Points for improvemment
- Cumulative deltas for yearly endpoints should be replaced with percentage differences
- Endpoints should be added to proivde a list of available years and session types to remove hardcoding on frontend
