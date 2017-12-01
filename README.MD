Visgence Inc. 2017

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>
# Icinga 2 Dependency Module
### An Icinga Web 2 Module for mapping network topology and displaying realtime status of Icinga 2 Networks
![alt tag](application/img/NetworkExample.png)
![alt tag](application/img/HierarchicalExample.png)

## Introduction
This module implements vis.js <http://visjs.org> to create a topological network map for Icinga 2 Web. To generate the relationships between the nodes, a custom variable "parents" is used in the host configurtion files, similar to use in Icinga 1/Nagios. To generate depedency information, an apply rule is applied which creates up to date depenency information, including multiple parentage.

## Features
1.  Displays Icinga 2 network topology in either hierarchical or network layouts.
2.  Displays up-to-date status information for hosts based on state information pulled from Icinga 2 API
3.  Allows for customization of network topology after initial simulation via dragging nodes to desired locations
4.  Automatically redraws network when a host is added or removed.
5.  Directly links to host information via double clicking on nodes.

#Installation
First clone this repository into `/usr/share/icingaweb2/modules`

## Icinga 2 Dependency Apply Rule
An apply rule is used to generate dependency data based on host configuration files. To implement this apply rule a new conf file needs to be created in /etc/icinga2/conf.d: `sudo touch /etc/icinga2/conf.d/parents.conf`. Next add the folowing lines to the file:
```
apply Dependency "Parent" for (parent in host.vars.parents) to Host {
      parent_host_name = parent
      assign where host.address && host.vars.parents
} 
```

## Format of Hosts Configuration Files
### Custom Variable "Parents"
The apply rule generates dependency data using a custom variable names "parents". this custom variable needs to be an array and can be manually inserted into host configuration files or modified using icinga director. An example host with the correct parent variable is: 
```
object Host "example-host" {
    import "generic-host"

    display_name = "example-host"
    address = "127.0.0.1"
    check_command = "check-host-alive"
    groups = [ "homegroup" ]
    vars.parents = [ "Parent-1", "Parent-2" ]
}
```
NOTE: The apply rule will fail if hosts listed in vars.parents do not exist, ensure that the parents exist before attempting to deploy.




## Create Database And Users
### Install and start postgres
1.  Install postgresql `yum install -y postgresql-server postgresql`
2.  Initialize db `postgresql-setup initdb`
3.  Enable and start service 
```
systemctl enable postgresql
systemctl start postgresql
```
### Setup db and User
```
sudo -u postgres psql -c "CREATE ROLE dependencies WITH LOGIN PASSWORD 'dependencies'"
sudo -u postgres createdb -O dependencies -E UTF8 dependencies
```

Add the following to /var/lib/pgsql/data/pg_hba.conf - *above* other ident commands

```
# icinga
local   dependencies      dependencies                            md5
host    dependencies      dependencies      127.0.0.1/32          md5
host    dependencies      dependencies      ::1/128               md5
```

Next restart postgres `service postgresql restart`


### Create Schema
`export PGPASSWORD=dependencies`
`psql -U dependencies -d dependencies < /usr/share/icingaweb2/modules/dependency_plugin/application/schema/pgsql.sql`


### Add Created Database to Icinga 2 Application Resources
1.  In Icinga Web 2 select configuration menu item.
2.  Select resource tab.
3.  Select create new resource.
4.  Create new resosurce using "dependencies" as resource name, database name, username, and password.
5.  Validate resource and save changes.

###Create Icinga 2 API user
In order to query data, this module needs full API access to Icinga Web 2. This can be accomplished by adding a new user to api-users.conf file
using  `sudo vim /etc/icinga2/conf.d/api-users.conf` add the following lines to the configuration file:
```
    object ApiUser "dependencies" {
      password = "dependencies"
      permissions = [ "*" ]
    }
```
Next, run the CLI command and provide the new API login information `icingacli dependency_plugin setup api`  NOTE: in a standard icinga 2 installation the API address is `localhost:5665`.














