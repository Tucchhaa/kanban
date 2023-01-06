# Kanban desk

In this project I didn't use any of the JavaScript libraries or frameworks. I used only TypeScript for typings.

This project can hardly bring any practical benefit, because it implements only the basic functions of the kanban board. Nevertheless, it was not created for this, but so that I could test myself and create a more or less complex application without frameworks.

I think it turned out well. I like the result and functionality of this Kanban board. Although I had to redesign the application architecture many times and carry out significant refactoring of the code with the expansion of functionality.

The architecture of the application is an MVC pattern (who would have thought?), but I think it is somewhat improved and optimized. Although I don't know exactly how well I used the concepts of MVC, since I found only such articles about MVC on the Internet, where an example was a flashlight application. In fact, for a slightly complex application, the architecture of "flashlight applications" is no good.

!["kanban desk screenshot"](https://github.com/Tucchhaa/kanban/blob/master/readme-images/kanban-preview.png?raw=true))

The full functionality of the application is as follows: dragging cards inside and between columns, creating/deleting/changing cards, creating/changing columns, dragging columns, scrolling columns when dragging a card to the edge, scrolling the board when dragging a column to the edge, scrolling the board by 'grabbing' it.