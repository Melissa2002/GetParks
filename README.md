# Find Campsites Available
### Website Link
[https://melissa2002.github.io/GetParks/](https://melissa2002.github.io/GetParks/)

### Why?
Currently, National Parks Service only allows one campground to be viewed at a time. This can mean that during peak seasons it is most beneficial to move campsites within a park due to the lack of availability. 
However, this can be a time consuming process as some parks have over 5 campgrounds. It's a balancing act of maximizing consecutive nights, and it is easy to accidentally calculate the time 
frames when switching inbetween different websites.

As someone who loves to explore the outdoors, I started making this application because it was something that I could use!


<img src="https://github.com/user-attachments/assets/c4ae2ba9-cced-46fb-8397-fe90b1c519af" alt="drawing" width="45%"/>
<img src="https://github.com/user-attachments/assets/6f6439bb-b5aa-4c79-b64f-63c8b59db449" alt="drawing" width="45%"/>


### How to Use it
Please give it about 15 seconds to load the parks. Then, you can select, press submit, and in the console, the available days will be displayed for the current month.
The URL for an available campsite is also included.

### How?
NPS provides some [endpoints](https://www.nps.gov/subjects/developer/api-documentation.htm) which helped me get started, but a lot of the data I was looking for was
not included in their documentation. I used their API `"https://developer.nps.gov/api/v1/campgrounds` to figure out which parks had campgrounds to begin with. From there, 
there, it was a matter of inspecting their websites, and finding endpoints relevant; It was definitely more data than I had originally thought! Each campground has availability
linked to each of their campsites (sometimes 100+!). If I am searching for a period of 2 weeks, this means that I could be searching through up to 5000 data points in hopes
of finding the perfect split.

### Current Status
Most of the work getting the RESTful APIs is completed. The website has some basic functionality:
1. Park codes are availabile via a dropdown menu corresponding to the parks which currently offer camping using an NPS API which gets all campgrounds
2. A park can be selected to retrieve its data
3. The available days are shown in the console when submit is pressed along with a url to book

### Future Plans
1. Hiding the API Key - it can currently be seen publically which just means people could technically use it to make calls to NPS from my account. This is not a big security concern for me as that is all it is tied to, but it is bad practice to have it visible. I will likely utilize Github's secret manager and configure a yaml file in the upcoming weeks.
2. Updating the park upon a new selection.
3. Displaying available dates on the page instead of the console
4. Adding functionality to change the date range: right now it only looks at current month
5. Missing campgrounds: their API misses several popular campsite including 3 from Yosemite, so I will manually have to add them in
6. Prioritizing same campsite's URLs; booking consecutive days when possible
7. Code styling
8. Css Styling
