# Command List
|                             Command                                |   Arguments        | Authorization |
|--------------------------------------------------------------------|--------------------|:-------------:|
| [`create project NAME`](/projects/#creating-a-new-project)         | Project Name       | {% include "public_shield.md" %} |
| [`delete project NAME`](/projects/#deleting-a-project)             | Project Name       | {% include "auth_project_admin_shield.md" %} |
| [`list projects`](/projects/#listing-all-projects)                 |                    | {% include "public_shield.md" %} |
| [`create admin USER`](/administration/#adding-administrators)      | Administrator Name | {% include "auth_project_admin_shield.md" %} |
| [`delete admin USER`](/administration/#removing-administrators)    | Administrator Name | {% include "auth_project_admin_shield.md" %} |
| [`list admins`](/administration/#listing-administrators)           |                    | {% include "public_shield.md" %} |
| [`pun`](/eggs/#puns)                                               |                    | {% include "public_shield.md" %} |
| [`get status`](/eggs/#status)                                      |                    | {% include "public_shield.md" %} |
| [`get queue length history`](/analytics/#queue-length-history)     |                    | {% include "public_shield.md" %} |
| [`help`](/eggs/#puns)                                              |                    | {% include "public_shield.md" %} |
| [`set current queue to NAME`](/queues/#changing-the-current-queue) | Queue Name         | {% include "public_shield.md" %} |
| [`add me`](/queues/#adding-myself-into-a-queue)                    |                    | {% include "public_shield.md" %} |
| [`remove me`](/queues/#remove-myself-from-a-queue)                 |                    | {% include "public_shield.md" %} |
| [`add person USER`](/queues/#adding-others-to-a-queue)             | Person's Username  | {% include "auth_project_admin_shield.md" %} |
| [`remove person USER`](/queues/#removing-others-from-a-queue)      | Person's Username  | {% include "auth_project_admin_shield.md" %} |
| [`get queue`](/queues/#showing-the-members-in-the-queue)           |                    | {% include "public_shield.md" %} |
| [`get largest queue depth`](/queues/#getting-largest-queue-depth)  |                    | {% include "public_shield.md" %} |
| [`how long`](/queues/#getting-estimated-time-remaining-for-me)     |                    | {% include "public_shield.md" %} |
| [`create queue NAME`](/queues/#creating-a-new-queue)               | Queue Name         | {% include "auth_project_admin_shield.md" %} |
| [`delete queue NAME`](/queues/#deleting-a-queue)                   | Queue Name         | {% include "auth_project_admin_shield.md" %} |
| [`list queues`](/queues/#listing-all-queues)                       |                    | {% include "public_shield.md" %} |
| [`get registration`](/registrations/#check-registration)           |                    | {% include "public_shield.md" %} |
| [`register to project NAME`](/registrations/#changing-the-registration) | Project Name  | {% include "public_shield.md" %} |