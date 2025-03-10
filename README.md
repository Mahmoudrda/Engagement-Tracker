# Engagement Tracker X Google Tag Manager

## Description
The Engagement Tracker Package is a tool for monitoring user interactions on a webpage by tracking various DOM events, including clicks, scrolls, and other engagement signals. It collects data on user behavior to help analyze interaction patterns. The package is injected into the webpage using Google Tag Manager’s custom template APIs, ensuring seamless integration without modifying the site’s core code.

## Features
- **Click Tracking**: Monitors clicks on links and distinguishes between internal and outbound links.
- **Scroll Tracking**: Tracks vertical and horizontal scrolling and reports when specific thresholds are reached.
- **Download Tracking**: Detects file downloads based on specified file extensions.
- **Video Tracking** : Tracks HTML5 and YouTube video events.

## Google Tag Manager Integration
This package is injected into the site using GTM custom template APIs. Follow these steps to set it up:  

1. **Install GTM** – Add the GTM container code to the site by following [Google’s official documentation](https://support.google.com/tagmanager/answer/14847097?hl=en&ref_topic=15191151&sjid=1094127409334264094-EU).  
2. **Add the template** – Import the template by either:  
   - Downloading the `template.tpl` file and importing it into an empty template.  
   - Adding the template directly to the container from the GTM Template Gallery.  
3. **Create a tag** – Set up a new tag using the template and select the event to track from the template UI.  
4. **Publish changes** – Apply the updates in the workspace. The template will then use GTM’s `dataLayer` to track events.  
5. **Configure event tracking** – Create `dataLayer` custom event triggers and variables to send the events to analytics platforms like Google Analytics 4.


