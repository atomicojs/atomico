import { options } from "./options";
let task = [],
    defer = Promise.resolve();
/**
 * allows to solve the pending tasks
 */
function resolve() {
    let currentTask = task,
        length = currentTask.length;

    task = [];

    for (let i = 0; i < length; i++) {
        let item = currentTask[i];
        // discounts a level to the pending task, if it reaches 0 it is executed
        if (!--item.lvl) {
            item.fun(item.arg);
        } else {
            // if the number of queued tasks is greater than
            // options.maxConcurrentTask, the subsequent queue will be left
            if (task.length > options.maxConcurrentTask) item.lvl++;
            // Rescue the task to add it to the next queue
            task.push(item);
        }
    }
    // If there are remaining tasks, generate another cycle to clean the tasks
    if (task.length) defer.then(resolve); //;setTimeout(() => defer.then(resolve));
}
/**
 * add a task to the waiting list
 * @param {function} fun - function to execute once the task has been solved.
 * @param {*} [arg] - argument to deliver to the task, once it is resolved
 * @param {number} [lvl] - level of importance 1 is important 2 is less important and so on
 */
export function setTask(fun, arg, lvl = 1) {
    if (!task.length) {
        defer.then(resolve);
    }
    task.push({ fun, arg, lvl });
}
