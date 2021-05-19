# Registrations

## What is a Registration?

In Qutex, a registration is just a mapping of a project to a location. This means that only one project can be defined per location. It also means that data can be shared across locations that are registered to the same project.

## What is a Location?

A location is either a webex group (or room) or a direct message. Locations are registered to projects

## Changing the Registration

{% include "auth_super_admin.md" %}

You can change the registration of your location to a different project. Currently, in order to do this you must be a super administrator. You can do this by using the following command:

=== "Generic"
    ```
    register to project <queue_name>
    ```
=== "Valid Example"
    ```
    register to project valid
    ```
=== "Invalid Example"
    ```
    register to project NOT&^%VALID
    ```
=== "Regex"
    ```
    ^\s*register to project [\w\s]+\s*$
    ```

## Check Registration

{% include "public.md" %}

You can check the registration of your location by using the following command:

=== "Generic"
    ```
    get registration
    ```
=== "Regex"
    ```
    ^\s*get registration\s*$
    ```

This should return a response similar to the following:

???+ example
    This destination is registered to project "EXAMPLE"