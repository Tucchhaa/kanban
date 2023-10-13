# Kanban desk

You can play with project here: https://tucchhaa.github.io/kanban/

In this project I didn't use any of the JavaScript libraries or frameworks. I used only TypeScript for typings.

This project can hardly bring any practical benefit, because it implements only the basic functions of the kanban board. Nevertheless, it was not created for this, but so that I could test myself in creating complex application without any frameworks.

I think it turned out well. I like the result and functionality of this Kanban board. Even though during development I had to redesign the application architecture many times and carry out significant refactoring of the code with the expansion of functionality, I learned a lot of how flexible and scalable architerture should look like.

The app architecture is designed based on MVC pattern with some improvements. The thing that I am really proud of about this project, is that I developed powerful and reusable drag-and-drop algorithm from scratch which allows to change elements order with minimum DOM operations.  

The full functionality of the application is as follows: 

* dragging cards inside and between columns
* creating/deleting/editing cards
* creating/deleteing/editing columns, dragging columns
* scrolling columns when dragging a card to the edge
* scrolling the board when dragging a column to the edge
* scrolling the board by 'grabbing' it.

!["kanban desk screenshot"](https://github.com/Tucchhaa/kanban/blob/master/readme-images/kanban-card-drag.png?raw=true)

!["kanban desk screenshot"](https://github.com/Tucchhaa/kanban/blob/master/readme-images/kanban-column-drag.png?raw=true)