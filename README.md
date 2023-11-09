## Injury Tracking System

### Tech Stack Used - 
- Next Js
- Chakra UI
- Auth0
- Next-Auth
- GraphQL
- Apollo Server
- Netlify
- Prisma
- Supabase Postgress (Database)

### Features Attempted - 

- [x] User Authentication with Auth0
- [x] Users can add injury Report
- [x] Users can view reports added by them
- [x] Users can filter reports based on start and end date
- [x] Search report based on body parts and content of the report
- [x] Users are able to sort reports by body part, content, date of creation
- [x] Body Map
- [x] Label Body Part 
- [x] Automatic Location Detection

### File Structure - 

  - graphql - contains all the mutation and graphql queries
  - prisma/schema - contains schemas of all the tables
  - prisma/db - Creation of a single Prisma client 
  - src/app/api/auth/[...nextauth] - Next auth and auth0 authentication code
  - src/app/api/graphql - Appolo server code. Contains queries and endpoints to adduser, addreport and for other functionalities.
  - src/app/components - Contains Component such as Navbar, BodyMap etc that are used in pages.
  - src/app/components/BodyMap - Contains bodymap compoenent and automatic location detection logic
  - src/app/view - View reports page
  - src/app/add - Add reports page
  - src/utils/theme.js - configure default chakra-ui theme
  - src/utils/avatar.js - code to genrate random avatar.
  
