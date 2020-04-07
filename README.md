ideaKat is a web application to help team members share, organize, and prioritize their ideas.

It's currently being built to experiment with software development tools, UX/UI design, and DevOps.

https://ideakat.com/

# Tools used:
- Spring Boot (Spring JPA/Hibernate, Spring Security)
- React, Typescript, Webpack 
- PostgreSQL row level security for tenant data isolation
- Liquibase for schema version control
- AWS Elastic Beanstalk for hosting and S3 for image storage 

# WIP/future enhancements being considered:
- Auto-updating activity feed on the home page when logged in
- Scheduled email digest of user activity, possibly using serverless functions to avoid overloading the main web serverless
- Integrating a proper WYSIWYG text editor for user content to replace the current textareas
- Optimize pages for mobile
- Automate more of the AWS deployment

# Screenshots
![Groups](https://i.imgur.com/DKooIyf.png "Groups for different projects and themes")

![Group Discussions](https://i.imgur.com/3ranNOj.png "Groups can have multiple discussions, which can be \"pinned\" to prioritize")

![Ideas](https://i.imgur.com/P9K6UE4.png "Contribute ideas/comments to discussions")
