# taskman.js

CRON-scheduled asynchronous task manager.

The task manager ensures that a task's callback (even if asynchronous) will not run more than 1 execution concurrently.

# Installation

```terminal
npm i @nottimtam/taskman.js
```

# Usage

## ES6

```js
import TaskMan from "@nottimtam/taskman.js";

const taskManager = new TaskMan();

const task = () => console.log("Hello, world!"); // The callback to run.

taskManager.createTask("my-task", task).schedule("*/5 * * * *"); // Run the task every 5 minutes.
```

## CJS

```js
const { TaskManager } = require("@nottimtam/taskman.js");

const taskManager = new TaskManager();

const task = () => console.log("Hello, world!"); // The callback to run.

taskManager.createTask("my-task", task).schedule("*/5 * * * *"); // Run the task every 5 minutes.
```

# Reference

## Importing in CJS

```js
const { TaskManager, Task } = require("@nottimtam/taskman.js");
```

## Importing in ESM

```js
import TaskManager, { Task } from "@nottimtam/taskman.js";
```

### `Task`

**Description**: Represents a task with a unique identifier and a callback function. It can be initiated manually or scheduled using a cron job.

While tasks can be created and run independently of a task manager, creating them using a TaskManager's `createTask` method will keep your tasks to be housed in one container.

#### Constructor

-   **`constructor(identifier, callback)`**
    -   **identifier**: A unique identifier for the task (string).
    -   **callback**: The function to be executed when the task is initiated (function).

#### Properties

-   **`identifier`**: The unique identifier for the task.
-   **`callback`**: The function associated with the task.
-   **`running`**: Boolean indicating whether the task is currently running.
-   **`started`**: Timestamp indicating when the task was started.

#### Methods

-   **`initiate()`**

    -   Attempts to start the task. Logs a warning if the task is already running.
    -   **Returns**: A `Promise` that resolves once the task is completed.

-   **`schedule(time = "*/5 * * * *", timeZone = "default")`**
    -   Schedules the task to run based on a cron schedule.
    -   **time**: The cron time string (defaults to every five minutes).
    -   **timeZone**: The timezone in which to operate the job (optional).
    -   **Returns**: The newly created `CronJob` instance.

### `TaskManager`

**Description**: Manages tasks to ensure they do not run in parallel.

#### Constructor

-   **`constructor()`**
    -   Initializes an empty task manager.

#### Properties

-   **`tasks`**: An object that stores tasks by their identifier.

#### Methods

-   **`createTask(identifier, callback)`**
    -   Creates a new task with the provided identifier and callback function.
    -   **identifier**: The unique identifier for the task.
    -   **callback**: The asynchronous function associated with the task.
    -   **Returns**: The newly created `Task` instance.

## Exports

-   **`module.exports.default`**: The `TaskManager` class.
-   **`module.exports`**: An object containing the `Task` class.
