# Webscraping

This folder contains scripts that scrape [Courses @ Brown](https://cab.brown.edu/) and
[Critical Review](https://thecriticalreview.org/) pages using Selenium and BeautifulSoup. Scraped data from these
scripts can be found in the `../server/data` folder.

### Required Installations
In order to run these scrapers, be sure to install the following:

* Selenium (`pip install selenium` in Terminal)
* BeautifulSoup (`pip install beautifulsoup4` in Terminal)
* Pandas (`pip install pandas` in Terminal)  
* ChromeDriver (installation details can be found 
  [here](https://sites.google.com/a/chromium.org/chromedriver/downloads))
  
### Setup
There is no setup needed (beyond the above installations) for the C@B scraper, as C@B does not require users to log
in before viewing all courses. However, since the Critical Review is only available for Brown students, you will need
to use your Brown cookie to run the Critical Review scraper.

These instructions work best for Google Chrome, but the steps should be similar on other browsers:

1. Open [the Critical Review](https://thecriticalreview.org/) and log in to your Brown account (you may need to search
   for a course to do so). Be sure to complete the two-factor authentication as well.
2. Open Developer Tools and go to the "Application" tab. On the left side of the DevTools window, find "Storage."
   Under that section, open the dropdown for Cookies and select "https://thecriticalreview.org"
3. Find the cookie named "connect.sid" and copy the value.
4. Create a new Python file in this folder called `cookies.py` and add the following code:
```python
COOKIES = {"Critical Review": <YOUR COOKIE HERE>}
```