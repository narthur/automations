import axios from "axios";
import env from "src/lib/env";

const baseURL = env("NARTHBUGZ_API") ?? "https://narthbugz-api.onrender.com";

const client = axios.create({
  baseURL,
});

/*
| Route                  | GET | POST | DELETE | PUT |
| ---------------------- | :-: | :--: | :----: | :-: |
| /clients               | ✅  |  ✅  |   -    |  -  |
| /clients/:id           | ✅  |  -   |   ✅   |     |
| /clients/:id/projects  | ✅  |  ?   |   -    |  -  |
| /entries               | ✅  |  ✅  |   -    |  -  |
| /entries/:id           | ✅  |  -   |   ✅   |     |
| /projects              | ✅  |  ✅  |   -    |  -  |
| /projects/:id          | ✅  |  -   |        |     |
| /projects/:id/entries  | ✅  |  ?   |   -    |  -  |
| /projects/:id/forecast | ✅  |  -   |   -    |  -  |
| /projects/:id/tasks    | ✅  |  ?   |   -    |  -  |
| /tasks                 | ✅  |  ✅  |   -    |  -  |
| /tasks/:id             | ✅  |  -   |        |     |
| /tasks/:id/entries     | ✅  |  ?   |   -    |  -  |
| /users                 | ✅  |  ✅  |   -    |  -  |
| /users/:id             | ✅  |  -   |        |     |
| /users/:id/entries     | ✅  |  ?   |   -    |  -  |
*/

export function getProjects() {
  return client.get("/projects");
}

export function getTasks() {
  return client.get("/tasks");
}

export function getEntries() {
  return client.get("/entries");
}

export function getEntriesForTask(taskId: string) {
  return client.get(`/tasks/${taskId}/entries`);
}

export function getEntriesForProject(projectId: string) {
  return client.get(`/projects/${projectId}/entries`);
}

export function getForecastForProject(projectId: string) {
  return client.get(`/projects/${projectId}/forecast`);
}

export function getTasksForProject(projectId: string) {
  return client.get(`/projects/${projectId}/tasks`);
}

export function getProjectsForClient(clientId: string) {
  return client.get(`/clients/${clientId}/projects`);
}

export function getEntriesForUser(userId: string) {
  return client.get(`/users/${userId}/entries`);
}
