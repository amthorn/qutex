# Administration

## What is an Administrator?

An administrator is someone that is responsible for managing a project and all its components. This includes anything that is stored under the project, which includes [queues](/queues) and other administrators.

## Administrator Privileges

Administrator privileges are the permissions that a project administrator has. This includes running commands that are not runnable by anyone else. A list of those commands can be found [here](/command_list)

### Recommendations

All project administrators should manage the users for that project with respect.

## Adding Administrators

{% include "auth_project_admin.md" %}

You can add individual admins to a project by tagging them using the following command:

=== "Generic"
    ```
    create admin <project_name>
    ```
=== "Valid Example"
    ```
    create admin valid
    ```
=== "Invalid Example"
    ```
    create admin NOT&^%VALID
    ```
=== "Regex"
    ```
    ^\s*create admin [\S]+\s*$
    ```

???+ important
    You must **tag** the person to add as an admin.

???+ example
    <img src="/images/createAdmin.png" width=350/>

???+ note
    You cannot add an admin that already exists.

???+ Caution
    You should not add people as an administrator unless you have talked with them and are sure they would like to be made an administrator. When they are made an admin, data will be stored about them such as username and display name. See the [Qutex Privacy Policy](https://github.com/amthorn/qutex/wiki/Privacy-Policy) for more information.

## Removing Administrators

{% include "auth_project_admin.md" %}

You can remove individual admins to a project by tagging them using the following command:

=== "Generic"
    ```
    delete admin <project_name>
    ```
=== "Valid Example"
    ```
    delete admin valid
    ```
=== "Invalid Example"
    ```
    delete admin NOT&^%VALID
    ```
=== "Regex"
    ```
    ^\s*(delete|remove) admin [\S]+\s*$
    ```

???+ important
    You must **tag** the person to remove as an admin.

???+ note
    You cannot remove an admin that does not exist. I should hope that would be obvious.

???+ warning
    There must always be at least one admin on every project at any given time. If you try to remove the final admin on a project, you will get an error.

## Listing Administrators

{% include "public.md" %}

Listing all administrators is possible by issuing the following command:

=== "Generic"
    ```
    list admins
    ```
=== "Regex"
    ```
    ^\s*list admins\s*$
    ```