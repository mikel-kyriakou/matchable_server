## Matchable

# Description
This is the server side of the project Matchabl. 
Inside Onwer folder you will find code for serving information to the owners app AdminHub. The same way you will find code serving information to user android app in the User folder

# Server
Both servers are implemented using Node and express. They are separated in microservices and each microservice has route file, service file and controller file. 
All microservices use the same db.js to have access to the database, located in the shared folder in each server(Owner and User).

# Admin Hub
The webpage has static data because we couldn't connect the webpage with the server. So the following information is if the data was dynamic. To view the pages that owner would have access to open
Owner/public folder.
