const { warn, error } = require("@nottimtam/console.js");
const CronJob = require("cron").CronJob;

class Task {
	/**
	 * A task data object.
	 * @param {string} identifier This task's unique identifier.
	 * @param {function} callback The callback to run when this task is called.
	 */
	constructor(identifier, callback) {
		this.identifier = identifier;
		this.callback = callback;

		this.running = false;
		this.started = undefined;
	}

	/**
	 * Attempts to start a task. The task will not initiate if it is already running.
	 */
	initiate = async () => {
		const { identifier, running, started } = this;

		if (running)
			return warn(
				`Could not start task "${identifier}" as it is currently running. The task has been running for ${(
					(performance.now() - started) /
					1000
				).toFixed(2)} seconds.`
			);

		this.started = performance.now(); // Record the time when the task started.
		this.running = true; // Mark the task as running.

		await this.callback(); // Run the task.

		this.running = false; // Once the task is finished, we mark that it is no longer running.
	};

	/**
	 * Create a CRON job to run the task on a schedule.
	 * @param {string} time The CRON time by which to execute. Defaults to every five minutes.
	 * @param {string} timeZone The (optional) timezone in which to operate the job.
	 * @returns The newly created job.
	 */
	schedule = (time = "*/5 * * * *", timeZone = "default") => {
		try {
			const job = new CronJob(
				time,
				() => this.initiate(),
				null,
				true,
				timeZone,
				this,
				true
			);

			return job;
		} catch (err) {
			error("Failed to start job.", err);
		}
	};
}

/**
 * Manages functions in order to prevent them from running in parallel.
 */
class TaskManager {
	constructor() {
		this.tasks = {};
	}

	/**
	 * Create a task that can be run.
	 * @param {string} identifier The identifying label for this task.
	 * @param {function} callback The **asynchronous** function associated with this task.
	 * @returns {Task} The generated task.
	 */
	createTask = (identifier, callback) => {
		if (this.tasks[identifier])
			throw new Error(
				`A task with the identifier "${identifier}" already exists.`
			);

		const task = new Task(identifier, callback);
		this.tasks[identifier] = task;

		return task;
	};
}

module.exports.default = TaskManager;
module.exports = { Task };
