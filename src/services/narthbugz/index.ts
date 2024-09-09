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

export type Project = {
  Name: string;
  Status: {
    value: string;
  };
  Snoozed: boolean;
};

export async function getProjects(): Promise<Project[]> {
  const repsonse = await client.get("/projects");

  return repsonse.data as Project[];
}
