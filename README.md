# sas-conversation-designer-frictionless-cx
This use case demonstrates how a conversational interface, based on SAS Conversation Designer, can help customers encounter a smooth experience while returning their purchases.

# Smooth Customer Journeys @ eCalico
_eCalico is a fictional retailer.  This demonstration was also used for the SAS Global Forum 2021 General Session : Technology Connect._

## Why should you care?

Successful organizations consistently explore means to improve Customer Satisfaction and Loyalty.  
Taking Retail as an example, recent changes in customer shopping behavior, due to the pandemic, have led to increased online shopping and consequently increased returned purchases.  
Therefore, organizations need to ensure smooth customer experiences while handling returns, and at the same time, make optimal decisions to keep reverse logistics costs at a minimum.   

## Top three messages this demo provides : 

1. **Conversational AI helps ensure smooth and frictionless customer journeys**; an example using online returns is shown in this demo. 
2. Conversational AI also facilitates using **analytics along the customer journey in order to take decisions** which bring optimal results for both organizations and their customers.
3. The analytics involved in multi-disciplinary in nature, thus necessitating the use of **composite AI** orchestrated through intelligent decision management systems. 

![Frictionless customer journeys @ eCalico](/ppt/Top_3_eCalico.jpg)

## Running the demo

### Pre-requisites
1. A SAS Viya 4 server (version 2021.1.1 monthly, 2021.1 LTS or later preferred )
2. Configure Cross-Origin Resource Sharing (CORS) on your Viya server so that it can accept requests from the domain hosting this application. Instructions can be found on the [SAS.com developer site](developer.sas.com).
3. Import the [chatbot](/bot/eCalicoBotPackage.json) used in this example to the server. You have an option of using other chatbots too, if you like to (and this is encouraged). 
4. A web server application to serve eCalico's website. This demo uses [NodeJs](https://nodejs.org/en/download/) to run the server (at least version 12 recommended).  
5. Update [globals.js](/javascript/globals.js) with the following : 
```
const baseURL = "<your Viya server name>";
const botId = "<your bot id - check FAQs to find out bot ID>";
const revisionId = "<your revision id - usually latest>";
const authToken = "<Access token; prefix with Bearer >";
const userId = "<your user id>";
const userName = "<your user name>";
const connectorName = "<some name to indicate where you are calling the bot from, e.g. main website>";
```

### Running the application

1. Clone this repository to your target environment of choice.
2. Navigate to the main directory (patikobotapp) and run 
```
npm install
``` 
3. Once installation is complete, run
```
node patikobotapp
```
You should receive the following message : 
```
Running. Visit: http://localhost:3000
```


# Notes

<mark>
This example has been built over the SAS Conversation Designer sample connector available at GitHub.  SAS has released an exciting new [client-side SDK component](https://github.com/sassoftware/conversation-designer-sdk) which makes the task of creating a bot application even easier (initial release May 2021).  This example will soon reflect a future enhancement of the client-side SDK once it is ready.  
</mark>


1. Check out "Code to add" section on line 47 of camera.js.  This is the place where you can re-purpose this app to do something (hint: run a CV model to recognize the dress) to what you upload.
2. Line 53 of camera.js starts the camera.  I prefer to start it when the page loads, but you may like to call it at an appropriate stage.
3. Change all bot related parameters @ globals.js
4. Page can be accessed either from localhost:3000 or localhost:3000/ecalico. 
5. Additional HTML elements such as triggering the camera / layout of the main page etc. are just **suggested** additional elements the user can integrate a chatbot with, and are not to be considered part of any offering from SAS.  To emphasize, **this is an example.**


## Contributing

We welcome your contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to submit contributions to this project. 

## License

This project is licensed under the [Apache 2.0 License](LICENSE).

## Additional Resources

[SAS Conversation Designer Documentation](https://go.documentation.sas.com/?cdcId=cdesignercdc&cdcVersion=default&docsetId=cdesignerwlcm&docsetTarget=home.htm&locale=en)

# FAQ

## What do the values in globals.js mean?
- baseURL - this value points to the base url of your SAS environment (ex: if SAS Conversation Designer was deployed to http://yourcompany.com/SASConversationDesigner, then set this value to http://yourcompany.com)
- botId - this is the unique identifier for the bot you want the connector to communicate with (ex: e3b1f772-1562-4c8c-a60e-1ee20684ce4b)
- revisionId - this is the unique identifier for the bot revision within your bot that the connector will communicate with; this could be a delegate value (ex: @published, @latest) or the UUID (ex: aa1e4567-e89b-12d3-a456-426614158700)
- authToken - the authentication token used to communicate with your SAS environment

For more information about authentication and how to obtain a token see the following:

- [SAS REST APIs: Authentication & Authorization](https://developer.sas.com/reference/auth)
- [Authentication to SAS Viya: a couple of approaches](https://blogs.sas.com/content/sgf/2019/01/25/authentication-to-sas-viya/)
- [Building custom apps on top of SAS Viya](https://blogs.sas.com/content/tag/build-custom-app/)

Other values in `javascript/chat.js` that can be changed to better reflect your connector and the user using it:

- userId - the user id of the user interacting with the bot
- userName - the user name of the user interacting with the bot
- connectorName - the name of the connector displayed in the bot history view


## How do I find the botId for my bot?
The most common way to find the botId for a bot is using the Natural Language Conversations API (ex: if SAS Conversation Designer was deployed to http://yourcompany.com/SASConversationDesigner, then the base URL for the API would typically be http://yourcompany.com/naturalLanguageConversations). Once you have found the base URL, you can then call GET on the bots endpoint (ex: http://yourcompany.com/naturalLanguageConversations/bot). This will return a list of all bots that currently exist and you search the list for your bot. Once you find it the botId value is shown as 'id'. 

Here is an example:

    {
    ...
    "items": [
      {
      "id": "7d3137bf-c306-4127-b513-3e3ab816d125",
      "createdBy": "sas",
      "creationTimeStamp": "2020-08-31T14:19:36.136Z",
      "modifiedBy": "sas",
      "modifiedTimeStamp": "2020-08-31T14:19:36.276Z",
      "name": "My bot",
      ...

The 'id' value (ex: 7d3137bf-c306-4127-b513-3e3ab816d125) should be used as the botId mentioned above. 

## How do I find the revisionId for my bot?
There are three options for revisionId:

- @published - (recommended) this value points to the published version of your bot, then each time a new bot version is published, the connector automatically updates to use the most recently published bot version
- @latest - this value points to the latest/draft version of your bot, then each time a new bot latest/draft is created, the connector automatically updates to use the new latest/draft bot version
- specific revision id - this value points to a specific version the bot and will not change as versions are published or created

To find a specific revision id, follow the above instructions on how to get the botId. Then you can use the API to get access to all of the revisions available for a bot. This can be done by calling GET on the revisions endpoint (ex: http://yourcompany.com/naturalLanguageConversations/bot/{botId}/revisions). This will return a list of all revisions that currently exist for your bot. Then find the revision you are interested in and the revision value is shown as 'id'.

Here is an example:

    {
    ...
    "items": [
      {
      "id": "e09881bb-3206-4d73-a9c0-a6280202c188",
      "createdBy": "sas",
      "creationTimeStamp": "2020-08-31T14:19:36.136Z",
      "modifiedBy": "sas",
      "modifiedTimeStamp": "2020-08-31T14:19:36.276Z",
      "name": "My best revision",
      ...

The 'id' value (ex: e09881bb-3206-4d73-a9c0-a6280202c188) should be used as the botId mentioned above. 
