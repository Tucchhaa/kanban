System.register("types", ["helpers"], function (exports_1, context_1) {
    "use strict";
    var helpers_1, Column, Card;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (helpers_1_1) {
                helpers_1 = helpers_1_1;
            }
        ],
        execute: function () {
            Column = class Column {
                constructor(name) {
                    this.name = name;
                    this.cards = [];
                    this.id = helpers_1.generateID(Column.name);
                }
            };
            exports_1("Column", Column);
            Card = class Card {
                constructor(name) {
                    this.id = helpers_1.generateID(Card.name);
                    this.name = name;
                }
            };
            exports_1("Card", Card);
        }
    };
});
System.register("helpers", [], function (exports_2, context_2) {
    "use strict";
    var noop, processClasses, concatClasses, isObject, isArray, isDeepEqual, clone, hasVerticalScroll, hasHorizontalScroll, generateID, focusEndOfContenteditable, trim;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            exports_2("noop", noop = () => { });
            // Classes
            exports_2("processClasses", processClasses = (classes) => {
                if (classes) {
                    return typeof (classes) === 'string' ? [classes] : classes;
                }
                return [];
            });
            exports_2("concatClasses", concatClasses = (classes1, classes2) => {
                return [...processClasses(classes1), ...processClasses(classes2)];
            });
            // Object comparison
            exports_2("isObject", isObject = (object) => object !== null && typeof (object) === 'object');
            exports_2("isArray", isArray = (object) => Array.isArray(object));
            exports_2("isDeepEqual", isDeepEqual = (a, b) => {
                if (typeof (a) !== typeof (b) || isArray(a) !== isArray(b))
                    return false;
                else if (isObject(a)) {
                    const keys1 = Object.keys(a);
                    const keys2 = Object.keys(b);
                    if (keys1.length !== keys2.length)
                        return false;
                    for (let key of keys1) {
                        const value1 = a[key];
                        const value2 = b[key];
                        if (!isDeepEqual(value1, value2))
                            return false;
                    }
                    return true;
                }
                return a === b;
            });
            exports_2("clone", clone = (value, inc = 0) => {
                if (inc > 10)
                    debugger;
                if (isArray(value)) {
                    return value.map((item) => clone(item));
                }
                else if (isObject(value) && value instanceof HTMLElement === false) {
                    const result = {};
                    for (const key in value)
                        result[key] = clone(value[key], inc + 1);
                    return result;
                }
                else {
                    return value;
                }
            });
            // Scroll
            exports_2("hasVerticalScroll", hasVerticalScroll = (element) => {
                return element.clientHeight < element.scrollHeight;
            });
            exports_2("hasHorizontalScroll", hasHorizontalScroll = (element) => {
                return element.clientWidth < element.scrollWidth;
            });
            // Others
            exports_2("generateID", generateID = (prefix = "") => {
                return prefix + `__id${Math.floor(Math.random() * Date.now())}`;
            });
            exports_2("focusEndOfContenteditable", focusEndOfContenteditable = (contentEditableElement) => {
                let range = document.createRange();
                range.selectNodeContents(contentEditableElement);
                range.collapse(false);
                let selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            });
            exports_2("trim", trim = (value) => value.trim().replace(/\s\s+/g, ' '));
        }
    };
});
System.register("base/idisposable", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("base/event-emitter", [], function (exports_4, context_4) {
    "use strict";
    var EventEmitter;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            // ===
            EventEmitter = class EventEmitter {
                constructor() {
                    this.events = {};
                    this.onAnyListeners = [];
                    this.onceListeners = {};
                }
                on(event, listener) {
                    if (!this.events[event])
                        this.events[event] = [];
                    this.events[event].push(listener);
                    return this;
                }
                once(event, listener) {
                    if (!this.events[event])
                        this.events[event] = [];
                    this.events[event].push(listener);
                    // ===
                    if (!this.onceListeners[event])
                        this.onceListeners[event] = [];
                    this.onceListeners[event].push(listener);
                    return this;
                }
                onAny(listener) {
                    this.onAnyListeners.push(listener);
                    return this;
                }
                onMany(events, listener) {
                    for (const event of events) {
                        if (!this.events[event])
                            this.events[event] = [];
                        this.events[event].push(listener);
                    }
                    return this;
                }
                unsubscribe(event, listener) {
                    this.events[event] = this.events[event].filter(_listener => _listener !== listener);
                    return this;
                }
                emit(event, ...param) {
                    var _a, _b;
                    for (let i = 0; i < this.onAnyListeners.length; i++) {
                        const listener = this.onAnyListeners[i];
                        listener(event, ...param);
                    }
                    for (let i = 0; i < ((_a = this.events[event]) === null || _a === void 0 ? void 0 : _a.length); i++) {
                        const listener = this.events[event][i];
                        listener(...param);
                    }
                    // delete once listeners
                    for (const onceListener of ((_b = this.onceListeners[event]) !== null && _b !== void 0 ? _b : [])) {
                        this.events[event] = this.events[event].filter(listener => listener !== onceListener);
                    }
                }
                clear() {
                    // this.events = {};
                    // this.onAnyListeners = [];
                    // this.onceListeners = {};
                }
            };
            exports_4("EventEmitter", EventEmitter);
        }
    };
});
System.register("base/state", ["helpers", "base/component-module"], function (exports_5, context_5) {
    "use strict";
    var helpers_2, component_module_1, BaseState;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (helpers_2_1) {
                helpers_2 = helpers_2_1;
            },
            function (component_module_1_1) {
                component_module_1 = component_module_1_1;
            }
        ],
        execute: function () {
            BaseState = class BaseState extends component_module_1.ComponentModule {
                constructor(defaultOptions, options, subscribedControllers = []) {
                    super();
                    this.options = helpers_2.clone(Object.assign({}, defaultOptions, options));
                    this.changes = [];
                    this.subscribedControllers = subscribedControllers;
                }
                getOptions() {
                    return this.options;
                }
                update(updatedOptions) {
                    this.changes = [];
                    this.updateRecursively(this.options, updatedOptions);
                    this.callStateChanged(this.changes);
                }
                updateByKey(key, value) {
                    const path = key.split('.');
                    if (!path.length)
                        throw new Error(`Invalid argument: key - ${key}`);
                    const updatedOptions = this.createUpdatedOptionsByPath(path, value);
                    this.update(updatedOptions);
                }
                updateBy(func) {
                    const updatedOptions = helpers_2.clone(this.options);
                    func(updatedOptions);
                    this.update(updatedOptions);
                }
                // ===
                callStateChanged(changes) {
                    for (const change of changes) {
                        for (const controller of this.subscribedControllers) {
                            this.getRequiredController(controller.name).stateChanged(change);
                        }
                    }
                }
                updateRecursively(options, updatedOptions, path = "") {
                    if (helpers_2.isArray(options)) {
                        if (!helpers_2.isDeepEqual(options, updatedOptions)) {
                            const newValue = helpers_2.clone(updatedOptions);
                            this.changes.push({
                                name: path,
                                previousValue: helpers_2.clone(options),
                                value: newValue,
                                state: this
                            });
                            options.splice(0, options.length, ...newValue);
                        }
                    }
                    else if (helpers_2.isObject(options)) {
                        for (const key in updatedOptions) {
                            if (!options.hasOwnProperty(key))
                                throw new Error(`No such property: '${key}' in ${this.constructor.name}`);
                            const currentValue = options[key];
                            const newValue = updatedOptions[key];
                            const fullName = path ? `${path}.${key}` : key;
                            if (helpers_2.isObject(currentValue))
                                this.updateRecursively(currentValue, newValue, fullName);
                            else if (currentValue !== newValue) {
                                this.changes.push({
                                    name: fullName,
                                    previousValue: currentValue,
                                    value: newValue,
                                    state: this
                                });
                                options[key] = newValue;
                            }
                        }
                    }
                }
                createUpdatedOptionsByPath(path, value) {
                    const key = path.shift();
                    return path.length === 0 ?
                        { [key]: value } :
                        { [key]: this.createUpdatedOptionsByPath(path, value) };
                }
            };
            exports_5("BaseState", BaseState);
        }
    };
});
System.register("base/component", ["base/component-module", "base/event-emitter"], function (exports_6, context_6) {
    "use strict";
    var component_module_2, event_emitter_1, BaseComponent;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (component_module_2_1) {
                component_module_2 = component_module_2_1;
            },
            function (event_emitter_1_1) {
                event_emitter_1 = event_emitter_1_1;
            }
        ],
        execute: function () {
            BaseComponent = class BaseComponent {
                constructor(name, stateType, viewType, container, options) {
                    this.states = {};
                    this.controllers = {};
                    if (!container) {
                        throw new Error(`${name}Component container is not defined`);
                    }
                    this._name = name;
                    this._container = container;
                    this.eventEmitter = new event_emitter_1.EventEmitter();
                    // === Create state
                    this._state = this.createComponentModule(() => new stateType(options));
                    this.registerState(() => this._state);
                    // === Create view
                    this._view = this.createComponentModule(() => new viewType());
                    this.eventEmitter.on('render', () => {
                        this.clear();
                        this.render();
                    });
                }
                // ===
                extendView(viewExtenderFactory) {
                    const viewExtender = this.createComponentModule(viewExtenderFactory);
                    this._view.extendView(viewExtender);
                }
                render() {
                    this._view.render();
                }
                clear() {
                    this._view.clear();
                    for (const controllerName in this.controllers) {
                        const controller = this.controllers[controllerName];
                        controller === null || controller === void 0 ? void 0 : controller.clear();
                    }
                    this.eventEmitter.clear();
                }
                // === GETTERS
                get name() {
                    return this._name;
                }
                get container() {
                    return this._container;
                }
                get view() {
                    return this._view;
                }
                get state() {
                    return this._state;
                }
                // === CREATE COMPONENT MODULE
                beforeCreateComponentModule() {
                    const componentProps = {
                        componentName: this._name,
                        getContainer: () => this.container,
                        eventEmitter: this.eventEmitter,
                        getController: this.getController.bind(this),
                        getRequiredController: this.getRequiredController.bind(this),
                        getState: this.getState.bind(this),
                        getRequiredState: this.getRequiredState.bind(this),
                        state: this.state,
                        view: this.view
                    };
                    component_module_2.ComponentModule.startCreatingComponent(componentProps);
                }
                afterCreateComponentModule() {
                    component_module_2.ComponentModule.endCreatingComponent();
                }
                createComponentModule(createFunc) {
                    this.beforeCreateComponentModule();
                    const module = createFunc();
                    this.afterCreateComponentModule();
                    return module;
                }
                // === Controller
                registerController(controllerFactory, name) {
                    const controller = this.createComponentModule(controllerFactory);
                    name = name !== null && name !== void 0 ? name : controller.constructor.name;
                    if (this.controllers[name])
                        throw new Error(`Controller with ${name} is already registered`);
                    this.controllers[name] = controller;
                }
                getController(name) {
                    return this.controllers[name];
                }
                getRequiredController(name) {
                    const controller = this.controllers[name];
                    if (!controller)
                        throw new Error(`getRequiredController: controller \'${name}\' is not registered`);
                    return controller;
                }
                // === State
                registerState(stateFactory, name) {
                    const state = this.createComponentModule(stateFactory);
                    name = name !== null && name !== void 0 ? name : state.constructor.name;
                    if (this.states[name])
                        throw new Error(`State with ${name} is already registered`);
                    this.states[name] = state;
                }
                getState(name) {
                    return this.states[name];
                }
                getRequiredState(name) {
                    const state = this.states[name];
                    if (!state) {
                        throw new Error(`getRequiredState: state \'${name}\' is not registered`);
                    }
                    return state;
                }
            };
            exports_6("BaseComponent", BaseComponent);
        }
    };
});
System.register("base/render-elements.manager", [], function (exports_7, context_7) {
    "use strict";
    var RenderElementsManager;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [],
        execute: function () {
            RenderElementsManager = class RenderElementsManager {
                constructor() {
                    this.elements = {};
                    this.currentElementKey = "";
                }
                get currentElement() {
                    return this.elements[this.currentElementKey];
                }
                create(element) {
                    const { key } = element;
                    if (this.elements[key])
                        throw new Error(`Render error: Render elements must have unique names. Repating name: ${key}`);
                    this.elements[key] = element;
                }
                render(elementKey, components) {
                    this.currentElementKey = elementKey;
                    this.clearElement(elementKey, components);
                    this.currentElement.container.innerHTML = "";
                    this.currentElement.render(this.currentElement.container);
                    this.currentElementKey = "";
                }
                getContainer(elementKey) {
                    return this.elements[elementKey].container;
                }
                onComponentCreated(key) {
                    if (this.elements[this.currentElementKey]) {
                        this.currentElement.componentKeys.push(key);
                    }
                }
                addClearFunc(elementKey, clearFunc) {
                    this.elements[elementKey].onClear.push(clearFunc);
                }
                clearElement(elementKey, components) {
                    for (const clearFunc of this.elements[elementKey].onClear)
                        clearFunc();
                    this.clearComponents(components);
                }
                clearComponents(components) {
                    for (const key of this.currentElement.componentKeys) {
                        components[key].clear();
                        delete components[key];
                    }
                    this.currentElement.componentKeys = [];
                }
                clear() {
                    for (const elementKey in this.elements)
                        for (const clearFunc of this.elements[elementKey].onClear)
                            clearFunc();
                    this.elements = {};
                    this.currentElementKey = "";
                }
            };
            exports_7("RenderElementsManager", RenderElementsManager);
        }
    };
});
System.register("base/view", ["helpers", "base/component-module", "base/render-elements.manager"], function (exports_8, context_8) {
    "use strict";
    var helpers_3, component_module_3, render_elements_manager_1, BaseView;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (helpers_3_1) {
                helpers_3 = helpers_3_1;
            },
            function (component_module_3_1) {
                component_module_3 = component_module_3_1;
            },
            function (render_elements_manager_1_1) {
                render_elements_manager_1 = render_elements_manager_1_1;
            }
        ],
        execute: function () {
            BaseView = class BaseView extends component_module_3.ComponentModule {
                constructor(classes) {
                    super();
                    this.components = {};
                    this.renderElementsManager = new render_elements_manager_1.RenderElementsManager();
                    this.viewExtenders = [];
                    this.onClear = [];
                    this.container.classList.add(...helpers_3.processClasses(classes));
                }
                // PUBLIC
                render() {
                    this.container.innerHTML = "";
                    this.onClear = [];
                    const fragment = document.createDocumentFragment();
                    this._render(fragment);
                    for (const viewExtender of this.viewExtenders)
                        viewExtender._render(fragment);
                    this.container.appendChild(fragment);
                    this.eventEmitter.emit('rendered');
                }
                extendView(viewExtender) {
                    this.viewExtenders.push(viewExtender);
                }
                clear() {
                    // internal level
                    this.clearInternalComponents();
                    // this level
                    for (const func of this.onClear)
                        func();
                    this.renderElementsManager.clear();
                    super.clear();
                    // extender level
                    for (const viewExtender of this.viewExtenders)
                        viewExtender.clear();
                }
                createDOMElement(tagName, classes) {
                    const element = document.createElement(tagName);
                    if (classes) {
                        typeof (classes) === 'string' ?
                            element.classList.add(classes) :
                            element.classList.add(...classes);
                    }
                    return element;
                }
                createComponent(container, componentType, options, key) {
                    if (typeof container === 'string')
                        container = this.createDOMElement(container);
                    const newComponent = new componentType(container, options);
                    key = key !== null && key !== void 0 ? key : newComponent.constructor.name;
                    if (this.components[key]) {
                        throw new Error(`Render error: Elements of the same component must contain unique keys. Repating key: ${key}`);
                    }
                    this.components[key] = newComponent;
                    this.renderElementsManager.onComponentCreated(key);
                    return newComponent;
                }
                // === Render Elements
                createRenderElement(elementKey, container, renderFunc) {
                    this.renderElementsManager.create({
                        key: elementKey,
                        container,
                        componentKeys: [],
                        onClear: [],
                        render: renderFunc,
                    });
                    this.renderElement(elementKey);
                    return container;
                }
                onClearRenderElement(elementKey, clearFunc) {
                    this.renderElementsManager.addClearFunc(elementKey, clearFunc);
                }
                renderElement(elementKey) {
                    this.renderElementsManager.render(elementKey, this.components);
                }
                getElementContainer(elementKey) {
                    return this.renderElementsManager.getContainer(elementKey);
                }
                // ===
                clearInternalComponents() {
                    for (const key in this.components) {
                        const component = this.components[key];
                        component.clear();
                    }
                    this.components = {};
                }
            };
            exports_8("BaseView", BaseView);
        }
    };
});
System.register("base/component-module", [], function (exports_9, context_9) {
    "use strict";
    var ComponentModule;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [],
        execute: function () {
            ComponentModule = class ComponentModule {
                // ===
                get container() {
                    return this.getContainer();
                }
                get eventEmitter() {
                    return this._eventEmitter;
                }
                get state() {
                    return this._state;
                }
                get view() {
                    return this._view;
                }
                // ===
                constructor() {
                    const props = ComponentModule.props[ComponentModule.props.length - 1];
                    this.componentName = props.componentName;
                    this.getContainer = props.getContainer;
                    this._eventEmitter = props.eventEmitter;
                    this.getController = props.getController;
                    this.getRequiredController = props.getRequiredController;
                    this.getState = props.getState;
                    this.getRequiredState = props.getRequiredState;
                    this._state = props.state;
                    this._view = props.view;
                }
                clear() { }
                static startCreatingComponent(componentProps) {
                    ComponentModule.props.push(componentProps);
                }
                static endCreatingComponent() {
                    const componentProps = ComponentModule.props.pop();
                }
            };
            exports_9("ComponentModule", ComponentModule);
            // === STATIC
            ComponentModule.props = [];
        }
    };
});
System.register("base/controller", ["base/component-module"], function (exports_10, context_10) {
    "use strict";
    var component_module_4, BaseController;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (component_module_4_1) {
                component_module_4 = component_module_4_1;
            }
        ],
        execute: function () {
            BaseController = class BaseController extends component_module_4.ComponentModule {
                constructor() {
                    super(...arguments);
                    this.onClear = [];
                }
                clear() {
                    for (const func of this.onClear)
                        func();
                }
                stateChanged(change) { }
                render() {
                    this.eventEmitter.emit('render');
                }
            };
            exports_10("BaseController", BaseController);
        }
    };
});
System.register("kanban/kanban.state", ["base/state", "kanban/kanban.controller"], function (exports_11, context_11) {
    "use strict";
    var state_1, kanban_controller_1, KanbanState;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (state_1_1) {
                state_1 = state_1_1;
            },
            function (kanban_controller_1_1) {
                kanban_controller_1 = kanban_controller_1_1;
            }
        ],
        execute: function () {
            KanbanState = class KanbanState extends state_1.BaseState {
                get columns() {
                    return this.options.columns.slice();
                }
                // ===
                constructor(options) {
                    const defaultOptions = {
                        columns: []
                    };
                    super(defaultOptions, options, [kanban_controller_1.KanbanController]);
                }
                createColumn(column) {
                    this.updateColumns([...this.columns, column]);
                }
                updateColumn(id, column) {
                    this.updateBy(options => {
                        const columnIndex = options.columns.findIndex((column) => id === column.id);
                        options.columns[columnIndex] = column;
                    });
                }
                deleteColumn(column) {
                    const updatedColumns = this.columns.filter(_column => _column.id !== column.id);
                    this.updateColumns(updatedColumns);
                }
                updateColumns(columns) {
                    this.updateByKey('columns', columns);
                }
            };
            exports_11("KanbanState", KanbanState);
        }
    };
});
System.register("utils/errors", [], function (exports_12, context_12) {
    "use strict";
    var UndefinedViewPropertyError;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [],
        execute: function () {
            UndefinedViewPropertyError = class UndefinedViewPropertyError extends Error {
                constructor(moduleName, componentName, propertyName) {
                    super(`${moduleName}: view of ${componentName} component does not have \'${propertyName}\' property`);
                }
            };
            exports_12("UndefinedViewPropertyError", UndefinedViewPropertyError);
        }
    };
});
System.register("utils/mouse", [], function (exports_13, context_13) {
    "use strict";
    var Mouse, mouse;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [],
        execute: function () {
            Mouse = class Mouse {
                constructor() {
                    this.oldX = 0;
                    this.oldY = 0;
                }
                get horizontal() {
                    return this._horizontal;
                }
                get vertical() {
                    return this._vertical;
                }
                setPosition(e) {
                    this.calculateDirection(e);
                    this.oldX = e.clientX;
                    this.oldY = e.clientY;
                }
                get position() {
                    return { x: this.oldX, y: this.oldY };
                }
                calculateDirection(e) {
                    if (this.oldX !== e.clientX)
                        this._horizontal = this.oldX > e.clientX ? 'left' : 'right';
                    if (this.oldY !== e.clientY)
                        this._vertical = this.oldY > e.clientY ? 'up' : 'down';
                }
                isInsideElement(element) {
                    const mousePosition = this.position;
                    const elementPosition = element instanceof DOMRect ? element : element.getBoundingClientRect();
                    return (mousePosition.x >= elementPosition.x && mousePosition.x <= elementPosition.x + elementPosition.width &&
                        mousePosition.y >= elementPosition.y && mousePosition.y <= elementPosition.y + elementPosition.height);
                }
            };
            exports_13("Mouse", Mouse);
            ;
            exports_13("mouse", mouse = new Mouse());
        }
    };
});
System.register("utils/smooth-scroll", [], function (exports_14, context_14) {
    "use strict";
    var SmoothScrollOptions, SmoothScroll, scrollingElements, smoothScroll;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [],
        execute: function () {
            SmoothScrollOptions = class SmoothScrollOptions {
                constructor() {
                    this.y = 0;
                    this.x = 0;
                    this.speedX = 0;
                    this.speedY = 0;
                    this.time = 0;
                }
            };
            exports_14("SmoothScrollOptions", SmoothScrollOptions);
            ;
            SmoothScroll = class SmoothScroll {
            };
            scrollingElements = new Map();
            exports_14("smoothScroll", smoothScroll = (element, options, callback) => {
                const tick = 10;
                // ===
                const { x, y, speedX, speedY, time } = options;
                const scrollInterval = setInterval(() => {
                    var _a, _b;
                    const top = speedY ? speedY : y / time * tick;
                    const left = speedX ? speedY : x / time * tick;
                    const beforeScrollTop = element.scrollTop;
                    const beforeScrollLeft = element.scrollLeft;
                    element.scrollBy({ top, left });
                    const scrolled = beforeScrollTop !== element.scrollTop || beforeScrollLeft !== element.scrollLeft;
                    !scrolled && ((_b = (_a = scrollingElements.get(element)) === null || _a === void 0 ? void 0 : _a.clear) === null || _b === void 0 ? void 0 : _b.call(this));
                }, tick);
                const _clearTimeout = setTimeout(() => {
                    clearInterval(scrollInterval);
                }, time);
                // ===
                let { clear } = scrollingElements.get(element) || {};
                clear && clear();
                clear = () => {
                    clearInterval(scrollInterval);
                    clearTimeout(_clearTimeout);
                    callback && callback();
                };
                scrollingElements.set(element, { clear });
                return clear;
            });
        }
    };
});
System.register("drag-drop/drag.state", ["base/state", "drag-drop/drag.controller"], function (exports_15, context_15) {
    "use strict";
    var state_2, drag_controller_1, DragState;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [
            function (state_2_1) {
                state_2 = state_2_1;
            },
            function (drag_controller_1_1) {
                drag_controller_1 = drag_controller_1_1;
            }
        ],
        execute: function () {
            DragState = class DragState extends state_2.BaseState {
                get isDragging() {
                    return this.options.isDragging;
                }
                get disabled() {
                    return this.options.disabled;
                }
                constructor(options = {}) {
                    const defaultOptions = {
                        isDragging: false,
                        disabled: false
                    };
                    super(options, defaultOptions, [drag_controller_1.DragController]);
                }
            };
            exports_15("DragState", DragState);
        }
    };
});
System.register("drag-drop/drag.controller", ["base/controller", "utils/errors", "utils/mouse", "drag-drop/drag.state"], function (exports_16, context_16) {
    "use strict";
    var controller_1, errors_1, mouse_1, drag_state_1, DragController;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (controller_1_1) {
                controller_1 = controller_1_1;
            },
            function (errors_1_1) {
                errors_1 = errors_1_1;
            },
            function (mouse_1_1) {
                mouse_1 = mouse_1_1;
            },
            function (drag_state_1_1) {
                drag_state_1 = drag_state_1_1;
            }
        ],
        execute: function () {
            DragController = class DragController extends controller_1.BaseController {
                constructor(item) {
                    super();
                    this.shadowElement = document.createElement('div');
                    this._sizes = { width: 50, height: 50 };
                    this.mouseOffset = { x: 50, y: 50 };
                    this.dragState = this.getRequiredState(drag_state_1.DragState.name);
                    this.item = item;
                    this.eventEmitter
                        .on('drag-start', this.onDragStart.bind(this))
                        .on('drag', this.onDrag.bind(this))
                        .on('drag-end', this.onDragEnd.bind(this))
                        .on('disable-drag', this.onDisableDrag.bind(this))
                        .on('enable-drag', this.onEnableDrag.bind(this))
                        .on('rendered', () => {
                        var _a, _b;
                        const { dragElement, dragWrapperElement } = this.view;
                        if (!dragElement)
                            throw new errors_1.UndefinedViewPropertyError(DragController.name, this.componentName, 'dragElement');
                        if (!dragElement)
                            throw new errors_1.UndefinedViewPropertyError(DragController.name, this.componentName, 'dragWrapperElement');
                        this._element = dragElement;
                        this._wrapperElement = dragWrapperElement;
                        (_a = this._element) === null || _a === void 0 ? void 0 : _a.classList.add('draggable');
                        (_b = this._wrapperElement) === null || _b === void 0 ? void 0 : _b.classList.add('draggable-wrapper');
                    });
                }
                // ===
                get element() {
                    return this._element;
                }
                get wrapperElement() {
                    return this._wrapperElement;
                }
                // ===
                stateChanged(change) {
                    switch (change.name) {
                        case "isDragging":
                        case "disabled":
                            break;
                        default:
                            this.render();
                    }
                }
                // ===
                onDragStart(e) {
                    e.preventDefault();
                    this.dragState.updateByKey('isDragging', true);
                    this._sizes = this.getElementSizes(this.element);
                    this.mouseOffset = this.getMouseOffsetInElement(this.element, e);
                    this.showShadow();
                    this.addDragStyles();
                    this.onDrag();
                }
                onDrag() {
                    const mousePosition = mouse_1.mouse.position;
                    this.element.style.top = (mousePosition.y - this.mouseOffset.y) + 'px';
                    this.element.style.left = (mousePosition.x - this.mouseOffset.x) + 'px';
                }
                onDragEnd() {
                    this.dragState.updateByKey('isDragging', false);
                    this.hideShadow();
                    this.removeDragStyles();
                }
                // === Calculations
                getElementSizes(element) {
                    let width = element.offsetWidth;
                    let height = element.offsetHeight;
                    if (this.elementStyles.boxSizing !== 'border-box') {
                        const paddingX = this.elementStyles.paddingX;
                        const paddingY = this.elementStyles.paddingY;
                        const borderX = this.elementStyles.borderX;
                        const borderY = this.elementStyles.borderY;
                        width = width - paddingX - borderX;
                        height = height - paddingY - borderY;
                    }
                    return { width, height };
                }
                getMouseOffsetInElement(element, e) {
                    const position = element.getBoundingClientRect();
                    return {
                        x: e.clientX - position.left,
                        y: e.clientY - position.top
                    };
                }
                get elementStyles() {
                    if (!this._elementStyles)
                        this.calculateElementStyles();
                    return this._elementStyles;
                }
                calculateElementStyles() {
                    const styles = getComputedStyle(this.element);
                    const computedStyles = {
                        paddingLeft: parseFloat(styles.paddingLeft),
                        paddingRight: parseFloat(styles.paddingRight),
                        paddingTop: parseFloat(styles.paddingTop),
                        paddingBottom: parseFloat(styles.paddingBottom),
                        borderLeftWidth: parseFloat(styles.borderLeftWidth),
                        borderRightWidth: parseFloat(styles.borderRightWidth),
                        borderTopWidth: parseFloat(styles.borderTopWidth),
                        borderBottomWidth: parseFloat(styles.borderBottomWidth),
                        margin: styles.margin,
                        boxSizing: styles.boxSizing
                    };
                    computedStyles.paddingX = computedStyles.paddingLeft + computedStyles.paddingRight;
                    computedStyles.paddingY = computedStyles.paddingTop + computedStyles.paddingBottom;
                    computedStyles.borderX = computedStyles.borderLeftWidth + computedStyles.borderRightWidth;
                    computedStyles.borderY = computedStyles.borderTopWidth + computedStyles.borderBottomWidth;
                    this._elementStyles = computedStyles;
                }
                // === Styles
                showShadow() {
                    this.shadowElement.classList.add('shadow');
                    this.shadowElement.style.margin = this.elementStyles.margin;
                    this.shadowElement.style.width = '100%';
                    this.shadowElement.style.height = this.element.clientHeight + 'px';
                    this.element.before(this.shadowElement);
                }
                hideShadow() {
                    this.shadowElement.remove();
                }
                addDragStyles() {
                    this.element.classList.add('state-dragging');
                    this.element.style.cursor = 'grabbing';
                    this.element.style.position = 'fixed';
                    this.element.style.width = this._sizes.width + 'px';
                    this.element.style.height = this._sizes.height + 'px';
                }
                removeDragStyles() {
                    this.element.classList.remove('state-dragging');
                    this.element.style.removeProperty('cursor');
                    this.element.style.removeProperty('position');
                    this.element.style.removeProperty('top');
                    this.element.style.removeProperty('left');
                    this.element.style.removeProperty('width');
                    this.element.style.removeProperty('height');
                }
                // === Disabled
                onDisableDrag() {
                    this.dragState.updateByKey('disabled', true);
                }
                onEnableDrag() {
                    this.dragState.updateByKey('disabled', false);
                }
            };
            exports_16("DragController", DragController);
        }
    };
});
System.register("drag-drop/drop.state", ["base/state"], function (exports_17, context_17) {
    "use strict";
    var state_3, DropState;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [
            function (state_3_1) {
                state_3 = state_3_1;
            }
        ],
        execute: function () {
            DropState = class DropState extends state_3.BaseState {
                get direction() {
                    return this.options.direction;
                }
                get isItemsEqual() {
                    return this.options.isItemsEqual;
                }
                get scrollBoundaryRange() {
                    return this.options.scrollBoundaryRange;
                }
                get scrollSpeed() {
                    return this.options.scrollSpeed;
                }
                constructor(options) {
                    const defaultOptions = {
                        direction: 'horizontal',
                        isItemsEqual: (itemA, itemB) => itemA === itemB,
                        scrollBoundaryRange: 80,
                        scrollSpeed: 40
                    };
                    super(defaultOptions, options);
                }
            };
            exports_17("DropState", DropState);
        }
    };
});
System.register("drag-drop/drop.controller", ["base/component", "base/controller", "helpers", "utils/errors", "utils/mouse", "utils/smooth-scroll", "drag-drop/drag.controller", "drag-drop/drop.state"], function (exports_18, context_18) {
    "use strict";
    var component_1, controller_2, helpers_4, errors_2, mouse_2, smooth_scroll_1, drag_controller_2, drop_state_1, DropController;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [
            function (component_1_1) {
                component_1 = component_1_1;
            },
            function (controller_2_1) {
                controller_2 = controller_2_1;
            },
            function (helpers_4_1) {
                helpers_4 = helpers_4_1;
            },
            function (errors_2_1) {
                errors_2 = errors_2_1;
            },
            function (mouse_2_1) {
                mouse_2 = mouse_2_1;
            },
            function (smooth_scroll_1_1) {
                smooth_scroll_1 = smooth_scroll_1_1;
            },
            function (drag_controller_2_1) {
                drag_controller_2 = drag_controller_2_1;
            },
            function (drop_state_1_1) {
                drop_state_1 = drop_state_1_1;
            }
        ],
        execute: function () {
            DropController = class DropController extends controller_2.BaseController {
                // ===
                get dropContainer() {
                    return this._dropContainer;
                }
                get dropScrollElement() {
                    return this._dropScrollElement;
                }
                // ===
                constructor(isMouseInsideDrag) {
                    super();
                    this.drags = [];
                    this.columnName = "";
                    this.dropState = this.getRequiredState(drop_state_1.DropState.name);
                    this.draggingDirection = this.dropState.direction;
                    const isMouseInsideElement = mouse_2.mouse.isInsideElement.bind(mouse_2.mouse);
                    this.isMouseInsideDrag = isMouseInsideDrag !== null && isMouseInsideDrag !== void 0 ? isMouseInsideDrag : ((drag) => isMouseInsideElement(drag.element));
                    this.isItemsEqual = this.dropState.isItemsEqual;
                    setTimeout(() => {
                        this.columnName = this.container.querySelector('.title').innerText;
                    });
                    this.eventEmitter
                        .on('process-drag', this.onProcessDrag.bind(this))
                        .on('rendered', () => {
                        const { dropContainer, dropScrollElement } = this.view;
                        if (!dropContainer)
                            throw new errors_2.UndefinedViewPropertyError(DropController.name, this.componentName, 'dropContainer');
                        this._dropContainer = dropContainer;
                        this._dropScrollElement = dropScrollElement !== null && dropScrollElement !== void 0 ? dropScrollElement : dropContainer;
                        this.dropContainer.classList.add('droppable');
                    });
                }
                // ===
                clear() {
                    this.clearDropInterval();
                    this.drags = [];
                }
                clearDropInterval() {
                    clearInterval(this.dropInterval);
                }
                // ===
                onProcessDrag(dragComponent) {
                    const dragController = dragComponent instanceof component_1.BaseComponent ?
                        dragComponent.getRequiredController(drag_controller_2.DragController.name) : dragComponent;
                    this.drags.push(dragController);
                    // ===
                    const onDragStart = () => this.startDrag(dragController);
                    const onDrag = () => this.drag(dragController);
                    const onDragEnd = () => this.endDrag();
                    dragController.eventEmitter
                        .on('drag-start', onDragStart)
                        // .on('drag', onDrag)
                        .on('drag-end', onDragEnd);
                    // ===
                    dragController.eventEmitter.once('unsubscribe-drag-listeners', () => {
                        dragController.eventEmitter
                            .unsubscribe('drag-start', onDragStart)
                            // .unsubscribe('drag', onDrag)
                            .unsubscribe('drag-end', onDragEnd);
                    });
                }
                // === DRAG EVENTS
                startDrag(drag) {
                    this.drag(drag);
                    this.dropInterval = setInterval(() => {
                        this.scrollDropContainer();
                        this.drag(drag);
                    }, 100);
                }
                drag(drag) {
                    const scrollTop = this.dropContainer.scrollTop;
                    const dragPosition = this.calculateDragPosition(drag);
                    const positionChanged = this.changeDragPosition(drag, dragPosition);
                    if (positionChanged) {
                        this.dropContainer.scrollTop = scrollTop;
                        this.moveDragToIndex(drag, dragPosition.index);
                    }
                }
                endDrag() {
                    this.clearDropInterval();
                    this.eventEmitter.emit('update-items-order', this.drags.map(drag => drag.item));
                }
                // === SCROLLING
                getScrollBoundaries() {
                    const scrollPosition = this.dropScrollElement.getBoundingClientRect();
                    const direction = this.dropState.direction;
                    if (direction === 'vertical') {
                        return {
                            boundary: {
                                start: scrollPosition.top,
                                end: scrollPosition.bottom,
                            },
                            currentPosition: mouse_2.mouse.position.y
                        };
                    }
                    return {
                        boundary: {
                            start: scrollPosition.left,
                            end: scrollPosition.right,
                        },
                        currentPosition: mouse_2.mouse.position.x
                    };
                }
                scrollDropContainer() {
                    let scrollOptions;
                    const { scrollBoundaryRange, scrollSpeed } = this.dropState;
                    const { boundary, currentPosition } = this.getScrollBoundaries();
                    if (helpers_4.hasVerticalScroll(this.dropScrollElement) || helpers_4.hasHorizontalScroll(this.dropScrollElement)) {
                        if (currentPosition < boundary.start + scrollBoundaryRange) {
                            // scroll to very start
                            if (currentPosition < boundary.start) {
                                scrollOptions = { time: 500, speedY: -15 };
                            }
                            // scroll to start
                            else {
                                const scrollDistance = (1 - (currentPosition - boundary.start) / scrollBoundaryRange) * scrollSpeed;
                                scrollOptions = { time: 80, y: -scrollDistance };
                            }
                        }
                        else if (currentPosition > boundary.end - scrollBoundaryRange) {
                            // scroll to very end
                            if (currentPosition > boundary.end) {
                                scrollOptions = { time: 500, speedY: 15 };
                            }
                            // scroll to end
                            else {
                                const scrollDistance = (1 - (boundary.end - currentPosition) / scrollBoundaryRange) * scrollSpeed;
                                scrollOptions = { time: 80, y: scrollDistance };
                            }
                        }
                    }
                    if (scrollOptions) {
                        this.scrollDirection = scrollOptions.y > 0 || scrollOptions.speedY > 0 ? 'end' : 'start';
                        if (this.dropState.direction === 'horizontal') {
                            scrollOptions.speedX = scrollOptions.speedY;
                            scrollOptions.x = scrollOptions.y;
                            delete scrollOptions.speedY;
                            delete scrollOptions.y;
                        }
                        smooth_scroll_1.smoothScroll(this.dropScrollElement, scrollOptions);
                        // smoothScroll(this.dropContainer, scrollOptions, () => { this.scrollDirection = undefined; });
                    }
                    else {
                        this.scrollDirection = undefined;
                    }
                }
                // == PRIVATE
                calculateDragPosition(drag) {
                    const direction = this.dropState.direction;
                    const mousePosition = mouse_2.mouse.position;
                    const dropPosition = this.dropContainer.getBoundingClientRect();
                    let isInsertBefore = this.isInsertBefore();
                    let index = -1;
                    // Shadow above or left
                    if ((direction === 'vertical' && mousePosition.y <= dropPosition.y) ||
                        (direction === 'horizontal' && mousePosition.x <= dropPosition.x)) {
                        index = 0;
                        isInsertBefore = true;
                    }
                    // Shadow below or right
                    else if ((direction === 'vertical' && mousePosition.y >= dropPosition.y + dropPosition.height) ||
                        (direction === 'horizontal' && mousePosition.x >= dropPosition.x + dropPosition.width)) {
                        index = this.drags.length - 1;
                        isInsertBefore = false;
                    }
                    // Shadow inside
                    else {
                        for (let i = 0; i < this.drags.length; i++) {
                            if (!this.isSameDrag(this.drags[i], drag) && this.isMouseInsideDrag(this.drags[i])) {
                                index = i;
                                break;
                            }
                        }
                    }
                    return { index, isInsertBefore };
                }
                changeDragPosition(drag, dragPosition) {
                    const { index, isInsertBefore } = dragPosition;
                    if (index === -1)
                        return false;
                    const insertNearDrag = this.drags[index];
                    if (insertNearDrag && !this.isSameDrag(insertNearDrag, drag)) {
                        if (isInsertBefore) {
                            if (index === 0 || !this.isSameDrag(this.drags[index - 1], drag)) {
                                insertNearDrag.container.before(drag.container);
                                return true;
                            }
                        }
                        else {
                            if (index + 1 === this.drags.length || !this.isSameDrag(this.drags[index + 1], drag)) {
                                insertNearDrag.container.after(drag.container);
                                return true;
                            }
                        }
                    }
                    else if (this.dropContainer.children.length !== this.drags.length) {
                        this.dropContainer.appendChild(drag.container);
                        return true;
                    }
                    return false;
                }
                isSameDrag(dragA, dragB) {
                    return this.isItemsEqual(dragA.item, dragB.item);
                }
                moveDragToIndex(drag, toIndex) {
                    const fromIndex = this.drags.indexOf(drag);
                    // remove from old index
                    this.drags.splice(fromIndex, 1);
                    // add to new index
                    this.drags.splice(toIndex, 0, drag);
                }
                isInsertBefore() {
                    if (this.scrollDirection)
                        return this.scrollDirection === 'start';
                    return this.draggingDirection === 'vertical' ? mouse_2.mouse.vertical === 'up' : mouse_2.mouse.horizontal === 'left';
                }
            };
            exports_18("DropController", DropController);
        }
    };
});
System.register("editable-field/editable-field.state", ["base/state", "helpers", "editable-field/editable-field.controller"], function (exports_19, context_19) {
    "use strict";
    var state_4, helpers_5, editable_field_controller_1, EditableFieldState;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [
            function (state_4_1) {
                state_4 = state_4_1;
            },
            function (helpers_5_1) {
                helpers_5 = helpers_5_1;
            },
            function (editable_field_controller_1_1) {
                editable_field_controller_1 = editable_field_controller_1_1;
            }
        ],
        execute: function () {
            EditableFieldState = class EditableFieldState extends state_4.BaseState {
                get title() {
                    return this.options.title;
                }
                get value() {
                    return this.options.value;
                }
                get placeholder() {
                    return this.options.placeholder;
                }
                // ===
                get isOpen() {
                    return this.options.isOpen;
                }
                get validationMsg() {
                    return this.options.validationMsg;
                }
                get submitOnOutsideClick() {
                    return this.options.submitOnOutsideClick;
                }
                get resetValueOnClosed() {
                    return this.options.resetValueOnClosed;
                }
                // ===
                get titleTemplate() {
                    return this.options.titleTemplate;
                }
                get buttonsTemplate() {
                    return this.options.buttonsTemplate;
                }
                get submitBtnContent() {
                    return this.options.submitBtnContent;
                }
                get cancelBtnContent() {
                    return this.options.cancelBtnContent;
                }
                // ===
                get prepareValue() {
                    return this.options.prepareValue;
                }
                get validation() {
                    return this.options.validation;
                }
                get onOpened() {
                    return this.options.onOpened;
                }
                get onClosed() {
                    return this.options.onClosed;
                }
                get onSubmit() {
                    return this.options.onSubmit;
                }
                constructor(options) {
                    const defaultOptions = {
                        title: "",
                        value: "",
                        placeholder: "",
                        isOpen: false,
                        validationMsg: null,
                        submitOnOutsideClick: false,
                        resetValueOnClosed: true,
                        titleTemplate: undefined,
                        buttonsTemplate: undefined,
                        submitBtnContent: undefined,
                        cancelBtnContent: undefined,
                        prepareValue: value => value,
                        validation: () => [true, ""],
                        onOpened: helpers_5.noop,
                        onClosed: helpers_5.noop,
                        onSubmit: helpers_5.noop
                    };
                    super(defaultOptions, options, [editable_field_controller_1.EditableFieldController]);
                }
            };
            exports_19("EditableFieldState", EditableFieldState);
        }
    };
});
System.register("button/button.state", ["base/state", "helpers"], function (exports_20, context_20) {
    "use strict";
    var state_5, helpers_6, ButtonState;
    var __moduleName = context_20 && context_20.id;
    return {
        setters: [
            function (state_5_1) {
                state_5 = state_5_1;
            },
            function (helpers_6_1) {
                helpers_6 = helpers_6_1;
            }
        ],
        execute: function () {
            ButtonState = class ButtonState extends state_5.BaseState {
                get icon() {
                    return this.options.icon;
                }
                get text() {
                    return this.options.text;
                }
                get content() {
                    return this.options.content;
                }
                get className() {
                    return this.options.className;
                }
                get onClick() {
                    return this.options.onClick;
                }
                constructor(state) {
                    const defaultOptions = {
                        icon: undefined,
                        text: undefined,
                        content: undefined,
                        className: "",
                        onClick: helpers_6.noop
                    };
                    super(defaultOptions, state);
                }
            };
            exports_20("ButtonState", ButtonState);
        }
    };
});
System.register("button/button.view", ["base/view"], function (exports_21, context_21) {
    "use strict";
    var view_1, ButtonView;
    var __moduleName = context_21 && context_21.id;
    return {
        setters: [
            function (view_1_1) {
                view_1 = view_1_1;
            }
        ],
        execute: function () {
            ButtonView = class ButtonView extends view_1.BaseView {
                constructor() {
                    super();
                }
                _render(fragment) {
                    var _a;
                    const btn = this.createDOMElement('button');
                    const content = (_a = this.state.content) !== null && _a !== void 0 ? _a : this.createContent();
                    btn.appendChild(content);
                    btn.className = this.state.className;
                    btn.addEventListener('click', () => this.eventEmitter.emit('click'));
                    fragment.appendChild(btn);
                }
                createContent() {
                    const fragment = document.createDocumentFragment();
                    if (this.state.icon)
                        fragment.append(this.state.icon);
                    if (this.state.text) {
                        const textElement = this.createDOMElement('span');
                        textElement.innerText = this.state.text;
                        fragment.append(textElement);
                    }
                    return fragment;
                }
            };
            exports_21("ButtonView", ButtonView);
        }
    };
});
System.register("button/button.controller", ["base/controller"], function (exports_22, context_22) {
    "use strict";
    var controller_3, ButtonController;
    var __moduleName = context_22 && context_22.id;
    return {
        setters: [
            function (controller_3_1) {
                controller_3 = controller_3_1;
            }
        ],
        execute: function () {
            ButtonController = class ButtonController extends controller_3.BaseController {
                constructor() {
                    super();
                    this.eventEmitter.on('click', (event) => this.state.onClick(event));
                }
            };
            exports_22("ButtonController", ButtonController);
        }
    };
});
System.register("components/button.component", ["base/component", "button/button.controller", "button/button.state", "button/button.view"], function (exports_23, context_23) {
    "use strict";
    var component_2, button_controller_1, button_state_1, button_view_1, ButtonComponent;
    var __moduleName = context_23 && context_23.id;
    return {
        setters: [
            function (component_2_1) {
                component_2 = component_2_1;
            },
            function (button_controller_1_1) {
                button_controller_1 = button_controller_1_1;
            },
            function (button_state_1_1) {
                button_state_1 = button_state_1_1;
            },
            function (button_view_1_1) {
                button_view_1 = button_view_1_1;
            }
        ],
        execute: function () {
            ButtonComponent = class ButtonComponent extends component_2.BaseComponent {
                constructor(container, options) {
                    super('Button', button_state_1.ButtonState, button_view_1.ButtonView, container, options);
                    this.registerController(() => new button_controller_1.ButtonController());
                    super.render();
                }
            };
            exports_23("ButtonComponent", ButtonComponent);
        }
    };
});
System.register("editable-field/editable-field.view", ["base/view", "components/button.component"], function (exports_24, context_24) {
    "use strict";
    var view_2, button_component_1, EditableFieldView;
    var __moduleName = context_24 && context_24.id;
    return {
        setters: [
            function (view_2_1) {
                view_2 = view_2_1;
            },
            function (button_component_1_1) {
                button_component_1 = button_component_1_1;
            }
        ],
        execute: function () {
            EditableFieldView = class EditableFieldView extends view_2.BaseView {
                constructor() {
                    super('editable-field');
                }
                _render(fragment) {
                    if (this.state.isOpen) {
                        this.renderOpened(fragment);
                        this.container.classList.add('state-opened');
                        this.container.classList.remove('state-closed');
                    }
                    else {
                        this.renderClosed(fragment);
                        this.container.classList.add('state-closed');
                        this.container.classList.remove('state-opened');
                    }
                }
                renderClosed(fragment) {
                    const btn = this.createDOMElement('div', 'title');
                    const open = () => this.eventEmitter.emit('open');
                    if (this.state.titleTemplate) {
                        const template = this.state.titleTemplate(open);
                        template && btn.appendChild(template);
                    }
                    else {
                        btn.innerText = this.state.title ? this.state.title : this.state.value;
                        btn.addEventListener('click', open);
                    }
                    fragment.appendChild(btn);
                }
                renderOpened(fragment) {
                    fragment.append(this.createRenderElement('input', this.createDOMElement('div', 'input-wrapper'), this.renderInput.bind(this)), this.createRenderElement('validation-msg', this.createDOMElement('div'), this.renderValidationMessage.bind(this)), this.createRenderElement('buttons', this.createDOMElement('div', 'buttons'), this.renderButtons.bind(this)));
                    setTimeout(() => this.setDocumentMouseDownListener());
                }
                renderInput(inputWrapper) {
                    this.placeholder = this.createPlaceholder();
                    this.input = this.createInput();
                    const inputContainer = this.createDOMElement('div', 'input-container');
                    inputContainer.append(this.placeholder, this.input);
                    inputWrapper.appendChild(inputContainer);
                }
                createPlaceholder() {
                    const placeholder = this.createDOMElement('div', 'placeholder');
                    placeholder.innerText = this.state.placeholder;
                    return placeholder;
                }
                createInput() {
                    const input = this.createDOMElement('span', 'input');
                    input.setAttribute('contenteditable', 'true');
                    input.setAttribute('role', 'textbox');
                    input.addEventListener('input', () => this.eventEmitter.emit('value-changed', input.innerText));
                    input.addEventListener('keydown', (e) => e.key === 'Enter' && this.eventEmitter.emit('enter-pressed'));
                    input.addEventListener('focus', () => this.eventEmitter.emit('focus'));
                    input.addEventListener('blur', (e) => this.eventEmitter.emit('blur', e));
                    input.innerText = this.state.value;
                    return input;
                }
                renderValidationMessage(container) {
                    if (this.state.validationMsg) {
                        const message = this.createDOMElement('div', 'validation-msg');
                        message.innerText = this.state.validationMsg;
                        container.appendChild(message);
                    }
                }
                renderButtons(container) {
                    const submitAction = () => this.eventEmitter.emit('submit');
                    const closeAction = () => this.eventEmitter.emit('close');
                    if (this.state.buttonsTemplate) {
                        this.state.buttonsTemplate(container, {
                            submit: submitAction,
                            close: closeAction
                        });
                    }
                    else {
                        const submitBtn = this.createComponent('span', button_component_1.ButtonComponent, {
                            className: 'submit',
                            content: this.state.submitBtnContent,
                            onClick: submitAction
                        }, 'submit-btn');
                        const cancelBtn = this.createComponent('span', button_component_1.ButtonComponent, {
                            className: 'cancel',
                            content: this.state.cancelBtnContent,
                            onClick: closeAction
                        }, 'cancel-btn');
                        container.append(submitBtn.container, cancelBtn.container);
                    }
                }
                setDocumentMouseDownListener() {
                    const onDocumentClick = (e) => this.eventEmitter.emit('document-click', e);
                    document.addEventListener('mousedown', onDocumentClick);
                    this.onClear.push(() => {
                        document.removeEventListener('mousedown', onDocumentClick);
                    });
                }
            };
            exports_24("EditableFieldView", EditableFieldView);
        }
    };
});
System.register("editable-field/editable-field.controller", ["base/controller", "helpers"], function (exports_25, context_25) {
    "use strict";
    var controller_4, helpers_7, EditableFieldController;
    var __moduleName = context_25 && context_25.id;
    return {
        setters: [
            function (controller_4_1) {
                controller_4 = controller_4_1;
            },
            function (helpers_7_1) {
                helpers_7 = helpers_7_1;
            }
        ],
        execute: function () {
            EditableFieldController = class EditableFieldController extends controller_4.BaseController {
                constructor() {
                    super();
                    this.lastSavedValue = this.state.value;
                    this.eventEmitter
                        .on('open', this.toggleInput.bind(this, true))
                        .on('close', this.toggleInput.bind(this, false))
                        .on('document-click', this.onDocumentClick.bind(this))
                        .on('focus', this.onFocus.bind(this))
                        .on('blur', this.onBlur.bind(this))
                        .on('submit', this.onSubmit.bind(this))
                        .on('enter-pressed', this.onEnterPressed.bind(this))
                        .on('value-changed', this.onValueChanged.bind(this));
                }
                stateChanged(change) {
                    switch (change.name) {
                        case 'value':
                            break;
                        default:
                            this.render();
                    }
                }
                focusInput() {
                    const input = this.view.input;
                    if (input && this.state.isOpen) {
                        input.focus();
                        this.onFocus();
                        helpers_7.focusEndOfContenteditable(input);
                    }
                }
                toggleInput(isOpen) {
                    this.state.update({
                        isOpen, validationMsg: null, value: this.lastSavedValue
                    });
                    if (isOpen) {
                        this.focusInput();
                        this.updatePlaceholder();
                        this.state.onOpened();
                    }
                    else {
                        if (this.state.resetValueOnClosed) {
                            this.lastSavedValue = '';
                            this.state.updateByKey('value', '');
                        }
                        this.onBlur();
                        this.state.onClosed();
                    }
                }
                onDocumentClick(e) {
                    const isInnerClick = e.target === this.container || this.container.contains(e.target);
                    if (!isInnerClick) {
                        if (this.state.submitOnOutsideClick)
                            this.onSubmit(e);
                        // else 
                        this.toggleInput(false);
                    }
                }
                onFocus() {
                    this.container.classList.add('state-focused');
                }
                onBlur() {
                    this.container.classList.remove('state-focused');
                }
                onSubmit(e) {
                    const value = this.state.prepareValue(this.state.value);
                    const [result, msg] = this.state.validation(value);
                    if (result) {
                        this.lastSavedValue = value;
                        this.state.updateByKey('value', value);
                        this.state.onSubmit(value);
                        this.toggleInput(false);
                    }
                    else {
                        this.state.updateByKey('validationMsg', msg);
                    }
                }
                onEnterPressed() {
                    this.onSubmit();
                }
                onValueChanged(value) {
                    this.state.updateByKey('value', value);
                    this.updatePlaceholder();
                }
                updatePlaceholder() {
                    this.view.placeholder.style.display = this.state.value.length ? 'none' : 'block';
                }
            };
            exports_25("EditableFieldController", EditableFieldController);
        }
    };
});
System.register("components/editable-field.component", ["base/component", "editable-field/editable-field.controller", "editable-field/editable-field.state", "editable-field/editable-field.view"], function (exports_26, context_26) {
    "use strict";
    var component_3, editable_field_controller_2, editable_field_state_1, editable_field_view_1, EditableFieldComponent;
    var __moduleName = context_26 && context_26.id;
    return {
        setters: [
            function (component_3_1) {
                component_3 = component_3_1;
            },
            function (editable_field_controller_2_1) {
                editable_field_controller_2 = editable_field_controller_2_1;
            },
            function (editable_field_state_1_1) {
                editable_field_state_1 = editable_field_state_1_1;
            },
            function (editable_field_view_1_1) {
                editable_field_view_1 = editable_field_view_1_1;
            }
        ],
        execute: function () {
            EditableFieldComponent = class EditableFieldComponent extends component_3.BaseComponent {
                constructor(container, options) {
                    super('EditableField', editable_field_state_1.EditableFieldState, editable_field_view_1.EditableFieldView, container, options);
                    this.registerController(() => new editable_field_controller_2.EditableFieldController());
                    super.render();
                }
            };
            exports_26("EditableFieldComponent", EditableFieldComponent);
        }
    };
});
System.register("prompt/prompt.controller", ["base/controller"], function (exports_27, context_27) {
    "use strict";
    var controller_5, PromptController;
    var __moduleName = context_27 && context_27.id;
    return {
        setters: [
            function (controller_5_1) {
                controller_5 = controller_5_1;
            }
        ],
        execute: function () {
            PromptController = class PromptController extends controller_5.BaseController {
            };
            exports_27("PromptController", PromptController);
        }
    };
});
System.register("prompt/prompt.state", ["base/state", "helpers"], function (exports_28, context_28) {
    "use strict";
    var state_6, helpers_8, PromptOptions, PromptState;
    var __moduleName = context_28 && context_28.id;
    return {
        setters: [
            function (state_6_1) {
                state_6 = state_6_1;
            },
            function (helpers_8_1) {
                helpers_8 = helpers_8_1;
            }
        ],
        execute: function () {
            PromptOptions = class PromptOptions {
            };
            exports_28("PromptOptions", PromptOptions);
            PromptState = class PromptState extends state_6.BaseState {
                get text() {
                    return this.options.text;
                }
                get onConfirm() {
                    return this.options.onConfirm;
                }
                get onCancel() {
                    return this.options.onCancel;
                }
                constructor(options) {
                    const defaultOptions = {
                        text: "",
                        onConfirm: helpers_8.noop,
                        onCancel: helpers_8.noop
                    };
                    super(defaultOptions, options);
                }
            };
            exports_28("PromptState", PromptState);
        }
    };
});
System.register("prompt/prompt.view", ["base/view", "components/button.component", "helpers"], function (exports_29, context_29) {
    "use strict";
    var view_3, button_component_2, helpers_9, PromptView;
    var __moduleName = context_29 && context_29.id;
    return {
        setters: [
            function (view_3_1) {
                view_3 = view_3_1;
            },
            function (button_component_2_1) {
                button_component_2 = button_component_2_1;
            },
            function (helpers_9_1) {
                helpers_9 = helpers_9_1;
            }
        ],
        execute: function () {
            PromptView = class PromptView extends view_3.BaseView {
                constructor(classes) {
                    super(helpers_9.concatClasses(classes, 'prompt'));
                }
                _render(fragment) {
                    fragment.append(this.createRenderElement('text', this.createDOMElement('div', 'prompt-text'), this.renderText.bind(this)), this.createRenderElement('buttons', this.createDOMElement('div', 'prompt-buttons'), this.renderButtons.bind(this)));
                }
                renderText(container) {
                    container.innerText = this.state.text;
                }
                renderButtons(container) {
                    const confirmBtn = this.createComponent('span', button_component_2.ButtonComponent, {
                        text: 'confirm',
                        className: 'prompt-confirm',
                        onClick: this.state.onConfirm
                    }, 'prompt-confirm-btn');
                    const cancelBtn = this.createComponent('span', button_component_2.ButtonComponent, {
                        text: 'cancel',
                        className: 'prompt-cancel',
                        onClick: this.state.onCancel
                    }, 'prompt-cancel-btn');
                    container.append(confirmBtn.container, cancelBtn.container);
                }
            };
            exports_29("PromptView", PromptView);
        }
    };
});
System.register("components/prompt.component", ["base/component", "prompt/prompt.controller", "prompt/prompt.state", "prompt/prompt.view"], function (exports_30, context_30) {
    "use strict";
    var component_4, prompt_controller_1, prompt_state_1, prompt_view_1, PromptComponent;
    var __moduleName = context_30 && context_30.id;
    return {
        setters: [
            function (component_4_1) {
                component_4 = component_4_1;
            },
            function (prompt_controller_1_1) {
                prompt_controller_1 = prompt_controller_1_1;
            },
            function (prompt_state_1_1) {
                prompt_state_1 = prompt_state_1_1;
            },
            function (prompt_view_1_1) {
                prompt_view_1 = prompt_view_1_1;
            }
        ],
        execute: function () {
            PromptComponent = class PromptComponent extends component_4.BaseComponent {
                constructor(container, options) {
                    super('Prompt', prompt_state_1.PromptState, prompt_view_1.PromptView, container, options);
                    this.registerController(() => new prompt_controller_1.PromptController());
                    super.render();
                }
            };
            exports_30("PromptComponent", PromptComponent);
        }
    };
});
System.register("utils/icons", [], function (exports_31, context_31) {
    "use strict";
    var Icon;
    var __moduleName = context_31 && context_31.id;
    function createIcon(name) {
        const element = document.createElement('i');
        element.classList.add('fa');
        element.classList.add(`fa-${name}`);
        element.setAttribute('aria-hidden', 'true');
        return element;
    }
    return {
        setters: [],
        execute: function () {
            Icon = class Icon {
                static get pencil() {
                    return createIcon('pencil');
                }
                static get check() {
                    return createIcon('check');
                }
                static get cross() {
                    return createIcon('times');
                }
                static get delete() {
                    return createIcon('trash');
                }
            };
            exports_31("Icon", Icon);
        }
    };
});
System.register("utils/validation", [], function (exports_32, context_32) {
    "use strict";
    var cardNameValidation, columnNameValidation;
    var __moduleName = context_32 && context_32.id;
    return {
        setters: [],
        execute: function () {
            exports_32("cardNameValidation", cardNameValidation = (value) => {
                if (value.length === 0)
                    return [false, 'Card name can\'t be empty'];
                if (value.length > 200)
                    return [false, 'Card name is too long'];
                return [true, ''];
            });
            exports_32("columnNameValidation", columnNameValidation = (value) => {
                if (value.length === 0)
                    return [false, 'Column name can\'t be empty'];
                if (value.length > 70)
                    return [false, 'Column name is too long'];
                return [true, ''];
            });
        }
    };
});
System.register("card/card.view", ["base/view", "components/button.component", "components/editable-field.component", "components/prompt.component", "helpers", "utils/icons", "utils/validation"], function (exports_33, context_33) {
    "use strict";
    var view_4, button_component_3, editable_field_component_1, prompt_component_1, helpers_10, icons_1, validation_1, CardView;
    var __moduleName = context_33 && context_33.id;
    return {
        setters: [
            function (view_4_1) {
                view_4 = view_4_1;
            },
            function (button_component_3_1) {
                button_component_3 = button_component_3_1;
            },
            function (editable_field_component_1_1) {
                editable_field_component_1 = editable_field_component_1_1;
            },
            function (prompt_component_1_1) {
                prompt_component_1 = prompt_component_1_1;
            },
            function (helpers_10_1) {
                helpers_10 = helpers_10_1;
            },
            function (icons_1_1) {
                icons_1 = icons_1_1;
            },
            function (validation_1_1) {
                validation_1 = validation_1_1;
            }
        ],
        execute: function () {
            CardView = class CardView extends view_4.BaseView {
                constructor() {
                    super('card-wrapper');
                }
                _render(fragment) {
                    const cardContainer = this.createDOMElement('div', 'card');
                    cardContainer.append(this.createRenderElement('card', this.createDOMElement('div'), this.renderCard.bind(this)), this.createRenderElement('toolbar', this.createDOMElement('div', 'toolbar'), this.renderToolbar.bind(this)));
                    this.dragWrapperElement = this.container;
                    this.dragElement = cardContainer;
                    fragment.append(cardContainer);
                }
                renderCard(container) {
                    const options = {
                        value: this.state.card.name,
                        placeholder: 'Card\'s name',
                        titleTemplate: () => {
                            const title = this.createDOMElement('div');
                            title.innerText = this.state.card.name;
                            return title;
                        },
                        submitBtnContent: this.getSubmitBtnContent(),
                        cancelBtnContent: this.getCancelBtnContent(),
                        submitOnOutsideClick: true,
                        resetValueOnClosed: false,
                        prepareValue: helpers_10.trim,
                        validation: validation_1.cardNameValidation,
                        onSubmit: (value) => this.eventEmitter.emit('change-card-name', value),
                        onOpened: () => {
                            this.eventEmitter.emit('update-toolbar-state', 'hidden');
                            this.eventEmitter.emit('disable-card-drag');
                        },
                        onClosed: () => {
                            this.eventEmitter.emit('update-toolbar-state', 'default');
                            this.eventEmitter.emit('enable-card-drag');
                        }
                    };
                    this.editFieldComponent = this.createComponent(container, editable_field_component_1.EditableFieldComponent, options, 'card-name-field');
                }
                getSubmitBtnContent() {
                    const content = this.createDOMElement('span');
                    content.innerText = 'save';
                    return content;
                }
                getCancelBtnContent() {
                    const content = this.createDOMElement('span');
                    content.append(icons_1.Icon.cross);
                    return content;
                }
                renderToolbar(container) {
                    container.classList.remove('toolbar-hidden', 'toolbar-delete-prompt', 'toolbar-default');
                    container.classList.add(`toolbar-${this.state.toolbarState}`);
                    switch (this.state.toolbarState) {
                        case 'hidden':
                            container.style.display = 'none';
                            this.onClearRenderElement('toolbar', () => container.style.removeProperty('display'));
                            break;
                        case 'delete-prompt':
                            this.createComponent(container, prompt_component_1.PromptComponent, {
                                text: 'Delete this card?',
                                onConfirm: () => this.eventEmitter.emit('delete-card-confirmed'),
                                onCancel: () => this.eventEmitter.emit('update-toolbar-state', 'default')
                            });
                            this.eventEmitter.emit('disable-card-drag');
                            setTimeout(() => {
                                const mouseDownHandler = () => this.eventEmitter.emit('update-toolbar-state', 'default');
                                document.addEventListener('click', mouseDownHandler);
                                this.onClearRenderElement('toolbar', () => document.removeEventListener('click', mouseDownHandler));
                                this.onClearRenderElement('toolbar', () => this.eventEmitter.emit('enable-card-drag'));
                            });
                            break;
                        default:
                            const changeNameBtn = this.createComponent('span', button_component_3.ButtonComponent, {
                                className: 'change-name',
                                icon: icons_1.Icon.pencil,
                                onClick: () => this.eventEmitter.emit('change-card-name-click')
                            }, 'change-name-btn');
                            const deleteBtn = this.createComponent('span', button_component_3.ButtonComponent, {
                                className: 'delete-card',
                                icon: icons_1.Icon.delete,
                                onClick: () => this.eventEmitter.emit('update-toolbar-state', 'delete-prompt')
                            }, 'delete-card');
                            container.append(changeNameBtn.container, deleteBtn.container);
                    }
                }
            };
            exports_33("CardView", CardView);
        }
    };
});
System.register("card/card.controller", ["base/controller", "editable-field/editable-field.controller"], function (exports_34, context_34) {
    "use strict";
    var controller_6, editable_field_controller_3, CardController;
    var __moduleName = context_34 && context_34.id;
    return {
        setters: [
            function (controller_6_1) {
                controller_6 = controller_6_1;
            },
            function (editable_field_controller_3_1) {
                editable_field_controller_3 = editable_field_controller_3_1;
            }
        ],
        execute: function () {
            CardController = class CardController extends controller_6.BaseController {
                constructor() {
                    super();
                    this.eventEmitter
                        .on('disable-card-drag', this.onDisableCardDrag.bind(this))
                        .on('enable-card-drag', this.onEnableCardDrag.bind(this))
                        .on('update-toolbar-state', this.onUpdateToolbarState.bind(this))
                        .on('change-card-name-click', this.onChangeCardNameClick.bind(this))
                        .on('delete-card-confirmed', this.onDeleteCardConfirmed.bind(this))
                        .on('change-card-name', this.onChangeCardName.bind(this));
                }
                stateChanged(change) {
                    switch (change.name) {
                        case 'toolbarState':
                            this.view.renderElement('toolbar');
                            break;
                        case 'card.name':
                            break;
                        default:
                            this.render();
                    }
                }
                onDisableCardDrag() {
                    this.container.style.cursor = 'default';
                    this.eventEmitter.emit('disable-drag');
                }
                onEnableCardDrag() {
                    this.container.style.removeProperty('cursor');
                    this.eventEmitter.emit('enable-drag');
                }
                onUpdateToolbarState(toolbarState) {
                    this.state.updateByKey('toolbarState', toolbarState);
                }
                onChangeCardNameClick() {
                    const editFieldController = this.view.editFieldComponent.getRequiredController(editable_field_controller_3.EditableFieldController.name);
                    editFieldController.toggleInput(true);
                    this.state.updateByKey('toolbarState', 'hidden');
                }
                onChangeCardName(newName) {
                    this.state.updateByKey('card.name', newName);
                    this.eventEmitter.emit('update-card', this.state.card);
                }
                onDeleteCardConfirmed() {
                    this.eventEmitter.emit('delete-card', this.state.card);
                }
            };
            exports_34("CardController", CardController);
        }
    };
});
System.register("card/card.state", ["base/state", "types", "card/card.controller"], function (exports_35, context_35) {
    "use strict";
    var state_7, types_1, card_controller_1, CardState;
    var __moduleName = context_35 && context_35.id;
    return {
        setters: [
            function (state_7_1) {
                state_7 = state_7_1;
            },
            function (types_1_1) {
                types_1 = types_1_1;
            },
            function (card_controller_1_1) {
                card_controller_1 = card_controller_1_1;
            }
        ],
        execute: function () {
            CardState = class CardState extends state_7.BaseState {
                get card() {
                    return this.options.card;
                }
                get toolbarState() {
                    return this.options.toolbarState;
                }
                constructor(options) {
                    const defaultOptions = {
                        card: new types_1.Card("__empty-card__"),
                        toolbarState: 'default'
                    };
                    super(defaultOptions, options, [card_controller_1.CardController]);
                }
            };
            exports_35("CardState", CardState);
        }
    };
});
System.register("drag-drop/drag.view", ["base/view", "drag-drop/drag.state"], function (exports_36, context_36) {
    "use strict";
    var view_5, drag_state_2, DragView;
    var __moduleName = context_36 && context_36.id;
    return {
        setters: [
            function (view_5_1) {
                view_5 = view_5_1;
            },
            function (drag_state_2_1) {
                drag_state_2 = drag_state_2_1;
            }
        ],
        execute: function () {
            DragView = class DragView extends view_5.BaseView {
                constructor(classes) {
                    super(classes);
                }
                _render(fragment) {
                    this.subscribeEventHandlers();
                }
                subscribeEventHandlers() {
                    const dragState = this.getRequiredState(drag_state_2.DragState.name);
                    let isMouseDown;
                    let initX, initY;
                    const setIsMouseDownFalse = () => {
                        isMouseDown = false;
                    };
                    const onMouseDown = (e) => {
                        initX = e.clientX;
                        initY = e.clientY;
                        isMouseDown = true;
                    };
                    const onMouseMove = (e) => {
                        const isDragAllowed = !dragState.disabled && !dragState.isDragging;
                        if (isDragAllowed) {
                            if (isMouseDown && this.isThresholdPassed(initX, initY, e.clientX, e.clientY)) {
                                this.startDrag(e);
                            }
                        }
                    };
                    // ===
                    let draggableArea = this.view.draggableAreaElement || this.view.dragElement || this.container;
                    draggableArea.addEventListener('mousedown', onMouseDown);
                    draggableArea.addEventListener('mousemove', onMouseMove);
                    draggableArea.addEventListener('click', setIsMouseDownFalse);
                    draggableArea.addEventListener('mouseup', setIsMouseDownFalse);
                    draggableArea.addEventListener('mouseout', setIsMouseDownFalse);
                    this.onClear.push(() => {
                        draggableArea.removeEventListener('mousedown', onMouseDown);
                        draggableArea.removeEventListener('mousemove', onMouseMove);
                        draggableArea.removeEventListener('click', setIsMouseDownFalse);
                        draggableArea.removeEventListener('mouseup', setIsMouseDownFalse);
                        draggableArea.removeEventListener('mouseout', setIsMouseDownFalse);
                    });
                }
                isThresholdPassed(initX, initY, lastX, lastY) {
                    return Math.abs(initX - lastX) >= 2 || Math.abs(initY - lastY) >= 2;
                }
                startDrag(e) {
                    const drag = (e) => this.eventEmitter.emit('drag', e);
                    const dragEnd = (e) => {
                        this.eventEmitter.emit('drag-end', e);
                        unsubscribeDocumentListeners();
                    };
                    this.eventEmitter.emit('drag-start', e);
                    document.addEventListener('mousemove', drag);
                    document.addEventListener('mouseup', dragEnd);
                    // ===
                    const unsubscribeDocumentListeners = () => {
                        document.removeEventListener('mousemove', drag);
                        document.removeEventListener('mouseup', dragEnd);
                    };
                    this.onClear.push(unsubscribeDocumentListeners);
                }
            };
            exports_36("DragView", DragView);
        }
    };
});
System.register("components/card.component", ["card/card.state", "card/card.view", "base/component", "drag-drop/drag.controller", "drag-drop/drag.state", "drag-drop/drag.view", "card/card.controller"], function (exports_37, context_37) {
    "use strict";
    var card_state_1, card_view_1, component_5, drag_controller_3, drag_state_3, drag_view_1, card_controller_2, CardComponent;
    var __moduleName = context_37 && context_37.id;
    return {
        setters: [
            function (card_state_1_1) {
                card_state_1 = card_state_1_1;
            },
            function (card_view_1_1) {
                card_view_1 = card_view_1_1;
            },
            function (component_5_1) {
                component_5 = component_5_1;
            },
            function (drag_controller_3_1) {
                drag_controller_3 = drag_controller_3_1;
            },
            function (drag_state_3_1) {
                drag_state_3 = drag_state_3_1;
            },
            function (drag_view_1_1) {
                drag_view_1 = drag_view_1_1;
            },
            function (card_controller_2_1) {
                card_controller_2 = card_controller_2_1;
            }
        ],
        execute: function () {
            CardComponent = class CardComponent extends component_5.BaseComponent {
                constructor(container, cardOptions) {
                    super('Card', card_state_1.CardState, card_view_1.CardView, container, cardOptions);
                    this.registerController(() => new card_controller_2.CardController());
                    this.registerState(() => new drag_state_3.DragState());
                    this.extendView(() => new drag_view_1.DragView());
                    this.registerController(() => new drag_controller_3.DragController(this.state.card));
                    super.render();
                }
            };
            exports_37("CardComponent", CardComponent);
        }
    };
});
System.register("column/column.view", ["components/card.component", "components/editable-field.component", "base/view", "utils/icons", "utils/validation", "helpers", "components/button.component", "components/prompt.component"], function (exports_38, context_38) {
    "use strict";
    var card_component_1, editable_field_component_2, view_6, icons_2, validation_2, helpers_11, button_component_4, prompt_component_2, ColumnView;
    var __moduleName = context_38 && context_38.id;
    return {
        setters: [
            function (card_component_1_1) {
                card_component_1 = card_component_1_1;
            },
            function (editable_field_component_2_1) {
                editable_field_component_2 = editable_field_component_2_1;
            },
            function (view_6_1) {
                view_6 = view_6_1;
            },
            function (icons_2_1) {
                icons_2 = icons_2_1;
            },
            function (validation_2_1) {
                validation_2 = validation_2_1;
            },
            function (helpers_11_1) {
                helpers_11 = helpers_11_1;
            },
            function (button_component_4_1) {
                button_component_4 = button_component_4_1;
            },
            function (prompt_component_2_1) {
                prompt_component_2 = prompt_component_2_1;
            }
        ],
        execute: function () {
            ColumnView = class ColumnView extends view_6.BaseView {
                constructor(classes) {
                    super(helpers_11.concatClasses(classes, 'column-wrapper'));
                }
                _render(fragment) {
                    const columnContainer = this.createDOMElement('div', 'column');
                    columnContainer.append(this.createRenderElement('heading', this.createDOMElement('div', 'heading'), this.renderHeading.bind(this)), this.createRenderElement('cards', this.createDOMElement('div', 'cards'), this.renderCards.bind(this)), this.createRenderElement('add-card', this.createDOMElement('div', 'add-card'), this.renderAddCard.bind(this)));
                    this.dragWrapperElement = this.container;
                    this.dragElement = columnContainer;
                    fragment.append(columnContainer);
                }
                renderHeading(container) {
                    this.draggableAreaElement = container;
                    switch (this.state.toolbarState) {
                        case 'delete-prompt':
                            const columnNameElement = this.createColumnName();
                            const deletePromptElement = this.createDeletePrompt();
                            container.append(columnNameElement, deletePromptElement);
                            break;
                        default:
                            const headingFieldElement = this.createHeadingField();
                            const deleteBtn = this.createHeadingDeleteBtn();
                            container.append(headingFieldElement, deleteBtn);
                    }
                }
                createHeadingField() {
                    const options = {
                        value: this.state.column.name,
                        placeholder: 'Column\'s name',
                        submitOnOutsideClick: true,
                        resetValueOnClosed: false,
                        buttonsTemplate: () => { return undefined; },
                        prepareValue: helpers_11.trim,
                        validation: validation_2.columnNameValidation,
                        onSubmit: (value) => this.eventEmitter.emit('change-column-name', value),
                        onOpened: () => this.eventEmitter.emit('disable-drag'),
                        onClosed: () => this.eventEmitter.emit('enable-drag')
                    };
                    const field = this.createComponent('div', editable_field_component_2.EditableFieldComponent, options, 'heading-field');
                    return field.container;
                }
                createHeadingDeleteBtn() {
                    const deleteBtn = this.createComponent('div', button_component_4.ButtonComponent, {
                        className: 'delete-column-btn',
                        icon: icons_2.Icon.delete,
                        onClick: () => this.eventEmitter.emit('update-toolbar-state', 'delete-prompt')
                    });
                    return deleteBtn.container;
                }
                createColumnName() {
                    const columnName = this.createDOMElement('div', 'column-name');
                    columnName.innerText = this.state.column.name;
                    return columnName;
                }
                createDeletePrompt() {
                    const prompt = this.createComponent('div', prompt_component_2.PromptComponent, {
                        text: 'Delete this column?',
                        onConfirm: () => this.eventEmitter.emit('delete-column-confirmed'),
                        onCancel: () => this.eventEmitter.emit('update-toolbar-state', 'default')
                    });
                    this.eventEmitter.emit('disable-column-drag');
                    setTimeout(() => {
                        const mouseDownHandler = () => this.eventEmitter.emit('update-toolbar-state', 'default');
                        document.addEventListener('click', mouseDownHandler);
                        this.onClearRenderElement('heading', () => document.removeEventListener('click', mouseDownHandler));
                        this.onClearRenderElement('heading', () => this.eventEmitter.emit('enable-column-drag'));
                    });
                    return prompt.container;
                }
                renderCards(container) {
                    this.dropContainer = container;
                    for (const card of this.state.column.cards) {
                        const cardContainer = this.createDOMElement('div');
                        const cardOptions = { card };
                        const cardCompoment = this.createComponent(cardContainer, card_component_1.CardComponent, cardOptions, `card${card.id}`);
                        // ===
                        cardCompoment.eventEmitter.on('drag-start', () => this.eventEmitter.emit('card-drag-start'));
                        cardCompoment.eventEmitter.on('drag-end', () => this.eventEmitter.emit('card-drag-end'));
                        // ===
                        cardCompoment.eventEmitter.on('update-card', (card) => this.eventEmitter.emit('update-card', card));
                        cardCompoment.eventEmitter.on('delete-card', (card) => this.eventEmitter.emit('delete-card', card));
                        setTimeout(() => this.eventEmitter.emit('process-drag', cardCompoment));
                        container.appendChild(cardContainer);
                    }
                }
                renderAddCard(container) {
                    const options = {
                        title: '+ Add new card',
                        placeholder: 'Enter new card\'s name',
                        submitBtnContent: this.getAddCardSubmitBtnContent(),
                        cancelBtnContent: this.getAddCardCancelBtnContent(),
                        prepareValue: helpers_11.trim,
                        validation: validation_2.cardNameValidation,
                        onSubmit: (value) => this.eventEmitter.emit('create-new-card', value),
                        onOpened: () => this.eventEmitter.emit('add-card-field-opened'),
                    };
                    this.createComponent(container, editable_field_component_2.EditableFieldComponent, options, 'add-card-field');
                }
                getAddCardSubmitBtnContent() {
                    const content = this.createDOMElement('span');
                    content.innerText = 'create';
                    return content;
                }
                getAddCardCancelBtnContent() {
                    const content = this.createDOMElement('span');
                    content.append(icons_2.Icon.cross);
                    return content;
                }
            };
            exports_38("ColumnView", ColumnView);
        }
    };
});
System.register("column/column.controller", ["base/controller", "drag-drop/drop.controller", "types", "utils/smooth-scroll"], function (exports_39, context_39) {
    "use strict";
    var controller_7, drop_controller_1, types_2, smooth_scroll_2, ColumnController;
    var __moduleName = context_39 && context_39.id;
    return {
        setters: [
            function (controller_7_1) {
                controller_7 = controller_7_1;
            },
            function (drop_controller_1_1) {
                drop_controller_1 = drop_controller_1_1;
            },
            function (types_2_1) {
                types_2 = types_2_1;
            },
            function (smooth_scroll_2_1) {
                smooth_scroll_2 = smooth_scroll_2_1;
            }
        ],
        execute: function () {
            ColumnController = class ColumnController extends controller_7.BaseController {
                constructor() {
                    super();
                    this.eventEmitter
                        .on('change-column-name', this.onChangeColumnName.bind(this))
                        .on('disable-column-drag', this.onDisableColumnDrag.bind(this))
                        .on('enable-column-drag', this.onEnableColumnDrag.bind(this))
                        .on('update-toolbar-state', this.onUpdateToolbarState.bind(this))
                        .on('delete-column-confirmed', this.onDeleteColumnConfirmed.bind(this))
                        .on('create-new-card', this.onCreateNewCard.bind(this))
                        .on('delete-card', this.onDeleteCard.bind(this))
                        .on('add-card-field-opened', this.onAddCardFieldOpened.bind(this))
                        .on('update-card', this.onUpdateCard.bind(this))
                        .on('update-items-order', this.onUpdateCardsOrder.bind(this));
                }
                stateChanged(change) {
                    switch (change.name) {
                        case 'toolbarState':
                            this.view.renderElement('heading');
                            break;
                        case 'column.name':
                            break;
                        case 'column.cards':
                            if (change.value.length !== change.previousValue.length) {
                                const cardsContainer = this.view.getElementContainer('cards');
                                const { scrollTop } = cardsContainer;
                                this.getRequiredController(drop_controller_1.DropController.name).clear();
                                this.view.renderElement('cards');
                                cardsContainer.scrollTop = scrollTop;
                            }
                            break;
                        default:
                            this.render();
                    }
                    this.eventEmitter.emit('update-column', this.state.column);
                }
                onChangeColumnName(newName) {
                    this.state.updateByKey('column.name', newName);
                }
                onDisableColumnDrag() {
                    this.view.draggableAreaElement.style.cursor = 'default';
                    this.eventEmitter.emit('disable-drag');
                }
                onEnableColumnDrag() {
                    this.view.draggableAreaElement.style.removeProperty('cursor');
                    this.eventEmitter.emit('enable-drag');
                }
                onUpdateToolbarState(toolbarState) {
                    this.state.updateByKey('toolbarState', toolbarState);
                }
                onDeleteColumnConfirmed() {
                    this.eventEmitter.emit('delete-column', this.state.column);
                }
                onCreateNewCard(cardName) {
                    this.state.createCard(new types_2.Card(cardName));
                }
                onDeleteCard(card) {
                    this.state.deleteCard(card);
                }
                onAddCardFieldOpened() {
                    const cardsContainer = this.view.getElementContainer('cards');
                    smooth_scroll_2.smoothScroll(cardsContainer, { time: 500, speedY: 30 });
                }
                onUpdateCard(card) {
                    this.state.updateCard(card.id, card);
                }
                onUpdateCardsOrder(cards) {
                    this.state.updateCards(cards);
                }
            };
            exports_39("ColumnController", ColumnController);
        }
    };
});
System.register("column/column.state", ["base/state", "types", "column/column.controller"], function (exports_40, context_40) {
    "use strict";
    var state_8, types_3, column_controller_1, ColumnState;
    var __moduleName = context_40 && context_40.id;
    return {
        setters: [
            function (state_8_1) {
                state_8 = state_8_1;
            },
            function (types_3_1) {
                types_3 = types_3_1;
            },
            function (column_controller_1_1) {
                column_controller_1 = column_controller_1_1;
            }
        ],
        execute: function () {
            ColumnState = class ColumnState extends state_8.BaseState {
                get column() {
                    return this.options.column;
                }
                get toolbarState() {
                    return this.options.toolbarState;
                }
                constructor(options) {
                    const defaultOptions = {
                        column: new types_3.Column('__empty-column__'),
                        toolbarState: 'default',
                    };
                    super(defaultOptions, options, [column_controller_1.ColumnController]);
                }
                updateCard(id, card) {
                    this.updateBy(options => {
                        const cardIndex = options.column.cards.findIndex((card) => id === card.id);
                        options.column.cards[cardIndex] = card;
                    });
                }
                updateCards(cards) {
                    this.updateBy((options) => { options.column.cards = cards; });
                }
                createCard(card) {
                    const updatedCards = [...this.column.cards, card];
                    this.updateCards(updatedCards);
                }
                deleteCard(card) {
                    const updatedCards = this.column.cards.filter(_card => _card.id !== card.id);
                    this.updateCards(updatedCards);
                }
            };
            exports_40("ColumnState", ColumnState);
        }
    };
});
System.register("drag-drop/shared-drop.controller", ["base/component", "base/controller", "drag-drop/drag.controller", "drag-drop/drop.controller", "drag-drop/drop.state"], function (exports_41, context_41) {
    "use strict";
    var component_6, controller_8, drag_controller_4, drop_controller_2, drop_state_2, SharedDropController;
    var __moduleName = context_41 && context_41.id;
    return {
        setters: [
            function (component_6_1) {
                component_6 = component_6_1;
            },
            function (controller_8_1) {
                controller_8 = controller_8_1;
            },
            function (drag_controller_4_1) {
                drag_controller_4 = drag_controller_4_1;
            },
            function (drop_controller_2_1) {
                drop_controller_2 = drop_controller_2_1;
            },
            function (drop_state_2_1) {
                drop_state_2 = drop_state_2_1;
            }
        ],
        execute: function () {
            SharedDropController = class SharedDropController extends controller_8.BaseController {
                constructor() {
                    super();
                    this.dropState = this.getRequiredState(drop_state_2.DropState.name);
                    this.dropController = this.getRequiredController(drop_controller_2.DropController.name);
                    this.isItemsEqual = this.dropState.isItemsEqual;
                    this.eventEmitter.on('process-drag', this.onProcessDrag.bind(this));
                }
                get dropContainer() {
                    return this.dropController.dropContainer;
                }
                get columnName() {
                    return this.dropController.columnName;
                }
                onProcessDrag(dragComponent) {
                    const dragController = dragComponent instanceof component_6.BaseComponent ?
                        dragComponent.getRequiredController(drag_controller_4.DragController.name) : dragComponent;
                    const onDragStart = () => this.eventEmitter.emit('shared-drag-start', this, dragController);
                    const onDrag = () => this.eventEmitter.emit('shared-drag', this, dragController);
                    const onDragEnd = () => this.eventEmitter.emit('shared-drag-end', this, dragController);
                    dragController.eventEmitter
                        .on('drag-start', onDragStart)
                        .on('drag', onDrag)
                        .on('drag-end', onDragEnd);
                    // ===
                    dragController.eventEmitter.once('unsubscribe-drag-listeners', () => {
                        dragController.eventEmitter
                            .unsubscribe('drag-start', onDragStart)
                            .unsubscribe('drag', onDrag)
                            .unsubscribe('drag-end', onDragEnd);
                    });
                }
                onSharedDragStart(dragController) {
                    this.onProcessDrag(dragController);
                    this.dropController.onProcessDrag(dragController);
                    this.dropController.startDrag(dragController);
                }
                onDragStartInShared(dragController) {
                    this.removeDrag(dragController);
                    this.dropController.clearDropInterval();
                    dragController.eventEmitter.emit('unsubscribe-drag-listeners');
                }
                onDragEndInShared(dragController) {
                    this.removeDrag(dragController);
                    this.dropController.endDrag();
                    // this.eventEmitter.emit('update-items-order', this.dropController.drags.map(drag => drag.item));
                }
                removeDrag(dragController) {
                    this.dropController.drags = this.dropController.drags.filter(drag => !this.isItemsEqual(drag.item, dragController.item));
                }
            };
            exports_41("SharedDropController", SharedDropController);
        }
    };
});
System.register("components/column.component", ["column/column.state", "column/column.view", "column/column.controller", "base/component", "drag-drop/drop.controller", "drag-drop/drop.state", "drag-drop/drag.state", "drag-drop/drag.controller", "drag-drop/drag.view", "drag-drop/shared-drop.controller", "utils/mouse"], function (exports_42, context_42) {
    "use strict";
    var column_state_1, column_view_1, column_controller_2, component_7, drop_controller_3, drop_state_3, drag_state_4, drag_controller_5, drag_view_2, shared_drop_controller_1, mouse_3, ColumnComponent;
    var __moduleName = context_42 && context_42.id;
    return {
        setters: [
            function (column_state_1_1) {
                column_state_1 = column_state_1_1;
            },
            function (column_view_1_1) {
                column_view_1 = column_view_1_1;
            },
            function (column_controller_2_1) {
                column_controller_2 = column_controller_2_1;
            },
            function (component_7_1) {
                component_7 = component_7_1;
            },
            function (drop_controller_3_1) {
                drop_controller_3 = drop_controller_3_1;
            },
            function (drop_state_3_1) {
                drop_state_3 = drop_state_3_1;
            },
            function (drag_state_4_1) {
                drag_state_4 = drag_state_4_1;
            },
            function (drag_controller_5_1) {
                drag_controller_5 = drag_controller_5_1;
            },
            function (drag_view_2_1) {
                drag_view_2 = drag_view_2_1;
            },
            function (shared_drop_controller_1_1) {
                shared_drop_controller_1 = shared_drop_controller_1_1;
            },
            function (mouse_3_1) {
                mouse_3 = mouse_3_1;
            }
        ],
        execute: function () {
            ColumnComponent = class ColumnComponent extends component_7.BaseComponent {
                constructor(container, columnOptions) {
                    super('Column', column_state_1.ColumnState, column_view_1.ColumnView, container, columnOptions);
                    this.registerController(() => new column_controller_2.ColumnController());
                    // SHARED DROP
                    this.registerState(() => new drop_state_3.DropState({
                        direction: 'vertical',
                        isItemsEqual: (cardA, cardB) => cardA.id === cardB.id,
                        scrollBoundaryRange: 70,
                        scrollSpeed: 120
                    }));
                    // DROP
                    const isMouseInsideDrag = (drag) => {
                        const position = drag.container.getBoundingClientRect();
                        return mouse_3.mouse.position.y >= position.top && mouse_3.mouse.position.y <= position.bottom;
                    };
                    this.registerController(() => new drop_controller_3.DropController(isMouseInsideDrag));
                    this.registerController(() => new shared_drop_controller_1.SharedDropController());
                    // DRAG
                    this.registerState(() => new drag_state_4.DragState());
                    this.extendView(() => new drag_view_2.DragView());
                    this.registerController(() => new drag_controller_5.DragController(this.state.column));
                    super.render();
                }
            };
            exports_42("ColumnComponent", ColumnComponent);
        }
    };
});
System.register("kanban/kanban.view", ["base/view", "components/column.component", "components/editable-field.component", "helpers", "utils/icons", "utils/validation", "utils/mouse"], function (exports_43, context_43) {
    "use strict";
    var view_7, column_component_1, editable_field_component_3, helpers_12, icons_3, validation_3, mouse_4, KanbanView;
    var __moduleName = context_43 && context_43.id;
    return {
        setters: [
            function (view_7_1) {
                view_7 = view_7_1;
            },
            function (column_component_1_1) {
                column_component_1 = column_component_1_1;
            },
            function (editable_field_component_3_1) {
                editable_field_component_3 = editable_field_component_3_1;
            },
            function (helpers_12_1) {
                helpers_12 = helpers_12_1;
            },
            function (icons_3_1) {
                icons_3 = icons_3_1;
            },
            function (validation_3_1) {
                validation_3 = validation_3_1;
            },
            function (mouse_4_1) {
                mouse_4 = mouse_4_1;
            }
        ],
        execute: function () {
            KanbanView = class KanbanView extends view_7.BaseView {
                constructor() {
                    super(['kanban']);
                }
                _render(fragment) {
                    this.dropScrollElement = this.container;
                    this.grabScrollElement = this.container;
                    this.dropContainer = this.createRenderElement('columns', this.createDOMElement('div', 'columns'), this.renderColumns.bind(this));
                    fragment.append(this.dropContainer, this.createRenderElement('add-column', this.createDOMElement('div', 'add-column'), this.renderAddColumn.bind(this)));
                    this.addMouseEventListeners();
                }
                renderColumns(container) {
                    const columns = this.state.columns;
                    for (let index = 0; index < columns.length; index++) {
                        const column = columns[index];
                        const columnElement = this.createColumn(column);
                        container.appendChild(columnElement);
                    }
                }
                createColumn(column) {
                    const columnElement = this.createDOMElement('div', 'kanban-column');
                    const columnOptions = { column };
                    const columnComponent = this.createComponent(columnElement, column_component_1.ColumnComponent, columnOptions, `column${column.id}`);
                    columnComponent.eventEmitter.on('update-column', (column) => this.eventEmitter.emit('update-column', column));
                    columnComponent.eventEmitter.on('delete-column', (column) => this.eventEmitter.emit('delete-column', column));
                    // ===
                    columnComponent.eventEmitter.on('drag-start', () => this.eventEmitter.emit('disable-grab-scroll'));
                    columnComponent.eventEmitter.on('drag-end', () => this.eventEmitter.emit('enable-grab-scroll'));
                    columnComponent.eventEmitter.on('card-drag-start', () => this.eventEmitter.emit('disable-grab-scroll'));
                    columnComponent.eventEmitter.on('card-drag-end', () => this.eventEmitter.emit('enable-grab-scroll'));
                    // ===
                    setTimeout(() => this.eventEmitter.emit('process-drag', columnComponent));
                    setTimeout(() => this.eventEmitter.emit('process-shared-drop', columnComponent));
                    return columnElement;
                }
                renderAddColumn(container) {
                    const options = {
                        title: '+ Add new column',
                        placeholder: 'Enter new column\'s name',
                        submitBtnContent: this.getAddColumnSubmitBtnContent(),
                        cancelBtnContent: this.getAddColumnCancelBtnContent(),
                        prepareValue: helpers_12.trim,
                        onSubmit: (value) => this.eventEmitter.emit('create-new-column', value),
                        validation: validation_3.columnNameValidation
                    };
                    this.createComponent(container, editable_field_component_3.EditableFieldComponent, options, 'add-column-field');
                }
                getAddColumnSubmitBtnContent() {
                    const content = this.createDOMElement('span');
                    content.innerText = 'create';
                    return content;
                }
                getAddColumnCancelBtnContent() {
                    const content = this.createDOMElement('span');
                    content.append(icons_3.Icon.cross);
                    return content;
                }
                addMouseEventListeners() {
                    const mouseMoveHandler = mouse_4.mouse.setPosition.bind(mouse_4.mouse);
                    document.addEventListener('mousemove', mouseMoveHandler);
                    this.onClear.push(() => document.removeEventListener('mousemove', mouseMoveHandler));
                }
                appendNewColumn(column) {
                    const columnElement = this.createColumn(column);
                    this.dropContainer.append(columnElement);
                }
            };
            exports_43("KanbanView", KanbanView);
        }
    };
});
System.register("kanban/kanban.controller", ["base/controller", "types"], function (exports_44, context_44) {
    "use strict";
    var controller_9, types_4, KanbanController;
    var __moduleName = context_44 && context_44.id;
    return {
        setters: [
            function (controller_9_1) {
                controller_9 = controller_9_1;
            },
            function (types_4_1) {
                types_4 = types_4_1;
            }
        ],
        execute: function () {
            KanbanController = class KanbanController extends controller_9.BaseController {
                constructor() {
                    super();
                    this.eventEmitter
                        .on('create-new-column', this.onCreateNewColumn.bind(this))
                        .on('update-column', this.onUpdateColumn.bind(this))
                        .on('delete-column', this.onDeleteColumn.bind(this))
                        .on('update-items-order', this.onUpdateColumnsOrder.bind(this));
                }
                stateChanged(change) {
                    switch (change.name) {
                        case 'columns':
                            break;
                        default:
                            this.render();
                    }
                }
                onCreateNewColumn(columnName) {
                    const column = new types_4.Column(columnName);
                    this.state.createColumn(column);
                    this.view.appendNewColumn(column);
                }
                onUpdateColumn(column) {
                    this.state.updateColumn(column.id, column);
                }
                onDeleteColumn(column) {
                    const index = this.state.columns.findIndex(_column => _column.id === column.id);
                    this.state.deleteColumn(column);
                    this.container.querySelectorAll('.kanban-column')[index].remove();
                }
                onUpdateColumnsOrder(columns) {
                    this.state.updateColumns(columns);
                }
            };
            exports_44("KanbanController", KanbanController);
        }
    };
});
System.register("drag-drop/shared-drop.manager.controller", ["base/controller", "drag-drop/shared-drop.controller", "utils/mouse", "drag-drop/drop.controller"], function (exports_45, context_45) {
    "use strict";
    var controller_10, shared_drop_controller_2, mouse_5, drop_controller_4, SharedDropManagerController;
    var __moduleName = context_45 && context_45.id;
    return {
        setters: [
            function (controller_10_1) {
                controller_10 = controller_10_1;
            },
            function (shared_drop_controller_2_1) {
                shared_drop_controller_2 = shared_drop_controller_2_1;
            },
            function (mouse_5_1) {
                mouse_5 = mouse_5_1;
            },
            function (drop_controller_4_1) {
                drop_controller_4 = drop_controller_4_1;
            }
        ],
        execute: function () {
            SharedDropManagerController = class SharedDropManagerController extends controller_10.BaseController {
                constructor(isAbleToDrop) {
                    super();
                    this.drops = [];
                    this.isDragging = false;
                    this.isAbleToDrop = isAbleToDrop !== null && isAbleToDrop !== void 0 ? isAbleToDrop : mouse_5.mouse.isInsideElement;
                    this.eventEmitter.on('process-shared-drop', (dropComponent) => this.processDrop(dropComponent));
                }
                clear() {
                    clearInterval(this.scrollInterval);
                }
                get dropController() {
                    if (!this._dropController)
                        this._dropController = this.getController(drop_controller_4.DropController.name);
                    return this._dropController;
                }
                processDrop(dropComponent) {
                    const dropController = dropComponent.getRequiredController(shared_drop_controller_2.SharedDropController.name);
                    dropController.eventEmitter
                        .on('shared-drag-start', this.onDragStart.bind(this))
                        // .on('shared-drag', this.onDrag.bind(this))
                        .on('shared-drag-end', this.onDragEnd.bind(this));
                    this.drops.push(dropController);
                }
                onDragStart(fromDrop, dragController) {
                    if (!this.isDragging) {
                        this.isDragging = true;
                        this.originDrop = fromDrop;
                        this.currentDrop = fromDrop;
                        this.scrollInterval = setInterval(() => {
                            this.dropController.scrollDropContainer();
                            this.onDrag(fromDrop, dragController);
                        }, 100);
                    }
                }
                onDrag(fromDrop, dragController) {
                    var _a;
                    for (const toDrop of this.drops) {
                        if (toDrop !== this.currentDrop && this.isAbleToDrop(toDrop.dropContainer)) {
                            (_a = this.currentDrop) === null || _a === void 0 ? void 0 : _a.onDragStartInShared(dragController);
                            toDrop.onSharedDragStart(dragController);
                            this.currentDrop = toDrop;
                            break;
                        }
                    }
                }
                onDragEnd(toDrop, dragController) {
                    var _a;
                    this.isDragging = false;
                    clearInterval(this.scrollInterval);
                    if (toDrop !== this.originDrop) {
                        (_a = this.originDrop) === null || _a === void 0 ? void 0 : _a.onDragEndInShared(dragController);
                    }
                }
            };
            exports_45("SharedDropManagerController", SharedDropManagerController);
        }
    };
});
System.register("grab-scroll/grab-scroll.state", ["base/state"], function (exports_46, context_46) {
    "use strict";
    var state_9, GrabScrollOptions, GrabScrollState;
    var __moduleName = context_46 && context_46.id;
    return {
        setters: [
            function (state_9_1) {
                state_9 = state_9_1;
            }
        ],
        execute: function () {
            GrabScrollOptions = class GrabScrollOptions {
            };
            GrabScrollState = class GrabScrollState extends state_9.BaseState {
                get disabled() {
                    return this.options.disabled;
                }
                constructor(options) {
                    const defaultOptions = {
                        disabled: false
                    };
                    super(defaultOptions, options);
                }
            };
            exports_46("GrabScrollState", GrabScrollState);
        }
    };
});
System.register("grab-scroll/grab-scroll.controller", ["base/controller", "utils/errors", "utils/mouse", "grab-scroll/grab-scroll.state"], function (exports_47, context_47) {
    "use strict";
    var controller_11, errors_3, mouse_6, grab_scroll_state_1, GrabScrollController;
    var __moduleName = context_47 && context_47.id;
    return {
        setters: [
            function (controller_11_1) {
                controller_11 = controller_11_1;
            },
            function (errors_3_1) {
                errors_3 = errors_3_1;
            },
            function (mouse_6_1) {
                mouse_6 = mouse_6_1;
            },
            function (grab_scroll_state_1_1) {
                grab_scroll_state_1 = grab_scroll_state_1_1;
            }
        ],
        execute: function () {
            GrabScrollController = class GrabScrollController extends controller_11.BaseController {
                constructor() {
                    super();
                    this.initScrollTop = 0;
                    this.initScrollLeft = 0;
                    this.initMouseY = 0;
                    this.initMouseX = 0;
                    this.grabScrollState = this.getRequiredState(grab_scroll_state_1.GrabScrollState.name);
                    this.eventEmitter
                        .on('disable-grab-scroll', () => this.grabScrollState.updateByKey('disabled', true))
                        .on('enable-grab-scroll', () => this.grabScrollState.updateByKey('disabled', false));
                    this.eventEmitter.on('rendered', () => {
                        this.subscribeEventHandlers();
                        const { grabScrollElement } = this.view;
                        if (!grabScrollElement)
                            throw new errors_3.UndefinedViewPropertyError(GrabScrollController.name, this.componentName, 'scrollElement');
                        this._grabScrollElement = grabScrollElement;
                        ;
                    });
                }
                get grabScrollElement() {
                    return this._grabScrollElement;
                }
                // ===
                subscribeEventHandlers() {
                    let isMouseDown;
                    let initX, initY;
                    const setIsMouseDownFalse = () => {
                        isMouseDown = false;
                    };
                    const onMouseDown = (e) => {
                        initX = e.clientX;
                        initY = e.clientY;
                        isMouseDown = true;
                    };
                    const onMouseMove = (e) => {
                        if (isMouseDown && this.isThresholdPassed(initX, initY, e.clientX, e.clientY)) {
                            setTimeout(() => {
                                if (!this.grabScrollState.disabled)
                                    this.startGrab();
                            });
                        }
                    };
                    // ===
                    document.addEventListener('mousedown', onMouseDown);
                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('click', setIsMouseDownFalse);
                    document.addEventListener('mouseup', setIsMouseDownFalse);
                    document.addEventListener('mouseout', setIsMouseDownFalse);
                    this.onClear.push(() => {
                        document.removeEventListener('mousedown', onMouseDown);
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('click', setIsMouseDownFalse);
                        document.removeEventListener('mouseup', setIsMouseDownFalse);
                        document.removeEventListener('mouseout', setIsMouseDownFalse);
                    });
                }
                startGrab() {
                    this.initScrollTop = this.grabScrollElement.scrollTop;
                    this.initScrollLeft = this.grabScrollElement.scrollLeft;
                    this.initMouseY = mouse_6.mouse.position.y;
                    this.initMouseX = mouse_6.mouse.position.x;
                    const mouseMoveHandler = () => {
                        this.grabScrollElement.scrollLeft = this.initScrollLeft + (this.initMouseX - mouse_6.mouse.position.x);
                        this.grabScrollElement.scrollTop = this.initScrollTop + (this.initMouseY - mouse_6.mouse.position.y);
                    };
                    const mouseUpHandler = () => {
                        unsubscribeDocumentListeners();
                    };
                    document.addEventListener('mousemove', mouseMoveHandler);
                    document.addEventListener('mouseup', mouseUpHandler);
                    const unsubscribeDocumentListeners = () => {
                        document.removeEventListener('mousemove', mouseMoveHandler);
                        document.removeEventListener('mouseup', mouseUpHandler);
                    };
                    this.onClear.push(unsubscribeDocumentListeners);
                }
                isThresholdPassed(initX, initY, lastX, lastY) {
                    return Math.abs(initX - lastX) >= 2 || Math.abs(initY - lastY) >= 2;
                }
            };
            exports_47("GrabScrollController", GrabScrollController);
        }
    };
});
System.register("components/kanban.component", ["kanban/kanban.controller", "kanban/kanban.state", "kanban/kanban.view", "base/component", "drag-drop/drop.state", "drag-drop/drop.controller", "drag-drop/shared-drop.manager.controller", "utils/mouse", "grab-scroll/grab-scroll.controller", "grab-scroll/grab-scroll.state"], function (exports_48, context_48) {
    "use strict";
    var kanban_controller_2, kanban_state_1, kanban_view_1, component_8, drop_state_4, drop_controller_5, shared_drop_manager_controller_1, mouse_7, grab_scroll_controller_1, grab_scroll_state_2, KanbanComponent;
    var __moduleName = context_48 && context_48.id;
    return {
        setters: [
            function (kanban_controller_2_1) {
                kanban_controller_2 = kanban_controller_2_1;
            },
            function (kanban_state_1_1) {
                kanban_state_1 = kanban_state_1_1;
            },
            function (kanban_view_1_1) {
                kanban_view_1 = kanban_view_1_1;
            },
            function (component_8_1) {
                component_8 = component_8_1;
            },
            function (drop_state_4_1) {
                drop_state_4 = drop_state_4_1;
            },
            function (drop_controller_5_1) {
                drop_controller_5 = drop_controller_5_1;
            },
            function (shared_drop_manager_controller_1_1) {
                shared_drop_manager_controller_1 = shared_drop_manager_controller_1_1;
            },
            function (mouse_7_1) {
                mouse_7 = mouse_7_1;
            },
            function (grab_scroll_controller_1_1) {
                grab_scroll_controller_1 = grab_scroll_controller_1_1;
            },
            function (grab_scroll_state_2_1) {
                grab_scroll_state_2 = grab_scroll_state_2_1;
            }
        ],
        execute: function () {
            KanbanComponent = class KanbanComponent extends component_8.BaseComponent {
                constructor(container, options) {
                    super('Kanban', kanban_state_1.KanbanState, kanban_view_1.KanbanView, container, options);
                    this.registerController(() => new kanban_controller_2.KanbanController());
                    // Shared drop
                    const isAbleToDrop = (dropElement) => {
                        const mousePosition = mouse_7.mouse.position;
                        const position = dropElement.getBoundingClientRect();
                        return mousePosition.x >= position.x && mousePosition.x <= position.x + position.width;
                    };
                    this.registerController(() => new shared_drop_manager_controller_1.SharedDropManagerController(isAbleToDrop));
                    // Drop
                    const isMouseInsideDrag = (drag) => {
                        const position = drag.container.getBoundingClientRect();
                        return mouse_7.mouse.position.x >= position.left && mouse_7.mouse.position.x <= position.right;
                    };
                    this.registerState(() => new drop_state_4.DropState({
                        isItemsEqual: (cardA, cardB) => cardA.id === cardB.id,
                        scrollBoundaryRange: 150,
                        scrollSpeed: 100
                    }));
                    this.registerController(() => new drop_controller_5.DropController(isMouseInsideDrag));
                    // Grab scrolling
                    this.registerState(() => new grab_scroll_state_2.GrabScrollState({}));
                    this.registerController(() => new grab_scroll_controller_1.GrabScrollController());
                    super.render();
                }
            };
            exports_48("KanbanComponent", KanbanComponent);
        }
    };
});
System.register("index", ["components/kanban.component"], function (exports_49, context_49) {
    "use strict";
    var kanban_component_1;
    var __moduleName = context_49 && context_49.id;
    return {
        setters: [
            function (kanban_component_1_1) {
                kanban_component_1 = kanban_component_1_1;
            }
        ],
        execute: function () {
            /*
            TODO:
            local storage
            when adding card -> mount element to .cards
            animations
            componentModule addClearableEventListener(docuemnt, event, handler)
            */
            window.addEventListener("load", () => {
                const container = document.getElementById("kanban");
                const config = {
                    columns: [{
                            name: 'Plans for day',
                            id: 0,
                            cards: [
                                { id: 0, name: 'Learn chineese for 4 hours' },
                                { id: 1, name: 'Go to gym' },
                                { id: 2, name: 'Prepare to Physics mid-term' },
                                { id: 3, name: 'Finish Khan Academy Calculus Unit 4' },
                                { id: 4, name: 'Read book for 1 hour' },
                                { id: 10, name: 'Solve couple Leetcode problems' },
                            ]
                        }, {
                            name: 'Plans for month',
                            id: 1,
                            cards: [
                                { id: 5, name: 'Visit Taipei 101' },
                                { id: 6, name: 'Meet friends from Taichung' },
                                { id: 7, name: 'Read "the man who laughs"' },
                                { id: 8, name: 'Learn 200 new chinese characters' },
                                { id: 9, name: 'Solve 100 Leetcode problems' },
                            ]
                        }, {
                            name: 'Books to read and films to watch',
                            id: 2,
                            cards: [
                                { id: 11, name: '451 degrees fahrenheit' },
                                { id: 12, name: 'State. Plato' },
                                { id: 13, name: '1986' },
                                { id: 14, name: 'Daron Acemoglu. Why nations fail' },
                                { id: 15, name: 'Lord of the rings' },
                                { id: 16, name: 'Avatar 2' },
                                { id: 17, name: 'Code da Vinci' },
                                { id: 18, name: 'Into the Spider-verse' },
                                { id: 19, name: 'Oppenheimer' },
                                { id: 20, name: 'King Arthur: Legend of the Sword' },
                                { id: 21, name: 'Bullet train' },
                            ]
                        }, {
                            name: 'Favorite anime',
                            id: 3,
                            cards: [
                                { id: 22, name: 'Attack on Titan' },
                                { id: 46, name: 'Berserk' },
                                { id: 47, name: 'Cowboy Bebop' },
                                { id: 23, name: 'Death note' },
                                { id: 24, name: 'Code Geass' },
                                { id: 25, name: 'The golden deity' },
                                { id: 26, name: 'The future diary' },
                                { id: 27, name: 'Reincarnation' },
                                { id: 28, name: 'Code Geass 2' },
                                { id: 29, name: 'Blame!' },
                                { id: 30, name: 'Fairy Tail' },
                                { id: 31, name: 'Jojo' },
                                { id: 32, name: 'Game of friends' },
                                { id: 44, name: 'One-punch-man' },
                                { id: 45, name: 'Darker than black' },
                            ]
                        }, {
                            name: 'Motivation',
                            id: 4,
                            cards: [
                                { id: 33, name: 'Stay away from those people who try to disparage your ambitions. Small minds will always do that, but great minds will give you a feeling that you can become great too' },
                                { id: 34, name: 'When you give joy to other people, you get more joy in return. You should give a good thought to happiness that you can give out' },
                                { id: 35, name: 'It is only when we take chances, when our lives improve. The initial and the most difficult risk that we need to take is to become honest' },
                                { id: 36, name: 'The way to get started is to quit talking and begin doing.' },
                                { id: 37, name: 'Do one thing every day that scares you.' },
                                { id: 38, name: 'Well done is better than well said.' },
                                { id: 39, name: 'Nature has given us all the pieces required to achieve exceptional wellness and health, but has left it to us to put these pieces together' },
                                { id: 40, name: 'Develop success from failures. Discouragement and failure are two of the surest stepping stones to success' },
                                { id: 41, name: 'There are three ways to ultimate success: The first way is to be kind. The second way is to be kind. The third way is to be kind.' },
                                { id: 42, name: 'Don\'t worry when you are not recognized, but strive to be worthy of recognition' },
                                { id: 43, name: 'Do not go where the path may lead, go instead where there is no path and leave a trail.' },
                            ]
                        }, {
                            name: 'Empty column 1',
                            id: 5,
                            cards: []
                        }, {
                            name: 'Empty column 2',
                            id: 6,
                            cards: []
                        }, {
                            name: 'Empty column 3',
                            id: 7,
                            cards: []
                        }, {
                            name: 'Empty column 4',
                            id: 8,
                            cards: []
                        }]
                };
                new kanban_component_1.KanbanComponent(container, config);
            });
        }
    };
});
System.register("drag-drop/drop.view", ["base/view", "helpers"], function (exports_50, context_50) {
    "use strict";
    var view_8, helpers_13, DropView;
    var __moduleName = context_50 && context_50.id;
    return {
        setters: [
            function (view_8_1) {
                view_8 = view_8_1;
            },
            function (helpers_13_1) {
                helpers_13 = helpers_13_1;
            }
        ],
        execute: function () {
            DropView = class DropView extends view_8.BaseView {
                constructor(classes) {
                    super(helpers_13.concatClasses(classes, 'droppable'));
                }
                _render(fragment) { }
            };
            exports_50("DropView", DropView);
        }
    };
});
//# sourceMappingURL=bundle.js.map