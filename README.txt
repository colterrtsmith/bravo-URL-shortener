URL shortener by Colter Smith

This a simple URL shortener.  The frontend is in React and
runs on localhost:3000.  It can be started with 'npm start'.
The backend is in Node and runs on localhost:3001.  It can
be started with 'npm start'

To get started:
1. start the front and back ends
2. Go to localhost:3000
3. enter a URL into the 'Shorten a URL' box and click 'Shorten'.
   You should get a 6 character short URL
4. At the bottom of the page, click 'See URLs'.  You should see your
   long URL with its corresponding short URL and '0 visits', indicating
   that this URL hasn't been visited
5. go to 'localhost:3001/(your short URL)' - you should be redirected
   to your long URL
6. Click 'See URLs' again.  The number of visits should have increased
   to 1
7. Type your short URL into the 'Delete a shortened URL' box and click
   'Delete'
8. Click 'See URLs' again.  Your shortened URL should be gone 