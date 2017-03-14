# Chapter 10
[(Heroku project)](https://dry-everglades-93919.herokuapp.com/)

;-; missed deadline, got annoyed at bug, and currently trying to perform AWS CPR. Database is going to swap back to mlab if this isn't fixed in the next few minutes. Also, noticed there was a problem with my previous heroku app repo that was causing content to not push, so I made a new one.


Features implemented;
* **site structure**
   * Structure has become a true SPA
   * Pages are now dynamically injected using Angular
   * More complex angular intergration; routing is now fully Angular
   * AngularUI added for modal
* **aesthetic design**
   * URLs no longer have #
   * Modal added for enhanced user experience when submitting review
   * User should no longer see any raw error codes, ever.

**Screenshot**
***

![N|Solid](http://i.imgur.com/bj0jtcu.png)

***

# Chapter 9
[(Heroku project)](https://nameless-hollows-66274.herokuapp.com/)

Chapter 9 was smooth sailing until I encountered a problem with uglify- After a few hours of grappling, I decided to compare dif between the code in the book, and the code in app_client; I was unable to spot a difference, but this fixed the problem. Manually typing each section was definitely helping with the concepts I was learning, but it clearly had some issues. From this point forward, I compared everything I typed directly to the source code to ensure I was not making any mistakes.

Features implemented;
* **site structure**
   * Routing changed from Express to Angular
   * Angular controllers added + uglified
   * Angular filters and directives added- also uglified
   
   
**Screenshot**
***

![N|Solid](http://i.imgur.com/xQh9KHm.png)

***

# Chapter 8
[(Heroku project)](https://nameless-hollows-66274.herokuapp.com/)

Chapter 8 was dependency hell for me until I switched machines. Over 5 hours straight of banging my head on the keyboard to find out it was a problem with node.

Features implemented;
* **site structure**
   * Angular setup
   * Simple Angular data binding implemented
   * Fixed GeoNear
   
**Screenshot**
***

![N|Solid](http://i.imgur.com/NOAn9Nc.png)

***

# Chapter 7
[(Heroku project)](https://nameless-hollows-66274.herokuapp.com/)

A few mistakes I made in chapter 6 really killed this one for me, I had a lot of difficulty with bug fixing. I'm probably going to start double-checking my work with the repo from the book after I write it out, as error checking can be quite complex when the returned exceptions have no obvious connection to their source (a missing / was murdering me for an entire hour)

Features implemented;
* **site structure**
    * Views are now 100% loaded dynamically
    * GET and POST requests are functional for reviews, and locations

**Screenshot**
***
![N|Solid](http://i.imgur.com/uP3lqcm.png)

***

# Chapter 6
[(Heroku project)](https://nameless-hollows-66274.herokuapp.com/)

This was the chapter that I pushed my first commit on. It was fairly difficult to get to this point, as there were several discrepancies between what code worked and what code was in the book. Nevertheless, I finished up to this chapter extremely quickly and then got complacent with my lead on the work, leading to serious scheduling problems later.

The features that were implemented at this time are as follows;
* **site structure**
    * Set up basic MEAN structure
    * Set up basic routing for dynamic content
    * Dynamic page loading using the database/jade views
    * HTTP methods implemented in router
    * REST API Implemented
* **Database**
    * Implemented data models for reviews and locations
    * Set up both local and remote databases
* **Aesthetic design**
    * Jade views for the following pages
        * Home page
        * About
        * Location info
    * Added bootstrap theme

**Screenshot**
***
![N|Solid](http://i.imgur.com/ujd6N4i.png)
