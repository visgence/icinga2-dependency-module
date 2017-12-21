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

    default_network BOOLEAN DEFAULT TRUE,
    display_up BOOLEAN DEFAULT TRUE,
    display_down BOOLEAN DEFAULT TRUE,
    display_unreachable BOOLEAN DEFAULT TRUE,
    display_only_dependencies BOOLEAN DEFAULT TRUE, 
    scaling BOOLEAN DEFAULT TRUE,
    text_size INTEGER DEFAULT 25
);