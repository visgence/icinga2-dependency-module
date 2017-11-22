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
This module implements vis.js <http://visjs.org> to create a topological network map for Icinga 2 Web similar to NagViz for Icinga 1/Nagios. To generate the relationships between the nodes, a custom variable "parents" is used in the host configurtion files, similar to use in Icinga 1/Nagios. To generate depedency information, an apply rule is applied which creates up to date depenency information, including multiple parentage.

## Features
1.  Displays Icinga 2 network topology in either hierarchical or network layouts.
2.  Displays up-to-date status information for hosts based on state information pulled from Icinga 2 API
3.  Allows for customization of network topology after initial simulation via dragging nodes to desired locations
4.  Automatically redraws network when a host is added or removed.
5.  Directly links to host information via double clicking on nodes.



## Format of Hosts Configuration Files
### Custom Variable "Parents"
<!-- ### Migration From Icinga 1/ Nagios -->

## Icinga 2 Dependency Apply Rule

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
`psql -U icinga -d icinga < /usr/share/icingaweb2/modules/dependency_plugin/application/schema`














