# ualibraries-libapps
University of Arizona Libraries customizations and workflows for Springshare/LibApps.

## Local Dev
Given that Springshare is a 3rd party app that uses text areas for adding HTML/CSS/JS, we don't have a good way of creating a true local development environment to test out changes prior to deploying them. To get around this, we use copies of live pages as static HTML files to test out HTML/CSS/JS changes.

The `/test` directory houses these files. This folder will be ignored from version control, as we don't need to actually track these in our git history--they are strictly for "local development".

List of test URLs:

**LibCal**
- https://libcal.library.arizona.edu/calendar (LibCal calendar)
- https://libcal.library.arizona.edu/calendar?cid=-1&t=g&d=0000-00-00&cal=-1&inc=0 (LibCal calendar as cards)
- https://libcal.library.arizona.edu/spaces (LibCal spaces)

**LibGuides**
- https://libguides.library.arizona.edu/library-guides (LibGuides home)
- https://libguides.library.arizona.edu/american-indian-studies (LibGuide item)
- https://libguides.library.arizona.edu/az/databases (LibGuides A-Z database)

**LibAnswers**
- https://ask.library.arizona.edu/ (LibAnswers home)
- https://ask.library.arizona.edu/search (LibAnswers search)
- https://ask.library.arizona.edu/ill_docdel_videostreaming/faq/303580 (LibAnswer item)


### Requirements
- You need to have `wget` installed on your machine
- If this is the first time you're running this project locally, you need to make the `.sh` file executable:
```sh
chmod +x local.sh
```

### Instructions
From the project root, run: 
```sh
./local.sh
```

