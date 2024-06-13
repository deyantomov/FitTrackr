# FitTrackr

## 1. About the Project
FitTrackr is a comprehensive application designed to help you track your fitness progress, create and view exercises, set goals, and socialize with friends. Leveraging the Fitbit Web API, FitTrackr seamlessly integrates with Fitbit devices to extract and display fitness data with ease.

### [Hosted by MongoDB - https://fittrackr-rnylmjz.mongodbstitch.com]("https://fittrackr-rnylmjz.mongodbstitch.com") 

## 2. Key Features
- **Ease of Use and User Interface Simplicity**: A clean, user-friendly interface designed to make tracking your fitness journey straightforward and enjoyable.
- **Seamless Fitbit Integration**: Connect your Fitbit profile to sync data effortlessly, allowing you to monitor your fitness metrics in one place.
- **Goal Setting and Achievement Tracking**: Set fitness goals and track your progress. Celebrate milestones and stay motivated throughout your fitness journey.
- **Exercise Management**: Create, view, and manage your exercises. Tailor your workouts to meet your specific fitness needs.
- **Social Features**: Connect with friends, share your progress, and support each other in reaching fitness goals.

## 3. Tech Stack
- **Frontend**: React, Tailwind CSS + Daisy UI, HeroIcons, Realm Web SDK
- **Backend**: Realm, MongoDB Atlas
- **Database**: MongoDB

## 4. Installation

### Prerequisites
- Node.js
- npm

### Clone the Repository
```sh
git clone https://github.com/deyantomov/FitTrackr.git
cd fittrackr
```

### Add the Atlas configuration strings in the root folder of the project, in a file named "atlasConfig.json"
```json
{
  "appId": "fittrackr-rnylmjz",
  "appUrl": "https://services.cloud.mongodb.com/groups/665ed036590d040b2cdaa937/apps/666474754ea2916cab58563e",
  "baseUrl": "https://services.cloud.mongodb.com",
  "clientApiBaseUrl": "https://eu-central-1.aws.services.cloud.mongodb.com",
  "dataApiBaseUrl": "https://eu-central-1.aws.data.mongodb-api.com",
  "dataExplorerLink": "https://cloud.mongodb.com/links/665ed036590d040b2cdaa937/explorer/Cluster0-FitTrackr/database/collection/find",
  "dataSourceName": "mongodb-atlas"
}
```

### Install dependencies
```sh
npm install
```

## 5. Run the project

### Start a development or LAN server
```sh
npm run dev | npm run lan
```

## 6. Deployment

### Build the project
```sh
npm run build
```
