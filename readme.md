# Kanban desk
Here's the playground: https://tucchhaa.github.io/kanban/

In this project, I didn't use any of the JavaScript libraries or frameworks. I used only TypeScript for typing.

"Kanban" can hardly bring any practical benefit, because it implements only the basic functions of the kanban board. Nevertheless, it was not created for this, but so that I could test myself in developing complex applications without any frameworks.

I think it turned out well. I like the result and functionality of this Kanban board. Even though during development I had to redesign the application architecture many times and carry out significant refactoring of the code with the expansion of functionality, I learned a lot about how flexible and scalable architecture should look like.

The app architecture is designed based on the MVC pattern with some improvements. The thing that I am proud of about this app, is that I developed a powerful and reusable drag-and-drop algorithm from scratch which allows to change elements order with minimum DOM operations.
The full functionality of the application is as follows:

* dragging cards inside and between columns
* creating/deleting/editing cards
* creating/deleting/editing columns, dragging columns
* scrolling columns when dragging a card to the edge
* scrolling the board when dragging a column to the edge
* scrolling the board by 'grabbing' it.

!["kanban desk screenshot"](https://github.com/Tucchhaa/kanban/blob/master/readme-images/kanban-card-drag.png?raw=true)

!["kanban desk screenshot"](https://github.com/Tucchhaa/kanban/blob/master/readme-images/kanban-column-drag.png?raw=true)