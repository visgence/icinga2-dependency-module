CREATE TABLE node_positions (
    node_name TEXT,
    node_x INTEGER,
    node_y INTEGER 
);


CREATE TABLE plugin_settings (
    api_endpoint TEXT,
    api_user TEXT,
    api_password TEXT 
);

CREATE TABLE graph_settings (

    default_network SMALLINT DEFAULT 1,
    display_up SMALLINT DEFAULT 1,
    display_down SMALLINT DEFAULT 1,
    display_unreachable SMALLINT DEFAULT 1,
    display_only_dependencies SMALLINT DEFAULT 1, 
    scaling SMALLINT DEFAULT 1,
    text_size INTEGER DEFAULT 25
);