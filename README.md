# NEWS Aggregator API
It is a restful api with mongodb , The user authentication and authorization is done via JWT token.
# End points
POST /register: Register a new user.

POST /login: Log in a user.

GET /preferences: Retrieve the news preferences for the logged-in user.

PUT /preferences: Update the news preferences for the logged-in user.

GET /news: Fetch news articles based on the logged-in user's preferences.
