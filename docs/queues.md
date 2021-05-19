# Queues

## What is a Queue?

A queue is the bread and butter of Qutex. It is the main component of a project. Queues are what manage the individual people for a particular resource. There can be multiple queues on a project. But only one queue is set as the [default queue.](/queues/#what-is-the-default-queue). In qutex, *people* are stored in queues. Individuals can [add](/queues/#adding-myself-into-a-queue)/[remove](/queues/#removing-myself-from-a-queue) themselves or [add](/queues/#adding-others-into-a-queue)/[remove](/queues/#removing-others-from-a-queue) others.

## Creating a New Queue

{% include "auth_project_admin.md" %}

You can create a qutex queue with the command:

=== "Generic"
    ```
    create queue <queue_name>
    ```
=== "Valid Example"
    ```
    create queue valid
    ```
=== "Invalid Example"
    ```
    create queue NOT&^%VALID
    ```
=== "Regex"
    ```
    ^\s*create queue [\w\s]+\s*$
    ```

???+ warning
    Queue names must be unique in qutex. Thus, you cannot create a queue with a name that already exists. Additionally, the name of the queue can only contain lowercase and uppercase alphabetical characters, spaces, and the underscore.

???+ note
    Your queue will automatically be put in uppercase regardless of how it was entered

When you issue the `create queue` command, Qutex will create an empty queue for you. This queue will not be utilized until you set it as the [current queue](/queues/#changing-the-current-queue).

???+ success
    You can verify your queue was created by issueing the [`list queues` command](/queues/#listing-the-queues-in-a-project)

## Modifying a Queue Name

Unfortunately, modifying the name of an existing queue is not currently possible with Qutex. You would need to delete the queue and create a new one with the new name.

## Deleting a Queue

{% include "auth_project_admin.md" %}

You can delete a qutex queue with the command:

=== "Generic"
    ```
    delete queue <queue_name>
    ```
=== "Valid Example"
    ```
    delete queue valid
    ```
=== "Invalid Example"
    ```
    delete queue NOT&^%VALID
    ```
=== "Regex"
    ```
    ^\s*delete queue [\w\s]+\s*$
    ```

???+ warning
    There must always be at least one queue configured on each project. If you try to delete the final queue on a project, you will not be permitted to do so.

???+ warning
    You cannot delete the current queue. All projects require one current queue at all times. If you try to delete the current queue, you will not be permitted to do so.

???+ danger
    Queue deletions are permanant and they cannot be recovered after deletion.

???+ success
    You can verify your queue was deleted by issueing the [`list queues` command](/queues/#listing-the-queues-in-a-project)


## Listing the Queues in a Project

{% include "public.md" %}

Listing all queues in a project is possible with qutex by issuing the following command:

=== "Generic"
    ```
    list queues
    ```
=== "Regex"
    ```
    ^\s*list queues\s*$
    ```

???+ note
    When you list the queues, an asterisk (*) will appear next to the current queue. You can change this by using the `set current queue to`(/queues/#changing-the-current-queue) command

## What is the Default Queue?

The default queue is the queue that is automatically created in your project when it is first [created](../projects/#creating-a-new-project). The name of this queue is always "DEFAULT". You can immediately begin using the default queue after a project has been created without needing to manually create a queue. However, you are also able to [create your own queue](../queues/#creating-a-new-queue) if you so choose. You are not limitted by the existing of the default queue in any way.

## What is the Current Queue?

In qutex, any action you perform on a queue within a project is always performed on the current queue. Because you can have multiple queues in a project, you are able to change the current queue as the needs of your resource management demands.

### Changing the Current Queue

{% include "public.md" %}

You can change the current queue using the following command:

=== "Generic"
    ```
    set current queue to <queue_name>
    ```
=== "Valid Example"
    ```
    set current queue to valid
    ```
=== "Invalid Example"
    ```
    set current queue to NOT&^%VALID
    ```
=== "Regex"
    ```
    ^\s*set (current )?queue to [\w\s]+\s*$
    ```

???+ note
    Every project must always have one and only one current queue at a time. If you try to delete the current queue, you will not be permitted to do so until the current queue is changed.

???+ success
    You can verify the current queue was changed by issueing the [`list queues` command](/queues/#listing-the-queues-in-a-project)

## Using a Queue

### Adding Myself into a Queue

{% include "public.md" %}

You can add yourself to the current queue using the following command:

=== "Generic"
    ```
    add me
    ```
=== "Regex"
    ```
    ^\s*add me\s*$
    ```

???+ note
    You can add yourself as many times as you want into a project.

???+ success
    You can verify that you were added to the current queue by issueing the [`get queue` command](/queues/#showing-the-members-in-a-queue)

### Removing Myself from a Queue

{% include "public.md" %}

You can remove yourself from the current queue using the following command:

=== "Generic"
    ```
    remove me
    ```
=== "Regex"
    ```
    ^\s*remove me\s*$
    ```

???+ note
    If you exist more than once within the queue, the *front-most* queue position will be removed.

???+ success
    You can verify that you were removed from the current queue by issueing the [`get queue` command](/queues/#showing-the-members-in-a-queue)

### Adding others into a Queue

{% include "auth_project_admin.md" %}

You can add other members within the same space to the current queue using the following command:

=== "Generic"
    ```
    add person <queue_name>
    ```
=== "Valid Example"
    ```
    add person valid
    ```
=== "Invalid Example"
    ```
    add person NOT&^%VALID
    ```
=== "Regex"
    ```
    ^\s*add person .+\s*$
    ```

???+ important
    You must **tag** the person to add them into the queue.

???+ success
    You can verify that you successfully added the target person to the current queue by issueing the [`get queue` command](/queues/#showing-the-members-in-a-queue)

### Removing Others from a Queue

{% include "auth_project_admin.md" %}

You can remove other members within the same space from the current queue using the following command:

=== "Generic"
    ```
    remove person <queue_name>
    ```
=== "Valid Example"
    ```
    remove person valid
    ```
=== "Invalid Example"
    ```
    remove person NOT&^%VALID
    ```
=== "Regex"
    ```
    ^\s*remove person .+\s*$
    ```

???+ important
    You must **tag** the person to remove them into the queue.

???+ note
    If you exist more than once within the queue, the *front-most* queue position will be removed.

???+ success
    You can verify that you successfully removed the target person from the current queue by issueing the [`get queue` command](/queues/#showing-the-members-in-a-queue)

### Showing the Members in the Queue

{% include "public.md" %}

You can list out the members of  a queue by issueing the following command:


=== "Generic"
    ```
    get queue
    ```
=== "Regex"
    ```
    ^\s*get queue\s*$
    ```

???+ example
    === "2 Users"
        ```
        Queue "DEFAULT":

            1. Ava Thorn (May 19, 2021 12:55:01 AM EST)
            2. Bill Nye (May 19, 2021 12:55:05 AM EST)
        ```
    === "Empty"
        ```
        Queue "DEFAULT" is empty
        ```

### Getting Estimated Time Remaining for Me

{% include "public.md" %}

Qutex can give you an estimated time remaining until you are moved to the head of the queue. The formulas to do this are outline below:

???+ info "Formula"
    === "$f(\gamma, n)$"
        $f$ is the function to calculate how long until a person in queue position $n$ reaches the head of the queue.

        $$
        \begin{equation*}
        f(\gamma, n)=\begin{cases}
                0 \quad &\text{if} \, n = 0\\
                \max(g(\gamma, 0) - \alpha,  0)  \quad &\text{if} \, n = 1 \\
                g(\gamma, n) + f(h(\theta), n-1)) \quad &\text{if} \, n \notin {0,1} \\
            \end{cases}
        \end{equation*}
        $$
        
        $\gamma$ represents the current queue data.
        $\alpha$ is the amount of time that has elapsed since the current head of the queue was promoted.<br>
    === "$g(\gamma, n)$"
        $g$ is the function which calculates average time to flush a person, whom is currently at queue position $n$, from the head of the queue.

        $$
        \begin{equation*}
        g(\gamma, n)=\begin{cases}
                0 \quad &\text{if} \, n = 0\\
                \frac{\beta}{|\beta|}  \quad &\text{if} \, n \neq 0 \\
            \end{cases}
        \end{equation*}
        $$

        $\beta$ is the number of seconds total that the person at position $n$ in $\gamma$ has ever been at the head of the queue.<br>
        $|\beta|$ is the number of times that the person at position $n$ in $\gamma$ has ever been at the head of the queue.<br>
    === "$h(\gamma)$"
        $h$ is a function that produces the current queue except with the current head removed and all the members shifted up one.

???+ note
    This is just an estimation and can never be 100% accurate

To get this estimation, you can use the following command: 

=== "Generic"
    ```
    how long
    ```
=== "Regex"
    ```
    ^\s*how long\s*$
    ```

???+ example
    Given that there is 1 person ahead of you. Your estimated wait time is 00:01:51

### Getting Largest Queue Depth

{% include "public.md" %}

Qutex can give you the largest queue depth for a given queue over the entire lifetime of that queue. You can do this by invoking the following command:

=== "Generic"
    ```
    get largest queue depth
    ```
=== "Regex"
    ```
    ^\s*get largest queue depth\s*$
    ```

Once invoked, Qutex will return the maximum depth that the queue has ever been as well as the date and time of when that depth last occurred.

???+ example
    Largest Depth is: 1
    This occurred at: Thu May 13 2021 04:52:29 GMT+0000 (Coordinated Universal Time)