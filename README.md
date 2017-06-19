# 11_course_rating_API_project

In this project, you’ll create a REST API using Express. The API will provide a way for users to review educational courses: users can see a list of courses in a database; add courses to the database; and add reviews for a specific course.

To complete this project, you’ll use your knowledge of REST API design, Node.js, and Express to create API routes, along with Mongoose and MongoDB for data modeling, validation, and persistence.

Prerequisites:
- How to Install MongoDB on a Mac - http://treehouse.github.io/installation-guides/mac/mongo-mac.html
- How to Install MongoDB on Windows - http://treehouse.github.io/installation-guides/windows/mongo-windows.html
- Postman for testing routes: https://www.getpostman.com/ - import CourseAPI.postman_collection.json

# Install & run
- Run npm install
- Run nodemon OR npm run devstart for dev mode OR
- Run npm start

# Project Instructions

1. Install Mongoose
2. Create models
  User
    _id (ObjectId, auto-generated)
    fullName (String, required)
    emailAddress (String, required, must be unique and in correct format)
    password (String, required)
  Course
    _id (ObjectId, auto-generated)
    user (_id from the users collection)
    title (String, required)
    description (String, required)
    estimatedTime (String)
    materialsNeeded (String)
    steps (Array of objects that include stepNumber (Number), title (String, required) and description (String, required) properties)
    reviews (Array of ObjectId values, _id values from the reviews collection)
  Review
    _id (ObjectId, auto-generated)
    user (_id from the users collection)
    postedOn (Date, defaults to “now”)
    rating (Number, required, must fall between “1” and “5”)
    review (String)
3. Validate. See http://mongoosejs.com/docs/validation.html for more information.
4. Seed your database with data.
  We've provided you with seed data in JSON format (see the src/data/data.json file) to work with the mongoose-seeder npm package.
  See https://github.com/SamVerschueren/mongoose-seeder for documentation on how to use mongoose-seeder.
5. Create the user routes
  Set up the following routes (listed in the format HTTP VERB Route HTTP Status Code):
    GET /api/users 200 - Returns the currently authenticated user
    POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
6. Create the course routes
  Set up the following routes (listed in the format HTTP VERB Route HTTP Status Code):
    GET /api/courses 200 - Returns the Course "_id" and "title" properties
    GET /api/course/:courseId 200 - Returns all Course properties and related documents for the provided course ID
  When returning a single course for the GET /api/courses/:courseId route, use Mongoose population to load the related user and reviews   documents.
    POST /api/courses 201 - Creates a course, sets the Location header, and returns no content
    PUT /api/courses/:courseId 204 - Updates a course and returns no content
    POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related         course, and returns no content
7. Update any POST and PUT routes to return Mongoose validation errors.
    Use the next function in each route to pass any Mongoose validation errors to Express’s global error handler
    Send the Mongoose validation error with a 400 status code to the user
8. Update the User model to store the user's password as a hashed value.
  For security reasons, we don't want to store the password property in the database as clear text.
  Create a pre save hook on the user schema that uses the bcrypt npm package to hash the user's password.
  See https://github.com/ncb000gt/node.bcrypt.js/ for more information.
9. Create an authentication method on the user model to return the user document based on their credentials
    Create a static method on the user schema that takes an email, password, and callback
    The method should attempt to get the user from the database that matches the email address given.
    If a user was found for the provided email address, then check that user's password against the password given using bcrypt.
    If they match, then return the user document that matched the email address
    If they don't match or a user with the email given isn’t found, then pass an error object to the callback
10. Set up permissions to require users to be signed in
    Postman will set an Authorization header with each request when a user is signed in.
11. Add a middleware function that attempts to get the user credentials from Authorization header set on the request.
    You can use the basic-auth npm package to parse the `Authorization' header into the user's credentials.
    Use the authenticate static method you built on the user schema to check the credentials against the database
    If the authenticate method returns the user, then set the user document on the request so that each following middleware function       has access to it.
    If the authenticate method returns an error, then pass it to the next function
12. Use this middleware in the following routes:
  POST /api/courses
  PUT /api/courses/:courseId
  GET /api/users
  POST /api/courses/:courseId/reviews

# Extra Credit

13. Review model
  Validation added to prevent a user from reviewing their own course
14. User routes
  Tests have been written for the following user stories:
  When I make a request to the GET route with the correct credentials, the corresponding user document is returned
  When I make a request to the GET /api/courses/:courseId route with the invalid credentials, a 401 status error is returned
15. Course routes
  When returning a single course for the GET /api/courses/:id route, use Mongoose deep population to load only the fullName of the related user on the course model and the review models. See the Project Resources section for more information about deep population.
